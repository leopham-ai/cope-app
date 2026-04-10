import { Card } from '@/components/ui/Card';
import { SURVIVAL_TIMEFRAMES, LIKELIHOOD_LEVELS } from '@/constants/clinicalBins';
import { SurvivalWithoutTreatmentSection } from './SurvivalWithoutTreatmentSection';
import type { LikelihoodExpectations, LikelihoodExpectation, SurvivalTimeframe, SurvivalWithoutTreatment } from '@/types';

interface LikelihoodExpectationsSectionProps {
  likelihoodData: LikelihoodExpectations;
  survivalWithoutTreatmentData: SurvivalWithoutTreatment;
  onLikelihoodChange: (data: LikelihoodExpectations) => void;
  onSurvivalWithoutTreatmentChange: (data: SurvivalWithoutTreatment) => void;
}

export function LikelihoodExpectationsSection({
  likelihoodData,
  survivalWithoutTreatmentData,
  onLikelihoodChange,
  onSurvivalWithoutTreatmentChange,
}: LikelihoodExpectationsSectionProps) {
  const handleChange = (timeframe: SurvivalTimeframe, value: LikelihoodExpectation) => {
    onLikelihoodChange({ ...likelihoodData, [timeframe]: value });
  };

  return (
    <Card title="My Estimates">
      <div className="mb-3">
        <p className="text-sm text-slate-600 dark:text-slate-400 italic">
          With the most effective cancer treatment, how likely is it that I will live...
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">(check one in each column)</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="text-left font-medium text-slate-700 dark:text-slate-300 pb-2 pr-4" />
              {LIKELIHOOD_LEVELS.map((level) => (
                <th key={level} className="text-center font-medium text-slate-700 dark:text-slate-300 pb-2 px-1 min-w-[120px]">
                  {level}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SURVIVAL_TIMEFRAMES.map((tf) => (
              <tr key={tf.key}>
                <td className="py-1 pr-4 text-slate-700 dark:text-slate-300 whitespace-nowrap font-medium">{tf.label}</td>
                {LIKELIHOOD_LEVELS.map((level) => (
                  <td key={level} className="text-center py-1 px-1">
                    <input
                      type="radio"
                      name={`${tf.key}`}
                      className="accent-teal-600 w-4 h-4 cursor-pointer"
                      checked={likelihoodData[tf.key] === level}
                      onChange={() => handleChange(tf.key, level)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SurvivalWithoutTreatmentSection
        data={survivalWithoutTreatmentData}
        onChange={onSurvivalWithoutTreatmentChange}
      />
    </Card>
  );
}
