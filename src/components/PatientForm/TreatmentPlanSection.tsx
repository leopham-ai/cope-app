import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { TREATMENT_GOALS, TREATMENTS } from '@/constants/clinicalBins';
import type { TreatmentPlan, TreatmentGoal, Treatment } from '@/types';

interface TreatmentPlanSectionProps {
  data: TreatmentPlan;
  onChange: (data: TreatmentPlan) => void;
}

export function TreatmentPlanSection({ data, onChange }: TreatmentPlanSectionProps) {
  const toggleGoal = (goal: TreatmentGoal) => {
    const newGoals = data.goals.includes(goal)
      ? data.goals.filter((g) => g !== goal)
      : [...data.goals, goal];
    onChange({ ...data, goals: newGoals });
  };

  const toggleTreatment = (treatment: Treatment) => {
    const newTreatments = data.treatments.includes(treatment)
      ? data.treatments.filter((t) => t !== treatment)
      : [...data.treatments, treatment];
    onChange({ ...data, treatments: newTreatments });
  };

  return (
    <Card title="Treatment">
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Goals of Treatment</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {TREATMENT_GOALS.map((goal) => (
              <Checkbox
                key={goal}
                label={goal}
                checked={data.goals.includes(goal)}
                onChange={() => toggleGoal(goal)}
              />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Planned Cancer Treatments</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {TREATMENTS.filter(t => t !== 'Other').map((treatment) => (
              <Checkbox
                key={treatment}
                label={treatment}
                checked={data.treatments.includes(treatment)}
                onChange={() => toggleTreatment(treatment)}
              />
            ))}
            <input
              type="text"
              placeholder="Other"
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded text-sm shadow-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
