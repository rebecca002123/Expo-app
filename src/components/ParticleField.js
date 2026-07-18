import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const rand = (min, max) => min + Math.random() * (max - min);

/* ------------------------------------------------------------------ RAIN */
function RainDrop({ drop, height }) {
  const y = useRef(new Animated.Value(-40)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(y, {
          toValue: height + 40,
          duration: drop.dur,
          delay: drop.delay,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(y, { toValue: -40, duration: 0, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [height]);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: drop.left,
        top: 0,
        width: 2,
        height: drop.len,
        borderRadius: 1,
        backgroundColor: `rgba(200,222,255,${drop.opacity})`,
        transform: [{ translateY: y }, { rotate: `${drop.angle}deg` }],
      }}
    />
  );
}

function Rain({ width, height, count = 70, angle = 14 }) {
  const drops = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: rand(-20, width),
        len: rand(14, 42),
        dur: rand(450, 900),
        delay: rand(0, 1400),
        opacity: rand(0.15, 0.55),
        angle,
      })),
    [width, height, count]
  );
  return (
    <>
      {drops.map((d, i) => (
        <RainDrop key={i} drop={d} height={height} />
      ))}
    </>
  );
}

/* --------------------------------------------------------------- LIGHTNING */
function Lightning({ width, height }) {
  const flash = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let alive = true;
    let timeout;
    const strike = () => {
      if (!alive) return;
      // a double-flash burst
      Animated.sequence([
        Animated.timing(flash, { toValue: 0.9, duration: 60, useNativeDriver: true }),
        Animated.timing(flash, { toValue: 0.1, duration: 90, useNativeDriver: true }),
        Animated.timing(flash, { toValue: 0.7, duration: 50, useNativeDriver: true }),
        Animated.timing(flash, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]).start();
      timeout = setTimeout(strike, rand(2600, 6000));
    };
    timeout = setTimeout(strike, rand(1200, 3000));
    return () => {
      alive = false;
      clearTimeout(timeout);
    };
  }, []);
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: '#dfe8ff', opacity: flash },
      ]}
    />
  );
}

/* ------------------------------------------------------------------ SNOW */
function Snowflake({ flake, height }) {
  const y = useRef(new Animated.Value(flake.startY)).current;
  const x = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const fall = Animated.loop(
      Animated.sequence([
        Animated.timing(y, {
          toValue: height + 20,
          duration: flake.dur,
          delay: flake.delay,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(y, { toValue: -20, duration: 0, useNativeDriver: true }),
      ])
    );
    const sway = Animated.loop(
      Animated.sequence([
        Animated.timing(x, {
          toValue: flake.sway,
          duration: flake.swayDur,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(x, {
          toValue: -flake.sway,
          duration: flake.swayDur,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    fall.start();
    sway.start();
    return () => {
      fall.stop();
      sway.stop();
    };
  }, [height]);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: flake.left,
        top: 0,
        width: flake.size,
        height: flake.size,
        borderRadius: flake.size / 2,
        backgroundColor: `rgba(255,255,255,${flake.opacity})`,
        transform: [{ translateY: y }, { translateX: x }],
      }}
    />
  );
}

function Snow({ width, height, count = 55 }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: count }).map(() => {
        const size = rand(3, 8);
        return {
          left: rand(0, width),
          startY: rand(-height, 0),
          size,
          opacity: rand(0.4, 0.95),
          dur: rand(6000, 12000),
          delay: rand(0, 4000),
          sway: rand(10, 40),
          swayDur: rand(1600, 3200),
        };
      }),
    [width, height, count]
  );
  return (
    <>
      {flakes.map((f, i) => (
        <Snowflake key={i} flake={f} height={height} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ STARS */
function Star({ star }) {
  const o = useRef(new Animated.Value(star.opacity)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(o, {
          toValue: 0.2,
          duration: star.dur,
          delay: star.delay,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(o, {
          toValue: 1,
          duration: star.dur,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: star.left,
        top: star.top,
        width: star.size,
        height: star.size,
        borderRadius: star.size / 2,
        backgroundColor: '#fff',
        opacity: o,
      }}
    />
  );
}

function Moon({ width }) {
  return (
    <View style={{ position: 'absolute', top: 70, right: 44 }}>
      <View style={styles.moonGlow} />
      <View style={styles.moon}>
        <View style={styles.moonShadow} />
      </View>
    </View>
  );
}

function Night({ width, height, count = 60 }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: rand(0, width),
        top: rand(0, height * 0.6),
        size: rand(1.5, 3.5),
        opacity: rand(0.4, 1),
        dur: rand(900, 2600),
        delay: rand(0, 2000),
      })),
    [width, height, count]
  );
  return (
    <>
      {stars.map((s, i) => (
        <Star key={i} star={s} />
      ))}
      <Moon width={width} />
    </>
  );
}

/* ------------------------------------------------------------------ SUN */
function Sun() {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 2600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 2600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.6] });
  return (
    <View style={{ position: 'absolute', top: 60, right: 48 }}>
      <Animated.View style={[styles.sunHalo, { opacity, transform: [{ scale }] }]} />
      <View style={styles.sun} />
    </View>
  );
}

function Glint({ g, height }) {
  const y = useRef(new Animated.Value(g.startY)).current;
  const o = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(y, {
        toValue: -30,
        duration: g.dur,
        delay: g.delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(o, { toValue: g.opacity, duration: g.dur / 2, delay: g.delay, useNativeDriver: true }),
        Animated.timing(o, { toValue: 0, duration: g.dur / 2, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: g.left,
        top: 0,
        width: g.size,
        height: g.size,
        borderRadius: g.size / 2,
        backgroundColor: '#fff7cc',
        opacity: o,
        transform: [{ translateY: y }],
      }}
    />
  );
}

function Clear({ width, height, count = 18 }) {
  const glints = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: rand(0, width),
        startY: rand(0, height),
        size: rand(2, 5),
        opacity: rand(0.3, 0.8),
        dur: rand(5000, 10000),
        delay: rand(0, 5000),
      })),
    [width, height, count]
  );
  return (
    <>
      <Sun />
      {glints.map((g, i) => (
        <Glint key={i} g={g} height={height} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------ CLOUDS / FOG */
function DriftBand({ band, width }) {
  const x = useRef(new Animated.Value(band.startX)).current;
  useEffect(() => {
    const travel = width + band.w + 80;
    const anim = Animated.loop(
      Animated.timing(x, {
        toValue: width + 40,
        duration: band.dur,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    // reset to left of screen each cycle by interpolating? use modulo via listener-free loop:
    anim.start();
    return () => anim.stop();
  }, []);
  const translateX = x.interpolate({
    inputRange: [-band.w - 80, width + 40],
    outputRange: [-band.w - 80, width + 40],
  });
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: band.top,
        left: -band.w - 80,
        width: band.w,
        height: band.h,
        borderRadius: band.h / 2,
        backgroundColor: band.color,
        opacity: band.opacity,
        transform: [{ translateX: x }],
      }}
    />
  );
}

function Cloudy({ width, height, count = 6 }) {
  const bands = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const w = rand(140, 280);
        return {
          w,
          h: rand(50, 90),
          top: rand(40, height * 0.55),
          startX: rand(-w, width),
          dur: rand(26000, 52000),
          opacity: rand(0.25, 0.55),
          color: 'rgba(255,255,255,0.9)',
        };
      }),
    [width, height, count]
  );
  return (
    <>
      {bands.map((b, i) => (
        <DriftBand key={i} band={b} width={width} />
      ))}
    </>
  );
}

function Fog({ width, height, count = 7 }) {
  const bands = useMemo(
    () =>
      Array.from({ length: count }).map(() => {
        const w = rand(260, 460);
        return {
          w,
          h: rand(90, 170),
          top: rand(0, height),
          startX: rand(-w, width),
          dur: rand(30000, 60000),
          opacity: rand(0.12, 0.3),
          color: 'rgba(235,240,244,1)',
        };
      }),
    [width, height, count]
  );
  return (
    <>
      {bands.map((b, i) => (
        <DriftBand key={i} band={b} width={width} />
      ))}
    </>
  );
}

/* --------------------------------------------------------------- DISPATCH */
export default function ParticleField({ type, width, height }) {
  let field = null;
  switch (type) {
    case 'rain':
      field = <Rain width={width} height={height} />;
      break;
    case 'thunder':
      field = (
        <>
          <Rain width={width} height={height} count={90} angle={10} />
          <Lightning width={width} height={height} />
        </>
      );
      break;
    case 'snow':
      field = <Snow width={width} height={height} />;
      break;
    case 'night':
      field = <Night width={width} height={height} />;
      break;
    case 'clear':
      field = <Clear width={width} height={height} />;
      break;
    case 'cloudy':
      field = <Cloudy width={width} height={height} />;
      break;
    case 'fog':
      field = <Fog width={width} height={height} />;
      break;
    default:
      field = null;
  }
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {field}
    </View>
  );
}

const styles = StyleSheet.create({
  sun: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FFE47A',
    shadowColor: '#FFD54A',
    shadowOpacity: 0.9,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },
  sunHalo: {
    position: 'absolute',
    top: -28,
    left: -28,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFE47A',
  },
  moon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F4F1E4',
    overflow: 'hidden',
    shadowColor: '#F4F1E4',
    shadowOpacity: 0.8,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  moonShadow: {
    position: 'absolute',
    top: -10,
    right: -18,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  moonGlow: {
    position: 'absolute',
    top: -22,
    left: -22,
    width: 114,
    height: 114,
    borderRadius: 57,
    backgroundColor: 'rgba(244,241,228,0.18)',
  },
});
