import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { CANCER_STAGES } from '@/constants/clinicalBins';
import type { CancerDetails, CancerStage } from '@/types';

interface DiagnosisSectionProps {
  data: CancerDetails;
  onChange: (data: CancerDetails) => void;
}

export function DiagnosisSection({ data, onChange }: DiagnosisSectionProps) {
  const handleChange = <K extends keyof CancerDetails>(field: K, value: CancerDetails[K]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card title="Diagnosis">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Type of Cancer (where it started)"
          value={data.typeOfCancer}
          onChange={(e) => handleChange('typeOfCancer', e.target.value)}
          placeholder="e.g., Lung, Breast, Colon"
        />
        <Select
          label="Cancer Stage"
          options={CANCER_STAGES}
          value={data.cancerStage}
          onChange={(e) => handleChange('cancerStage', e.target.value as CancerStage)}
        />
        <Input
          label="Scientific Name for Cancer Cell Type"
          value={data.scientificName}
          onChange={(e) => handleChange('scientificName', e.target.value)}
          placeholder="e.g., Adenocarcinoma, Squamous cell carcinoma"
        />
        <Input
          label="Where It Has Spread"
          value={data.whereSpread}
          onChange={(e) => handleChange('whereSpread', e.target.value)}
          placeholder="e.g., Liver, Lung, Bones, Lymph nodes"
        />
      </div>
    </Card>
  );
}
