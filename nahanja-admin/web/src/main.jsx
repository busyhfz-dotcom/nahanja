import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { upload } from '@vercel/blob/client';
import './style.css';

const API = import.meta.env.VITE_CMS_API_URL || 'http://localhost:3001';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const groups = [
  ['خانه و صفحه‌ها', ['section', 'page', 'ui_copy']],
  ['کتابخانه', ['book', 'author', 'collection']],
  ['تجربه و جهان', ['experience', 'world', 'mood']],
  ['روایت و مدیا', ['photo', 'podcast', 'video', 'member_work', 'community_voice']],
];
const defaultPayload = {
  book: { title: '', lead: '', description: '', keywords: [], coverStyle: 'sage' },
  author: { name: '' },
  experience: { title: '', short: '', format: 'read', minutes: 3, paragraphs: [], question: '' },
  world: { title: '', kicker: '', description: '', words: [] },
  mood: { title: '', label: '', subtitle: '' },
  collection: { title: '', description: '' },
  photo: { title: '', description: '' },
  podcast: { title: '', description: '' },
  video: { title: '', description: '' },
  member_work: { title: '', summary: '' },
  community_voice: { text: '', authorDisplay: '' },
  page: { title: '' },
  section: { title: '' },
  ui_copy: { text: '' },
};

function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [types, setTypes] = useState([]);
  const [kind, setKind] = useState('book');
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [media, setMedia] = useState([]);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);
  const [payloadText, setPayloadText] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [tab, setTab] = useState('content');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showRaw, setShowRaw] = useState(false);

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', ...options.headers },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'خطا در ارتباط با سرور');
    return data;
  }

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) { setMessage('شناسهٔ ورود Google هنوز تنظیم نشده است.'); return; }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: ({ credential }) => setToken(credential) });
      window.google.accounts.id.renderButton(document.getElementById('google-button'), { theme: 'outline', size: 'large', text: 'signin_with', locale: 'fa' });
    };
    document.head.append(script);
    return () => script.remove();
  }, []);

  useEffect(() => {
    if (!token) return;
    Promise.all([request('/v1/admin/me'), request('/v1/admin/types')])
      .then(([account, catalog]) => { setUser(account); setTypes(catalog.types); setMessage(''); })
      .catch(error => { setToken(''); setMessage(error.message); });
  }, [token]);

  async function refresh() {
    const [list, all, library] = await Promise.all([
      request(`/v1/admin/items?kind=${kind}&status=${status}&q=${encodeURIComponent(query)}`),
      request('/v1/admin/items?limit=100'),
      request('/v1/admin/media'),
    ]);
    setItems(list.items);
    setAllItems(all.items);
    setMedia(library.media);
  }
  useEffect(() => { if (user) refresh().catch(error => setMessage(error.message)); }, [user, kind, query, status]);

  async function openItem(id) {
    try {
      const item = await request(`/v1/admin/items/${id}`);
      setSelected(id);
      setDraft({ ...item, payload: item.draft_payload, version: item.draft_version });
      setPayloadText(JSON.stringify(item.draft_payload, null, 2));
      setShowRaw(false);
      setTab('content');
    } catch (error) { setMessage(error.message); }
  }
  function newItem() {
    const fresh = { id: null, kind, payload: structuredClone(defaultPayload[kind] || {}), relations: [], media: [], slug: '' };
    setSelected('new'); setDraft(fresh); setPayloadText(JSON.stringify(fresh.payload, null, 2)); setShowRaw(false); setTab('content');
  }
  async function mutate(path, options, next) {
    setBusy(true); setMessage('');
    try {
      const result = await request(path, options);
      await refresh();
      if (next) await next(result);
      setMessage('تغییر ذخیره شد.');
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }
  function save() {
    let payload;
    try { payload = JSON.parse(payloadText); }
    catch { setMessage('ساختار JSON معتبر نیست.'); return; }
    if (!payload || Array.isArray(payload) || typeof payload !== 'object') { setMessage('محتوا باید یک شیء JSON باشد.'); return; }
    const data = { kind: draft.kind, slug: draft.slug || null, payload,
      relations: draft.relations.map((r, index) => ({ field: r.field, ordinal: draft.relations.slice(0, index).filter(previous => previous.field === r.field).length, targetId: r.targetId, label: r.label })),
      media: draft.media.map((m, index) => ({ slot: m.slot, ordinal: draft.media.slice(0, index).filter(previous => previous.slot === m.slot).length, mediaId: m.mediaId, crop: m.crop || {} })),
      expectedVersion: draft.version,
    };
    mutate(draft.id ? `/v1/admin/items/${draft.id}` : '/v1/admin/items',
      { method: draft.id ? 'PUT' : 'POST', body: JSON.stringify(data) },
      result => openItem(result.id));
  }
  function action(name) {
    if (!draft?.id) return;
    mutate(`/v1/admin/items/${draft.id}${name === 'trash' ? '' : `/${name}`}`,
      { method: name === 'trash' ? 'DELETE' : 'POST' },
      () => name === 'trash' ? (setSelected(null), setDraft(null)) : openItem(draft.id));
  }
  async function uploadFile(file) {
    if (!file) return;
    setBusy(true); setMessage('در حال بارگذاری فایل…');
    try {
      await upload(`nahanja/${file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-')}`, file, {
        access: 'public',
        handleUploadUrl: `${API}/v1/admin/upload`,
        clientPayload: token,
        multipart: file.size > 20 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setUploadProgress(Math.round(percentage)),
      });
      setMessage('فایل بارگذاری شد؛ پس از ثبت در کتابخانهٔ مدیا، فهرست را تازه کنید.');
      await refresh();
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); setUploadProgress(0); }
  }

  const labels = useMemo(() => Object.fromEntries(types.map(type => [type.name, type.label_fa])), [types]);
  const preview = useMemo(() => {
    try { return JSON.parse(payloadText); } catch { return draft?.payload || {}; }
  }, [payloadText, draft]);
  function changePayloadField(key, value) {
    let next;
    try { next = JSON.parse(payloadText); }
    catch { setMessage('ابتدا خطای ساختار داده را در حالت پیشرفته اصلاح کنید.'); setShowRaw(true); return; }
    setPayloadText(JSON.stringify({ ...next, [key]: value }, null, 2));
  }
  const title = item => item?.payload?.title || item?.payload?.name || item?.payload?.label || item?.payload?.text?.slice(0, 45) || item?.stable_key || 'بدون عنوان';

  if (!user) return <div className="login-wrap"><div className="login-panel"><div className="monogram">نـ</div><div className="eyebrow">NAHANJA · CONTENT STUDIO</div><h1>مدیریت نهان‌جا</h1><p>کتاب‌ها، روایت‌ها، جهان‌ها و صفحه‌های سایت از اینجا ویرایش و منتشر می‌شوند.</p><div id="google-button" /><div className="notice">{message}</div></div></div>;
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="monogram small">نـ</span><span><strong>نهان‌جا</strong><small>پنل محتوا</small></span></div>
      <div className="workspace-label">فضای تحریریه</div>
      {groups.map(([group, names]) => <div className="nav-group" key={group}><div className="nav-title">{group}</div>{names.map(name => <button key={name} className={`nav-item ${kind === name && tab !== 'media' ? 'active' : ''}`} onClick={() => { setKind(name); setSelected(null); setDraft(null); setTab('content'); }}>{labels[name] || name}</button>)}</div>)}
      <div className="nav-group"><div className="nav-title">سیستم</div><button className={`nav-item ${tab === 'media' ? 'active' : ''}`} onClick={() => { setTab('media'); setSelected(null); }}>کتابخانهٔ مدیا</button></div>
      <div className="sidebar-bottom"><span>{user.email}</span><small>{user.role}</small><button onClick={() => { setToken(''); setUser(null); window.google?.accounts.id.disableAutoSelect(); }}>خروج</button></div>
    </aside>
    <main className="main">
      <header className="topbar"><span>فضای مدیریت / {tab === 'media' ? 'مدیا' : labels[kind] || kind}</span><span className="topbar-tag">پیش‌نویس و انتشار مستقل</span></header>
      {tab === 'media' ? <section className="content-pad"><div className="page-heading"><div><div className="eyebrow">MEDIA LIBRARY</div><h1>کتابخانهٔ مدیا</h1><p>تصویر جلد، عکس، صوت و ویدئو را اینجا بارگذاری و به محتوا متصل کنید.</p></div><label className="button primary upload-button">بارگذاری فایل<input type="file" accept="image/jpeg,image/png,image/webp,audio/mpeg,audio/mp4,audio/wav,video/mp4,video/webm" onChange={event => uploadFile(event.target.files?.[0])} /></label></div>{uploadProgress > 0 && <div className="progress"><span style={{ width: `${uploadProgress}%` }} /></div>}<button className="text-button" onClick={() => refresh()}>تازه‌سازی فهرست</button><div className="media-grid">{media.map(asset => <MediaCard asset={asset} key={asset.id} onSave={(alt, caption) => mutate(`/v1/admin/media/${asset.id}`, { method: 'PUT', body: JSON.stringify({ alt, caption }) })} />)}</div></section> : <div className="content-grid">
        <section className="list-pane"><div className="page-heading"><div><div className="eyebrow">CONTENT COLLECTION</div><h1>{labels[kind] || kind}</h1><p>{items.length} مورد در این فهرست</p></div><button className="button primary" onClick={newItem}>افزودن</button></div><div className="filters"><input placeholder="جست‌وجوی محتوا…" value={query} onChange={event => setQuery(event.target.value)} /><select value={status} onChange={event => setStatus(event.target.value)}><option value="all">همه</option><option value="published">منتشرشده</option><option value="draft">پیش‌نویس</option><option value="archived">آرشیو</option><option value="trash">زباله‌دان</option></select></div><div className="item-list">{items.map(item => <button key={item.id} className={`item-row ${selected === item.id ? 'selected' : ''}`} onClick={() => openItem(item.id)}><div className="item-title">{title(item)}</div><div className="item-meta"><span>{item.slug || item.stable_key}</span><span className={`status ${item.deleted_at ? 'muted' : item.published ? 'live' : 'draft'}`}>{item.deleted_at ? 'حذف‌شده' : item.published ? 'منتشرشده' : 'پیش‌نویس'}</span></div></button>)}{items.length === 0 && <div className="empty">موردی برای نمایش نیست.</div>}</div></section>
        <section className="editor-pane">{draft ? <><div className="editor-heading"><div><div className="eyebrow">{draft.id ? 'EDIT CONTENT' : 'NEW CONTENT'}</div><h2>{preview.title || preview.name || 'محتوای تازه'}</h2><small>{draft.id ? `نسخه ${draft.version}` : 'پیش‌نویس جدید'}</small></div><button className="close" onClick={() => { setDraft(null); setSelected(null); }}>×</button></div><div className="editor-tabs"><button className={tab === 'content' ? 'active' : ''} onClick={() => setTab('content')}>محتوا</button><button className={tab === 'links' ? 'active' : ''} onClick={() => setTab('links')}>پیوند و ترتیب</button><button className={tab === 'assets' ? 'active' : ''} onClick={() => setTab('assets')}>مدیا و جلد</button><button className={tab === 'preview' ? 'active' : ''} onClick={() => setTab('preview')}>پیش‌نمایش</button></div><div className="editor-body">{tab === 'content' && <><label>شناسه مسیر<input value={draft.slug || ''} disabled={!!draft.id} onChange={event => setDraft({ ...draft, slug: event.target.value })} placeholder="slug" /></label><label>ترتیب نمایش<input type="number" value={preview.displayOrder ?? ''} onChange={event => changePayloadField('displayOrder', event.target.value === '' ? null : Number(event.target.value))} placeholder="ترتیب پیش‌فرض" /></label><div className="editor-mode"><span>متن‌ها و مشخصات محتوا</span><button className="text-button" onClick={() => setShowRaw(!showRaw)}>{showRaw ? 'نمایش فرم' : 'ویرایش پیشرفتهٔ داده'}</button></div>{showRaw ? <label>دادهٔ ساختاریافته<textarea spellCheck="false" value={payloadText} onChange={event => setPayloadText(event.target.value)} /></label> : <PayloadFields payload={preview} onChange={changePayloadField} />}</>}{tab === 'links' && <RelationEditor draft={draft} setDraft={setDraft} allItems={allItems} />}{tab === 'assets' && <MediaEditor draft={draft} setDraft={setDraft} media={media} kind={kind} />}{tab === 'preview' && <div className="preview-card"><div className="eyebrow">PREVIEW · DRAFT</div>{draft.media.filter(m => m.slot === 'cover' || m.slot === 'image').map(m => { const asset = media.find(a => a.id === m.mediaId); return asset?.public_url && <img key={m.mediaId} src={asset.public_url} alt={asset.alt_fa || preview.title || ''} />; })}<h2>{preview.title || preview.name || preview.label}</h2><p>{preview.lead || preview.short || preview.description || preview.summary || preview.text}</p><div className="preview-meta">{draft.relations.length} پیوند · {draft.media.length} فایل · فقط در پنل</div></div>}</div><div className="editor-actions"><button className="button primary" disabled={busy || !['owner','editor'].includes(user.role)} onClick={save}>ذخیرهٔ پیش‌نویس</button>{draft.id && <><button className="button" disabled={busy || !['owner','publisher'].includes(user.role)} onClick={() => action('publish')}>انتشار</button><button className="button subtle" disabled={busy || !['owner','publisher'].includes(user.role)} onClick={() => action('unpublish')}>لغو انتشار</button><button className="button danger" disabled={busy || !['owner','editor'].includes(user.role)} onClick={() => action(draft.deleted_at ? 'restore' : 'trash')}>{draft.deleted_at ? 'بازیابی' : 'انتقال به زباله‌دان'}</button></>}</div></> : <div className="editor-empty"><div className="monogram">نـ</div><h2>روایت را انتخاب کنید</h2><p>یک مورد از فهرست باز کنید یا محتوای تازه بسازید.</p></div>}</section>
      </div>}{message && <div className="toast" role="status">{message}<button onClick={() => setMessage('')}>×</button></div>}
    </main>
  </div>;
}

const fieldLabels = { title: 'عنوان', name: 'نام', label: 'برچسب', short: 'متن کوتاه', lead: 'متن معرفی', description: 'توضیح', summary: 'خلاصه', text: 'متن', kicker: 'عبارت بالای عنوان', subtitle: 'زیرعنوان', invitation: 'دعوت', question: 'پرسش', paragraphs: 'پاراگراف‌ها', keywords: 'کلیدواژه‌ها', words: 'واژه‌ها', minutes: 'مدت (دقیقه)', format: 'نوع تجربه', tone: 'رنگ جلد پیش‌فرض', coverStyle: 'سبک جلد پیش‌فرض', icon: 'نماد', authorDisplay: 'نام نمایشی نویسنده' };
function PayloadFields({ payload, onChange }) {
  const entries = Object.entries(payload || {}).filter(([key, value]) => key !== 'id' && key !== 'displayOrder' && value !== null && !key.endsWith('Media'));
  return <div className="payload-fields">{entries.map(([key, value]) => {
    const label = fieldLabels[key] || key;
    if (Array.isArray(value) && value.every(item => typeof item === 'string')) return <label key={key}>{label}<span>هر مورد را در یک خط بنویسید.</span><textarea className="list-field" value={value.join('\n')} onChange={event => onChange(key, event.target.value.split('\n').map(item => item.trim()).filter(Boolean))} /></label>;
    if (typeof value === 'number') return <label key={key}>{label}<input type="number" value={value} onChange={event => onChange(key, Number(event.target.value))} /></label>;
    if (typeof value === 'boolean') return <label key={key} className="checkbox-field"><input type="checkbox" checked={value} onChange={event => onChange(key, event.target.checked)} />{label}</label>;
    if (typeof value === 'string') return <label key={key}>{label}{value.length > 100 || ['description','summary','text','lead','subtitle'].includes(key) ? <textarea className="text-field" value={value} onChange={event => onChange(key, event.target.value)} /> : <input value={value} onChange={event => onChange(key, event.target.value)} />}</label>;
    return <div className="field-help" key={key}>{label}: برای تغییر این دادهٔ پیچیده، ویرایش پیشرفته را باز کنید.</div>;
  })}</div>;
}

function RelationEditor({ draft, setDraft, allItems }) {
  function change(index, patch) { setDraft({ ...draft, relations: draft.relations.map((r, i) => i === index ? { ...r, ...patch } : r) }); }
  function move(index, direction) {
    const rows = [...draft.relations]; const to = index + direction;
    if (to < 0 || to >= rows.length || rows[to].field !== rows[index].field) return;
    [rows[index], rows[to]] = [rows[to], rows[index]];
    setDraft({ ...draft, relations: rows.map((r, i) => ({ ...r, ordinal: rows.filter((x, j) => j < i && x.field === r.field).length })) });
  }
  return <div><p className="field-help">ارتباط کتاب، تجربه، جهان و چیدمان Home از اینجا تعیین می‌شود. ترتیب هر گروه با پیکان تغییر می‌کند.</p>{draft.relations.map((relation, index) => <div className="relation-row" key={`${relation.field}-${index}`}><input value={relation.field} onChange={event => change(index, { field: event.target.value })} placeholder="نوع پیوند" /><select value={relation.targetId} onChange={event => change(index, { targetId: event.target.value })}><option value="">انتخاب محتوا</option>{allItems.map(item => <option key={item.id} value={item.id}>{item.kind} · {item.payload?.title || item.payload?.name || item.stable_key}</option>)}</select><input value={relation.label || ''} onChange={event => change(index, { label: event.target.value })} placeholder="برچسب" /><button onClick={() => move(index, -1)}>↑</button><button onClick={() => move(index, 1)}>↓</button><button onClick={() => setDraft({ ...draft, relations: draft.relations.filter((_, i) => i !== index) })}>×</button></div>)}<button className="button" onClick={() => setDraft({ ...draft, relations: [...draft.relations, { field: 'items', ordinal: draft.relations.filter(r => r.field === 'items').length, targetId: '', label: '' }] })}>افزودن پیوند</button></div>;
}

function MediaEditor({ draft, setDraft, media, kind }) {
  function change(index, patch) { setDraft({ ...draft, media: draft.media.map((m, i) => i === index ? { ...m, ...patch } : m) }); }
  return <div><p className="field-help">جلد کتاب از جایگاه <code>cover</code> خوانده می‌شود و در تمام محل‌های نمایش یکسان خواهد بود. فایل تازه را ابتدا در کتابخانهٔ مدیا بارگذاری کنید.</p>{draft.media.map((reference, index) => <div className="media-reference" key={index}><select value={reference.slot} onChange={event => change(index, { slot: event.target.value })}>{['cover','image','artwork','audio','video','background','icon','thumbnail'].map(slot => <option key={slot}>{slot}</option>)}</select><select value={reference.mediaId} onChange={event => change(index, { mediaId: event.target.value })}><option value="">انتخاب فایل</option>{media.filter(asset => asset.state === 'ready').map(asset => <option key={asset.id} value={asset.id}>{asset.object_key.split('/').pop()} · {asset.mime_type}</option>)}</select>{media.find(asset => asset.id === reference.mediaId)?.public_url && media.find(asset => asset.id === reference.mediaId)?.mime_type.startsWith('image/') && <img src={media.find(asset => asset.id === reference.mediaId).public_url} alt="پیش‌نمایش فایل" />}<button onClick={() => setDraft({ ...draft, media: draft.media.filter((_, i) => i !== index) })}>×</button></div>)}<button className="button" onClick={() => setDraft({ ...draft, media: [...draft.media, { slot: kind === 'book' ? 'cover' : 'image', ordinal: draft.media.length, mediaId: '', crop: {} }] })}>اتصال فایل</button></div>;
}

function MediaCard({ asset, onSave }) {
  const [alt, setAlt] = useState(asset.alt_fa || '');
  const [caption, setCaption] = useState(asset.caption_fa || '');
  return <div className="media-card">
    {asset.mime_type.startsWith('image/') && asset.public_url ? <img src={asset.public_url} alt={asset.alt_fa || ''} /> : <div className="media-icon">{asset.mime_type.startsWith('audio/') ? '♫' : '▶'}</div>}
    <strong>{asset.object_key.split('/').pop()}</strong><small>{asset.mime_type} · {asset.state}</small>
    <input value={alt} onChange={event => setAlt(event.target.value)} placeholder="متن جایگزین تصویر" />
    <input value={caption} onChange={event => setCaption(event.target.value)} placeholder="توضیح فایل" />
    <button className="button" onClick={() => onSave(alt, caption)}>ذخیرهٔ مشخصات</button>
    <code>{asset.id}</code>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
