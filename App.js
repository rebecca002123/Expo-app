import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { setAudioModeAsync } from 'expo-audio';

import { WEATHERS } from './src/weathers';
import { useWeatherSound } from './src/useWeatherSound';
import ParticleField from './src/components/ParticleField';
import Slider from './src/components/Slider';

// One sky layer: gradient + its animated particle field.
function Sky({ weather, width, height }) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient colors={weather.colors} style={StyleSheet.absoluteFill} />
      <ParticleField type={weather.particle} width={width} height={height} />
    </View>
  );
}

export default function App() {
  const { width, height } = useWindowSize();

  const [current, setCurrent] = useState(WEATHERS[0]);
  const [prev, setPrev] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [volume, setVolume] = useState(0.7);

  const fade = useRef(new Animated.Value(1)).current;

  // configure audio to play even when the ringer is silent
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  useWeatherSound(current.sound, soundOn, volume);

  const changeWeather = (w) => {
    if (w.id === current.id) return;
    setPrev(current);
    setCurrent(w);
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setPrev(null);
    });
  };

  const shuffle = () => {
    const others = WEATHERS.filter((w) => w.id !== current.id);
    changeWeather(others[Math.floor(Math.random() * others.length)]);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* crossfading sky layers */}
      {prev && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { opacity: fade.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) },
          ]}
        >
          <Sky weather={prev} width={width} height={height} />
        </Animated.View>
      )}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade }]}>
        <Sky weather={current} width={width} height={height} />
      </Animated.View>

      {/* subtle darkening so text stays readable on any sky */}
      <LinearGradient
        colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.45)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* ---------------- HUD ---------------- */}
      <View style={styles.hud} pointerEvents="box-none">
        {/* top readout */}
        <View style={styles.topRow}>
          <Text style={styles.temp}>{current.temp}°</Text>
          <Text style={styles.bigEmoji}>{current.emoji}</Text>
        </View>
        <Text style={styles.weatherName}>{current.label}</Text>
        <Text style={styles.desc}>{current.desc}</Text>

        <View style={{ flex: 1 }} />

        {/* control card */}
        <View style={styles.card}>
          <View style={styles.soundRow}>
            <Pressable
              onPress={() => setSoundOn((s) => !s)}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              hitSlop={10}
            >
              <Text style={styles.iconTxt}>{soundOn ? '🔊' : '🔈'}</Text>
            </Pressable>
            <Slider
              value={volume}
              onChange={setVolume}
              width={Math.max(120, width - 190)}
              accent="#ffffff"
            />
            <Pressable
              onPress={shuffle}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              hitSlop={10}
            >
              <Text style={styles.iconTxt}>🎲</Text>
            </Pressable>
          </View>

          {/* weather picker */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pickerContent}
          >
            {WEATHERS.map((w) => {
              const active = w.id === current.id;
              return (
                <Pressable
                  key={w.id}
                  onPress={() => changeWeather(w)}
                  style={({ pressed }) => [
                    styles.chip,
                    active && styles.chipActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.chipEmoji}>{w.emoji}</Text>
                  <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                    {w.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

function useWindowSize() {
  const [size, setSize] = useState(() => Dimensions.get('window'));
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => setSize(window));
    return () => sub?.remove?.();
  }, []);
  return size;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  hud: {
    flex: 1,
    paddingTop: 74,
    paddingHorizontal: 22,
    paddingBottom: 34,
  },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  temp: {
    color: '#fff',
    fontSize: 72,
    fontWeight: '200',
    letterSpacing: -2,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 8,
  },
  bigEmoji: { fontSize: 44, marginLeft: 14, marginTop: 8 },
  weatherName: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '600',
    marginTop: -6,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 8,
  },
  desc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 6,
  },
  card: {
    backgroundColor: 'rgba(20,24,40,0.42)',
    borderRadius: 26,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTxt: { fontSize: 20 },
  pressed: { opacity: 0.55 },
  pickerContent: { gap: 10, paddingRight: 6 },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.10)',
    minWidth: 66,
  },
  chipActive: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  chipEmoji: { fontSize: 22 },
  chipLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 3,
    fontWeight: '600',
  },
  chipLabelActive: { color: '#1a1f33' },
});
