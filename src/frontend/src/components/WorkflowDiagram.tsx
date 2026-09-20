import { cn } from "@/lib/utils";
import {
  ArrowRight,
  FileUp,
  Printer,
  ScanLine,
  Sparkles,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface WorkflowStage {
  id: string;
  label: string;
  detail: string;
  icon: LucideIcon;
  tone: "primary" | "accent" | "neutral";
}

const STAGES: Array<WorkflowStage> = [
  {
    id: "upload",
    label: "User Uploads PDF",
    detail: "Pick a document from your phone or laptop.",
    icon: FileUp,
    tone: "primary",
  },
  {
    id: "ai",
    label: "PrintHub AI",
    detail: "Checks every page and flags blank or wasted sheets.",
    icon: Sparkles,
    tone: "accent",
  },
  {
    id: "device",
    label: "Portable PrintHub Device",
    detail: "Sends the job over its own wireless link.",
    icon: Wifi,
    tone: "primary",
  },
  {
    id: "printer",
    label: "Printer",
    detail: "The connected printer lays down the pages.",
    icon: Printer,
    tone: "neutral",
  },
  {
    id: "document",
    label: "Printed Document",
    detail: "Collect your finished pages, ready to go.",
    icon: ScanLine,
    tone: "neutral",
  },
];

const TONE_STYLES: Record<WorkflowStage["tone"], string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/20 text-accent-foreground",
  neutral: "bg-secondary text-secondary-foreground",
};

export function WorkflowDiagram({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <ol
        data-ocid="home.workflow_list"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-stretch"
      >
        {STAGES.map((stage, index) => (
          <li
            key={stage.id}
            data-ocid={`home.workflow_stage.${index + 1}`}
            className="relative flex flex-col rounded-lg border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-card-hover"
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  TONE_STYLES[stage.tone],
                )}
              >
                <stage.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-xs font-medium text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-4 font-display text-sm font-semibold text-foreground">
              {stage.label}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {stage.detail}
            </p>

            {index < STAGES.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-border lg:block"
              >
                <ArrowRight className="h-5 w-5" />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
