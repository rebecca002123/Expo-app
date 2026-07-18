// One feeling, burning in place. Shape and color come from the mood,
// brightness from the tone of the words, twinkle rhythm from the star itself.

import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable } from 'react-native';
import Svg, { Circle, Polygon } from 'react-native-svg';
import { makeRng } from '../utils/rng';
import { moodFor } from '../utils/stars';

function starPoints(cx, cy, spikes, outerR, innerR) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return pts.join(' ');
}

export default function Star({ star, position, onPress, reduceMotion }) {
  const mood = moodFor(star.mood);
  const rng = useMemo(() => makeRng(star.id), [star.id]);

  const size = useMemo(() => {
    const sentimentBoost = (star.sentiment?.score || 0) * 3;
    return Math.max(7, 11 + sentimentBoost + rng.range(-1.5, 2.5));
  }, [star, rng]);

  const twinkle = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduceMotion) return;
    const duration = rng.range(mood.twinkle[0], mood.twinkle[1]);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(twinkle, {
          toValue: 0.62,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(twinkle, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [twinkle, reduceMotion, mood, rng]);

  const box = size * 4;
  const c = box / 2;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: position.x - box / 2,
        top: position.y - box / 2,
        width: box,
        height: box,
        opacity: twinkle,
      }}
    >
      <Pressable
        onPress={onPress}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`${mood.label} star`}
        style={{ flex: 1 }}
      >
        <Svg width={box} height={box}>
          <Circle cx={c} cy={c} r={size * 1.7} fill={mood.glow} opacity={0.16} />
          <Circle cx={c} cy={c} r={size * 1.05} fill={mood.glow} opacity={0.3} />
          {mood.points === 0 ? (
            <Circle cx={c} cy={c} r={size * 0.62} fill={mood.core} />
          ) : (
            <Polygon
              points={starPoints(c, c, mood.points, size, size * 0.42)}
              fill={mood.core}
            />
          )}
          <Circle cx={c} cy={c} r={size * 0.2} fill="#ffffff" opacity={0.85} />
        </Svg>
      </Pressable>
    </Animated.View>
  );
}
