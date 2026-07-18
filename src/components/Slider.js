import React, { useRef, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';

// Minimal dependency-free horizontal slider (0..1).
export default function Slider({ value, onChange, width = 180, accent = '#fff' }) {
  const [w, setW] = useState(width);
  const wRef = useRef(width);

  const setFromX = (x) => {
    const v = Math.max(0, Math.min(1, x / wRef.current));
    onChange(v);
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => setFromX(e.nativeEvent.locationX),
      onPanResponderMove: (e) => setFromX(e.nativeEvent.locationX),
    })
  ).current;

  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      {...responder.panHandlers}
      onLayout={(e) => {
        const lw = e.nativeEvent.layout.width;
        wRef.current = lw;
        setW(lw);
      }}
      style={[styles.wrap, { width }]}
      hitSlop={{ top: 12, bottom: 12 }}
    >
      <View style={styles.track} />
      <View style={[styles.fill, { width: pct * w, backgroundColor: accent }]} />
      <View style={[styles.thumb, { left: Math.max(0, pct * w - 9), backgroundColor: accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 28, justifyContent: 'center' },
  track: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: 5,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    top: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
});
