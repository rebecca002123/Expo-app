// Revisiting a star: the feeling, the words, and what the sky heard in them.

import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { moodFor } from '../utils/stars';

const TONE_LINES = {
  light: 'Your words felt light that night.',
  tender: 'Your words felt tender that night.',
  heavy: 'Your words carried some weight that night.',
  neutral: 'A quiet star — no words, just light.',
};

export default function StarDetail({ star, constellationName, onClose, onDelete }) {
  if (!star) return null;
  const mood = moodFor(star.mood);
  const date = new Date(star.createdAt);
  const when = date.toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric',
  });
  const keywords = star.sentiment?.keywords || [];

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.panel, { borderColor: `${mood.core}55` }]}>
          <Text style={styles.emoji}>{mood.emoji}</Text>
          <Text style={[styles.mood, { color: mood.core }]}>{mood.label}</Text>
          <Text style={styles.when}>{when}</Text>
          {constellationName ? (
            <Text style={styles.constellation}>part of “{constellationName}”</Text>
          ) : null}

          {star.note ? (
            <ScrollView style={styles.noteBox}>
              <Text style={styles.note}>{star.note}</Text>
            </ScrollView>
          ) : null}

          <Text style={styles.tone}>
            {TONE_LINES[star.note ? star.sentiment?.tone : 'neutral'] || TONE_LINES.neutral}
          </Text>

          {keywords.length > 0 && (
            <View style={styles.keywordRow}>
              {keywords.map((k) => (
                <View key={k} style={styles.keyword}>
                  <Text style={styles.keywordText}>{k}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.whisper}>“{mood.whisper}”</Text>

          <View style={styles.actions}>
            <Pressable onPress={() => onDelete(star.id)} style={styles.fadeBtn}>
              <Text style={styles.fadeText}>Let it fade</Text>
            </Pressable>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Back to the sky</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3,5,12,0.8)',
    justifyContent: 'center',
    padding: 24,
  },
  panel: {
    backgroundColor: 'rgba(16,22,52,0.97)',
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },
  emoji: { fontSize: 40 },
  mood: { fontSize: 20, fontWeight: '700', marginTop: 6 },
  when: { color: 'rgba(230,236,255,0.6)', fontSize: 13, marginTop: 2 },
  constellation: { color: 'rgba(190,205,255,0.75)', fontSize: 13, fontStyle: 'italic', marginTop: 4 },
  noteBox: { maxHeight: 150, marginTop: 14, alignSelf: 'stretch' },
  note: { color: '#e8ecff', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  tone: { color: 'rgba(230,236,255,0.5)', fontSize: 13, marginTop: 14 },
  keywordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10, justifyContent: 'center' },
  keyword: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  keywordText: { color: '#cfd8ff', fontSize: 12 },
  whisper: { color: 'rgba(230,236,255,0.45)', fontSize: 13, fontStyle: 'italic', marginTop: 16 },
  actions: { flexDirection: 'row', gap: 14, marginTop: 22 },
  fadeBtn: { paddingHorizontal: 14, paddingVertical: 10 },
  fadeText: { color: 'rgba(255,170,170,0.8)', fontSize: 14 },
  closeBtn: {
    backgroundColor: 'rgba(91,108,255,0.9)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
  },
  closeText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
