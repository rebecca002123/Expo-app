import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ImageBackground,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const AlarmNotificationApp = () => {
  const [alarms, setAlarms] = useState([
    {
      id: 1,
      time: '11:03',
      period: 'AM',
      label: 'Alarm',
      color: ['#1e3a8a', '#0c4a6e'],
      icon: 'alarm',
      isAnimating: true,
    },
    {
      id: 2,
      time: '06:30',
      period: 'PM',
      label: 'Meeting',
      color: ['#7c3aed', '#6d28d9'],
      icon: 'calendar-clock',
      isAnimating: false,
    },
    {
      id: 3,
      time: '09:00',
      period: 'AM',
      label: 'Workout',
      color: ['#dc2626', '#b91c1c'],
      icon: 'dumbbell',
      isAnimating: false,
    },
  ]);

  const [dismissedIds, setDismissedIds] = useState([]);
  const pulseAnimations = useRef(alarms.reduce((acc, alarm) => {
    acc[alarm.id] = new Animated.Value(1);
    return acc;
  }, {})).current;

  useEffect(() => {
    const animations = alarms
      .filter(alarm => alarm.isAnimating && !dismissedIds.includes(alarm.id))
      .map(alarm =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnimations[alarm.id], {
              toValue: 1.15,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnimations[alarm.id], {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        )
      );

    animations.forEach(anim => anim.start());
    return () => animations.forEach(anim => anim.stop());
  }, [alarms, dismissedIds]);

  const handleSnooze = (id, minutes = 5) => {
    const alarm = alarms.find(a => a.id === id);
    if (alarm) {
      const [hours, mins] = alarm.time.split(':').map(Number);
      let newHours = hours;
      let newMins = mins + minutes;
      if (newMins >= 60) {
        newHours = (newHours + 1) % 12;
        if (newHours === 0) newHours = 12;
        newMins -= 60;
      }
      
      // Remove from current and re-add as non-animating alarm
      setTimeout(() => {
        setDismissedIds([...dismissedIds, id]);
      }, 500);
    }
  };

  const handleDismiss = (id) => {
    setDismissedIds([...dismissedIds, id]);
  };

  const activeAlarms = alarms.filter(alarm => !dismissedIds.includes(alarm.id));

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1518611505868-48510604a92d?w=500&h=1000&q=60',
        }}
        style={styles.background}
        blurRadius={2}
      >
        <View style={styles.overlay} />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>{activeAlarms.length} active</Text>
        </View>

        <View style={styles.alarmContainer}>
          {activeAlarms.map((alarm, index) => (
            <AlarmCard
              key={alarm.id}
              alarm={alarm}
              onSnooze={() => handleSnooze(alarm.id)}
              onDismiss={() => handleDismiss(alarm.id)}
              scaleAnim={pulseAnimations[alarm.id]}
              delay={index * 100}
            />
          ))}
        </View>

        {dismissedIds.length > 0 && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setDismissedIds([])}
          >
            <Text style={styles.resetButtonText}>Reset All</Text>
          </TouchableOpacity>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

const AlarmCard = ({ alarm, onSnooze, onDismiss, scaleAnim, delay }) => {
  const [snoozeExpanded, setSnoozeExpanded] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 400,
      delay: delay,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0],
  });

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          transform: [
            { translateX },
            { scale: alarm.isAnimating ? scaleAnim : 1 },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={[...alarm.color, alarm.color[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { opacity: 0.85 }]}
      >
        <View style={styles.cardContent}>
          {/* Icon with glow */}
          <View style={styles.iconWrapper}>
            <View style={styles.iconGlow} />
            <MaterialCommunityIcons
              name={alarm.icon}
              size={48}
              color="#fff"
              style={styles.icon}
            />
          </View>

          {/* Time and Label */}
          <View style={styles.timeSection}>
            <Text style={styles.time}>
              {alarm.time}
              <Text style={styles.period}> {alarm.period}</Text>
            </Text>
            <Text style={styles.label}>{alarm.label}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsRow}>
            {!snoozeExpanded ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.snoozeButton]}
                  onPress={() => setSnoozeExpanded(true)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="sleep"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.buttonText}>Snooze</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.dismissButton]}
                  onPress={onDismiss}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.snoozeOptions}>
                {[5, 10, 15].map(minutes => (
                  <TouchableOpacity
                    key={minutes}
                    style={[styles.button, styles.snoozeOptionButton]}
                    onPress={() => {
                      onSnooze();
                      setSnoozeExpanded(false);
                    }}
                  >
                    <Text style={styles.snoozeOptionText}>{minutes}m</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.button, styles.snoozeOptionButton]}
                  onPress={() => setSnoozeExpanded(false)}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={18}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Decorative gradient overlay */}
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.shimmer}
        />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  alarmContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  cardWrapper: {
    marginVertical: 6,
  },
  card: {
    borderRadius: 28,
    padding: 20,
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minHeight: 100,
    justifyContent: 'space-between',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  iconGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 30,
    opacity: 0.6,
  },
  icon: {
    zIndex: 1,
  },
  timeSection: {
    flex: 1,
  },
  time: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 32,
  },
  period: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  label: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  snoozeButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.7)',
    flex: 1,
  },
  dismissButton: {
    backgroundColor: 'rgba(156, 163, 175, 0.5)',
    width: 44,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  snoozeOptions: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  snoozeOptionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    flex: 1,
  },
  snoozeOptionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    borderRadius: 28,
  },
  resetButton: {
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default AlarmNotificationApp;
