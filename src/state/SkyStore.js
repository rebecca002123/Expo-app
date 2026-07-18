// The heart of the sky: every star is stored on-device (AsyncStorage).
// No account, no cloud — your sky belongs to you.

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccessibilityInfo } from 'react-native';
import { analyzeSentiment } from '../utils/sentiment';

const STARS_KEY = 'constella.stars.v1';

const SkyContext = createContext(null);

const dayMs = 24 * 60 * 60 * 1000;

function sampleStars() {
  const now = Date.now();
  const mk = (id, daysAgo, mood, note) => ({
    id,
    createdAt: now - daysAgo * dayMs - 3600000 * 4,
    mood,
    note,
    sample: true,
    sentiment: analyzeSentiment(note),
  });
  return [
    mk(
      'sample-peaceful', 9, 'peaceful',
      'Slow evening. Watched the sky change color from the balcony and let my thoughts drift with it.'
    ),
    mk(
      'sample-happy', 3, 'happy',
      'Laughed until my cheeks hurt over the smallest thing. Grateful for days that feel light.'
    ),
    mk(
      'sample-inspired', 1, 'inspired',
      'An idea woke me up and would not let go. Filled four pages before breakfast. It might be something.'
    ),
  ];
}

export function SkyProvider({ children }) {
  const [stars, setStars] = useState(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STARS_KEY);
        setStars(raw === null ? sampleStars() : JSON.parse(raw));
      } catch {
        setStars(sampleStars());
      }
    })();
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const sub = AccessibilityInfo.addEventListener?.('reduceMotionChanged', setReduceMotion);
    return () => sub?.remove?.();
  }, []);

  useEffect(() => {
    if (stars !== null) {
      AsyncStorage.setItem(STARS_KEY, JSON.stringify(stars)).catch(() => {});
    }
  }, [stars]);

  const addStar = useCallback((mood, note) => {
    const star = {
      id: `star-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      createdAt: Date.now(),
      mood,
      note: note.trim(),
      sentiment: analyzeSentiment(note),
    };
    setStars((prev) => [star, ...(prev || [])]);
    return star;
  }, []);

  const deleteStar = useCallback((id) => {
    setStars((prev) => (prev || []).filter((s) => s.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      stars: stars || [],
      loaded: stars !== null,
      addStar,
      deleteStar,
      reduceMotion,
    }),
    [stars, reduceMotion, addStar, deleteStar]
  );

  return <SkyContext.Provider value={value}>{children}</SkyContext.Provider>;
}

export function useSky() {
  const ctx = useContext(SkyContext);
  if (!ctx) throw new Error('useSky must be used inside SkyProvider');
  return ctx;
}
