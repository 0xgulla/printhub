import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StepCardProps {
  index: number;
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  ocid?: string;
}

export function StepCard({
  index,
  icon: Icon,
  title,
  description,
  className,
  ocid,
}: StepCardProps) {
  return (
    <li
      data-ocid={ocid}
      className={cn(
        "group relative flex flex-col items-start rounded-lg border border-border bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-card-hover",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="font-mono text-2xl font-semibold text-border transition-smooth group-hover:text-primary/30">
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-5 font-display text-base font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </li>
  );
}
