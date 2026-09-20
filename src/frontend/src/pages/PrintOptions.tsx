import { ColorMode, PageSelection, PaperSize } from "@/backend";
import { EmptyState } from "@/components/EmptyState";
import { PRINT_FLOW_STEPS, PageStepper } from "@/components/PageStepper";
import { PdfPreviewModal } from "@/components/PdfPreviewModal";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBackend } from "@/hooks/useBackend";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  type PrintOptionsDraft,
  toPrintOptions,
  usePrintFlow,
} from "@/store/printFlow";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Eye,
  FileText,
  Loader2,
  Minus,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

const PAPER_SIZES: Array<PaperSize> = [PaperSize.A4, PaperSize.A3];
const COLOR_MODES: Array<{ value: ColorMode; label: string }> = [
  { value: ColorMode.BlackAndWhite, label: "Black & White" },
  { value: ColorMode.Color, label: "Color" },
];

/**
 * Mirrors the backend's `estimatePrice` so the flow can continue even when the
 * live estimate request fails. Prices are whole rupees.
 */
function localEstimate(pageCount: number, draft: PrintOptionsDraft): bigint {
  const printable = Math.max(0, pageCount - draft.excludedBlankPages.length);
  const perPage = draft.colorMode === ColorMode.Color ? 5 : 1;
  const paperMultiplier = draft.paperSize === PaperSize.A3 ? 2 : 1;
  return BigInt(printable * perPage * paperMultiplier * draft.copies);
}

export function PrintOptionsPage() {
  const { actor, isReady } = useBackend();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);

  const file = usePrintFlow((state) => state.file);
  const localFile = usePrintFlow((state) => state.localFile);
  const analysis = usePrintFlow((state) => state.analysis);
  const options = usePrintFlow((state) => state.options);
  const price = usePrintFlow((state) => state.price);
  const setOptions = usePrintFlow((state) => state.setOptions);
  const setPrice = usePrintFlow((state) => state.setPrice);
  const setJob = usePrintFlow((state) => state.setJob);

  const blankPages = analysis
    ? analysis.blankPages.map((page) => Number(page))
    : [];
  const hasBlankSuggestion =
    blankPages.length > 0 && options.excludedBlankPages.length === 0;

  const priceMutation = useMutation({
    mutationFn: async (draft: PrintOptionsDraft) => {
      if (!actor || !file) throw new Error("Backend is not ready");
      return actor.estimatePrice(file.pageCount, toPrintOptions(draft));
    },
    onSuccess: (value) => setPrice(value),
    onError: () => {
      // Fall back to a locally computed price so the user can keep going.
      if (file) setPrice(localEstimate(Number(file.pageCount), options));
    },
  });

  const { mutate: estimate } = priceMutation;

  useEffect(() => {
    if (!isReady || !file) return;
    estimate(options);
  }, [isReady, file, options, estimate]);

  const startMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !file) throw new Error("Backend is not ready");
      return actor.createJob(file.id, toPrintOptions(options));
    },
    onSuccess: (job) => {
      setJob(job);
      toast("Printing started", {
        description: `Job ${job.jobRef} was sent to the PrintHub device.`,
        tone: "success",
      });
      void navigate({ to: "/printing" });
    },
    onError: (error: Error) => {
      toast("Could not start printing", {
        description: error.message,
        tone: "error",
      });
    },
  });

  const estimateFailed = priceMutation.isError;
  const isEstimating = priceMutation.isPending;
  const effectivePrice =
    price ?? (file ? localEstimate(Number(file.pageCount), options) : null);
  const canContinue = !!file && effectivePrice !== null;

  const excludeAllBlank = () => {
    setOptions({ excludedBlankPages: blankPages });
    toast("Blank pages excluded", {
      description: `${blankPages.length} page${blankPages.length === 1 ? "" : "s"} removed from this job.`,
      tone: "success",
    });
  };

  if (!file) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={FileText}
          title="No document to configure"
          message="Upload a document first, then choose your paper size, colour, and copies."
          actionLabel="Upload a document"
          onAction={() => void navigate({ to: "/upload" })}
          ocid="options.empty_state"
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <section className="border-b border-border bg-gradient-subtle">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Customize printing
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure how your document should be printed.
          </p>
          <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-card">
            <PageStepper current={2} steps={PRINT_FLOW_STEPS} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card className="rounded-lg border-border shadow-card">
            <CardContent className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">
                  {file.fileName}
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {Number(file.pageCount)} page
                  {Number(file.pageCount) === 1 ? "" : "s"}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreviewOpen(true)}
                data-ocid="options.preview_button"
                className="shrink-0 rounded-full"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                Preview
              </Button>
            </CardContent>
          </Card>

          {hasBlankSuggestion ? (
            <div
              data-ocid="options.ai_suggestion_banner"
              className="flex flex-col gap-3 rounded-lg border border-accent/50 bg-accent/10 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-2">
                <Sparkles
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <p className="text-sm text-foreground">
                  AI detected {blankPages.length} blank page
                  {blankPages.length === 1 ? "" : "s"}. Exclude them to save
                  paper and lower the price.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={excludeAllBlank}
                data-ocid="options.exclude_blank_button"
                className="shrink-0 rounded-full transition-smooth"
              >
                Exclude blank pages
              </Button>
            </div>
          ) : null}

          <Card className="rounded-lg border-border shadow-card">
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Colour mode</Label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  {COLOR_MODES.map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setOptions({ colorMode: mode.value })}
                      aria-pressed={options.colorMode === mode.value}
                      data-ocid={`options.color_mode.${mode.value.toLowerCase()}`}
                      className={cn(
                        "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-smooth",
                        options.colorMode === mode.value
                          ? "border-primary bg-secondary text-primary shadow-ring-primary"
                          : "border-border bg-card text-foreground hover:border-primary/40",
                      )}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="copies" className="text-sm font-medium">
                  Copies
                </Label>
                <div className="mt-3 flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Decrease copies"
                    disabled={options.copies <= 1}
                    onClick={() =>
                      setOptions({ copies: Math.max(1, options.copies - 1) })
                    }
                    data-ocid="options.copies_decrease_button"
                    className="rounded-full"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Input
                    id="copies"
                    type="number"
                    min={1}
                    max={99}
                    value={options.copies}
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      setOptions({
                        copies: Number.isFinite(next)
                          ? Math.min(99, Math.max(1, Math.floor(next)))
                          : 1,
                      });
                    }}
                    data-ocid="options.copies_input"
                    className="h-10 w-20 text-center font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Increase copies"
                    disabled={options.copies >= 99}
                    onClick={() =>
                      setOptions({ copies: Math.min(99, options.copies + 1) })
                    }
                    data-ocid="options.copies_increase_button"
                    className="rounded-full"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Paper size</Label>
                <div className="mt-3 flex gap-3">
                  {PAPER_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setOptions({ paperSize: size })}
                      aria-pressed={options.paperSize === size}
                      data-ocid={`options.paper_size.${size.toLowerCase()}`}
                      className={cn(
                        "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-smooth",
                        options.paperSize === size
                          ? "border-primary bg-secondary text-primary shadow-ring-primary"
                          : "border-border bg-card text-foreground hover:border-primary/40",
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Pages</Label>
                <div className="mt-3 flex gap-3">
                  {(
                    [
                      { value: PageSelection.All, label: "All Pages" },
                      { value: PageSelection.Custom, label: "Custom Range" },
                    ] as const
                  ).map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setOptions({ pageSelection: mode.value })}
                      aria-pressed={options.pageSelection === mode.value}
                      data-ocid={`options.page_range.${mode.value.toLowerCase()}`}
                      className={cn(
                        "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-smooth",
                        options.pageSelection === mode.value
                          ? "border-primary bg-secondary text-primary shadow-ring-primary"
                          : "border-border bg-card text-foreground hover:border-primary/40",
                      )}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
                {options.pageSelection === PageSelection.Custom ? (
                  <Input
                    value={options.customRange}
                    onChange={(event) =>
                      setOptions({ customRange: event.target.value })
                    }
                    placeholder="e.g. 1-5, 8-10"
                    aria-label="Custom page range"
                    data-ocid="options.custom_range_input"
                    className="mt-3 font-mono"
                  />
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="rounded-lg border-border shadow-card">
            <CardContent>
              <h2 className="font-display text-base font-semibold text-foreground">
                Estimated price
              </h2>
              <p
                data-ocid="options.price_display"
                className="mt-4 font-display text-4xl font-bold text-foreground"
              >
                {isEstimating && price === null ? (
                  <span className="inline-flex items-center gap-2 text-2xl text-muted-foreground">
                    <Loader2
                      className="h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                    Calculating…
                  </span>
                ) : effectivePrice !== null ? (
                  formatPrice(effectivePrice)
                ) : (
                  "—"
                )}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Updates live from pages, colour, copies, and paper size.
              </p>

              {estimateFailed ? (
                <div
                  data-ocid="options.price_error_state"
                  className="mt-4 flex flex-col gap-3 rounded-lg border border-accent/50 bg-accent/10 p-3"
                >
                  <p className="flex items-start gap-2 text-xs text-foreground">
                    <AlertCircle
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    Live estimate unavailable — showing an offline estimate. You
                    can still continue.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => estimate(options)}
                    data-ocid="options.retry_estimate_button"
                    className="self-start rounded-full transition-smooth"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                    Retry estimate
                  </Button>
                </div>
              ) : null}

              <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Device</dt>
                  <dd className="min-w-0 truncate text-right font-medium text-foreground">
                    PrintHub Portable
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Excluded pages</dt>
                  <dd className="font-mono text-foreground">
                    {options.excludedBlankPages.length}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Button
            type="button"
            size="lg"
            disabled={!canContinue || startMutation.isPending}
            onClick={() => startMutation.mutate()}
            data-ocid="options.continue_button"
            className="w-full rounded-full transition-smooth"
          >
            {startMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Starting printing…
              </>
            ) : (
              <>
                Continue to Printing
                <span aria-hidden="true">→</span>
              </>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Your document is sent straight to the PrintHub device — no payment
            step.
          </p>
        </aside>
      </section>

      <PdfPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        file={localFile}
        fileName={file.fileName}
        pageCount={Number(file.pageCount)}
      />
    </div>
  );
}
