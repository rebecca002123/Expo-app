// The six core emotions. Each one burns as a different kind of star.

export const MOODS = {
  happy: {
    key: 'happy',
    emoji: '😊',
    label: 'Happy',
    core: '#ffd97a',
    glow: '#ffedb0',
    points: 5,
    twinkle: [1400, 2200],
    whisper: 'A little sun that never sets.',
  },
  excited: {
    key: 'excited',
    emoji: '🤩',
    label: 'Excited',
    core: '#ffb36b',
    glow: '#ffd9a8',
    points: 4,
    twinkle: [700, 1200],
    whisper: 'It crackles when you look at it.',
  },
  peaceful: {
    key: 'peaceful',
    emoji: '😌',
    label: 'Peaceful',
    core: '#a8d8ff',
    glow: '#dcefff',
    points: 0,
    twinkle: [2600, 3600],
    whisper: "It barely moves. It doesn't need to.",
  },
  sad: {
    key: 'sad',
    emoji: '😔',
    label: 'Sad',
    core: '#8fa8c8',
    glow: '#c5d6ee',
    points: 5,
    twinkle: [2000, 3000],
    whisper: 'Even dim stars hold the sky together.',
  },
  anxious: {
    key: 'anxious',
    emoji: '😰',
    label: 'Anxious',
    core: '#9a93c8',
    glow: '#cfc9f0',
    points: 6,
    twinkle: [420, 700],
    whisper: 'It flickers — and keeps shining anyway.',
  },
  inspired: {
    key: 'inspired',
    emoji: '✨',
    label: 'Inspired',
    core: '#b28dff',
    glow: '#e3d4ff',
    points: 6,
    twinkle: [1000, 1800],
    whisper: 'New light. The sky leans in.',
  },
};

export const MOOD_LIST = Object.values(MOODS);

export function moodFor(key) {
  return MOODS[key] || MOODS.peaceful;
}
