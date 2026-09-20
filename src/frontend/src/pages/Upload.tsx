import { AiAnalysisPanel } from "@/components/AiAnalysisPanel";
import { EmptyState } from "@/components/EmptyState";
import { PRINT_FLOW_STEPS, PageStepper } from "@/components/PageStepper";
import { PdfPreviewModal } from "@/components/PdfPreviewModal";
import { SkeletonRows } from "@/components/Skeleton";
import { useToast } from "@/components/ToastProvider";
import { UploadDropzone } from "@/components/UploadDropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBackend } from "@/hooks/useBackend";
import { formatBytes, timestampToDate } from "@/lib/format";
import {
  type PageThumbnail,
  analyzePdfDocument,
  renderPageThumbnails,
} from "@/lib/pdfAnalysis";
import { usePrintFlow } from "@/store/printFlow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Eye,
  FileText,
  History,
  UploadCloud,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MAX_BYTES = 20 * 1024 * 1024;
/** Keep the analysis animation inside the required 2–5 second window. */
const MIN_ANALYSIS_MS = 2000;

function isPdf(file: File): boolean {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

function relativeTime(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function UploadPage() {
  const { actor, isReady } = useBackend();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const file = usePrintFlow((state) => state.file);
  const localFile = usePrintFlow((state) => state.localFile);
  const analysis = usePrintFlow((state) => state.analysis);
  const options = usePrintFlow((state) => state.options);
  const setFile = usePrintFlow((state) => state.setFile);
  const setLocalFile = usePrintFlow((state) => state.setLocalFile);
  const setAnalysis = usePrintFlow((state) => state.setAnalysis);
  const setOptions = usePrintFlow((state) => state.setOptions);

  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [thumbnails, setThumbnails] = useState<Array<PageThumbnail>>([]);
  const [thumbnailsLoading, setThumbnailsLoading] = useState(false);
  const lastFileRef = useRef<File | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const recentQuery = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFiles();
    },
    enabled: isReady,
  });

  useEffect(() => {
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, []);

  const uploadMutation = useMutation({
    mutationFn: async (selected: File) => {
      if (!actor) throw new Error("Backend is not ready");

      const validation = await actor.validateUpload(
        selected.name,
        BigInt(selected.size),
      );
      if (validation.__kind__ === "unsupportedExtension") {
        throw new Error(
          `Unsupported file type ".${validation.unsupportedExtension}". Upload a PDF.`,
        );
      }
      if (validation.__kind__ === "tooLarge") {
        throw new Error(
          `File is too large (${formatBytes(validation.tooLarge.actualBytes)}). The limit is ${formatBytes(validation.tooLarge.limitBytes)}.`,
        );
      }
      if (validation.__kind__ === "empty") {
        throw new Error("That file is empty. Choose a PDF with content.");
      }

      // Real per-page inspection of the actual PDF content.
      const startedAt = Date.now();
      const inspection = await analyzePdfDocument(selected);
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_ANALYSIS_MS) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_ANALYSIS_MS - elapsed),
        );
      }

      const registered = await actor.registerFile(
        selected.name,
        selected.type || "application/pdf",
        BigInt(selected.size),
        BigInt(inspection.totalPages),
      );
      const result = await actor.analyzeFile(registered.id, inspection.input);
      return { registered, result };
    },
    onSuccess: ({ registered, result }) => {
      setFile(registered);
      setAnalysis(result);
      setOptions({ excludedBlankPages: [] });
      setProgress(100);
      void queryClient.invalidateQueries({ queryKey: ["files"] });
      toast("PDF Uploaded", {
        description: `${registered.fileName} is ready. Review the AI analysis below.`,
        tone: "success",
      });
    },
    onError: (error: Error) => {
      setUploadError(error.message);
      toast("Upload failed", { description: error.message, tone: "error" });
    },
  });

  // Render page thumbnails for the visual strip once a PDF is registered.
  useEffect(() => {
    if (!localFile || !file || !isPdf(localFile)) {
      setThumbnails([]);
      return;
    }
    let cancelled = false;
    setThumbnailsLoading(true);
    renderPageThumbnails(localFile)
      .then((rendered) => {
        if (!cancelled) setThumbnails(rendered);
      })
      .catch(() => {
        if (!cancelled) setThumbnails([]);
      })
      .finally(() => {
        if (!cancelled) setThumbnailsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [localFile, file]);

  const handleFileSelected = (selected: File) => {
    if (!isPdf(selected)) {
      const message = "Only PDF files can be printed. Choose a .pdf document.";
      setUploadError(message);
      toast("Upload failed", { description: message, tone: "error" });
      return;
    }
    if (selected.size > MAX_BYTES) {
      const message = `File is too large (${formatBytes(BigInt(selected.size))}). The limit is 20 MB.`;
      setUploadError(message);
      toast("Upload failed", { description: message, tone: "error" });
      return;
    }
    if (selected.size === 0) {
      const message = "That file is empty. Choose a PDF with content.";
      setUploadError(message);
      toast("Upload failed", { description: message, tone: "error" });
      return;
    }

    setUploadError(null);
    setProgress(8);
    lastFileRef.current = selected;
    setLocalFile(selected);
    if (progressTimer.current) clearInterval(progressTimer.current);
    progressTimer.current = setInterval(() => {
      setProgress((current) => (current >= 92 ? current : current + 6));
    }, 180);
    uploadMutation.mutate(selected);
  };

  const handleRetry = () => {
    setUploadError(null);
    setProgress(0);
    const retryFile = lastFileRef.current;
    if (retryFile) handleFileSelected(retryFile);
  };

  const toggleBlankPage = (page: number) => {
    const excluded = options.excludedBlankPages.includes(page)
      ? options.excludedBlankPages.filter((item) => item !== page)
      : [...options.excludedBlankPages, page];
    setOptions({ excludedBlankPages: excluded });
  };

  const flaggedPages = analysis
    ? [...analysis.blankPages, ...analysis.nearlyBlankPages].map((page) =>
        Number(page),
      )
    : [];

  const selectAllBlank = () => {
    const allSelected =
      flaggedPages.length > 0 &&
      flaggedPages.every((page) => options.excludedBlankPages.includes(page));
    setOptions({ excludedBlankPages: allSelected ? [] : flaggedPages });
  };

  const recentFiles = recentQuery.data ?? [];
  const printablePages = analysis
    ? Number(analysis.totalPages) - options.excludedBlankPages.length
    : 0;

  return (
    <div className="animate-fade-in">
      <section className="border-b border-border bg-gradient-subtle">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Upload your document
          </h1>
          <p className="mt-2 text-muted-foreground">
            Add a PDF. PrintHub AI inspects every page for blank sheets and
            colour content before you print.
          </p>
          <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-card">
            <PageStepper steps={PRINT_FLOW_STEPS} current={0} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <UploadDropzone
            onFileSelected={handleFileSelected}
            isUploading={uploadMutation.isPending}
            progress={progress}
            error={uploadError}
            onRetry={handleRetry}
            disabled={!isReady}
          />

          {file && !uploadMutation.isPending ? (
            <Card
              data-ocid="upload.success_state"
              className="rounded-lg border-success/30 shadow-card"
            >
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      PDF Uploaded
                    </h2>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {file.fileName}
                    </p>
                    <p className="mt-2 font-mono text-xs text-muted-foreground">
                      {Number(file.pageCount)} page
                      {Number(file.pageCount) === 1 ? "" : "s"} ·{" "}
                      {formatBytes(file.sizeBytes)}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPreviewOpen(true)}
                    data-ocid="upload.view_pdf_button"
                    className="w-full rounded-full transition-smooth sm:w-auto"
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    View Your PDF
                  </Button>
                  <Button
                    type="button"
                    onClick={() => void navigate({ to: "/options" })}
                    data-ocid="upload.continue_button"
                    className="w-full rounded-full transition-smooth sm:w-auto"
                  >
                    Continue
                    <span aria-hidden="true">→</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <AiAnalysisPanel
            analysis={analysis}
            isAnalyzing={uploadMutation.isPending}
            thumbnails={thumbnails}
            thumbnailsLoading={thumbnailsLoading}
            excludedPages={options.excludedBlankPages}
            onTogglePage={toggleBlankPage}
            onSelectAll={selectAllBlank}
          />
        </div>

        <aside className="space-y-6">
          <Card className="rounded-lg border-border shadow-card">
            <CardContent>
              <h2 className="font-display text-base font-semibold text-foreground">
                PrintHub device
              </h2>
              <div className="mt-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      PrintHub Portable
                    </p>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      Routed automatically — no printer to choose
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="shrink-0 rounded-full border-transparent bg-success/15 px-2.5 py-1 text-xs font-medium text-success"
                  >
                    Ready
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {analysis ? (
            <Card
              data-ocid="upload.printable_summary"
              className="rounded-lg border-border shadow-card"
            >
              <CardContent>
                <h2 className="font-display text-base font-semibold text-foreground">
                  Printable pages
                </h2>
                <p className="mt-3 font-mono text-3xl font-semibold text-primary">
                  {printablePages}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {options.excludedBlankPages.length > 0
                    ? `${options.excludedBlankPages.length} page${
                        options.excludedBlankPages.length === 1 ? "" : "s"
                      } excluded from printing.`
                    : "All pages will be printed."}
                </p>
              </CardContent>
            </Card>
          ) : null}

          <Card className="rounded-lg border-border shadow-card">
            <CardContent>
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" aria-hidden="true" />
                <h2 className="font-display text-base font-semibold text-foreground">
                  Recent files
                </h2>
              </div>
              {recentQuery.isLoading ? (
                <div className="mt-4" data-ocid="upload.recent_loading_state">
                  <SkeletonRows count={3} />
                </div>
              ) : recentFiles.length === 0 ? (
                <div
                  data-ocid="upload.recent_empty_state"
                  className="mt-4 flex flex-col items-center rounded-lg border border-dashed border-border px-4 py-8 text-center"
                >
                  <UploadCloud
                    className="h-6 w-6 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm font-medium text-foreground">
                    No recent files
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Documents you upload will be listed here for quick reuse.
                  </p>
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {recentFiles.slice(0, 5).map((item, index) => (
                    <li
                      key={item.id.toString()}
                      data-ocid={`upload.recent_item.${index + 1}`}
                      className="flex items-start gap-3 rounded-lg border border-border bg-secondary p-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card text-primary">
                        <FileText className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {item.fileName}
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                          {Number(item.pageCount)}p ·{" "}
                          {formatBytes(item.sizeBytes)} ·{" "}
                          {relativeTime(item.uploadedAt)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </aside>
      </section>

      {!file && !uploadMutation.isPending && !uploadError ? (
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
          <EmptyState
            icon={FileText}
            title="No document uploaded yet"
            message="Drop a PDF above to see its AI analysis, page count, and printing cost."
            ocid="upload.empty_state"
          />
        </div>
      ) : null}

      <PdfPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        file={localFile}
        fileName={file?.fileName ?? "Document"}
        pageCount={file ? Number(file.pageCount) : 1}
      />
    </div>
  );
}
