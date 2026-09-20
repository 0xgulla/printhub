import { Skeleton } from "@/components/Skeleton";
import type { PageThumbnail } from "@/lib/pdfAnalysis";
import { cn } from "@/lib/utils";
import { AlertTriangle, FileWarning, Scissors, X } from "lucide-react";
import { motion } from "motion/react";

export interface PageThumbnailStripProps {
  thumbnails: Array<PageThumbnail>;
  isLoading: boolean;
  blankPages: Array<number>;
  nearlyBlankPages: Array<number>;
  colorPages: Array<number>;
  excludedPages: Array<number>;
  onTogglePage: (page: number) => void;
}

function pageState(
  page: number,
  blankPages: Array<number>,
  nearlyBlankPages: Array<number>,
  colorPages: Array<number>,
) {
  if (blankPages.includes(page)) {
    return {
      label: "Blank",
      tone: "border-destructive/50 bg-destructive/10",
      badge: "bg-destructive/15 text-destructive",
      icon: AlertTriangle,
    };
  }
  if (nearlyBlankPages.includes(page)) {
    return {
      label: "Nearly blank",
      tone: "border-accent/60 bg-accent/10",
      badge: "bg-accent/20 text-accent-foreground",
      icon: FileWarning,
    };
  }
  if (colorPages.includes(page)) {
    return {
      label: "Colour",
      tone: "border-primary/40 bg-primary/5",
      badge: "bg-primary/15 text-primary",
      icon: null,
    };
  }
  return {
    label: "Content",
    tone: "border-border bg-card",
    badge: "bg-secondary text-muted-foreground",
    icon: null,
  };
}

export function PageThumbnailStrip({
  thumbnails,
  isLoading,
  blankPages,
  nearlyBlankPages,
  colorPages,
  excludedPages,
  onTogglePage,
}: PageThumbnailStripProps) {
  const removable = [...blankPages, ...nearlyBlankPages];

  if (isLoading) {
    const ids = Array.from({ length: 6 }, (_, i) => `page-skeleton-${i}`);
    return (
      <div
        data-ocid="analysis.thumbnails_loading_state"
        className="flex gap-3 overflow-x-auto pb-2"
      >
        {ids.map((id) => (
          <Skeleton key={id} className="h-40 w-32 shrink-0 rounded-lg" />
        ))}
      </div>
    );
  }

  if (thumbnails.length === 0) {
    return (
      <div
        data-ocid="analysis.thumbnails_empty_state"
        className="rounded-lg border border-dashed border-border px-4 py-8 text-center"
      >
        <p className="text-sm font-medium text-foreground">
          Page previews unavailable
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          This format cannot be rendered in the browser, but the analysis above
          still reflects the real document.
        </p>
      </div>
    );
  }

  return (
    <div
      data-ocid="analysis.thumbnail_strip"
      className="flex gap-3 overflow-x-auto pb-2"
    >
      {thumbnails.map((thumbnail) => {
        const page = thumbnail.pageNumber;
        const state = pageState(page, blankPages, nearlyBlankPages, colorPages);
        const isExcluded = excludedPages.includes(page);
        const canRemove = removable.includes(page);
        const StateIcon = state.icon;

        return (
          <motion.div
            key={page}
            layout
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            data-ocid={`analysis.page_thumbnail.${page}`}
            className={cn(
              "group relative w-32 shrink-0 overflow-hidden rounded-lg border shadow-card transition-smooth",
              state.tone,
              isExcluded && "opacity-45",
            )}
          >
            <div className="relative bg-card">
              <img
                src={thumbnail.dataUrl}
                alt={`Page ${page} preview`}
                className="h-40 w-full object-contain"
              />
              {isExcluded ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                  <span className="rounded-full bg-destructive px-2.5 py-1 text-xs font-semibold text-destructive-foreground">
                    Excluded
                  </span>
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-1 px-2 py-1.5">
              <span className="font-mono text-xs font-medium text-foreground">
                {page}
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                  state.badge,
                )}
              >
                {StateIcon ? (
                  <StateIcon className="h-3 w-3" aria-hidden="true" />
                ) : null}
                {state.label}
              </span>
            </div>

            {canRemove ? (
              <button
                type="button"
                onClick={() => onTogglePage(page)}
                aria-pressed={isExcluded}
                aria-label={
                  isExcluded
                    ? `Include page ${page} in printing`
                    : `Exclude page ${page} from printing`
                }
                data-ocid={`analysis.remove_page_button.${page}`}
                className={cn(
                  "absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border shadow-card transition-smooth",
                  isExcluded
                    ? "border-success bg-success text-success-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-destructive hover:text-destructive",
                )}
              >
                {isExcluded ? (
                  <Scissors className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}
