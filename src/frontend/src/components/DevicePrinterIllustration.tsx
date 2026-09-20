import { cn } from "@/lib/utils";
import { FileText, Printer, Sparkles, Wifi } from "lucide-react";

export function DevicePrinterIllustration({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute inset-8 -z-10 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Wifi className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-foreground">
                Portable PrintHub Device
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                connected · ready
              </p>
            </div>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Online
          </span>
        </div>

        <div className="relative mt-8 flex items-center justify-center gap-4 sm:gap-8">
          <div className="flex flex-col items-center gap-2">
            <span className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-secondary text-primary shadow-card">
              <FileText className="h-7 w-7" aria-hidden="true" />
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              report.pdf
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              AI checked
            </span>
            <div className="relative h-px w-full bg-border">
              <span className="absolute inset-y-0 left-0 w-1/2 animate-pulse-soft bg-primary" />
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              sending pages
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-secondary text-foreground shadow-card">
              <Printer className="h-7 w-7" aria-hidden="true" />
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              printer
            </span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
          <span className="text-xs text-muted-foreground">Pages queued</span>
          <span className="font-mono text-sm font-semibold text-foreground">
            12
          </span>
        </div>
      </div>
    </div>
  );
}
