// Planting a star: pick the feeling, give it a few words, let it rise.

import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { MOOD_LIST } from '../utils/stars';

export default function Composer({ visible, onClose, onSave }) {
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');

  const reset = () => {
    setMood(null);
    setNote('');
  };

  const save = () => {
    if (!mood) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onSave(mood, note);
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.panel}>
          <Text style={styles.title}>Plant a star</Text>
          <Text style={styles.subtitle}>How does tonight feel?</Text>

          <View style={styles.moodRow}>
            {MOOD_LIST.map((m) => (
              <Pressable
                key={m.key}
                onPress={() => setMood(m.key)}
                style={[
                  styles.moodChip,
                  mood === m.key && { borderColor: m.core, backgroundColor: 'rgba(255,255,255,0.08)' },
                ]}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={styles.moodLabel}>{m.label}</Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="A few words, if you have them…"
            placeholderTextColor="rgba(230,236,255,0.35)"
            value={note}
            onChangeText={setNote}
            multiline
            maxLength={600}
          />

          <View style={styles.actions}>
            <Pressable onPress={() => { reset(); onClose(); }} style={styles.ghostBtn}>
              <Text style={styles.ghostText}>Not tonight</Text>
            </Pressable>
            <Pressable
              onPress={save}
              disabled={!mood}
              style={[styles.saveBtn, !mood && { opacity: 0.35 }]}
            >
              <Text style={styles.saveText}>Let it rise ✦</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3,5,12,0.78)',
    justifyContent: 'center',
    padding: 20,
  },
  panel: {
    backgroundColor: 'rgba(16,22,52,0.96)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(150,170,255,0.18)',
    padding: 22,
  },
  title: { color: '#eef1ff', fontSize: 22, fontWeight: '700' },
  subtitle: { color: 'rgba(230,236,255,0.55)', fontSize: 14, marginTop: 4, marginBottom: 16 },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  moodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(150,170,255,0.18)',
  },
  moodEmoji: { fontSize: 16 },
  moodLabel: { color: '#dfe6ff', fontSize: 13 },
  input: {
    minHeight: 90,
    maxHeight: 160,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(150,170,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    color: '#eef1ff',
    padding: 14,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 18 },
  ghostBtn: { paddingHorizontal: 14, paddingVertical: 10 },
  ghostText: { color: 'rgba(230,236,255,0.55)', fontSize: 15 },
  saveBtn: {
    backgroundColor: '#5b6cff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
  },
  saveText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
});
