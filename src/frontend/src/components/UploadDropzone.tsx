import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, FileText, Loader2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

export interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
  progress: number;
  error: string | null;
  onRetry: () => void;
  disabled?: boolean;
}

const ACCEPTED = ".pdf,application/pdf";

export function UploadDropzone({
  onFileSelected,
  isUploading,
  progress,
  error,
  onRetry,
  disabled = false,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const selected = files?.[0];
    if (!selected) return;
    onFileSelected(selected);
  };

  const openPicker = () => {
    if (disabled || isUploading) return;
    inputRef.current?.click();
  };

  if (error) {
    return (
      <div
        data-ocid="upload.error_state"
        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/5 px-6 py-14 text-center"
      >
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Upload failed
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{error}</p>
        <Button
          type="button"
          onClick={onRetry}
          data-ocid="upload.retry_button"
          className="mt-6 rounded-full transition-smooth"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (isUploading) {
    return (
      <div
        data-ocid="upload.loading_state"
        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/40 bg-secondary px-6 py-14 text-center"
      >
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-card text-primary shadow-card">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        </div>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Uploading your PDF
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Reading and registering your document…
        </p>
        <div className="mt-6 w-full max-w-sm">
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Upload progress"
            tabIndex={0}
            data-ocid="upload.progress_bar"
            className="h-2.5 w-full overflow-hidden rounded-full bg-border"
          >
            <div
              className="h-full rounded-full bg-primary transition-smooth"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-right font-mono text-xs font-medium text-primary">
            {progress}%
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-ocid="upload.dropzone"
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card px-6 py-16 text-center transition-smooth",
        dragging
          ? "border-primary bg-secondary shadow-ring-primary"
          : "border-border hover:border-primary/40",
      )}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
        <UploadCloud className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="font-display text-lg font-semibold text-foreground">
        Drag and drop your PDF here
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        PDF files up to 20 MB. We validate the file before it is registered.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
        data-ocid="upload.input"
      />
      <Button
        type="button"
        onClick={openPicker}
        disabled={disabled}
        data-ocid="upload.upload_button"
        className="mt-6 rounded-full transition-smooth"
      >
        <FileText className="h-4 w-4" aria-hidden="true" />
        Choose a PDF
      </Button>
      {disabled ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Connecting to the PrintHub backend…
        </p>
      ) : null}
    </div>
  );
}
