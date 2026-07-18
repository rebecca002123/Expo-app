// The new idea Constella adds: stars logged in the same week reach for each
// other and become a named constellation — a shape your days drew together.

import { makeRng } from './rng';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const ADJECTIVES = [
  'Quiet', 'Wandering', 'Brave', 'Gentle', 'Burning', 'Paper',
  'Golden', 'Patient', 'Restless', 'Silver', 'Small', 'Hidden',
];

const NOUNS = [
  'Lantern', 'River', 'Harbor', 'Fox', 'Anchor', 'Door',
  'Garden', 'Compass', 'Kite', 'Bell', 'Crown', 'Boat',
];

function weekKey(timestamp) {
  // Weeks start on Monday, anchored to the epoch's first Monday (Jan 5 1970).
  const anchor = 4 * 24 * 60 * 60 * 1000;
  return Math.floor((timestamp - anchor) / WEEK_MS);
}

export function nameForWeek(key) {
  const rng = makeRng(`constellation-${key}`);
  return `The ${rng.pick(ADJECTIVES)} ${rng.pick(NOUNS)}`;
}

// Group stars into weekly constellations. Every group is returned (so the
// current week has a name even with one star); `linked` marks real shapes.
export function groupConstellations(stars) {
  const byWeek = new Map();
  for (const star of stars) {
    const key = weekKey(star.createdAt);
    if (!byWeek.has(key)) byWeek.set(key, []);
    byWeek.get(key).push(star);
  }
  return [...byWeek.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([key, members]) => ({
      key,
      name: nameForWeek(key),
      stars: [...members].sort((a, b) => a.createdAt - b.createdAt),
      linked: members.length >= 2,
    }));
}

export function currentWeekName(now = Date.now()) {
  return nameForWeek(weekKey(now));
}
