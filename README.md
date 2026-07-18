# 🌦️ Weather Mood — Live Weather Backgrounds + ASMR

A relaxing Expo (SDK 54) app with **live animated weather backgrounds** and
looping **ASMR ambience**. Tap any weather to instantly change the whole scene —
sky, particles, and sound.

## ✨ Features

- **7 living weather scenes**, each with its own animated background:
  - ☀️ **Sunny** — glowing, pulsing sun with warm light glints
  - ☁️ **Cloudy** — soft clouds drifting across the sky
  - 🌧️ **Rain** — angled falling rain streaks
  - ⛈️ **Storm** — heavy rain with random lightning flashes
  - ❄️ **Snow** — gentle snowflakes swaying as they fall
  - 🌙 **Night** — twinkling stars and a glowing crescent moon
  - 🌫️ **Fog** — slow rolling banks of fog
- **ASMR sound for every weather** — rain, thunder, wind, birdsong, crickets,
  a foggy drone and more. Every loop is **procedurally generated** (no
  copyrighted audio, fully offline).
- **Change the weather to anything you want** with the bottom picker.
- **Smooth crossfade** transition between scenes.
- **Sound controls** — mute toggle and a volume slider.
- **🎲 Shuffle** button for a random weather.
- Works fully **offline** — all visuals and sounds are bundled.

## 🚀 Run it (Expo Go, SDK 54)

```bash
npm install
npx expo start
```

Then scan the QR code with the **Expo Go** app (make sure it's the SDK 54
build), or press `a` / `i` for an Android emulator / iOS simulator.

> Tip: flip your phone's silent switch off, or the audio uses
> `playsInSilentMode` so it should play regardless.

## 🧩 Project structure

```
App.js                      # main screen: crossfading sky + HUD + controls
src/weathers.js             # weather presets (colors, sound, copy, temp)
src/useWeatherSound.js      # expo-audio looping-ambience hook
src/components/
  ParticleField.js          # all animated scenes (rain, snow, stars, sun…)
  Slider.js                 # tiny dependency-free volume slider
assets/sounds/*.wav         # procedurally generated ASMR loops
```

## 🔊 How the sounds were made

The ambience loops in `assets/sounds/` are synthesized as seamless 8-second
WAV loops (filtered noise, gentle tones, and rhythmic chirps) — see
`scripts/gen-sounds.js`. Re-generate them anytime with:

```bash
node scripts/gen-sounds.js assets/sounds
```

## 🛠️ Built with

- Expo SDK 54 · React Native 0.81 · React 19
- `expo-audio` for looping playback
- `expo-linear-gradient` for the skies
- React Native `Animated` for every particle (no extra native deps)
