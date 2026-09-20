import type { PrinterView } from "@/backend";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonRows } from "@/components/Skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Printer } from "lucide-react";

interface DevicesListProps {
  printers: Array<PrinterView>;
  isLoading: boolean;
  onAddDevice: () => void;
}

export function DevicesList({
  printers,
  isLoading,
  onAddDevice,
}: DevicesListProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Devices
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Printer hardware connected to your network.
          </p>
        </div>
        <Button
          type="button"
          onClick={onAddDevice}
          data-ocid="admin.add_device_button"
          className="rounded-full transition-smooth"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Device
        </Button>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div data-ocid="admin.devices_loading_state">
            <SkeletonRows count={3} />
          </div>
        ) : printers.length === 0 ? (
          <EmptyState
            icon={Printer}
            title="No devices connected"
            message="Add a printer to start accepting print jobs on your network."
            actionLabel="Add Device"
            onAction={onAddDevice}
            ocid="admin.devices_empty_state"
          />
        ) : (
          <ul data-ocid="admin.devices_list" className="space-y-3">
            {printers.map((printer, index) => (
              <li
                key={printer.id}
                data-ocid={`admin.device_item.${index + 1}`}
                className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-card transition-smooth hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      printer.isOnline
                        ? "bg-success/15 text-success"
                        : "bg-destructive/15 text-destructive",
                    )}
                  >
                    <Printer className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {printer.name}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {printer.id} · {printer.location}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 rounded-full border-transparent px-2.5 py-1 text-xs font-medium",
                    printer.isOnline
                      ? "bg-success/15 text-success"
                      : "bg-destructive/15 text-destructive",
                  )}
                >
                  {printer.isOnline ? "Online" : "Offline"}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
