import { Card } from '@/components/ui/Card';
import { SURVIVAL_TIMEFRAMES, LIKELIHOOD_LEVELS } from '@/constants/clinicalBins';
import type { LikelihoodExpectations, LikelihoodExpectation, SurvivalTimeframe } from '@/types';

interface LikelihoodExpectationsSectionProps {
  data: LikelihoodExpectations;
  onChange: (data: LikelihoodExpectations) => void;
}

export function LikelihoodExpectationsSection({ data, onChange }: LikelihoodExpectationsSectionProps) {
  const handleChange = (timeframe: SurvivalTimeframe, value: LikelihoodExpectation) => {
    onChange({ ...data, [timeframe]: value });
  };

  return (
    <Card title="Likelihood of Survival">
      <div className="mb-3">
        <p className="text-sm text-slate-600 italic">
          With the most effective cancer treatment, how likely is it that I will live...
        </p>
        <p className="text-xs text-slate-500 mt-1">(check one in each column)</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="text-left font-medium text-slate-700 pb-2 pr-4" />
              {LIKELIHOOD_LEVELS.map((level) => (
                <th key={level} className="text-center font-medium text-slate-700 pb-2 px-1 min-w-[120px]">
                  {level}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SURVIVAL_TIMEFRAMES.map((tf) => (
              <tr key={tf.key}>
                <td className="py-1 pr-4 text-slate-700 whitespace-nowrap font-medium">{tf.label}</td>
                {LIKELIHOOD_LEVELS.map((level) => (
                  <td key={level} className="text-center py-1 px-1">
                    <input
                      type="radio"
                      name={`${tf.key}`}
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
