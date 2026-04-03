import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { TreatmentPlan } from '@/types';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0d9488',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  subsection: {
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: '#475569',
    marginBottom: 6,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#f0fdfa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0d9488',
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    color: '#0d9488',
    fontWeight: 600,
  },
  emptyText: {
    fontSize: 10,
    color: '#94a3b8',
  },
});

interface TreatmentSectionPDFProps {
  data: TreatmentPlan;
}

export function TreatmentSectionPDF({ data }: TreatmentSectionPDFProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Treatment</Text>

      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Goals of Treatment</Text>
        {data.goals.length > 0 ? (
          <View style={styles.badgeContainer}>
            {data.goals.map((goal, index) => (
              <View key={goal} style={[styles.badge, index === data.goals.length - 1 ? { marginRight: 0 } : {}]}>
                <Text style={styles.badgeText}>{goal}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No goals specified</Text>
        )}
      </View>

      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Planned Cancer Treatments</Text>
        {data.treatments.length > 0 ? (
          <View style={styles.badgeContainer}>
            {data.treatments.map((treatment, index) => (
              <View key={treatment} style={[styles.badge, index === data.treatments.length - 1 ? { marginRight: 0 } : {}]}>
                <Text style={styles.badgeText}>{treatment}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No treatments specified</Text>
        )}
      </View>
    </View>
  );
}
