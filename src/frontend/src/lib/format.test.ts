import { JobStatus } from "@/backend";
import {
  formatBytes,
  formatPrice,
  formatRating,
  jobStatusLabel,
  jobStatusTone,
} from "@/lib/format";
import { describe, expect, it } from "vitest";

describe("formatPrice", () => {
  it("renders whole rupees with the rupee symbol and en-IN grouping", () => {
    expect(formatPrice(0n)).toBe("₹0");
    expect(formatPrice(40n)).toBe("₹40");
    expect(formatPrice(123456n)).toBe("₹1,23,456");
  });
});

describe("formatBytes", () => {
  it("scales bytes to B, KB, and MB", () => {
    expect(formatBytes(512n)).toBe("512 B");
    expect(formatBytes(2048n)).toBe("2.0 KB");
    expect(formatBytes(20n * 1024n * 1024n)).toBe("20.0 MB");
  });
});

describe("formatRating", () => {
  it("shows one decimal for rated printers and 'New' for unrated", () => {
    expect(formatRating(5n)).toBe("5.0");
    expect(formatRating(0n)).toBe("New");
  });
});

describe("jobStatusLabel", () => {
  it("maps every backend status to a human label", () => {
    expect(jobStatusLabel(JobStatus.Uploaded)).toBe("Uploaded");
    expect(jobStatusLabel(JobStatus.Printing)).toBe("Printing");
    expect(jobStatusLabel(JobStatus.Completed)).toBe("Completed");
    expect(jobStatusLabel(JobStatus.Cancelled)).toBe("Cancelled");
    expect(jobStatusLabel(JobStatus.Failed)).toBe("Failed");
  });
});

describe("jobStatusTone", () => {
  it("assigns success to completed and danger to cancelled/failed", () => {
    expect(jobStatusTone(JobStatus.Completed)).toBe("success");
    expect(jobStatusTone(JobStatus.Printing)).toBe("info");
    expect(jobStatusTone(JobStatus.Cancelled)).toBe("danger");
    expect(jobStatusTone(JobStatus.Failed)).toBe("danger");
  });
});
