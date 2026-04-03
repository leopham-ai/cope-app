import { Card } from '@/components/ui/Card';
import { SURVIVAL_TIMEFRAMES, LIKELIHOOD_LEVELS } from '@/constants/clinicalBins';
import type { SurvivalWithoutTreatment, LikelihoodExpectation, SurvivalTimeframe } from '@/types';

interface SurvivalWithoutTreatmentSectionProps {
  data: SurvivalWithoutTreatment;
  onChange: (data: SurvivalWithoutTreatment) => void;
}

export function SurvivalWithoutTreatmentSection({ data, onChange }: SurvivalWithoutTreatmentSectionProps) {
  const handleChange = (timeframe: SurvivalTimeframe, value: LikelihoodExpectation) => {
    onChange({ ...data, [timeframe]: value });
  };

  return (
    <Card title="Survival Without Treatment">
      <div className="mb-3">
        <p className="text-sm text-slate-600 italic">
          Without any cancer treatment, how likely is it that I will live...
        </p>
        <p className="text-xs text-slate-500 mt-1">(check one in each column)</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="text-left font-medium text-slate-700 pb-2 pr-4" />
              {SURVIVAL_TIMEFRAMES.map((tf) => (
                <th key={tf.key} className="text-center font-medium text-slate-700 pb-2 px-1 min-w-[80px]">
                  {tf.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LIKELIHOOD_LEVELS.map((level) => (
              <tr key={level}>
                <td className="py-1 pr-4 text-slate-700 whitespace-nowrap">{level}</td>
                {SURVIVAL_TIMEFRAMES.map((tf) => (
                  <td key={tf.key} className="text-center py-1 px-1">
                    <input
                      type="radio"
                      name={`no-treat-${tf.key}-${level}`}
                      className="accent-teal-600 w-4 h-4 cursor-pointer"
                      checked={data[tf.key] === level}
                      onChange={() => handleChange(tf.key, level)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
