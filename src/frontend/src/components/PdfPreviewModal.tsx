import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ImageIcon,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export interface PdfPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
  fileName: string;
  pageCount: number;
}

const ZOOM_STEPS = [0.75, 1, 1.25, 1.5, 2];

export function PdfPreviewModal({
  open,
  onOpenChange,
  file,
  fileName,
  pageCount,
}: PdfPreviewModalProps) {
  const [page, setPage] = useState(1);
  const [zoomIndex, setZoomIndex] = useState(1);

  const objectUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  useEffect(() => {
    if (open) {
      setPage(1);
      setZoomIndex(1);
    }
  }, [open]);

  const isImage = file?.type.startsWith("image/") ?? false;
  const isPdf =
    file?.type === "application/pdf" ||
    file?.name.toLowerCase().endsWith(".pdf");
  const totalPages = Math.max(1, pageCount);
  const zoom = ZOOM_STEPS[zoomIndex];

  const goToPage = (next: number) => {
    setPage(Math.min(totalPages, Math.max(1, next)));
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Document preview"
      description={fileName}
      ocid="preview.modal"
      className="sm:max-w-3xl"
      footer={
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Zoom out"
              disabled={zoomIndex === 0}
              onClick={() => setZoomIndex((index) => Math.max(0, index - 1))}
              data-ocid="preview.zoom_out_button"
              className="rounded-full"
            >
              <ZoomOut className="h-4 w-4" aria-hidden="true" />
            </Button>
            <span className="w-14 text-center font-mono text-xs text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Zoom in"
              disabled={zoomIndex === ZOOM_STEPS.length - 1}
              onClick={() =>
                setZoomIndex((index) =>
                  Math.min(ZOOM_STEPS.length - 1, index + 1),
                )
              }
              data-ocid="preview.zoom_in_button"
              className="rounded-full"
            >
              <ZoomIn className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
              data-ocid="preview.prev_page_button"
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <span className="font-mono text-xs text-muted-foreground">
              Page {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next page"
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
              data-ocid="preview.next_page_button"
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      }
    >
      <div
        data-ocid="preview.viewer"
        className="flex min-h-[320px] items-center justify-center overflow-auto rounded-lg border border-border bg-secondary p-4"
      >
        {objectUrl && isPdf ? (
          <iframe
            key={`${objectUrl}-${page}`}
            src={`${objectUrl}#page=${page}&zoom=${Math.round(zoom * 100)}`}
            title={`Preview of ${fileName}`}
            className="h-[420px] w-full rounded-md border border-border bg-card"
          />
        ) : objectUrl && isImage ? (
          <img
            src={objectUrl}
            alt={`Preview of ${fileName}`}
            style={{ transform: `scale(${zoom})` }}
            className="max-h-[420px] rounded-md border border-border bg-card object-contain transition-smooth"
          />
        ) : (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-card text-primary shadow-card">
              {isImage ? (
                <ImageIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <FileText className="h-6 w-6" aria-hidden="true" />
              )}
            </div>
            <p className="font-display text-base font-semibold text-foreground">
              Preview unavailable for this format
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {fileName} is registered with {totalPages} page
              {totalPages === 1 ? "" : "s"}. Word documents can be previewed
              after conversion to PDF.
            </p>
          </div>
        )}
      </div>
      <p
        className={cn(
          "mt-3 text-center text-xs text-muted-foreground",
          !objectUrl && "hidden",
        )}
      >
        Use the page and zoom controls to inspect your document before printing.
      </p>
    </Modal>
  );
}
