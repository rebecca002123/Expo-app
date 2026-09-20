# Alarm Notifications App - Expo Go Setup

## Overview
A modern, glassmorphic alarm notification UI app inspired by ColorOS 17, built for Expo Go. Features smooth animations, customizable snooze times, and an elegant design.

## Quick Start

### Option 1: Expo Go (Fastest)
1. Download **Expo Go** app on your phone
2. Run the following command in your project directory:
   ```bash
   npx expo start
   ```
3. Scan the QR code with your phone camera or Expo Go app
4. The app will load instantly!

### Option 2: Local Development
1. Create a new Expo project:
   ```bash
   npx create-expo-app alarm-notifications
   cd alarm-notifications
   ```

2. Install dependencies:
   ```bash
   npm install expo-linear-gradient
   ```

3. Replace your `App.js` with the provided `AlarmNotificationApp.jsx` content

4. Update your `app.json` with the provided configuration

5. Start the app:
   ```bash
   npx expo start
   ```

## Features

### ✨ Design Elements
- **Glassmorphic Cards** - Frosted glass effect with blur and transparency
- **Gradient Backgrounds** - Smooth linear gradients per alarm
- **Pulse Animations** - Smooth scaling animations for active alarms
- **Slide-in Entrance** - Staggered card animations on load

### 🎯 Interactive Features
- **Snooze Button** - Expands to show quick options (5m, 10m, 15m)
- **Dismiss Button** - Remove alarms from the notification list
- **Reset All** - Restore all dismissed alarms at once
- **Multiple Alarms** - Display and manage multiple alarms simultaneously

### 🎨 Customization

#### Change Alarm Colors
Open `AlarmNotificationApp.jsx` and modify the `alarms` state:
```javascript
{
  id: 1,
  time: '11:03',
  period: 'AM',
  label: 'Alarm',
  color: ['#1e3a8a', '#0c4a6e'],  // Change these colors
  icon: 'alarm',
  isAnimating: true,
}
```

#### Change Icons
Replace `icon` value with any icon from @expo/vector-icons (MaterialCommunityIcons):
- `alarm` → Alarm clock
- `calendar-clock` → Meeting/Calendar
- `dumbbell` → Workout
- `coffee` → Break time
- `moon` → Sleep reminder
- See full list: [Icon Browser](https://icons.expo.fyi/)

#### Modify Snooze Options
Find this line and change the array:
```javascript
{[5, 10, 15].map(minutes => (  // Change to [3, 7, 20] etc.
```

### 📱 Responsive Design
The app automatically adapts to different screen sizes:
- Portrait orientation optimized
- Scales for tablets
- Touch target sizes optimized (44px minimum)

## File Structure
```
alarm-notifications/
├── AlarmNotificationApp.jsx     # Main component
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── App.js                        # Root file (use component)
└── SETUP.md                      # This file
```

## Component Props & State

### Alarm Object
```javascript
{
  id: number,           // Unique identifier
  time: string,         // "HH:MM" format
  period: string,       // "AM" or "PM"
  label: string,        // "Alarm", "Meeting", etc.
  color: array,         // [startColor, endColor] for gradient
  icon: string,         // Icon name from @expo/vector-icons
  isAnimating: boolean  // Whether card pulses
}
```

### Functions
- `handleSnooze(id)` - Snooze alarm by 5 minutes
- `handleDismiss(id)` - Remove alarm from display
- `Reset All` - Restore dismissed alarms

## Animation Details

### Pulse Animation
- Duration: 1.2s (600ms up, 600ms down)
- Scale: 1 → 1.15 → 1
- Applied to cards with `isAnimating: true`

### Slide-in Animation
- Duration: 400ms
- Staggered by 100ms per card
- Easing: Linear

## Dependencies

| Package | Purpose |
|---------|---------|
| `expo-linear-gradient` | Gradient backgrounds |
| `@expo/vector-icons` | Icon library (MaterialCommunityIcons) |
| `react-native` | UI components |
| `expo` | Managed app platform |

All included in `package.json` - just run `npm install`!

## Troubleshooting

### QR Code not scanning?
- Make sure phone camera has permission for Expo Go
- Try entering the URL manually from terminal output
- Check both devices are on same WiFi network

### Icons not showing?
- Clear Expo cache: `expo start --clear`
- Reinstall: `npm install expo@latest`

### Animations choppy?
- Close background apps
- Try clearing cache: `expo start --clear`
- Animations use `useNativeDriver: true` for performance

### Can't import expo-linear-gradient?
Run:
```bash
npm install expo-linear-gradient
```

## Performance Tips

1. **Limit Active Alarms** - Keep to <5 animated alarms simultaneously
2. **Use Native Driver** - All animations use `useNativeDriver: true`
3. **Memoize Components** - Consider wrapping AlarmCard in React.memo for large lists

## Next Steps

### Enhance the App
- [ ] Add sound/vibration on alarm trigger
- [ ] Persist alarms to AsyncStorage
- [ ] Add light/dark theme toggle
- [ ] Custom snooze duration input
- [ ] Alarm history/logs
- [ ] Integration with device calendar

### Deploy
- Build and publish to Expo: `eas build`
- Submit to App Stores: `eas submit`
- Share with link: Run on Expo servers

## Resources

- **Expo Docs**: https://docs.expo.dev/
- **Icon Browser**: https://icons.expo.fyi/
- **Linear Gradient Docs**: https://docs.expo.dev/versions/latest/sdk/linear-gradient/
- **React Native Animated API**: https://reactnative.dev/docs/animated

## License
Free to use and modify!

---

**Questions?** Check the Expo Discord or Expo forums for community support.
