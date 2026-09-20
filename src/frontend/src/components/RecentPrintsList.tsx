import type { PrintJobView } from "@/backend";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonRows } from "@/components/Skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatDateTime,
  formatNumber,
  formatPrice,
  jobStatusLabel,
  jobStatusTone,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { AlertTriangle, Printer, RotateCcw } from "lucide-react";

const TONE_CLASSES: Record<string, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-accent/20 text-accent-foreground",
  danger: "bg-destructive/15 text-destructive",
  info: "bg-primary/15 text-primary",
  muted: "bg-muted text-muted-foreground",
};

interface RecentPrintsListProps {
  jobs: Array<PrintJobView>;
  isLoading: boolean;
  isError?: boolean;
  limit?: number;
  onStartPrinting: () => void;
  onRetry?: () => void;
}

export function RecentPrintsList({
  jobs,
  isLoading,
  isError = false,
  limit = 5,
  onStartPrinting,
  onRetry,
}: RecentPrintsListProps) {
  const visible = jobs.slice(0, limit);

  if (isLoading) {
    return (
      <div data-ocid="dashboard.jobs_loading_state">
        <SkeletonRows count={4} />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        data-ocid="dashboard.jobs_error_state"
        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-destructive/40 bg-card px-6 py-14 text-center"
      >
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">
          We couldn&apos;t load your print history
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          The PrintHub device may be offline. Check the connection and try
          again.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          data-ocid="dashboard.jobs_retry_button"
          className="mt-6 rounded-full transition-smooth"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try Again
        </Button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={Printer}
        title="No prints yet"
        message="Upload a document and send it through your PrintHub device — your jobs will show up here."
        actionLabel="Start Printing"
        onAction={onStartPrinting}
        ocid="dashboard.jobs_empty_state"
      />
    );
  }

  return (
    <ul data-ocid="dashboard.jobs_list" className="space-y-3">
      {visible.map((job, index) => (
        <li
          key={job.id.toString()}
          data-ocid={`dashboard.job_item.${index + 1}`}
          className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-card transition-smooth hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {job.fileName}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {formatNumber(job.pageCount)} pages · {job.jobRef} ·{" "}
              {formatDateTime(job.createdAt)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="font-mono text-sm font-medium text-foreground">
              {formatPrice(job.estimatedPrice)}
            </span>
            <Badge
              variant="outline"
              className={cn(
                "rounded-full border-transparent px-2.5 py-1 text-xs font-medium",
                TONE_CLASSES[jobStatusTone(job.status)],
              )}
            >
              {jobStatusLabel(job.status)}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
