import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { CancerDetails } from '@/types';

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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: '50%',
    marginBottom: 12,
  },
  label: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: 600,
    color: '#1e293b',
  },
});

interface DiagnosisSectionPDFProps {
  data: CancerDetails;
}

export function DiagnosisSectionPDF({ data }: DiagnosisSectionPDFProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diagnosis</Text>
      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={styles.label}>Type of Cancer (where it started)</Text>
          <Text style={styles.value}>{data.typeOfCancer || 'Not specified'}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Cancer Stage</Text>
          <Text style={styles.value}>{data.cancerStage}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Scientific Name for Cancer Cell Type</Text>
          <Text style={styles.value}>{data.scientificName || 'Not specified'}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Where It Has Spread</Text>
          <Text style={styles.value}>{data.whereSpread || 'Not specified'}</Text>
        </View>
      </View>
    </View>
  );
}
