// Procedural ASMR ambient loop generator -> 16-bit mono WAV files.
// All sounds are seamless loops (equal-power crossfade at the seam).
const fs = require('fs');
const path = require('path');

const SR = 22050;
const DUR = 8; // seconds
const L = SR * DUR; // loop length in samples
const CF = Math.floor(SR * 0.25); // crossfade length

const OUT = process.argv[2] || '.';
fs.mkdirSync(OUT, { recursive: true });

// deterministic PRNG so builds are reproducible
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// one-pole low-pass state helper
function makeLP(alpha) {
  let y = 0;
  return (x) => { y += alpha * (x - y); return y; };
}

// Generate a raw signal of length (L + CF) using fn(i), then crossfade-loop to length L.
function bake(name, fn, gain = 1) {
  const total = L + CF;
  const raw = new Float32Array(total);
  for (let i = 0; i < total; i++) raw[i] = fn(i);

  const out = new Float32Array(L);
  for (let i = 0; i < L; i++) {
    if (i < CF) {
      const w = i / CF; // 0 -> 1
      // equal-power crossfade between loop start and the wrapped tail
      const a = raw[i] * Math.sin((w * Math.PI) / 2);
      const b = raw[i + L] * Math.cos((w * Math.PI) / 2);
      out[i] = a + b;
    } else {
      out[i] = raw[i];
    }
  }
  // normalize / apply gain with soft clip
  for (let i = 0; i < L; i++) {
    let v = out[i] * gain;
    if (v > 1) v = 1; else if (v < -1) v = -1;
    out[i] = Math.tanh(v * 1.1) * 0.95;
  }
  writeWav(path.join(OUT, name), out);
  console.log('wrote', name, (L * 2 / 1024).toFixed(0) + 'KB');
}

function writeWav(file, samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE((s * 32767) | 0, 44 + i * 2);
  }
  fs.writeFileSync(file, buf);
}

const TAU = Math.PI * 2;

// ---- pink-ish noise via layered low-passed white (Voss-ish) ----
function pinkGen(seed) {
  const r = mulberry32(seed);
  const lps = [makeLP(0.9), makeLP(0.35), makeLP(0.1), makeLP(0.03)];
  return () => {
    const w = r() * 2 - 1;
    let s = 0;
    s += lps[0](w) * 0.4;
    s += lps[1](w) * 0.6;
    s += lps[2](w) * 0.8;
    s += lps[3](w) * 1.0;
    return s * 0.5;
  };
}

// ===================== RAIN =====================
{
  const r = mulberry32(11);
  const body = makeLP(0.5);
  const shimmerLP = makeLP(0.002);
  bake('rain.wav', () => {
    const w = r() * 2 - 1;
    const b = body(w);              // steady body
    const hiss = w * 0.18;          // high-freq droplets
    const shimmer = 0.85 + 0.15 * (shimmerLP(r()) * 4); // slow density variation
    return (b * 0.8 + hiss) * shimmer;
  }, 1.15);
}

// ===================== THUNDERSTORM =====================
{
  const r = mulberry32(23);
  const body = makeLP(0.45);
  const rumbleLP = makeLP(0.012);
  // rumble events (center sec, length sec, gain)
  const events = [
    [1.8, 2.4, 1.0],
    [5.3, 2.8, 0.85],
  ];
  bake('thunder.wav', (i) => {
    const t = i / SR;
    const w = r() * 2 - 1;
    const rain = body(w) * 0.75 + w * 0.16;
    let rumble = 0;
    for (const [c, len, g] of events) {
      const d = t - c;
      if (d > -0.2 && d < len) {
        const env = Math.exp(-Math.pow((d - len * 0.25) / (len * 0.4), 2));
        const low = rumbleLP(r() * 2 - 1);
        const sub = Math.sin(TAU * (42 + 10 * Math.sin(d * 1.5)) * t);
        rumble += (low * 2.2 + sub * 0.5) * env * g;
      }
    }
    return rain + rumble;
  }, 1.1);
}

// ===================== SNOW (soft airy wind) =====================
{
  const r = mulberry32(37);
  const air = makeLP(0.06);
  const hp = makeLP(0.4);
  bake('snow.wav', (i) => {
    const t = i / SR;
    const w = r() * 2 - 1;
    const low = air(w);
    const airy = w - hp(w); // high-passed whisper
    const breathe = 0.55 + 0.45 * Math.sin(TAU * (1 / DUR) * t - 0.5);
    return (low * 1.3 + airy * 0.25) * breathe;
  }, 0.8);
}

// ===================== WIND (cloudy / gusty) =====================
{
  const r = mulberry32(53);
  const wind = makeLP(0.05);
  bake('wind.wav', (i) => {
    const t = i / SR;
    const w = r() * 2 - 1;
    const base = wind(w);
    // gust envelope from summed low-freq sines (integer cycles over DUR for loop)
    const gust =
      0.5 +
      0.5 *
        (0.5 * Math.sin(TAU * (1 / DUR) * t) +
          0.3 * Math.sin(TAU * (2 / DUR) * t + 1.1) +
          0.2 * Math.sin(TAU * (3 / DUR) * t + 2.3));
    return base * (0.35 + 1.1 * Math.max(0, gust));
  }, 1.0);
}

// ===================== CLEAR (warm breeze + birdsong) =====================
{
  const r = mulberry32(71);
  const breeze = makeLP(0.08);
  // bird chirps: short freq-swept sine pips
  const chirps = [
    [0.7, 2600, 3400], [1.05, 3000, 2400], [2.4, 2800, 3600],
    [3.1, 3200, 2600], [4.6, 2500, 3300], [5.0, 3400, 2500],
    [6.3, 2700, 3500], [6.62, 3100, 2400],
  ];
  bake('clear.wav', (i) => {
    const t = i / SR;
    const w = r() * 2 - 1;
    let s = breeze(w) * 0.5; // gentle warm breeze
    for (const [c, f0, f1] of chirps) {
      const d = t - c;
      const len = 0.16;
      if (d >= 0 && d < len) {
        const p = d / len;
        const env = Math.sin(Math.PI * p) ** 2;
        const f = f0 + (f1 - f0) * p;
        s += Math.sin(TAU * f * d) * env * 0.32;
      }
    }
    return s;
  }, 1.0);
}

// ===================== NIGHT (crickets) =====================
{
  const r = mulberry32(97);
  const bg = makeLP(0.02);
  // cricket trills: bursts of AM'd high tone, rhythmic
  bake('night.wav', (i) => {
    const t = i / SR;
    const w = r() * 2 - 1;
    let s = bg(w) * 0.5; // soft night air
    // rhythmic chirp every ~0.33s, each ~0.12s
    const period = 0.34;
    const phase = t % period;
    if (phase < 0.13) {
      const env = Math.sin((phase / 0.13) * Math.PI) ** 2;
      const trill = 0.5 + 0.5 * Math.sin(TAU * 42 * t); // wing trill
      s += Math.sin(TAU * 4600 * t) * env * trill * 0.22;
      s += Math.sin(TAU * 5200 * t) * env * trill * 0.1;
    }
    // a second, offset cricket for depth
    const phase2 = (t + 0.17) % 0.41;
    if (phase2 < 0.1) {
      const env2 = Math.sin((phase2 / 0.1) * Math.PI) ** 2;
      const trill2 = 0.5 + 0.5 * Math.sin(TAU * 38 * t);
      s += Math.sin(TAU * 4200 * t) * env2 * trill2 * 0.12;
    }
    return s;
  }, 1.0);
}

// ===================== FOG (drone + distant foghorn) =====================
{
  const r = mulberry32(131);
  const haze = makeLP(0.015);
  bake('fog.wav', (i) => {
    const t = i / SR;
    const w = r() * 2 - 1;
    // detuned low drone -> slow beating
    const drone =
      Math.sin(TAU * 70 * t) * 0.5 +
      Math.sin(TAU * 70.5 * t) * 0.5 +
      Math.sin(TAU * 105 * t) * 0.2;
    const hz = haze(w) * 1.2; // low haze
    // distant foghorn swell every 4s
    const fp = t % 4.0;
    let horn = 0;
    if (fp < 1.4) {
      const env = Math.sin((fp / 1.4) * Math.PI) ** 2;
      horn = (Math.sin(TAU * 116 * t) + Math.sin(TAU * 174 * t) * 0.4) * env * 0.25;
    }
    return drone * 0.28 + hz + horn;
  }, 0.9);
}

console.log('done');
