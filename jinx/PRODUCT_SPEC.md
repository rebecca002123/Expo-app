# Jinx — call your shots

A personal prediction market on your own life. Built for Expo Go.

## The idea

Users make predictions about themselves — "I'll go to the gym 3x this week", "I'll finish the project by Friday" — lock in a confidence percentage (50–99%), and set a deadline. When the deadline passes, they resolve the prediction **Yes ("Called it!")** or **No ("Jinxed")**.

The app scores how well-calibrated they are about their own life: a **Self-Knowledge Score** (0–100, derived from the Brier score), accuracy by category, and a **Called It streak** (consecutive correct predictions). Resolved predictions become shareable image cards.

Why it can be big: it sits at the intersection of habit trackers, prediction markets, and journaling — but nobody has shipped a *self-calibration game*. The share cards are the growth loop.

## Core features

1. **Onboarding (4 steps):** animated concept intro → name entry → guided first prediction → ready screen. Progress dots, skippable.
2. **Home:** open predictions with deadline countdowns, confidence badge, category icon. Floating "+" to add.
3. **New prediction:** free-text prediction, category (Health, Career, Social, Habits, Money, Wildcard), confidence slider 50–99% with playful copy, deadline picker.
4. **Resolution:** overdue predictions surface for Yes/No resolution. Confetti on "Called it!", glitch/shake on "Jinxed".
5. **Stats:** Self-Knowledge Score, accuracy %, accuracy by category, current/best Called It streak, calibration insights ("You're overconfident about Health").
6. **Share cards:** image of a resolved prediction, shared via the native share sheet.

## Design

Dark theme, subtle gradients, rounded cards, electric-violet accent, generous whitespace, haptics on key interactions. Rich animation reserved for onboarding and the resolve moment; everything else subtle.

## Technical decisions

- Expo (React Native), must run in **Expo Go** with zero configuration.
- Pure local persistence via AsyncStorage — no accounts, no backend, fully offline.
- Calibration: Brier score internally, presented as a friendly 0–100 Self-Knowledge Score; plain accuracy shown as a secondary stat.
- Streak = consecutive correct predictions ("Called It streak").

## Builds in progress

- **Emergent:** job `4f849c58-3803-477e-8586-621d4a0c4fea` — https://app.emergent.sh/?job_id=4f849c58-3803-477e-8586-621d4a0c4fea
- **Replit:** https://replit.com/@rebeccaguntrip2/Prediction-Market

## Monetization ideas (later)

- Premium: deeper calibration analytics, prediction templates, streak insurance.
- Social layer: friends can co-sign or doubt your predictions (drives retention + invites).
- B2B angle: team forecasting / decision-calibration for companies.
