const { test } = require('node:test');
const assert = require('node:assert/strict');
const { build, rank, route } = require('../public/nahanja-journey.js');

const model = {
  moods: { calm: { title: 'مکث' }, think: { title: 'پرسش' } },
  worlds: {
    solitude: { title: 'تنهایی', kicker: 'سکوت', words: ['سکوت'], mood: 'calm' },
    choice: { title: 'انتخاب', kicker: 'پرسش', words: ['انتخاب'], mood: 'think' },
  },
  books: { book1: { title: 'کتاب سکوت', keywords: ['سکوت'], description: 'درباره سکوت' } },
  experiences: [{ id: 'exp1', title: 'مکث', book: 'book1', world: 'solitude', moods: ['calm'], format: 'read', minutes: 3 }],
  photos: [], podcasts: [], videos: [],
};

test('a newly published photo, podcast and video become eligible route stops', () => {
  const updated = { ...model,
    photos: [{ id: 'photo1', title: 'قاب سکوت', book: 'book1', imageUrl: 'https://example.test/p.jpg' }],
    podcasts: [{ id: 'pod1', title: 'صدای سکوت', world: 'solitude', audioUrl: 'https://example.test/a.mp3' }],
    videos: [{ id: 'vid1', title: 'تصویر انتخاب', world: 'choice', videoUrl: 'https://example.test/v.mp4' }],
  };
  const stops = build(updated);
  assert.deepEqual(new Set(stops.map(stop => stop.key)), new Set(['experience:exp1', 'book:book1', 'photo:photo1', 'podcast:pod1', 'video:vid1']));
  assert.ok(stops.find(stop => stop.key === 'photo:photo1').moods.includes('calm'));
  assert.equal(stops.find(stop => stop.key === 'podcast:pod1').format, 'listen');
  assert.equal(stops.find(stop => stop.key === 'video:vid1').format, 'watch');
});

test('owner can hide a stop or fix its semantic links manually', () => {
  const updated = { ...model,
    photos: [{ id: 'hidden', title: 'پنهان', journeyMode: 'hidden' },
      { id: 'manual', title: 'سکوت', journeyMode: 'manual', world: 'choice', moods: ['think'], journeyQuestion: 'چه پرسشی مانده؟', journeyOrder: 10 }],
  };
  const stops = build(updated);
  assert.equal(stops.some(stop => stop.id === 'hidden'), false);
  assert.equal(build(updated, { includeHidden: true }).some(stop => stop.id === 'hidden'), true);
  assert.deepEqual(stops.find(stop => stop.id === 'manual').moods, ['think']);
  assert.equal(stops.find(stop => stop.id === 'manual').question, 'چه پرسشی مانده؟');
  assert.equal(stops.find(stop => stop.id === 'manual').order, 10);
});

test('explicit preferences and fresh content change ordering without erasing existing content', () => {
  const now = Date.parse('2026-10-06T00:00:00Z');
  const stops = build({ ...model, podcasts: [{ id: 'new', title: 'صدای تازه', world: 'solitude', createdAt: '2026-10-05T00:00:00Z' }] });
  const listening = rank(stops, { mood: 'calm', format: 'listen' }, [], now);
  assert.equal(listening[0].key, 'podcast:new');
  assert.equal(listening.length, 3);
  const journey = route(stops, { mood: 'calm', format: 'listen' }, [], now);
  assert.equal(journey.lead.key, 'podcast:new');
  assert.notEqual(journey.next.type, journey.lead.type);
});

test('unrelated content remains discoverable when no semantic link is known', () => {
  const stops = build({ ...model, photos: [{ id: 'open', title: 'یک قاب تازه' }] });
  const open = stops.find(stop => stop.key === 'photo:open');
  assert.equal(open.world, '');
  assert.deepEqual(open.moods, []);
  assert.ok(rank(stops, { mood: 'calm' }).some(stop => stop.key === open.key));
});
