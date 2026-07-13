interface StepperProps {
  steps: number;
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-xl mx-auto mb-8">
      {Array.from({ length: steps }, (_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                  isCompleted
                    ? "bg-[#6366F1] text-white"
                    : isActive
                      ? "bg-[#6366F1] text-white ring-4 ring-[#6366F1]/30"
                      : "bg-[#1E2540] text-[#56607A] border border-[#2A3358]"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
            </div>
            {i < steps - 1 && (
              <div
                className={`h-[2px] w-12 sm:w-16 transition-colors duration-200 ${
                  isCompleted ? "bg-[#6366F1]" : "bg-[#1E2540]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
