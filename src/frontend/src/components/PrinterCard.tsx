import type { PrinterView } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRating } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Clock, Gauge, MapPin, Star } from "lucide-react";

interface PrinterCardProps {
  printer: PrinterView;
  isSelected: boolean;
  onSelect: (printer: PrinterView) => void;
  onViewDetails: (printer: PrinterView) => void;
  ocid?: string;
}

export function PrinterCard({
  printer,
  isSelected,
  onSelect,
  onViewDetails,
  ocid,
}: PrinterCardProps) {
  return (
    <Card
      data-ocid={ocid}
      className={cn(
        "group flex h-full flex-col rounded-lg border-border shadow-card transition-smooth hover:-translate-y-1 hover:shadow-card-hover",
        isSelected && "border-primary shadow-card-hover",
      )}
    >
      <CardContent className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <h2 className="min-w-0 font-display text-lg font-semibold text-foreground">
            {printer.name}
          </h2>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 rounded-full border-transparent px-2.5 py-1 text-xs font-medium",
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
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{printer.location}</span>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {printer.paperSizes.map((size) => (
            <span
              key={size}
              className="rounded-full bg-secondary px-2.5 py-1 font-mono text-xs font-medium text-secondary-foreground"
            >
              {size}
            </span>
          ))}
          {printer.colorModes.map((mode) => (
            <span
              key={mode}
              className="rounded-full bg-secondary px-2.5 py-1 font-mono text-xs font-medium text-secondary-foreground"
            >
              {mode === "Color" ? "Colour" : "B&W"}
            </span>
          ))}
        </div>

        <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{printer.openingHours}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="font-mono">
              {Number(printer.speedPagesPerMinute)} ppm
            </span>
          </p>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-sm">
          <Star
            className="h-3.5 w-3.5 fill-accent text-accent"
            aria-hidden="true"
          />
          <span className="font-mono text-muted-foreground">
            {formatRating(printer.rating)}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {printer.description}
        </p>

        <div className="mt-auto pt-6">
          {!printer.isOnline ? (
            <p className="mb-2 text-center text-xs text-muted-foreground">
              Choose another printer — this one is offline.
            </p>
          ) : null}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onViewDetails(printer)}
              data-ocid={ocid ? `${ocid}.details_button` : undefined}
              className="rounded-full transition-smooth"
            >
              Details
            </Button>
            <Button
              type="button"
              disabled={!printer.isOnline}
              onClick={() => onSelect(printer)}
              data-ocid={ocid ? `${ocid}.select_button` : undefined}
              className="flex-1 rounded-full transition-smooth"
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
