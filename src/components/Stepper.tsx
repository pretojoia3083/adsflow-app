interface StepperProps {
  labels: string[];
  currentStep: number;
}

export default function Stepper({ labels, currentStep }: StepperProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
      {labels.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontSize: 19,
                fontWeight: 600,
                whiteSpace: "nowrap",
                color: isActive ? "#3FCB92" : isCompleted ? "#22B07D" : "#4A5078",
                transition: "color 0.2s",
              }}
            >
              {label}
            </span>
            {i < labels.length - 1 && (
              <span style={{ color: "#232C52", fontSize: 15, margin: "0 14px" }}>&#8250;</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
