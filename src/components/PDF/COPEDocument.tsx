import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { DiagnosisSectionPDF } from './DiagnosisSectionPDF';
import { TreatmentSectionPDF } from './TreatmentSectionPDF';
import { LikelihoodExpectationsPDF } from './LikelihoodExpectationsPDF';
import { SurvivalWithoutTreatmentPDF } from './SurvivalWithoutTreatmentPDF';
import { PrognosisSectionPDF } from './PrognosisSectionPDF';
import { PrognosisDiscussion } from './PrognosisDiscussion';
import type { Demographics, CancerDetails, TreatmentPlan, PrognosisData, LikelihoodExpectations, SurvivalWithoutTreatment } from '@/types';

// Register fonts - using system fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#0d9488',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0d9488',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  demographicsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 20,
  },
  demographicItem: {
    fontSize: 10,
    color: '#64748b',
  },
});

interface COPEDocumentProps {
  demographics: Demographics;
  cancerDetails: CancerDetails;
  treatmentPlan: TreatmentPlan;
  likelihoodExpectations: LikelihoodExpectations;
  survivalWithoutTreatment: SurvivalWithoutTreatment;
  prognosisData: PrognosisData;
}

export function COPEDocument({ demographics, cancerDetails, treatmentPlan, likelihoodExpectations, survivalWithoutTreatment, prognosisData }: COPEDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Demographics */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 10, color: '#64748b' }}>Sex: {demographics.sex}  •  Age: {demographics.ageGroup}</Text>
        </View>

        {/* Diagnosis Section */}
        <DiagnosisSectionPDF data={cancerDetails} />

        {/* Treatment Section */}
        <TreatmentSectionPDF data={treatmentPlan} />

        {/* My Estimates */}
        <View style={{ marginBottom: 4, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }}>
          <Text style={{ fontSize: 14, fontWeight: 600, color: '#0d9488' }}>My Estimates</Text>
        </View>
        <LikelihoodExpectationsPDF data={likelihoodExpectations} />
        <SurvivalWithoutTreatmentPDF data={survivalWithoutTreatment} />

        {/* Online Estimators */}
        <PrognosisSectionPDF data={prognosisData} />
      </Page>

      <Page size="A4" style={styles.page}>
        <PrognosisDiscussion />
      </Page>
    </Document>
  );
}
