import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { AGE_GROUPS } from '@/constants/clinicalBins';
import type { Demographics } from '@/types';

interface DemographicsSectionProps {
  data: Demographics;
  onChange: (data: Demographics) => void;
}

export function DemographicsSection({ data, onChange }: DemographicsSectionProps) {
  const handleChange = <K extends keyof Demographics>(field: K, value: Demographics[K]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card title="Patient Demographics">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Sex"
          options={['Male', 'Female'] as const}
          value={data.sex}
          onChange={(e) => handleChange('sex', e.target.value as 'Male' | 'Female')}
        />
        <Select
          label="Age Group"
          options={AGE_GROUPS}
          value={data.ageGroup}
          onChange={(e) => handleChange('ageGroup', e.target.value as typeof data.ageGroup)}
        />
      </div>
    </Card>
  );
}
