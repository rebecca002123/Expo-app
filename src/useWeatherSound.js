import { useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';

// Plays a looping ambience track for the active weather.
// `source` is a static require(...) module id, so it's stable per weather.
export function useWeatherSound(source, enabled, volume) {
  const player = useAudioPlayer(source);

  // keep it looping whenever the source (weather) changes
  useEffect(() => {
    if (!player) return;
    try {
      player.loop = true;
    } catch (e) {}
  }, [player, source]);

  // react to volume / on-off / weather changes
  useEffect(() => {
    if (!player) return;
    try {
      player.volume = volume;
      if (enabled) {
        player.play();
      } else {
        player.pause();
      }
    } catch (e) {}
  }, [player, enabled, volume, source]);

  return player;
}
