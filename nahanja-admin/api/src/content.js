import crypto from 'node:crypto';

const MAX_PAYLOAD_BYTES = 256_000;
const mediaSlots = new Set(['cover', 'image', 'artwork', 'audio', 'video', 'background', 'icon', 'thumbnail']);
const kindsWithTitle = new Set(['book', 'experience', 'world', 'collection', 'photo', 'member_work', 'podcast', 'video', 'page', 'section']);

export function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

export function validateContent(input, kind) {
  const payload = input?.payload;
  if (!payload || Array.isArray(payload) || typeof payload !== 'object') throw badRequest('payload must be an object');
  if (Buffer.byteLength(JSON.stringify(payload)) > MAX_PAYLOAD_BYTES) throw badRequest('payload too large');
  if (kindsWithTitle.has(kind) && typeof payload.title !== 'string') throw badRequest('title required');
  if (kind === 'author' && typeof payload.name !== 'string') throw badRequest('name required');
  if (kind === 'book' && payload.coverMedia != null && typeof payload.coverMedia !== 'string') throw badRequest('Invalid coverMedia');
  if (kind === 'experience' && payload.format && !['read', 'listen', 'watch'].includes(payload.format)) throw badRequest('Invalid experience format');
  const relations = input.relations ?? [];
  const media = input.media ?? [];
  if (!Array.isArray(relations) || relations.length > 500 || !Array.isArray(media) || media.length > 100) throw badRequest('Invalid relations or media');
  for (const r of relations) {
    if (!/^[a-z][a-z0-9_]*$/.test(r.field) || !Number.isInteger(r.ordinal) || r.ordinal < 0 || !isUuid(r.targetId)) throw badRequest('Invalid relation');
  }
  for (const m of media) {
    if (!mediaSlots.has(m.slot) || !Number.isInteger(m.ordinal) || m.ordinal < 0 || !isUuid(m.mediaId)) throw badRequest('Invalid media');
  }
  for (const set of [relations.map(r => `${r.field}:${r.ordinal}`), media.map(m => `${m.slot}:${m.ordinal}`)]) {
    if (new Set(set).size !== set.length) throw badRequest('Duplicate position');
  }
  return { payload, relations, media };
}

export function isUuid(value) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function itemKey(kind) {
  return `${kind}:${crypto.randomUUID()}`;
}

export async function withTransaction(pool, fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function validateTargets(client, relations, media) {
  if (relations.length) {
    const ids = [...new Set(relations.map(r => r.targetId))];
    const found = await client.query('SELECT id FROM content_item WHERE id = ANY($1::uuid[]) AND deleted_at IS NULL', [ids]);
    if (found.rowCount !== ids.length) throw badRequest('Relation target missing or deleted');
  }
  if (media.length) {
    const ids = [...new Set(media.map(m => m.mediaId))];
    const found = await client.query("SELECT id FROM media_asset WHERE id = ANY($1::uuid[]) AND state = 'ready'", [ids]);
    if (found.rowCount !== ids.length) throw badRequest('Media missing or not ready');
  }
}

async function attach(client, revisionId, relations, media) {
  await validateTargets(client, relations, media);
  for (const r of relations) {
    await client.query('INSERT INTO revision_relation(revision_id,field_name,ordinal,target_item_id,label) VALUES($1,$2,$3,$4,$5)', [revisionId, r.field, r.ordinal, r.targetId, r.label ?? null]);
  }
  for (const m of media) {
    await client.query('INSERT INTO revision_media(revision_id,slot,ordinal,media_id,crop) VALUES($1,$2,$3,$4,$5)', [revisionId, m.slot, m.ordinal, m.mediaId, m.crop ?? {}]);
  }
}

export async function createItem(pool, actor, kind, input) {
  const { payload, relations, media } = validateContent(input, kind);
  return withTransaction(pool, async client => {
    const known = await client.query('SELECT 1 FROM content_type WHERE name=$1', [kind]);
    if (!known.rowCount) throw badRequest('Unknown content type');
    const slug = input.slug || null;
    if (slug && !/^[a-z0-9][a-z0-9-]{1,100}$/.test(slug)) throw badRequest('Invalid slug');
    const item = (await client.query('INSERT INTO content_item(kind,stable_key,slug) VALUES($1,$2,$3) RETURNING id', [kind, itemKey(kind), slug])).rows[0];
    const revision = (await client.query('INSERT INTO content_revision(item_id,version,payload,created_by) VALUES($1,1,$2,$3) RETURNING id', [item.id, payload, actor.id])).rows[0];
    await attach(client, revision.id, relations, media);
    await client.query('UPDATE content_item SET draft_revision_id=$2 WHERE id=$1', [item.id, revision.id]);
    await client.query("INSERT INTO audit_event(actor_id,action,item_id,revision_id) VALUES($1,'create',$2,$3)", [actor.id, item.id, revision.id]);
    return { id: item.id, revisionId: revision.id, version: 1 };
  });
}

export async function saveDraft(pool, actor, itemId, input) {
  return withTransaction(pool, async client => {
    const item = (await client.query(`SELECT i.kind, i.draft_revision_id, r.version FROM content_item i JOIN content_revision r ON r.id=i.draft_revision_id WHERE i.id=$1 AND i.deleted_at IS NULL FOR UPDATE OF i`, [itemId])).rows[0];
    if (!item) throw Object.assign(new Error('Item not found'), { status: 404 });
    if (input.expectedVersion !== item.version) throw Object.assign(new Error('Draft changed; reload before saving'), { status: 409 });
    const { payload, relations, media } = validateContent(input, item.kind);
    const revision = (await client.query('INSERT INTO content_revision(item_id,version,payload,created_by) VALUES($1,$2,$3,$4) RETURNING id', [itemId, item.version + 1, payload, actor.id])).rows[0];
    await attach(client, revision.id, relations, media);
    await client.query('UPDATE content_item SET draft_revision_id=$2, updated_at=now() WHERE id=$1', [itemId, revision.id]);
    await client.query("INSERT INTO audit_event(actor_id,action,item_id,revision_id) VALUES($1,'save_draft',$2,$3)", [actor.id, itemId, revision.id]);
    return { id: itemId, revisionId: revision.id, version: item.version + 1 };
  });
}

export async function setDeleted(pool, actor, itemId, deleted) {
  return withTransaction(pool, async client => {
    const result = await client.query('UPDATE content_item SET deleted_at=$2, updated_at=now() WHERE id=$1 RETURNING id', [itemId, deleted ? new Date() : null]);
    if (!result.rowCount) throw Object.assign(new Error('Item not found'), { status: 404 });
    await client.query('INSERT INTO audit_event(actor_id,action,item_id) VALUES($1,$2,$3)', [actor.id, deleted ? 'trash' : 'restore', itemId]);
    return { id: itemId, deleted };
  });
}

export async function publish(pool, actor, itemId, mode) {
  return withTransaction(pool, async client => {
    const item = (await client.query('SELECT id,kind,draft_revision_id,deleted_at FROM content_item WHERE id=$1 FOR UPDATE', [itemId])).rows[0];
    if (!item || item.deleted_at) throw Object.assign(new Error('Item not found'), { status: 404 });
    if (mode === 'publish' && !item.draft_revision_id) throw badRequest('No draft to publish');
    if (item.kind === 'member_work' && mode === 'publish') {
      const review = (await client.query('SELECT review_status FROM member_submission WHERE item_id=$1', [itemId])).rows[0];
      if (review && review.review_status !== 'approved') throw Object.assign(new Error('Member work must be approved'), { status: 403 });
    }
    const active = (await client.query('SELECT release_id FROM active_release WHERE singleton=true FOR UPDATE')).rows[0];
    if (!active) throw new Error('No active release');
    const release = (await client.query('INSERT INTO publication_release(label,created_by) VALUES($1,$2) RETURNING id,release_no', [`${mode} ${item.kind}`, actor.id])).rows[0];
    await client.query(`INSERT INTO release_entry(release_id,item_id,revision_id)
      SELECT $1,e.item_id,e.revision_id FROM release_entry e JOIN content_item i ON i.id=e.item_id
      WHERE e.release_id=$2 AND e.item_id<>$3 AND i.deleted_at IS NULL`, [release.id, active.release_id, itemId]);
    if (mode === 'publish') await client.query('INSERT INTO release_entry(release_id,item_id,revision_id) VALUES($1,$2,$3)', [release.id, itemId, item.draft_revision_id]);
    await client.query('UPDATE active_release SET release_id=$1, switched_at=now() WHERE singleton=true', [release.id]);
    await client.query('INSERT INTO audit_event(actor_id,action,item_id,revision_id,details) VALUES($1,$2,$3,$4,$5)', [actor.id, mode, itemId, mode === 'publish' ? item.draft_revision_id : null, { releaseNo: release.release_no }]);
    return { releaseId: release.id, releaseNo: release.release_no };
  });
}

