import {
  formatDate,
  formatDateTime,
  formatNumber,
  formatPageList,
  timestampToDate,
} from "@/lib/format";
import { describe, expect, it } from "vitest";

/**
 * Characterization of the shared formatting helpers that must survive the
 * workflow rework. Dashboard history, the completed screen, and the analysis
 * panel all render through these, so their observable output is a baseline the
 * rework must not change.
 *
 * `formatPrice`, `formatBytes`, `formatRating`, `jobStatusLabel`,
 * `jobStatusTone`, and `paymentStatusLabel` are already covered by
 * `format.test.ts`; this file covers the remaining helpers.
 */
describe("timestampToDate", () => {
  it("converts a nanosecond timestamp into the matching Date", () => {
    // 1_700_000_000_000_000_000 ns == 1_700_000_000_000 ms.
    const date = timestampToDate(1_700_000_000_000_000_000n);
    expect(date).not.toBeNull();
    expect(date?.getTime()).toBe(1_700_000_000_000);
  });

  it("returns null for a timestamp that cannot form a valid date", () => {
    // A value far beyond the Date range yields an Invalid Date.
    expect(timestampToDate(10n ** 30n)).toBeNull();
  });
});

describe("formatDateTime", () => {
  it("renders a non-empty localized date and time", () => {
    const formatted = formatDateTime(1_700_000_000_000_000_000n);
    expect(formatted).not.toBe("—");
    expect(formatted.length).toBeGreaterThan(0);
    // The year is locale-independent enough to assert on.
    expect(formatted).toContain("2023");
  });

  it("falls back to an em dash for an invalid timestamp", () => {
    expect(formatDateTime(10n ** 30n)).toBe("—");
  });
});

describe("formatDate", () => {
  it("renders a non-empty localized date", () => {
    const formatted = formatDate(1_700_000_000_000_000_000n);
    expect(formatted).not.toBe("—");
    expect(formatted).toContain("2023");
  });

  it("falls back to an em dash for an invalid timestamp", () => {
    expect(formatDate(10n ** 30n)).toBe("—");
  });
});

describe("formatNumber", () => {
  it("renders a bigint with locale grouping", () => {
    expect(formatNumber(0n)).toBe("0");
    expect(formatNumber(1234567n)).toBe("1,234,567");
  });
});

describe("formatPageList", () => {
  it("renders a comma-separated list of page numbers", () => {
    expect(formatPageList([1n, 3n, 7n])).toBe("1, 3, 7");
  });

  it("renders 'None' for an empty list", () => {
    expect(formatPageList([])).toBe("None");
  });
});
