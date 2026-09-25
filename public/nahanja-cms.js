/* Published content adapter. The audited inline catalog remains the network fallback. */
(function (root) {
  'use strict';
  const allowedId = /^[a-z0-9_-]{1,80}$/i;
  const clean = value => String(value ?? '').replace(/&/g, '＆').replace(/</g, '＜').replace(/>/g, '＞');
  const text = (value, fallback = '') => value == null ? fallback : clean(value);
  const texts = value => Array.isArray(value) ? value.filter(v => typeof v === 'string').map(clean) : [];
  const key = entry => {
    const candidate = entry.slug || entry.stable_key?.split(':').at(-1) || entry.id;
    return allowedId.test(candidate || '') ? candidate : String(entry.id || '').replace(/[^a-z0-9_-]/gi, '');
  };
  const asset = (entry, slot) => {
    const value = (entry.media || []).find(m => m.slot === slot)?.url;
    if (!value) return '';
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname.endsWith('.public.blob.vercel-storage.com') ? url.href : '';
    } catch { return ''; }
  };
  const httpsUrl = value => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value.trim());
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
    } catch { return ''; }
  };
  const audioEmbed = value => {
    if (typeof value !== 'string') return '';
    const candidate = value.trim().startsWith('<iframe') ? /\bsrc\s*=\s*["']([^"']+)["']/i.exec(value)?.[1] : value;
    const source = httpsUrl(candidate);
    if (!source) return '';
    const url = new URL(source);
    if (url.hostname === 'open.spotify.com' && /^\/(?:embed\/)?(?:episode|show|track)\/[a-zA-Z0-9]+$/.test(url.pathname)) {
      return `https://open.spotify.com/embed/${url.pathname.replace(/^\/(?:embed\/)?/, '')}`;
    }
    if (url.hostname === 'w.soundcloud.com' && url.pathname === '/player/') {
      const track = httpsUrl(url.searchParams.get('url'));
      if (track && (new URL(track).hostname === 'soundcloud.com' || new URL(track).hostname.endsWith('.soundcloud.com'))) return `https://w.soundcloud.com/player/?url=${encodeURIComponent(track)}`;
    }
    if ((url.hostname === 'soundcloud.com' || url.hostname.endsWith('.soundcloud.com')) && url.pathname.length > 1) {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(source)}`;
    }
    return '';
  };
  const ordered = (entry, field) => (entry.relations || []).filter(r => r.field === field).sort((a, b) => a.ordinal - b.ordinal);
  const legacyOrder = {
    book: ['prince', 'stranger', 'house'],
    mood: ['calm', 'think', 'imagine', 'change'],
    world: ['solitude', 'choice', 'memory', 'beginning', 'home'],
    experience: ['silence', 'choice', 'voice', 'begin', 'home', 'star', 'pause', 'another'],
    photo: ['prince', 'stranger', 'house']
  };
  const position = entry => entry.payload?.displayOrder != null && Number.isFinite(Number(entry.payload.displayOrder))
    ? Number(entry.payload.displayOrder)
    : (legacyOrder[entry.kind]?.indexOf(key(entry)) ?? -1) >= 0
      ? legacyOrder[entry.kind].indexOf(key(entry)) : 1000;

  function adapt(entries) {
    if (!Array.isArray(entries)) throw new Error('Invalid release entries');
    entries = [...entries].sort((a, b) => position(a) - position(b) || (a.stable_key || '').localeCompare(b.stable_key || ''));
    const byId = new Map(entries.map(entry => [entry.id, entry]));
    const target = relation => byId.get(relation?.targetId);
    const targetKey = relation => {
      const item = target(relation);
      return item ? key(item) : '';
    };
    const first = (entry, field) => targetKey(ordered(entry, field)[0]);
    const moods = {}, books = {}, worlds = {}, experiences = [], photos = [], podcasts = [];
    const page = entries.find(entry => entry.stable_key === 'page:home');
    const sharePage = entries.find(entry => entry.stable_key === 'page:share');
    for (const entry of entries) {
      const p = entry.payload || {}, id = key(entry);
      if (!id) continue;
      if (entry.kind === 'mood') moods[id] = {
        label: text(p.label), short: text(p.short), title: text(p.title),
        icon: ['waves', 'spark', 'moon', 'wind'].includes(p.icon) ? p.icon : 'spark',
        verb: text(p.verb), subtitle: text(p.subtitle), invitation: text(p.invitation),
        world: first(entry, 'world')
      };
      if (entry.kind === 'world') worlds[id] = {
        title: text(p.title), kicker: text(p.kicker), description: text(p.description),
        mood: first(entry, 'mood'), words: texts(p.words)
      };
      if (entry.kind === 'book') {
        const author = target(ordered(entry, 'author')[0]);
        books[id] = {
          id, title: text(p.title), author: text(author?.payload?.name),
          authorBio: text(author?.payload?.bio), authorImageUrl: asset(author || {}, 'image') || httpsUrl(author?.payload?.imageUrl),
          tone: ['sage', 'ink', 'sand'].includes(p.tone) ? p.tone : 'sage',
          lead: text(p.lead), description: text(p.description), keywords: texts(p.keywords),
          coverUrl: asset(entry, 'cover') || httpsUrl(p.coverUrl)
        };
      }
    }
    for (const entry of entries) {
      if (entry.kind !== 'experience') continue;
      const p = entry.payload || {}, id = key(entry);
      const book = first(entry, 'book'), world = first(entry, 'primary_world');
      if (!id || !books[book] || !worlds[world]) continue;
      experiences.push({
        id, title: text(p.title), short: text(p.short), book, world,
        moods: ordered(entry, 'moods').map(targetKey).filter(m => !!moods[m]),
        minutes: Number.isFinite(Number(p.minutes)) ? Math.max(1, Math.min(240, Number(p.minutes))) : 3,
        format: p.format === 'listen' ? 'listen' : 'read',
        question: text(p.question), paragraphs: texts(p.paragraphs),
        words: ordered(entry, 'words').map(r => [text(r.label), targetKey(r)]).filter(pair => !!worlds[pair[1]]),
        audioUrl: asset(entry, 'audio') || httpsUrl(p.audioUrl), audioEmbedUrl: audioEmbed(p.audioEmbedUrl)
      });
    }
    for (const world of Object.values(worlds)) if (!moods[world.mood]) world.mood = Object.keys(moods)[0];
    for (const mood of Object.values(moods)) if (!worlds[mood.world]) mood.world = Object.keys(worlds)[0];
    for (const entry of entries) {
      const p = entry.payload || {};
      if (entry.kind === 'photo') photos.push({ title: text(p.title), description: text(p.description),
        book: first(entry, 'book'), imageUrl: asset(entry, 'image') || httpsUrl(p.imageUrl) });
      if (entry.kind === 'podcast') podcasts.push({ title: text(p.title), description: text(p.description),
        audioUrl: asset(entry, 'audio') || httpsUrl(p.audioUrl), audioEmbedUrl: audioEmbed(p.audioEmbedUrl), imageUrl: asset(entry, 'artwork') || httpsUrl(p.imageUrl) });
    }
    if (!Object.keys(moods).length || !Object.keys(books).length || !Object.keys(worlds).length || !experiences.length) {
      throw new Error('Published release lacks required catalog content');
    }
    const works = entries.filter(e => e.kind === 'member_work');
    const shareEntries = sharePage ? ordered(sharePage, 'works').map(target).filter(Boolean) : works.filter(e => e.payload?.placement === 'share');
    const shareWorks = shareEntries.map(e => {
      const p = e.payload || {};
      return { type: ['podcast','writing','image'].includes(p.type) ? p.type : 'writing',
        title: text(p.title), summary: text(p.summary), author: text(p.author),
        world: first(e, 'world') };
    }).filter(w => !!worlds[w.world]);
    const homeShowcase = ordered(page || {}, 'showcase').map(r => target(r)).filter(e => e?.kind === 'member_work').map(e => ({
      type: ['podcast','writing','image'].includes(e.payload?.type) ? e.payload.type : 'writing',
      label: text(e.payload?.label), title: text(e.payload?.title),
      body: text(e.payload?.body), author: text(e.payload?.author), age: text(e.payload?.age),
      imageUrl: asset(e, 'image'), audioUrl: asset(e, 'audio')
    }));
    const voices = entries.filter(e => e.kind === 'community_voice').map(e => ({
      id: key(e), world: first(e, 'world'), text: text(e.payload?.text),
      author: text(e.payload?.author), ageHours: Number(e.payload?.ageHours) || 0,
      quality: Number(e.payload?.quality) || 0, editorial: !!e.payload?.editorial
    })).filter(v => !!worlds[v.world]);
    const defaultSections = ['heading', 'scene', 'panorama'];
    const requestedSections = Array.isArray(page?.payload?.sections) ? page.payload.sections : defaultSections.map(key => ({ key, enabled: true }));
    const sections = requestedSections.filter(row => defaultSections.includes(row?.key)).map(row => ({
      key: row.key, enabled: row.enabled !== false
    }));
    for (const section of defaultSections) if (!sections.some(row => row.key === section)) sections.push({ key: section, enabled: true });
    return { moods, books, worlds, experiences, photos, podcasts, shareWorks, homeShowcase, voices,
      home: { title: text(page?.payload?.title, 'هر حال، دری به یک جهان'),
        intro: text(page?.payload?.intro, 'یک حس را دنبال کن؛ باقیِ راه خودش پیدا می‌شود.'),
        featuredExperience: first(page || {}, 'featured_experience'),
        questionExperience: first(page || {}, 'question_experience'),
        audioExperience: first(page || {}, 'audio_experience'),
        featuredBook: first(page || {}, 'featured_book'),
        featuredWorld: first(page || {}, 'featured_world'),
        panorama: ordered(page || {}, 'panorama').map(targetKey), sections } };
  }
  root.NahanjaCmsAdapter = { adapt };
  fetch('/cms-content', { cache: 'no-store' })
    .then(response => { if (!response.ok) throw new Error('Published release unavailable'); return response.json(); })
    .then(data => root.NahanjaApplyRelease?.(adapt(data.entries)))
    .catch(error => console.warn('Nahanja keeps the bundled catalog:', error.message));
})(window);

