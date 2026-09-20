import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PrintOptionsDraft } from "@/store/printFlow";
import { FileText, Printer } from "lucide-react";

export interface OrderSummaryProps {
  fileName: string;
  pageCount: number;
  options: PrintOptionsDraft;
  total: bigint | null;
  className?: string;
}

export function OrderSummary({
  fileName,
  pageCount,
  options,
  total,
  className,
}: OrderSummaryProps) {
  const excludedCount = options.excludedBlankPages.length;
  const printablePages = Math.max(0, pageCount - excludedCount);

  return (
    <div
      data-ocid="order.order_summary"
      className={cn(
        "rounded-lg border border-border bg-card p-6 shadow-card",
        className,
      )}
    >
      <h2 className="font-display text-lg font-semibold text-foreground">
        Order summary
      </h2>

      <div className="mt-5 flex items-start gap-3 rounded-lg border border-border bg-secondary p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card text-primary">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{fileName}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {printablePages} of {pageCount} page
            {pageCount === 1 ? "" : "s"} will print
          </p>
        </div>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Pages</dt>
          <dd className="font-mono text-foreground">
            {printablePages}
            {excludedCount > 0 ? (
              <span className="ml-1 text-muted-foreground">
                ({excludedCount} excluded)
              </span>
            ) : null}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Colour mode</dt>
          <dd className="font-mono text-foreground">
            {options.colorMode === "Color" ? "Colour" : "Black & white"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Copies</dt>
          <dd className="font-mono text-foreground">{options.copies}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Paper size</dt>
          <dd className="font-mono text-foreground">{options.paperSize}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Page range</dt>
          <dd className="font-mono text-foreground">
            {options.pageSelection === "Custom"
              ? options.customRange || "Custom"
              : "All pages"}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex items-baseline justify-between border-t border-border pt-6">
        <span className="font-medium text-muted-foreground">Total amount</span>
        <span className="font-display text-3xl font-bold text-foreground">
          {total !== null ? formatPrice(total) : "—"}
        </span>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Printer className="h-3.5 w-3.5" aria-hidden="true" />
        Sent straight to the PrintHub device — no payment step.
      </p>
    </div>
  );
}
