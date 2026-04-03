import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { PrognosisData } from '@/types';

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
  explanation: {
    fontSize: 10,
    color: '#64748b',
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 1.5,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  subsectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: '#334155',
    marginBottom: 8,
    marginTop: 16,
  },
  sourceCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourceName: {
    fontSize: 11,
    fontWeight: 600,
    color: '#1e293b',
  },
  likelihoodBadge: {
    backgroundColor: '#f0fdfa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#0d9488',
  },
  likelihoodText: {
    fontSize: 9,
    color: '#0d9488',
  },
  survivalRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  survivalLabel: {
    width: '40%',
    fontSize: 9,
    color: '#64748b',
  },
  survivalValue: {
    width: '15%',
    fontSize: 9,
    color: '#1e293b',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 16,
  },
});

interface PrognosisSectionPDFProps {
  data: PrognosisData;
}

export function PrognosisSectionPDF({ data }: PrognosisSectionPDFProps) {
  const hasData = data.survivalSources.some(s => s.sixMonth > 0 || s.oneYear > 0 || s.twoYear > 0 || s.fiveYear > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Online Estimators</Text>

      <Text style={styles.explanation}>
        Many cancers that cannot be cured can still be controlled for a period of time. No one can say how much
        time a person has left, but doctors can take what they know about you and your cancer and estimate how
        likely it is that a person will live a certain amount of time. These are very rough estimates, and are
        intended only to give a general idea of your prognosis.
      </Text>

      {hasData && (
        <>
          <Text style={styles.subsectionTitle}>Estimates of Survival</Text>

          {data.survivalSources.map((source, index) => (
            <View key={index} style={styles.sourceCard}>
              <View style={styles.sourceHeader}>
                <Text style={styles.sourceName}>{source.source}</Text>
                <View style={styles.likelihoodBadge}>
                  <Text style={styles.likelihoodText}>{source.likelihoodOfCure}</Text>
                </View>
              </View>

              <View style={styles.survivalRow}>
                <Text style={styles.survivalLabel}>6 Months:</Text>
                <Text style={styles.survivalValue}>{source.sixMonth > 0 ? `${source.sixMonth}%` : '-'}</Text>
                <Text style={styles.survivalLabel}>1 Year:</Text>
                <Text style={styles.survivalValue}>{source.oneYear > 0 ? `${source.oneYear}%` : '-'}</Text>
              </View>
              <View style={styles.survivalRow}>
                <Text style={styles.survivalLabel}>2 Years:</Text>
                <Text style={styles.survivalValue}>{source.twoYear > 0 ? `${source.twoYear}%` : '-'}</Text>
                <Text style={styles.survivalLabel}>5 Years:</Text>
                <Text style={styles.survivalValue}>{source.fiveYear > 0 ? `${source.fiveYear}%` : '-'}</Text>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );
}
