import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepperStep {
  label: string;
  description?: string;
}

/** The canonical five-step PrintHub flow. */
export const PRINT_FLOW_STEPS: Array<StepperStep> = [
  { label: "Upload" },
  { label: "AI Analysis" },
  { label: "Customize" },
  { label: "Printing" },
  { label: "Completed" },
];

interface PageStepperProps {
  steps: Array<StepperStep>;
  current: number;
  className?: string;
}

export function PageStepper({ steps, current, className }: PageStepperProps) {
  return (
    <nav
      aria-label="Print progress"
      data-ocid="page_stepper"
      className={cn("w-full", className)}
    >
      <ol className="flex items-start justify-between gap-1 sm:gap-2">
        {steps.map((step, index) => {
          const isComplete = index < current;
          const isCurrent = index === current;
          return (
            <li
              key={step.label}
              className="flex min-w-0 flex-1 flex-col items-center text-center"
            >
              <div className="flex w-full items-center">
                <span
                  className={cn(
                    "h-0.5 flex-1 rounded-full transition-smooth",
                    index === 0
                      ? "bg-transparent"
                      : isComplete || isCurrent
                        ? "bg-primary"
                        : "bg-border",
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-smooth",
                    isComplete &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      "border-primary bg-primary text-primary-foreground shadow-ring-primary",
                    !isComplete &&
                      !isCurrent &&
                      "border-border bg-card text-muted-foreground",
                  )}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "h-0.5 flex-1 rounded-full transition-smooth",
                    index === steps.length - 1
                      ? "bg-transparent"
                      : isComplete
                        ? "bg-primary"
                        : "bg-border",
                  )}
                  aria-hidden="true"
                />
              </div>
              <span
                className={cn(
                  "mt-2 truncate text-xs font-medium sm:text-sm",
                  isCurrent ? "text-primary" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
