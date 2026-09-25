import http from 'node:http';
import { Pool } from 'pg';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { handleUpload } from '@vercel/blob/client';
import { createItem, saveDraft, setDeleted, publish, isUuid, badRequest } from './content.js';

const port = Number(process.env.PORT || 3001);
const adminOrigin = process.env.ADMIN_ORIGIN;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || !googleClientId || !adminOrigin) throw new Error('DATABASE_URL, GOOGLE_CLIENT_ID and ADMIN_ORIGIN are required');
const pool = new Pool({ connectionString: databaseUrl, max: 10 });
const googleKeys = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
const writeRoles = new Set(['owner', 'editor']);
const publishRoles = new Set(['owner', 'publisher']);

function send(res, status, body, extra = {}) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra });
  res.end(JSON.stringify(body));
}

async function bodyJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1024 * 1024) throw Object.assign(new Error('Request too large'), { status: 413 });
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); }
  catch { throw badRequest('Invalid JSON'); }
}

async function actorFor(req) {
  const token = /^Bearer (\S+)$/.exec(req.headers.authorization || '')?.[1];
  if (!token) throw Object.assign(new Error('Sign in required'), { status: 401 });
  let claims;
  try {
    ({ payload: claims } = await jwtVerify(token, googleKeys, {
      audience: googleClientId,
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
    }));
  } catch { throw Object.assign(new Error('Invalid Google session'), { status: 401 }); }
  if (claims.email_verified !== true || typeof claims.email !== 'string' || typeof claims.sub !== 'string') {
    throw Object.assign(new Error('Verified Google email required'), { status: 403 });
  }
  const email = claims.email.toLowerCase();
  const result = await pool.query(`UPDATE admin_account SET identity_subject=$1
    WHERE identity_provider='google' AND identity_subject=$2 AND lower(email)=$3 AND active
    RETURNING id,email,role`, [claims.sub, `pending:${email}`, email]);
  const actor = result.rows[0] || (await pool.query(`SELECT id,email,role FROM admin_account
    WHERE identity_provider='google' AND identity_subject=$1 AND lower(email)=$2 AND active`, [claims.sub, email])).rows[0];
  if (!actor) throw Object.assign(new Error('This Google account is not an admin'), { status: 403 });
  return actor;
}

function requireRole(actor, roles) {
  if (!roles.has(actor.role)) throw Object.assign(new Error('Permission denied'), { status: 403 });
}

async function getItem(id) {
  const item = (await pool.query(`SELECT i.*, d.version AS draft_version, d.payload AS draft_payload,
    p.revision_id AS published_revision_id, pr.payload AS published_payload
    FROM content_item i
    LEFT JOIN content_revision d ON d.id=i.draft_revision_id
    LEFT JOIN active_release a ON a.singleton=true
    LEFT JOIN release_entry p ON p.release_id=a.release_id AND p.item_id=i.id
    LEFT JOIN content_revision pr ON pr.id=p.revision_id
    WHERE i.id=$1`, [id])).rows[0];
  if (!item) return null;
  const [relations, media] = await Promise.all([
    pool.query(`SELECT field_name AS field, ordinal, target_item_id AS "targetId", label
      FROM revision_relation WHERE revision_id=$1 ORDER BY field_name,ordinal`, [item.draft_revision_id]),
    pool.query(`SELECT rm.slot,rm.ordinal,rm.media_id AS "mediaId",rm.crop,m.public_url AS url,m.mime_type AS "mimeType",m.alt_fa AS alt
      FROM revision_media rm JOIN media_asset m ON m.id=rm.media_id
      WHERE rm.revision_id=$1 ORDER BY rm.slot,rm.ordinal`, [item.draft_revision_id]),
  ]);
  return { ...item, relations: relations.rows, media: media.rows };
}

async function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'OPTIONS') return send(res, 204, null);
  if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { ok: true });
  if (req.method === 'GET' && url.pathname === '/v1/public/release') {
    const release = (await pool.query(`SELECT a.release_id,r.release_no,r.created_at
      FROM active_release a JOIN publication_release r ON r.id=a.release_id`)).rows[0];
    const entries = (await pool.query(`SELECT i.id,i.kind,i.stable_key,i.slug,r.payload,
      COALESCE((SELECT jsonb_agg(jsonb_build_object('field',rr.field_name,'ordinal',rr.ordinal,'targetId',rr.target_item_id,'label',rr.label) ORDER BY rr.field_name,rr.ordinal)
        FROM revision_relation rr WHERE rr.revision_id=e.revision_id),'[]'::jsonb) AS relations,
      COALESCE((SELECT jsonb_agg(jsonb_build_object('slot',rm.slot,'ordinal',rm.ordinal,'mediaId',rm.media_id,'url',m.public_url,'alt',m.alt_fa,'crop',rm.crop) ORDER BY rm.slot,rm.ordinal)
        FROM revision_media rm JOIN media_asset m ON m.id=rm.media_id WHERE rm.revision_id=e.revision_id),'[]'::jsonb) AS media
      FROM release_entry e JOIN content_item i ON i.id=e.item_id JOIN content_revision r ON r.id=e.revision_id
      WHERE e.release_id=$1 ORDER BY i.kind,i.stable_key`, [release.release_id])).rows;
    return send(res, 200, { release, entries }, { 'cache-control': 'public, max-age=30, stale-while-revalidate=120' });
  }
  if (req.method === 'POST' && url.pathname === '/v1/admin/upload') {
    if (!process.env.BLOB_READ_WRITE_TOKEN || !process.env.CMS_PUBLIC_URL) throw Object.assign(new Error('Media storage not configured'), { status: 503 });
    const uploadResult = await handleUpload({
      body: await bodyJson(req),
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const uploader = await actorFor({ headers: { authorization: `Bearer ${clientPayload || ''}` } });
        requireRole(uploader, writeRoles);
        if (!/^nahanja\/[a-z0-9/_-]+\.[a-z0-9]+$/i.test(pathname)) throw badRequest('Invalid upload path');
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/mp4', 'audio/wav', 'video/mp4', 'video/webm'],
          maximumSizeInBytes: 500 * 1024 * 1024,
          addRandomSuffix: true,
          callbackUrl: `${process.env.CMS_PUBLIC_URL.replace(/\/$/, '')}/v1/admin/upload`,
          tokenPayload: JSON.stringify({ actorId: uploader.id }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const { actorId } = JSON.parse(tokenPayload);
        if (!isUuid(actorId)) throw badRequest('Invalid upload actor');
        await pool.query(`INSERT INTO media_asset(storage_provider,object_key,public_url,mime_type,state)
          VALUES('vercel_blob',$1,$2,$3,'ready') ON CONFLICT(storage_provider,object_key) DO NOTHING`, [blob.pathname, blob.url, blob.contentType]);
        await pool.query("INSERT INTO audit_event(actor_id,action,details) VALUES($1,'upload_media',$2)", [actorId, { pathname: blob.pathname }]);
      },
    });
    return send(res, 200, uploadResult);
  }
  if (!url.pathname.startsWith('/v1/admin/')) throw Object.assign(new Error('Not found'), { status: 404 });
  const actor = await actorFor(req);
  if (req.method === 'GET' && url.pathname === '/v1/admin/me') return send(res, 200, actor);
  if (req.method === 'GET' && url.pathname === '/v1/admin/types') {
    const types = (await pool.query('SELECT name,label_fa,schema_version FROM content_type ORDER BY name')).rows;
    return send(res, 200, { types });
  }
  if (req.method === 'GET' && url.pathname === '/v1/admin/items') {
    const kind = url.searchParams.get('kind');
    const query = url.searchParams.get('q')?.slice(0, 100) || '';
    const status = url.searchParams.get('status') || 'all';
    if (!['all', 'published', 'draft', 'trash', 'archived'].includes(status)) throw badRequest('Invalid status');
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 50, 1), 100);
    const offset = Math.max(Number(url.searchParams.get('offset')) || 0, 0);
    const rows = (await pool.query(`SELECT i.id,i.kind,i.stable_key,i.slug,i.created_at,i.updated_at,
      i.deleted_at,i.archived_at,d.version,d.payload,p.revision_id IS NOT NULL AS published
      FROM content_item i JOIN content_revision d ON d.id=i.draft_revision_id
      LEFT JOIN active_release a ON a.singleton=true
      LEFT JOIN release_entry p ON p.release_id=a.release_id AND p.item_id=i.id
      WHERE ($1::text IS NULL OR i.kind=$1)
        AND ($2='' OR i.slug ILIKE '%'||$2||'%' OR i.stable_key ILIKE '%'||$2||'%' OR d.payload->>'title' ILIKE '%'||$2||'%' OR d.payload->>'name' ILIKE '%'||$2||'%')
        AND ($3='all' OR ($3='published' AND p.revision_id IS NOT NULL AND i.deleted_at IS NULL)
          OR ($3='draft' AND p.revision_id IS NULL AND i.deleted_at IS NULL AND i.archived_at IS NULL)
          OR ($3='trash' AND i.deleted_at IS NOT NULL)
          OR ($3='archived' AND i.archived_at IS NOT NULL))
      ORDER BY i.updated_at DESC,i.id LIMIT $4 OFFSET $5`, [kind, query, status, limit, offset])).rows;
    return send(res, 200, { items: rows });
  }
  if (req.method === 'POST' && url.pathname === '/v1/admin/items') {
    requireRole(actor, writeRoles);
    const input = await bodyJson(req);
    const result = await createItem(pool, actor, input.kind, input);
    return send(res, 201, result);
  }
  const itemMatch = /^\/v1\/admin\/items\/([0-9a-f-]{36})(?:\/(publish|unpublish|restore|preview))?$/.exec(url.pathname);
  if (itemMatch && isUuid(itemMatch[1])) {
    const [, id, action] = itemMatch;
    if (req.method === 'GET' && (!action || action === 'preview')) {
      const item = await getItem(id);
      if (!item) throw Object.assign(new Error('Item not found'), { status: 404 });
      return send(res, 200, item);
    }
    if (req.method === 'PUT' && !action) {
      requireRole(actor, writeRoles);
      return send(res, 200, await saveDraft(pool, actor, id, await bodyJson(req)));
    }
    if (req.method === 'DELETE' && !action) {
      requireRole(actor, writeRoles);
      return send(res, 200, await setDeleted(pool, actor, id, true));
    }
    if (req.method === 'POST' && action === 'restore') {
      requireRole(actor, writeRoles);
      return send(res, 200, await setDeleted(pool, actor, id, false));
    }
    if (req.method === 'POST' && (action === 'publish' || action === 'unpublish')) {
      requireRole(actor, publishRoles);
      return send(res, 200, await publish(pool, actor, id, action));
    }
  }
  if (req.method === 'GET' && url.pathname === '/v1/admin/media') {
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 100, 1), 100);
    const offset = Math.max(Number(url.searchParams.get('offset')) || 0, 0);
    const rows = (await pool.query('SELECT * FROM media_asset ORDER BY created_at DESC,id LIMIT $1 OFFSET $2', [limit, offset])).rows;
    return send(res, 200, { media: rows });
  }
  const mediaMatch = /^\/v1\/admin\/media\/([0-9a-f-]{36})$/.exec(url.pathname);
  if (req.method === 'PUT' && mediaMatch && isUuid(mediaMatch[1])) {
    requireRole(actor, writeRoles);
    const input = await bodyJson(req);
    if ((input.alt != null && typeof input.alt !== 'string') || (input.caption != null && typeof input.caption !== 'string')) throw badRequest('Invalid media description');
    const result = await pool.query(`UPDATE media_asset SET alt_fa=$2,caption_fa=$3
      WHERE id=$1 RETURNING id,alt_fa,caption_fa`, [mediaMatch[1], input.alt?.slice(0, 500) || null, input.caption?.slice(0, 2000) || null]);
    if (!result.rowCount) throw Object.assign(new Error('Media not found'), { status: 404 });
    await pool.query("INSERT INTO audit_event(actor_id,action,details) VALUES($1,'edit_media',$2)", [actor.id, { mediaId: mediaMatch[1] }]);
    return send(res, 200, result.rows[0]);
  }
  if (req.method === 'GET' && url.pathname === '/v1/admin/releases') {
    const rows = (await pool.query(`SELECT r.id,r.release_no,r.label,r.created_at,
      a.release_id=r.id AS active FROM publication_release r LEFT JOIN active_release a ON a.singleton=true ORDER BY r.release_no DESC LIMIT 50`)).rows;
    return send(res, 200, { releases: rows });
  }
  throw Object.assign(new Error('Not found'), { status: 404 });
}

const server = http.createServer(async (req, res) => {
  if (req.headers.origin === adminOrigin) {
    res.setHeader('access-control-allow-origin', adminOrigin);
    res.setHeader('access-control-allow-headers', 'authorization,content-type');
    res.setHeader('access-control-allow-methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('vary', 'Origin');
  }
  if (req.headers.origin && req.headers.origin !== adminOrigin) return send(res, 403, { error: 'Origin not allowed' });
  try { await route(req, res); }
  catch (error) {
    const status = error.status || (error.code === '23505' ? 409 : error.code === '23503' ? 400 : 500);
    if (status === 500) console.error(error);
    send(res, status, { error: status === 500 ? 'Internal server error' : error.message });
  }
});
server.listen(port, '0.0.0.0', () => console.log(`Nahanja CMS API on ${port}`));
