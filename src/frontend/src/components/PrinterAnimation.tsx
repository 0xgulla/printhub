import { cn } from "@/lib/utils";

export interface PrinterAnimationProps {
  /** 0–100 printing progress. */
  percent: number;
  isPrinting: boolean;
  isComplete: boolean;
  isCancelled: boolean;
  className?: string;
}

export function PrinterAnimation({
  percent,
  isPrinting,
  isComplete,
  isCancelled,
  className,
}: PrinterAnimationProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const sheetOffset = 26 - (clamped / 100) * 26;

  return (
    <div
      data-ocid="printing.printer_animation"
      className={cn(
        "relative mx-auto flex h-44 w-full max-w-sm items-center justify-center",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-x-6 bottom-2 h-6 rounded-full bg-primary/10 blur-xl" />

      <svg
        viewBox="0 0 240 170"
        className="relative h-full w-full"
        role="img"
        aria-label="Printer illustration"
      >
        {/* Output tray */}
        <rect
          x="52"
          y="118"
          width="136"
          height="10"
          rx="5"
          className="fill-border"
        />

        {/* Printed sheet emerging from the printer */}
        <g
          style={{
            transform: `translateY(${sheetOffset}px)`,
            transition: "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <rect
            x="76"
            y="96"
            width="88"
            height="34"
            rx="3"
            className={cn(
              "stroke-border",
              isComplete ? "fill-success/15" : "fill-card",
            )}
            strokeWidth="1.5"
          />
          <line
            x1="86"
            y1="106"
            x2="154"
            y2="106"
            className="stroke-muted-foreground/40"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="86"
            y1="114"
            x2="146"
            y2="114"
            className="stroke-muted-foreground/40"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="86"
            y1="122"
            x2="132"
            y2="122"
            className="stroke-muted-foreground/40"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Printer body */}
        <rect
          x="44"
          y="34"
          width="152"
          height="66"
          rx="10"
          className="fill-card stroke-border"
          strokeWidth="2"
        />

        {/* Paper feed slot */}
        <rect
          x="66"
          y="28"
          width="108"
          height="8"
          rx="4"
          className="fill-secondary stroke-border"
          strokeWidth="1.5"
        />

        {/* Control panel */}
        <rect
          x="60"
          y="48"
          width="52"
          height="18"
          rx="4"
          className="fill-secondary"
        />
        <circle
          cx="70"
          cy="57"
          r="3"
          className={cn(
            isCancelled
              ? "fill-destructive"
              : isComplete
                ? "fill-success"
                : isPrinting
                  ? "fill-primary animate-pulse-soft"
                  : "fill-muted-foreground",
          )}
        />
        <line
          x1="80"
          y1="57"
          x2="104"
          y2="57"
          className="stroke-muted-foreground/50"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Output slot */}
        <rect
          x="60"
          y="88"
          width="120"
          height="8"
          rx="4"
          className="fill-secondary stroke-border"
          strokeWidth="1.5"
        />

        {/* Status light */}
        <circle
          cx="176"
          cy="57"
          r="4"
          className={cn(
            isCancelled
              ? "fill-destructive"
              : isComplete
                ? "fill-success"
                : "fill-primary",
          )}
        />
      </svg>
    </div>
  );
}
