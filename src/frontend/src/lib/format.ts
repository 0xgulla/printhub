import type { JobStatus } from "@/backend";

/** Motoko `Time.now()` values are nanosecond bigints. */
export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Prices are whole rupees (the backend's `estimatePrice` returns rupees). */
export function formatPrice(rupees: bigint): string {
  return `₹${Number(rupees).toLocaleString("en-IN")}`;
}

export function formatBytes(bytes: bigint): string {
  const value = Number(bytes);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatNumber(value: bigint): string {
  return Number(value).toLocaleString();
}

export function formatPageList(pages: Array<bigint>): string {
  if (pages.length === 0) return "None";
  return pages.map((page) => Number(page)).join(", ");
}

export function jobStatusLabel(status: JobStatus): string {
  switch (status) {
    case "Uploaded":
      return "Uploaded";
    case "Printing":
      return "Printing";
    case "Completed":
      return "Completed";
    case "Cancelled":
      return "Cancelled";
    case "Failed":
      return "Failed";
    default:
      return "Unknown";
  }
}

export type StatusTone = "success" | "warning" | "danger" | "info" | "muted";

export function jobStatusTone(status: JobStatus): StatusTone {
  switch (status) {
    case "Completed":
      return "success";
    case "Printing":
      return "info";
    case "Uploaded":
      return "warning";
    case "Cancelled":
    case "Failed":
      return "danger";
    default:
      return "muted";
  }
}

export function formatRating(rating: bigint): string {
  const value = Number(rating);
  return value > 0 ? value.toFixed(1) : "New";
}
