import { useState } from 'react';
import { DemographicsSection } from './DemographicsSection';
import { DiagnosisSection } from './DiagnosisSection';
import { TreatmentPlanSection } from './TreatmentPlanSection';
import { PrognosisSection } from './PrognosisSection';
import { Button } from '@/components/ui/Button';
import { FileDown, Loader2, AlertCircle } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import type { Demographics, CancerDetails, TreatmentPlan, PrognosisData } from '@/types';
import { COPEDocument } from '@/components/PDF/COPEDocument';

const initialDemographics: Demographics = {
  sex: 'Male',
  ageGroup: '50-59',
};

const initialCancerDetails: CancerDetails = {
  typeOfCancer: '',
  cancerStage: 'Stage 1 - Localized',
  scientificName: '',
  whereSpread: '',
};

const initialTreatmentPlan: TreatmentPlan = {
  goals: [],
  treatments: [],
};

const initialPrognosisData: PrognosisData = {
  survivalSources: [],
};

interface PatientFormProps {
  onComplete: () => void;
}

export function PatientForm({ onComplete }: PatientFormProps) {
  const [demographics, setDemographics] = useState<Demographics>(initialDemographics);
  const [cancerDetails, setCancerDetails] = useState<CancerDetails>(initialCancerDetails);
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan>(initialTreatmentPlan);
  const [prognosisData, setPrognosisData] = useState<PrognosisData>(initialPrognosisData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasSurvivalData = prognosisData.survivalSources.length > 0;

  const handleGeneratePDF = async () => {
    setError(null);
    setIsGenerating(true);

    try {
      const doc = <COPEDocument {...{ demographics, cancerDetails, treatmentPlan, prognosisData }} />;
      const blob = await pdf(doc).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `COPE-Report-${cancerDetails.typeOfCancer || 'Patient'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Clear form after successful generation
      setDemographics(initialDemographics);
      setCancerDetails(initialCancerDetails);
      setTreatmentPlan(initialTreatmentPlan);
      setPrognosisData(initialPrognosisData);
      onComplete();
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = hasSurvivalData;

  return (
    <div className="space-y-6">
      <DemographicsSection data={demographics} onChange={setDemographics} />
      <DiagnosisSection data={cancerDetails} onChange={setCancerDetails} />
      <TreatmentPlanSection data={treatmentPlan} onChange={setTreatmentPlan} />
      <PrognosisSection
        data={prognosisData}
        demographics={demographics}
        cancerDetails={cancerDetails}
        onChange={setPrognosisData}
      />

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button
          variant="primary"
          onClick={handleGeneratePDF}
          disabled={!isFormValid || isGenerating}
          className="min-w-[200px]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4 mr-2" />
              Generate PDF Report
            </>
          )}
        </Button>
      </div>

      {!hasSurvivalData && (
        <p className="text-sm text-slate-500 text-center">
          Note: Add at least one survival estimate in the Prognosis section to enable PDF generation.
        </p>
      )}
    </div>
  );
}
