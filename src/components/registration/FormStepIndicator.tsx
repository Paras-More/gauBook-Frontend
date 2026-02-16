import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface FormStepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const FormStepIndicator = ({ steps, currentStep }: FormStepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                  isCompleted && 'gradient-saffron text-primary-foreground',
                  isCurrent && 'border-2 border-primary bg-secondary text-primary',
                  !isCompleted && !isCurrent && 'border border-border bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className={cn(
                'text-xs mt-1.5 max-w-[80px] text-center leading-tight hidden sm:block',
                isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
              )}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                'w-8 lg:w-16 h-0.5 mx-1 mt-[-18px] sm:mt-0 transition-all duration-300',
                isCompleted ? 'bg-primary' : 'bg-border'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FormStepIndicator;
