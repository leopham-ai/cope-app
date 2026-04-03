import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { LikelihoodExpectations } from '@/types';
import { LIKELIHOOD_LEVELS } from '@/constants/clinicalBins';

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
  intro: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  subtext: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 12,
  },
  table: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerCell: {
    flex: 1,
    padding: 6,
    fontSize: 9,
    fontWeight: 600,
    color: '#334155',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  labelCell: {
    flex: 1,
    padding: 6,
    fontSize: 9,
    color: '#334155',
  },
  cell: {
    flex: 1,
    padding: 6,
    textAlign: 'center',
    fontSize: 12,
    color: '#334155',
  },
  emptyText: {
    fontSize: 10,
    color: '#94a3b8',
  },
});

interface LikelihoodExpectationsPDFProps {
  data: LikelihoodExpectations;
}

const TIMEFRAMES = ['sixMonth', 'oneYear', 'twoYear', 'fiveYear'] as const;
const TIMEFRAME_LABELS: Record<string, string> = {
  sixMonth: '6 Months',
  oneYear: '1 Year',
  twoYear: '2 Years',
  fiveYear: '5 Years',
};

export function LikelihoodExpectationsPDF({ data }: LikelihoodExpectationsPDFProps) {
  const hasAnySelection = TIMEFRAMES.some((tf) => data[tf] !== null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Likelihood of Survival</Text>
      <Text style={styles.intro}>With the most effective cancer treatment, how likely is it that I will live...</Text>
      <Text style={styles.subtext}>(check one in each column)</Text>

      <View style={styles.table}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.headerCell} />
          {TIMEFRAMES.map((tf) => (
            <Text key={tf} style={styles.headerCell}>{TIMEFRAME_LABELS[tf]}</Text>
          ))}
        </View>

        {/* Likelihood rows */}
        {LIKELIHOOD_LEVELS.map((level, rowIndex) => (
          <View key={level} style={[styles.row, rowIndex === LIKELIHOOD_LEVELS.length - 1 ? styles.rowLast : {}]}>
            <View style={styles.labelCell}>
              <Text style={{ fontSize: 9, color: '#334155' }}>{level}</Text>
            </View>
            {TIMEFRAMES.map((tf) => (
              <View key={tf} style={styles.cell}>
                <Text style={{ fontSize: 12, color: data[tf] === level ? '#0d9488' : '#e2e8f0' }}>
                  {data[tf] === level ? '☑' : '☐'}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {!hasAnySelection && (
        <Text style={styles.emptyText}>No selections made</Text>
      )}
    </View>
  );
}
