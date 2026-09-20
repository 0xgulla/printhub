import type { PrinterView } from "@/backend";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRating } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Clock, Gauge, MapPin, Star } from "lucide-react";

interface PrinterDetailsModalProps {
  printer: PrinterView | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (printer: PrinterView) => void;
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function PrinterDetailsModal({
  printer,
  open,
  onOpenChange,
  onConfirm,
}: PrinterDetailsModalProps) {
  if (!printer) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={printer.name}
      description={printer.description}
      ocid="printer_details.modal"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-ocid="printer_details.cancel_button"
            className="rounded-full transition-smooth"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!printer.isOnline}
            onClick={() => onConfirm(printer)}
            data-ocid="printer_details.confirm_button"
            className="rounded-full transition-smooth"
          >
            {printer.isOnline ? "Confirm printer" : "Printer offline"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "rounded-full border-transparent px-2.5 py-1 text-xs font-medium",
              printer.isOnline
                ? "bg-success/15 text-success"
                : "bg-destructive/15 text-destructive",
            )}
          >
            <span
              className={cn(
                "mr-1.5 h-1.5 w-1.5 rounded-full",
                printer.isOnline ? "bg-success" : "bg-destructive",
              )}
              aria-hidden="true"
            />
            {printer.isOnline ? "Online" : "Offline"}
          </Badge>
          <span className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            <Star
              className="h-3.5 w-3.5 fill-accent text-accent"
              aria-hidden="true"
            />
            <span className="font-mono">{formatRating(printer.rating)}</span>
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailRow icon={MapPin} label="Location" value={printer.location} />
          <DetailRow
            icon={Clock}
            label="Opening hours"
            value={printer.openingHours}
          />
          <DetailRow
            icon={Gauge}
            label="Print speed"
            value={`${Number(printer.speedPagesPerMinute)} pages per minute`}
          />
          <DetailRow
            icon={Star}
            label="Rating"
            value={formatRating(printer.rating)}
          />
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Supported paper
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {printer.paperSizes.map((size) => (
              <span
                key={size}
                className="rounded-full bg-secondary px-2.5 py-1 font-mono text-xs font-medium text-secondary-foreground"
              >
                {size}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Colour support
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {printer.colorModes.map((mode) => (
              <span
                key={mode}
                className="rounded-full bg-secondary px-2.5 py-1 font-mono text-xs font-medium text-secondary-foreground"
              >
                {mode === "Color" ? "Colour" : "Black & white"}
              </span>
            ))}
          </div>
        </div>

        {!printer.isOnline ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            This printer is currently offline. Choose another printer to
            continue.
          </p>
        ) : null}
      </div>
    </Modal>
  );
}
