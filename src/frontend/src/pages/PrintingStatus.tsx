import { JobStatus } from "@/backend";
import { EmptyState } from "@/components/EmptyState";
import { PRINT_FLOW_STEPS, PageStepper } from "@/components/PageStepper";
import { PrinterAnimation } from "@/components/PrinterAnimation";
import { useToast } from "@/components/ToastProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBackend } from "@/hooks/useBackend";
import { formatPrice, jobStatusLabel, jobStatusTone } from "@/lib/format";
import { cn } from "@/lib/utils";
import { usePrintFlow } from "@/store/printFlow";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Check, Printer, XCircle } from "lucide-react";
import { useEffect, useRef } from "react";

const TONE_CLASSES: Record<string, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-accent/20 text-accent-foreground",
  danger: "bg-destructive/15 text-destructive",
  info: "bg-primary/15 text-primary",
  muted: "bg-muted text-muted-foreground",
};

const TIMELINE = [
  "File uploaded",
  "AI analysis complete",
  "Sent to PrintHub device",
  "Printer received",
  "Printing…",
  "Completed",
];

function timelineIndex(status: JobStatus): number {
  switch (status) {
    case "Uploaded":
      return 0;
    case "Printing":
      // The job goes straight to Printing, so the earlier stages (AI analysis,
      // dispatch to the device, printer received) are already done.
      return 4;
    case "Completed":
      return TIMELINE.length - 1;
    default:
      return 0;
  }
}

export function PrintingStatusPage() {
  const { actor, isReady } = useBackend();
  const { toast } = useToast();
  const navigate = useNavigate();

  const job = usePrintFlow((state) => state.job);
  const setJob = usePrintFlow((state) => state.setJob);
  const completedRef = useRef(false);

  const progressQuery = useQuery({
    queryKey: ["print-progress", job?.id.toString() ?? "none"],
    queryFn: async () => {
      if (!actor || !job) return null;
      return actor.getPrintProgress(job.id);
    },
    enabled: isReady && !!job,
    refetchInterval: 2000,
  });

  const tickMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend is not ready");
      await actor.tickPrinting();
    },
  });

  const { mutate: tick } = tickMutation;

  useEffect(() => {
    if (!isReady || !job) return;
    const interval = setInterval(() => tick(), 2000);
    return () => clearInterval(interval);
  }, [isReady, job, tick]);

  const progress = progressQuery.data;
  const status: JobStatus =
    progress?.status ?? job?.status ?? JobStatus.Uploaded;
  const totalPages = progress
    ? Number(progress.totalPages)
    : job
      ? Number(job.pageCount)
      : 0;
  const printedPages = progress
    ? Number(progress.printedPages)
    : job
      ? Number(job.printedPages)
      : 0;
  const percent =
    totalPages > 0
      ? Math.min(100, Math.round((printedPages / totalPages) * 100))
      : 0;
  const isComplete = status === JobStatus.Completed;
  const isCancelled = status === JobStatus.Cancelled;
  const isFailed = status === JobStatus.Failed;
  const reachedFullProgress =
    !isCancelled && !isFailed && totalPages > 0 && printedPages >= totalPages;
  const showComplete = isComplete || reachedFullProgress;
  const isPrinting = !showComplete && !isCancelled && !isFailed;

  useEffect(() => {
    if ((!isComplete && !reachedFullProgress) || !job || completedRef.current)
      return;
    completedRef.current = true;
    const finalPages = BigInt(Math.max(printedPages, totalPages));
    setJob({
      ...job,
      status: JobStatus.Completed,
      printedPages: finalPages,
      updatedAt: progress?.updatedAt ?? job.updatedAt,
    });
    toast("Printing complete", {
      description: "Your document is ready to collect.",
      tone: "success",
    });
    void navigate({ to: "/completed" });
  }, [
    isComplete,
    reachedFullProgress,
    job,
    printedPages,
    totalPages,
    progress,
    setJob,
    toast,
    navigate,
  ]);

  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !job) throw new Error("Backend is not ready");
      return actor.cancelJob(job.id);
    },
    onSuccess: (updated) => {
      setJob(updated);
      toast("Job cancelled", {
        description: "The print job was cancelled.",
        tone: "info",
      });
    },
    onError: (error: Error) => {
      toast("Could not cancel job", {
        description: error.message,
        tone: "error",
      });
    },
  });

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={Printer}
          title="No active print job"
          message="Start a print job to track its progress here in real time."
          actionLabel="Start a print job"
          onAction={() => void navigate({ to: "/upload" })}
          ocid="printing.empty_state"
        />
      </div>
    );
  }

  const activeStep = showComplete ? TIMELINE.length - 1 : timelineIndex(status);

  return (
    <div className="animate-fade-in">
      <section className="border-b border-border bg-gradient-subtle">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Printing status
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tracking job{" "}
            <span className="font-mono font-medium text-foreground">
              {job.jobRef}
            </span>
          </p>
          <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-card">
            <PageStepper current={3} steps={PRINT_FLOW_STEPS} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card className="rounded-lg border-border shadow-card">
            <CardContent>
              <PrinterAnimation
                percent={percent}
                isPrinting={isPrinting}
                isComplete={showComplete}
                isCancelled={isCancelled || isFailed}
              />

              <div className="mt-4 text-center">
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  {isCancelled
                    ? "Printing cancelled"
                    : isFailed
                      ? "Printing failed"
                      : showComplete
                        ? "Printing complete!"
                        : "Your document is printing!"}
                </h2>
                <p className="mt-2 font-mono text-sm text-muted-foreground">
                  Job ID: {job.jobRef}
                </p>
              </div>

              <div className="mt-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">
                    {progressQuery.isLoading
                      ? "Preparing print job…"
                      : `Progress: ${printedPages} / ${totalPages} pages`}
                  </span>
                  <span className="font-mono text-sm font-medium text-foreground">
                    {percent}%
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Printing progress"
                  tabIndex={0}
                  data-ocid="printing.progress_bar"
                  className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-border"
                >
                  <div
                    className={cn(
                      "h-full rounded-full transition-smooth",
                      isCancelled || isFailed
                        ? "bg-destructive"
                        : showComplete
                          ? "bg-success"
                          : "bg-primary",
                    )}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {isPrinting ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={cancelMutation.isPending}
                    onClick={() => cancelMutation.mutate()}
                    data-ocid="printing.cancel_button"
                    className="w-full rounded-full transition-smooth sm:w-auto"
                  >
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                    {cancelMutation.isPending ? "Cancelling…" : "Cancel Job"}
                  </Button>
                ) : null}
                {showComplete ? (
                  <Button
                    type="button"
                    onClick={() => void navigate({ to: "/completed" })}
                    data-ocid="printing.view_completed_button"
                    className="w-full rounded-full transition-smooth sm:w-auto"
                  >
                    View completion
                  </Button>
                ) : null}
                {isCancelled || isFailed ? (
                  <Button
                    type="button"
                    onClick={() => void navigate({ to: "/upload" })}
                    data-ocid="printing.start_again_button"
                    className="w-full rounded-full transition-smooth sm:w-auto"
                  >
                    Start a new job
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-border shadow-card">
            <CardContent>
              <h2 className="font-display text-base font-semibold text-foreground">
                Job timeline
              </h2>
              <ol className="mt-5 space-y-1">
                {TIMELINE.map((label, index) => {
                  const isDone = index < activeStep;
                  const isCurrent = index === activeStep;
                  const isFinalDone =
                    showComplete && index === TIMELINE.length - 1;
                  return (
                    <li
                      key={label}
                      data-ocid={`printing.timeline.${index + 1}`}
                      className="flex items-start gap-3"
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-smooth",
                            isFinalDone
                              ? "border-success bg-success text-success-foreground shadow-ring-primary"
                              : isCurrent
                                ? "border-primary bg-primary text-primary-foreground shadow-ring-primary"
                                : isDone
                                  ? "border-success bg-success text-success-foreground"
                                  : "border-border bg-card text-muted-foreground",
                          )}
                        >
                          {isDone || isFinalDone ? (
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            index + 1
                          )}
                        </span>
                        {index < TIMELINE.length - 1 ? (
                          <span
                            className={cn(
                              "my-1 h-6 w-0.5 rounded-full",
                              isDone ? "bg-success" : "bg-border",
                            )}
                            aria-hidden="true"
                          />
                        ) : null}
                      </div>
                      <span
                        className={cn(
                          "pt-1 text-sm",
                          isFinalDone
                            ? "font-semibold text-success"
                            : isCurrent
                              ? "font-semibold text-primary"
                              : isDone
                                ? "text-foreground"
                                : "text-muted-foreground",
                        )}
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="rounded-lg border-border shadow-card">
            <CardContent>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-base font-semibold text-foreground">
                  Job details
                </h2>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 rounded-full border-transparent px-2.5 py-1 text-xs font-medium",
                    TONE_CLASSES[jobStatusTone(status)],
                  )}
                >
                  {jobStatusLabel(status)}
                </Badge>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Document</dt>
                  <dd className="min-w-0 truncate text-right font-medium text-foreground">
                    {job.fileName}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Device</dt>
                  <dd className="min-w-0 truncate text-right text-foreground">
                    PrintHub Portable
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Paper</dt>
                  <dd className="font-mono text-foreground">
                    {job.options.paperSize}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Colour</dt>
                  <dd className="font-mono text-foreground">
                    {job.options.colorMode === "Color" ? "Colour" : "B&W"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Copies</dt>
                  <dd className="font-mono text-foreground">
                    {Number(job.options.copies)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Total</dt>
                  <dd className="font-mono text-foreground">
                    {formatPrice(job.estimatedPrice)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-border bg-secondary shadow-card">
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Keep this page open to watch progress live. The status refreshes
                automatically every couple of seconds.
              </p>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}
