/* A transparent editorial route through published content, not a personality inference. */
(function (root) {
  'use strict';
  const label = { experience: 'تجربه', book: 'کتاب', photo: 'تصویر', podcast: 'پادکست', video: 'ویدئو' };
  const genericQuestion = 'چه چیزی از این اثر در تو ماند؟';
  const words = value => String(value || '').toLocaleLowerCase('fa').replace(/[\u064b-\u065f\u200c\u200f]/g, '').split(/[^\p{L}\p{N}]+/u).filter(word => word.length > 2);
  const unique = values => [...new Set(values.filter(Boolean))];
  const validDate = value => {
    const time = Date.parse(value || '');
    return Number.isFinite(time) ? time : 0;
  };

  function build(model, options = {}) {
    const moods = model.moods || {}, worlds = model.worlds || {}, books = model.books || {};
    const experiences = model.experiences || [];
    const related = bookId => experiences.filter(item => item.book === bookId);
    const lexicalWorld = item => {
      const source = new Set(words([item.title, item.summary, ...(item.keywords || [])].join(' ')));
      const ranked = Object.entries(worlds).map(([id, world]) => ({
        id, score: words([world.title, world.kicker, ...(world.words || [])].join(' ')).filter(word => source.has(word)).length
      })).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
      return ranked[0]?.score ? ranked[0].id : '';
    };
    const stops = [];
    const add = (type, item, id) => {
      if (!item || (item.journeyMode === 'hidden' && !options.includeHidden) || !item.title) return;
      const linked = item.book ? related(item.book) : type === 'book' ? related(id) : [];
      const explicitWorld = worlds[item.world] ? item.world : '';
      const inferredWorld = linked.find(entry => worlds[entry.world])?.world || lexicalWorld(item);
      const world = explicitWorld || (item.journeyMode === 'manual' ? '' : inferredWorld);
      const explicitMoods = (item.moods || []).filter(mood => !!moods[mood]);
      const derivedMoods = unique([world && worlds[world]?.mood, ...linked.flatMap(entry => entry.moods || [])]).filter(mood => !!moods[mood]);
      const journeyMoods = item.journeyMode === 'manual'
        ? unique([...explicitMoods, explicitWorld && worlds[explicitWorld]?.mood]).filter(mood => !!moods[mood])
        : explicitMoods.length ? explicitMoods : derivedMoods;
      stops.push({ key: `${type}:${id}`, id, type, label: label[type], title: item.title,
        summary: item.journeyLead || item.short || item.lead || item.description || '',
        question: item.journeyQuestion || item.question || genericQuestion,
        book: type === 'book' ? id : item.book || '', world, moods: journeyMoods,
        format: type === 'podcast' ? 'listen' : type === 'video' ? 'watch' : item.format || 'read',
        minutes: Number(item.minutes) || 0, createdAt: validDate(item.createdAt),
        order: Number.isFinite(Number(item.journeyOrder)) ? Number(item.journeyOrder) : 0,
        hasMedia: !!(item.imageUrl || item.videoUrl || item.audioUrl || item.audioEmbedUrl),
      });
    };
    for (const item of experiences) add('experience', item, item.id);
    for (const [id, item] of Object.entries(books)) add('book', item, id);
    for (const type of ['photo', 'podcast', 'video']) for (const item of model[`${type}s`] || []) add(type, item, item.id);
    return stops;
  }

  function rank(stops, answers = {}, history = [], now = Date.now()) {
    const seen = new Set(history);
    return stops.map((stop, position) => {
      let score = stop.order;
      const reasons = [];
      if (answers.mood && stop.moods.includes(answers.mood)) { score += 45; reasons.push('با حس انتخاب‌شده پیوند دارد'); }
      if (answers.format && answers.format !== 'both' && stop.format === answers.format) { score += 15; reasons.push('با شیوهٔ انتخاب‌شده هماهنگ است'); }
      if (answers.time === 'short' && stop.minutes > 0 && stop.minutes <= 3) score += 8;
      if (answers.time === 'medium' && stop.minutes > 0 && stop.minutes <= 7) score += 8;
      if (!seen.has(stop.key)) score += 8;
      const age = stop.createdAt ? Math.max(0, (now - stop.createdAt) / 86_400_000) : Infinity;
      if (age < 30) score += Math.round(16 * (1 - age / 30));
      if (stop.hasMedia) score += 2;
      return { ...stop, score, reasons, position };
    }).sort((a, b) => b.score - a.score || b.createdAt - a.createdAt || a.position - b.position);
  }

  function route(stops, answers = {}, history = [], now = Date.now()) {
    const ranked = rank(stops, answers, history, now);
    const lead = ranked[0];
    if (!lead) return { lead: null, next: null, world: '' };
    const next = ranked.slice(1).map(stop => ({ stop, score:
      stop.score + (stop.type !== lead.type ? 12 : 0) + (stop.world && stop.world === lead.world ? 18 : 0) +
      (stop.book && stop.book === lead.book ? 14 : 0)
    })).sort((a, b) => b.score - a.score || a.stop.key.localeCompare(b.stop.key))[0]?.stop || null;
    return { lead, next, world: lead.world || next?.world || '' };
  }
  const api = { build, rank, route };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.NahanjaJourney = api;
})(typeof window !== 'undefined' ? window : globalThis);
