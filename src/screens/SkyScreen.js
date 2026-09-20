// The whole sky on one screen: backdrop, stars, the lines between them,
// and the door for planting something new.

import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line } from 'react-native-svg';
import { useSky } from '../state/SkyStore';
import { makeRng } from '../utils/rng';
import { groupConstellations, currentWeekName } from '../utils/constellations';
import SkyBackdrop from '../components/SkyBackdrop';
import Star from '../components/Star';
import ShootingStar from '../components/ShootingStar';
import Composer from '../components/Composer';
import StarDetail from '../components/StarDetail';

function starPosition(id, width, height) {
  const rng = makeRng(`pos-${id}`);
  return {
    x: rng.range(width * 0.08, width * 0.92),
    y: rng.range(height * 0.1, height * 0.68),
  };
}

export default function SkyScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { stars, loaded, addStar, deleteStar, reduceMotion } = useSky();
  const [composing, setComposing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const positions = useMemo(() => {
    const map = {};
    for (const s of stars) map[s.id] = starPosition(s.id, width, height);
    return map;
  }, [stars, width, height]);

  const constellations = useMemo(() => groupConstellations(stars), [stars]);
  const linked = constellations.filter((c) => c.linked);

  const selected = stars.find((s) => s.id === selectedId) || null;
  const selectedConstellation = selected
    ? constellations.find((c) => c.linked && c.stars.some((s) => s.id === selected.id))
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: '#05070f' }}>
      <SkyBackdrop width={width} height={height} />

      {/* Constellation lines: each week's stars, joined in the order they were felt. */}
      <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
        {linked.map((c) =>
          c.stars.slice(1).map((s, i) => {
            const a = positions[c.stars[i].id];
            const b = positions[s.id];
            if (!a || !b) return null;
            return (
              <Line
                key={`${c.key}-${s.id}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="rgba(185,205,255,0.3)"
                strokeWidth={1}
                strokeDasharray="1 5"
              />
            );
          })
        )}
      </Svg>

      {/* Constellation names, resting near their centers. */}
      {linked.map((c) => {
        const pts = c.stars.map((s) => positions[s.id]).filter(Boolean);
        if (pts.length < 2) return null;
        const cx = pts.reduce((sum, p) => sum + p.x, 0) / pts.length;
        const cy = pts.reduce((sum, p) => sum + p.y, 0) / pts.length;
        return (
          <Text
            key={`label-${c.key}`}
            pointerEvents="none"
            style={[styles.constellationLabel, {
              left: Math.min(Math.max(cx - 70, 8), width - 148),
              top: Math.min(cy + 26, height * 0.72),
            }]}
          >
            {c.name}
          </Text>
        );
      })}

      {stars.map((s) => (
        <Star
          key={s.id}
          star={s}
          position={positions[s.id]}
          reduceMotion={reduceMotion}
          onPress={() => setSelectedId(s.id)}
        />
      ))}

      <ShootingStar width={width} height={height} reduceMotion={reduceMotion} />

      <View style={[styles.header, { top: insets.top + 14 }]} pointerEvents="none">
        <Text style={styles.title}>Constella</Text>
        <Text style={styles.subtitle}>
          {stars.length} {stars.length === 1 ? 'star' : 'stars'} · {linked.length}{' '}
          {linked.length === 1 ? 'constellation' : 'constellations'}
        </Text>
        <Text style={styles.weekName}>this week is “{currentWeekName()}”</Text>
      </View>

      {loaded && stars.length === 0 && (
        <View style={styles.empty} pointerEvents="none">
          <Text style={styles.emptyText}>The sky is dark and patient.</Text>
          <Text style={styles.emptyHint}>Plant your first star below. ✦</Text>
        </View>
      )}

      <Pressable
        onPress={() => setComposing(true)}
        style={[styles.addBtn, { bottom: insets.bottom + 26 }]}
        accessibilityRole="button"
        accessibilityLabel="Plant a star"
      >
        <Text style={styles.addText}>＋</Text>
      </Pressable>

      <Composer
        visible={composing}
        onClose={() => setComposing(false)}
        onSave={(mood, note) => addStar(mood, note)}
      />

      {selected && (
        <StarDetail
          star={selected}
          constellationName={selectedConstellation?.name}
          onClose={() => setSelectedId(null)}
          onDelete={(id) => {
            deleteStar(id);
            setSelectedId(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { position: 'absolute', left: 22 },
  title: { color: '#eef1ff', fontSize: 26, fontWeight: '800', letterSpacing: 1 },
  subtitle: { color: 'rgba(230,236,255,0.55)', fontSize: 13, marginTop: 2 },
  weekName: { color: 'rgba(190,205,255,0.6)', fontSize: 12, fontStyle: 'italic', marginTop: 2 },
  constellationLabel: {
    position: 'absolute',
    width: 140,
    textAlign: 'center',
    color: 'rgba(200,214,255,0.5)',
    fontSize: 11,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  empty: { position: 'absolute', top: '42%', alignSelf: 'center', alignItems: 'center' },
  emptyText: { color: 'rgba(230,236,255,0.7)', fontSize: 16 },
  emptyHint: { color: 'rgba(230,236,255,0.45)', fontSize: 13, marginTop: 6 },
  addBtn: {
    position: 'absolute',
    alignSelf: 'center',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(91,108,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200,210,255,0.4)',
  },
  addText: { color: '#ffffff', fontSize: 30, lineHeight: 34 },
});
