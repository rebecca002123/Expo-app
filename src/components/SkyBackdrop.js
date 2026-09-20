// The living night. The gradient breathes with your clock, dust stars keep
// the dark company, and the moon shows tonight's real phase.

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { makeRng } from '../utils/rng';

function paletteForHour(hour) {
  if (hour >= 5 && hour < 8) return ['#1b1440', '#3a2a5e', '#6e4468'];   // dawn
  if (hour >= 8 && hour < 17) return ['#0b1233', '#14204d', '#1d2f66']; // day-twilight
  if (hour >= 17 && hour < 21) return ['#120f33', '#251a4d', '#43265a']; // dusk
  return ['#04060f', '#0a1130', '#10173d'];                              // deep night
}

// 0 = new moon, 0.5 = full, wrapping back to new.
function moonPhase(now) {
  const synodic = 29.53058867;
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14);
  const days = (now - knownNewMoon) / 86400000;
  return ((days % synodic) + synodic) % synodic / synodic;
}

function Moon({ size = 44 }) {
  const phase = moonPhase(Date.now());
  const illumination = 1 - Math.abs(phase - 0.5) * 2;
  const r = size / 2 - 2;
  const c = size / 2;
  // A dark disc slides across the bright one; its offset carves the crescent.
  const direction = phase < 0.5 ? -1 : 1;
  const offset = direction * (1 - illumination) * r * 1.9;
  return (
    <Svg width={size} height={size}>
      <Circle cx={c} cy={c} r={r + 1.5} fill="#f2ecd8" opacity={0.12} />
      <Circle cx={c} cy={c} r={r} fill="#f2ecd8" opacity={0.9} />
      <Circle cx={c + offset} cy={c} r={r} fill="#0a1130" opacity={0.96} />
    </Svg>
  );
}

export default function SkyBackdrop({ width, height }) {
  const palette = useMemo(() => paletteForHour(new Date().getHours()), []);

  const dust = useMemo(() => {
    const rng = makeRng('constella-dust');
    return Array.from({ length: 90 }, (_, i) => ({
      id: i,
      x: rng.range(0, width),
      y: rng.range(0, height),
      size: rng.range(0.8, 2.2),
      opacity: rng.range(0.15, 0.55),
    }));
  }, [width, height]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient colors={palette} style={StyleSheet.absoluteFill} />
      {dust.map((d) => (
        <View
          key={d.id}
          style={{
            position: 'absolute',
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            borderRadius: d.size,
            backgroundColor: '#dfe8ff',
            opacity: d.opacity,
          }}
        />
      ))}
      <View style={{ position: 'absolute', top: height * 0.07, right: 28 }}>
        <Moon />
      </View>
    </View>
  );
}
