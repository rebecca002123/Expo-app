// Every now and then, something falls across the sky. Make a wish.

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';

export default function ShootingStar({ width, height, reduceMotion }) {
  const progress = useRef(new Animated.Value(0)).current;
  const [path, setPath] = useState(null);

  useEffect(() => {
    if (reduceMotion) return;
    let alive = true;
    let timer;

    const schedule = () => {
      timer = setTimeout(() => {
        if (!alive) return;
        const startY = height * (0.08 + Math.random() * 0.25);
        setPath({ startY, drop: 60 + Math.random() * 90 });
        progress.setValue(0);
        Animated.timing(progress, {
          toValue: 1,
          duration: 750,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start(() => {
          if (alive) {
            setPath(null);
            schedule();
          }
        });
      }, 9000 + Math.random() * 14000);
    };

    schedule();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [progress, height, reduceMotion]);

  if (!path) return null;

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [width + 60, -120],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [path.startY, path.startY + path.drop],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.15, 0.8, 1],
    outputRange: [0, 1, 0.9, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        transform: [{ translateX }, { translateY }, { rotate: '8deg' }],
        opacity,
      }}
    >
      <View
        style={{
          width: 90,
          height: 2,
          borderRadius: 2,
          backgroundColor: '#ffffff',
          shadowColor: '#bcd4ff',
          shadowOpacity: 0.9,
          shadowRadius: 6,
        }}
      />
    </Animated.View>
  );
}
