import type { AnalysisResultView } from "@/backend";
import { PageThumbnailStrip } from "@/components/PageThumbnailStrip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PageThumbnail } from "@/lib/pdfAnalysis";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  FileWarning,
  Loader2,
  Palette,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

export interface AiAnalysisPanelProps {
  analysis: AnalysisResultView | null;
  isAnalyzing: boolean;
  thumbnails: Array<PageThumbnail>;
  thumbnailsLoading: boolean;
  excludedPages: Array<number>;
  onTogglePage: (page: number) => void;
  onSelectAll: () => void;
}

const STAGES = [
  "Analyzing pages…",
  "Checking blank pages…",
  "Detecting colors…",
  "Preparing print options…",
];

function AnalysisLoading() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((current) => (current + 1) % STAGES.length);
    }, 850);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      data-ocid="analysis.loading_state"
      className="rounded-lg border-accent/50 bg-accent/10 shadow-card"
    >
      <CardContent className="flex flex-col items-center py-10 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-card text-accent shadow-card">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        </div>
        <p className="font-display text-lg font-semibold text-foreground">
          PrintHub AI is checking your document…
        </p>
        <p
          aria-live="polite"
          className="mt-2 font-mono text-sm text-accent-foreground"
        >
          {STAGES[stage]}
        </p>
        <div className="mt-6 flex items-center gap-2">
          {STAGES.map((label, index) => (
            <span
              key={label}
              className={cn(
                "h-1.5 rounded-full transition-smooth",
                index === stage ? "w-8 bg-accent" : "w-4 bg-accent/30",
              )}
              aria-hidden="true"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatProps {
  value: number;
  label: string;
  tone?: "default" | "accent" | "primary";
}

function Stat({ value, label, tone = "default" }: StatProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-center">
      <p
        className={cn(
          "font-mono text-2xl font-semibold",
          tone === "accent" && "text-accent-foreground",
          tone === "primary" && "text-primary",
          tone === "default" && "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function AiAnalysisPanel({
  analysis,
  isAnalyzing,
  thumbnails,
  thumbnailsLoading,
  excludedPages,
  onTogglePage,
  onSelectAll,
}: AiAnalysisPanelProps) {
  if (isAnalyzing) return <AnalysisLoading />;
  if (!analysis) return null;

  const blankPages = analysis.blankPages.map((page) => Number(page));
  const nearlyBlankPages = analysis.nearlyBlankPages.map((page) =>
    Number(page),
  );
  const lowContentPages = analysis.lowContentPages.map((page) => Number(page));
  const colorPages = analysis.colorPages.map((page) => Number(page));
  const totalPages = Number(analysis.totalPages);
  const blackAndWhitePages = totalPages - colorPages.length;
  const flaggedPages = [...blankPages, ...nearlyBlankPages];
  const hasBlank = blankPages.length > 0;
  const allSelected =
    flaggedPages.length > 0 &&
    flaggedPages.every((page) => excludedPages.includes(page));

  return (
    <Card
      data-ocid="analysis.panel"
      className="rounded-lg border-accent/50 bg-accent/10 shadow-card"
    >
      <CardContent>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
          <h2 className="font-display text-base font-semibold text-foreground">
            AI Analysis Complete
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value={totalPages} label="Total Pages" />
          <Stat value={blankPages.length} label="Blank Pages" tone="accent" />
          <Stat value={colorPages.length} label="Color Pages" tone="primary" />
          <Stat value={blackAndWhitePages} label="Black & White" />
        </div>

        {hasBlank ? (
          <div className="mt-5 rounded-lg border border-accent/40 bg-card p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-foreground">
                {blankPages.length} blank page
                {blankPages.length === 1 ? "" : "s"} detected. You can save
                paper by excluding them.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {blankPages.map((page) => {
                const excluded = excludedPages.includes(page);
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => onTogglePage(page)}
                    aria-pressed={excluded}
                    data-ocid={`analysis.blank_page.${page}`}
                    className={cn(
                      "rounded-full border px-3 py-1.5 font-mono text-xs font-medium transition-smooth",
                      excluded
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-accent",
                    )}
                  >
                    {excluded ? "Excluded" : "Page"} {page}
                  </button>
                );
              })}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onSelectAll}
                data-ocid="analysis.select_all_button"
                className="rounded-full text-xs"
              >
                {allSelected ? "Clear all" : "Select all"}
              </Button>
            </div>
          </div>
        ) : (
          <div
            data-ocid="analysis.no_blank_state"
            className="mt-5 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-4"
          >
            <CheckCircle2
              className="h-4 w-4 shrink-0 text-success"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-foreground">
              No blank pages detected.
            </p>
          </div>
        )}

        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-sm font-semibold text-foreground">
              Page preview
            </h3>
            <p className="text-xs text-muted-foreground">
              Click the X on a blank page to exclude it from printing.
            </p>
          </div>
          <div className="mt-3">
            <PageThumbnailStrip
              thumbnails={thumbnails}
              isLoading={thumbnailsLoading}
              blankPages={blankPages}
              nearlyBlankPages={nearlyBlankPages}
              colorPages={colorPages}
              excludedPages={excludedPages}
              onTogglePage={onTogglePage}
            />
          </div>
        </div>

        {nearlyBlankPages.length > 0 ? (
          <div className="mt-4 rounded-lg border border-border bg-card p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileWarning
                className="h-4 w-4 shrink-0 text-accent"
                aria-hidden="true"
              />
              Nearly blank pages
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              {nearlyBlankPages.join(", ")}
            </p>
          </div>
        ) : null}

        {lowContentPages.length > 0 ? (
          <div className="mt-4 rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium text-foreground">
              Low-content pages
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              {lowContentPages.join(", ")}
            </p>
          </div>
        ) : null}

        {colorPages.length > 0 ? (
          <div className="mt-4 rounded-lg border border-border bg-card p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Palette
                className="h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              Colour pages
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              {colorPages.join(", ")}
            </p>
          </div>
        ) : null}

        {analysis.issueNotes.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {analysis.issueNotes.map((note) => (
              <li
                key={note}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden="true"
                />
                {note}
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}
