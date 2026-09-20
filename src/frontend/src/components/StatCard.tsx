import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type StatTone = "primary" | "success" | "danger" | "accent";

const TONE_STYLES: Record<StatTone, string> = {
  primary: "bg-secondary text-primary",
  success: "bg-success/15 text-success",
  danger: "bg-destructive/15 text-destructive",
  accent: "bg-accent/20 text-accent-foreground",
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: StatTone;
  /** When set, the numeric value counts up from zero on mount. */
  countTo?: number;
  ocid?: string;
}

function useCountUp(target: number | undefined, duration = 700) {
  const [display, setDisplay] = useState(target === undefined ? null : 0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (target === undefined) {
      setDisplay(null);
      return;
    }
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(target);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(target * eased));
      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
      }
    };
    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [target, duration]);

  return display;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "primary",
  countTo,
  ocid = "stat_card",
}: StatCardProps) {
  const counted = useCountUp(countTo);
  const shown = counted === null ? value : counted.toLocaleString();

  return (
    <Card
      data-ocid={ocid}
      className="animate-fade-in rounded-lg border-border shadow-card transition-smooth hover:shadow-card-hover"
    >
      <CardContent className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
            TONE_STYLES[tone],
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-2xl font-semibold tracking-tight text-foreground">
            {shown}
          </p>
          <p className="mt-0.5 text-sm font-medium text-muted-foreground">
            {label}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
