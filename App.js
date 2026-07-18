import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SkyProvider } from './src/state/SkyStore';
import SkyScreen from './src/screens/SkyScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <SkyProvider>
        <StatusBar hidden />
        <SkyScreen />
      </SkyProvider>
    </SafeAreaProvider>
  );
}
