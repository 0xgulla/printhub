import { EmptyState } from "@/components/EmptyState";
import { PRINT_FLOW_STEPS, PageStepper } from "@/components/PageStepper";
import { ThankYouPopup } from "@/components/ThankYouPopup";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime, formatPrice } from "@/lib/format";
import { usePrintFlow } from "@/store/printFlow";
import { Link, useNavigate } from "@tanstack/react-router";
import { Download, Printer, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

export function PrintCompletedPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const job = usePrintFlow((state) => state.job);
  const resetFlow = usePrintFlow((state) => state.resetFlow);
  const [thankYouOpen, setThankYouOpen] = useState(false);

  useEffect(() => {
    if (!job) return;
    const timer = setTimeout(() => setThankYouOpen(true), 900);
    return () => clearTimeout(timer);
  }, [job]);

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={Printer}
          title="No completed job to show"
          message="Once a print job finishes, its completion summary will appear here."
          actionLabel="Start a print job"
          onAction={() => void navigate({ to: "/upload" })}
          ocid="completed.empty_state"
        />
      </div>
    );
  }

  const handleDownloadReceipt = () => {
    const lines = [
      "PrintHub — Print Receipt",
      "========================",
      `Job ID:      ${job.jobRef}`,
      `Document:    ${job.fileName}`,
      `Pages:       ${Number(job.printedPages)} / ${Number(job.pageCount)}`,
      `Paper size:  ${job.options.paperSize}`,
      `Colour mode: ${job.options.colorMode === "Color" ? "Colour" : "Black & white"}`,
      `Copies:      ${Number(job.options.copies)}`,
      "Device:      PrintHub Portable",
      `Total:       ${formatPrice(job.estimatedPrice)}`,
      `Completed:   ${formatDateTime(job.updatedAt)}`,
      "",
      "Thank you for using PrintHub.",
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `printhub-receipt-${job.jobRef}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    toast("Receipt downloaded", {
      description: `Saved as printhub-receipt-${job.jobRef}.txt`,
      tone: "success",
    });
  };

  return (
    <div className="animate-fade-in">
      <section className="border-b border-border bg-gradient-subtle">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <PageStepper current={4} steps={PRINT_FLOW_STEPS} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Card
          data-ocid="completed.success_state"
          className="rounded-lg border-success/30 shadow-card"
        >
          <CardContent className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center">
              <svg
                viewBox="0 0 64 64"
                className="h-20 w-20"
                role="img"
                aria-label="Print completed"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="176"
                  strokeDashoffset="176"
                  className="stroke-success animate-draw-check"
                />
                <path
                  d="M20 33 L28 41 L45 24"
                  fill="none"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                  className="stroke-success animate-draw-check"
                  style={{ animationDelay: "0.35s" }}
                />
              </svg>
            </div>

            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground">
              Print Completed!
            </h1>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Your document has been printed successfully.
            </p>

            <div className="mt-8 rounded-lg border border-border bg-secondary p-5 text-left">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Job ID</dt>
                  <dd className="font-mono text-foreground">{job.jobRef}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">File</dt>
                  <dd className="min-w-0 truncate text-right font-medium text-foreground">
                    {job.fileName}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Pages printed</dt>
                  <dd className="font-mono text-foreground">
                    {Number(job.printedPages)} / {Number(job.pageCount)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Total</dt>
                  <dd className="font-mono text-foreground">
                    {formatPrice(job.estimatedPrice)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Completed</dt>
                  <dd className="font-mono text-foreground">
                    {formatDateTime(job.updatedAt)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                type="button"
                onClick={() => {
                  resetFlow();
                  void navigate({ to: "/upload" });
                }}
                data-ocid="completed.print_again_button"
                className="w-full rounded-full transition-smooth sm:w-auto"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Print Again
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDownloadReceipt}
                data-ocid="completed.download_receipt_button"
                className="w-full rounded-full transition-smooth sm:w-auto"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download Receipt
              </Button>
            </div>

            <div className="mt-10 border-t border-border pt-8">
              <p className="font-display text-lg font-semibold text-foreground">
                Thank you for using PrintHub
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                We hope we made printing a little easier for you.
              </p>
              <div
                className="mt-5 flex justify-center gap-1.5"
                aria-hidden="true"
              >
                {["a", "b", "c", "d", "e"].map((key, index) => (
                  <span
                    key={key}
                    className="h-2 w-2 animate-float rounded-full bg-primary/60"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  />
                ))}
              </div>
              <Button
                asChild
                variant="ghost"
                data-ocid="completed.dashboard_link"
                className="mt-5 rounded-full transition-smooth"
              >
                <Link to="/dashboard">Go to dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <ThankYouPopup open={thankYouOpen} onOpenChange={setThankYouOpen} />
    </div>
  );
}
