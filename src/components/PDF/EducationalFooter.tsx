import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#f1f5f9',
  },
  title: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0d9488',
    marginBottom: 10,
  },
  questionsTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: '#334155',
    marginBottom: 6,
  },
  questionItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  questionBullet: {
    width: 16,
    fontSize: 11,
    color: '#0d9488',
  },
  questionText: {
    flex: 1,
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.4,
  },
  acaSection: {
    marginTop: 16,
    backgroundColor: '#f0fdfa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#99f6e4',
  },
  acaTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: '#0f766e',
    marginBottom: 4,
  },
  acaText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.5,
  },
  disclaimer: {
    marginTop: 16,
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

const QUESTIONS = [
  'What stage is my cancer and what does that mean for my treatment?',
  'What are the specific goals of my treatment plan?',
  'What support resources are available to me and my family?',
];

export function EducationalFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Questions to Discuss with Your Doctor</Text>
      <Text style={styles.questionsTitle}>3 Questions to Help You Understand Your Care</Text>
      {QUESTIONS.map((question, index) => (
        <View key={index} style={styles.questionItem}>
          <Text style={styles.questionBullet}>{index + 1}.</Text>
          <Text style={styles.questionText}>{question}</Text>
        </View>
      ))}

      <View style={styles.acaSection}>
        <Text style={styles.acaTitle}>Advance Care Planning</Text>
        <Text style={styles.acaText}>
          Consider discussing your wishes with your loved ones and healthcare team.
          Thinking about your values and goals for care can help ensure you receive
          the care that&apos;s right for you, now and in the future.
        </Text>
      </View>

      <Text style={styles.disclaimer}>
        This document is for educational purposes only and does not replace medical advice.
        Please consult your healthcare provider for personalized medical guidance.
      </Text>
    </View>
  );
}
