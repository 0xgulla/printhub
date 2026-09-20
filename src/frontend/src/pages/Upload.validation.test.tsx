import { AllowedExtension } from "@/backend";
import { UploadPage } from "@/pages/Upload";
import { usePrintFlow } from "@/store/printFlow";
import { coreMock, resetCoreMock } from "@/test/coreInfrastructureMock";
import {
  createMockActor,
  makeAnalysis,
  makeFile,
  renderWithProviders,
} from "@/test/test-utils";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () =>
  import("@/test/coreInfrastructureMock").then((m) =>
    m.coreInfrastructureMock(),
  ),
);

// The real `analyzePdfDocument` runs pdf.js over the file bytes, which cannot
// parse the synthetic `%PDF-1.4` fixture used here. Stub the inspection so the
// upload pipeline (validate -> inspect -> register -> analyze) is exercised
// deterministically without a real PDF parser.
vi.mock("@/lib/pdfAnalysis", () => ({
  analyzePdfDocument: vi.fn(async () => ({
    totalPages: 10,
    pages: [],
    input: {
      totalPages: 10n,
      blankPages: [3n, 7n],
      nearlyBlankPages: [],
      lowContentPages: [],
      colorPages: [],
    },
    issueNotes: [],
  })),
  renderPageThumbnails: vi.fn(async () => []),
}));

function pdfFile(name = "assignment.pdf", size = 2048): File {
  const header = "%PDF-1.4 content";
  const padding = "x".repeat(Math.max(0, size - header.length));
  return new File([header + padding], name, { type: "application/pdf" });
}

function uploadInput(): HTMLInputElement {
  return document.querySelector<HTMLInputElement>(
    '[data-ocid="upload.input"]',
  ) as HTMLInputElement;
}

function errorState(): HTMLElement {
  return document.querySelector(
    '[data-ocid="upload.error_state"]',
  ) as HTMLElement;
}

/**
 * Characterization of the upload validation contract that must survive the
 * workflow rework: the client rejects empty files before any backend call, and
 * every backend `UploadValidation` failure kind is surfaced to the user with a
 * readable message instead of a silent failure.
 */
describe("UploadPage validation", () => {
  beforeEach(() => {
    resetCoreMock();
    usePrintFlow.getState().resetFlow();
  });

  it("rejects an empty file before calling the backend", async () => {
    const actor = createMockActor();
    actor.listFiles.mockResolvedValue([]);
    coreMock.actor = actor;
    const user = userEvent.setup();

    await renderWithProviders(<UploadPage />, { path: "/upload" });

    await user.upload(
      uploadInput(),
      new File([], "empty.pdf", { type: "application/pdf" }),
    );

    await waitFor(() => {
      expect(errorState()).not.toBeNull();
    });
    expect(
      within(errorState()).getByText(/upload failed/i),
    ).toBeInTheDocument();
    expect(
      within(errorState()).getByText(/file is empty/i),
    ).toBeInTheDocument();
    expect(actor.validateUpload).not.toHaveBeenCalled();
  });

  it("surfaces the backend's too-large rejection with the actual size", async () => {
    const actor = createMockActor();
    actor.listFiles.mockResolvedValue([]);
    actor.validateUpload.mockResolvedValue({
      __kind__: "tooLarge",
      tooLarge: {
        actualBytes: 30n * 1024n * 1024n,
        limitBytes: 20n * 1024n * 1024n,
      },
    });
    coreMock.actor = actor;
    const user = userEvent.setup();

    await renderWithProviders(<UploadPage />, { path: "/upload" });

    await user.upload(uploadInput(), pdfFile());

    await waitFor(() => {
      expect(actor.validateUpload).toHaveBeenCalledTimes(1);
    });
    expect(within(errorState()).getByText(/too large/i)).toBeInTheDocument();
    expect(within(errorState()).getByText(/30\.0 MB/)).toBeInTheDocument();
    expect(actor.registerFile).not.toHaveBeenCalled();
  });

  it("surfaces the backend's unsupported-extension rejection", async () => {
    const actor = createMockActor();
    actor.listFiles.mockResolvedValue([]);
    actor.validateUpload.mockResolvedValue({
      __kind__: "unsupportedExtension",
      unsupportedExtension: "exe",
    });
    coreMock.actor = actor;
    const user = userEvent.setup();

    await renderWithProviders(<UploadPage />, { path: "/upload" });

    await user.upload(uploadInput(), pdfFile());

    await waitFor(() => {
      expect(actor.validateUpload).toHaveBeenCalledTimes(1);
    });
    expect(
      within(errorState()).getByText(/unsupported file type/i),
    ).toBeInTheDocument();
    expect(actor.registerFile).not.toHaveBeenCalled();
  });

  it("surfaces the backend's empty-file rejection", async () => {
    const actor = createMockActor();
    actor.listFiles.mockResolvedValue([]);
    actor.validateUpload.mockResolvedValue({ __kind__: "empty", empty: null });
    coreMock.actor = actor;
    const user = userEvent.setup();

    await renderWithProviders(<UploadPage />, { path: "/upload" });

    await user.upload(uploadInput(), pdfFile());

    await waitFor(() => {
      expect(actor.validateUpload).toHaveBeenCalledTimes(1);
    });
    expect(
      within(errorState()).getByText(/file is empty/i),
    ).toBeInTheDocument();
    expect(actor.registerFile).not.toHaveBeenCalled();
  });

  it("retries the last file after a validation failure", async () => {
    const actor = createMockActor();
    actor.listFiles.mockResolvedValue([]);
    actor.validateUpload
      .mockResolvedValueOnce({
        __kind__: "unsupportedExtension",
        unsupportedExtension: "exe",
      })
      .mockResolvedValueOnce({ __kind__: "ok", ok: AllowedExtension.pdf });
    actor.registerFile.mockResolvedValue(makeFile({ id: 7n, pageCount: 10n }));
    actor.analyzeFile.mockResolvedValue(makeAnalysis({ fileId: 7n }));
    coreMock.actor = actor;
    const user = userEvent.setup();

    await renderWithProviders(<UploadPage />, { path: "/upload" });

    await user.upload(uploadInput(), pdfFile());
    await waitFor(() => {
      expect(actor.validateUpload).toHaveBeenCalledTimes(1);
    });

    await user.click(
      within(errorState()).getByRole("button", { name: /try again/i }),
    );

    // The upload pipeline intentionally holds the analysis for at least
    // MIN_ANALYSIS_MS (2s), so allow more than the 1s default.
    expect(
      await screen.findByText("PDF Uploaded", undefined, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(actor.validateUpload).toHaveBeenCalledTimes(2);
    expect(actor.registerFile).toHaveBeenCalledTimes(1);
  });
});
