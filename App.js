import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AlarmNotificationApp from './AlarmNotificationApp';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <AlarmNotificationApp />
    </>
  );
}
