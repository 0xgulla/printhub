import type { PrintJobView } from "@/backend";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonRows } from "@/components/Skeleton";
import { Badge } from "@/components/ui/badge";
import {
  formatDateTime,
  formatNumber,
  formatPrice,
  jobStatusLabel,
  jobStatusTone,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { Printer } from "lucide-react";

const TONE_CLASSES: Record<string, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-accent/20 text-accent-foreground",
  danger: "bg-destructive/15 text-destructive",
  info: "bg-primary/15 text-primary",
  muted: "bg-muted text-muted-foreground",
};

interface JobsTableProps {
  jobs: Array<PrintJobView>;
  isLoading: boolean;
  limit?: number;
}

export function JobsTable({ jobs, isLoading, limit }: JobsTableProps) {
  if (isLoading) {
    return (
      <div data-ocid="admin.jobs_loading_state">
        <SkeletonRows count={4} />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={Printer}
        title="No print jobs yet"
        message="Jobs created by customers will appear here as they come in."
        ocid="admin.jobs_empty_state"
      />
    );
  }

  const rows = limit ? jobs.slice(0, limit) : jobs;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <div className="overflow-x-auto">
        <table
          data-ocid="admin.jobs_table"
          className="w-full min-w-[720px] text-sm"
        >
          <thead className="sticky top-0 bg-secondary">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                File Name
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Pages
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Amount
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((job, index) => (
              <tr
                key={job.id.toString()}
                data-ocid={`admin.job_row.${index + 1}`}
                className="border-t border-border transition-quick hover:bg-secondary/60"
              >
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {index + 1}
                </td>
                <td className="max-w-[220px] px-4 py-3">
                  <p className="truncate font-medium text-foreground">
                    {job.fileName}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {job.jobRef}
                  </p>
                </td>
                <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                  {formatNumber(job.pageCount)}
                </td>
                <td className="px-4 py-3 text-right font-mono font-medium text-foreground">
                  {formatPrice(job.estimatedPrice)}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full border-transparent px-2.5 py-1 text-xs font-medium",
                      TONE_CLASSES[jobStatusTone(job.status)],
                    )}
                  >
                    {jobStatusLabel(job.status)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground">
                  {formatDateTime(job.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
