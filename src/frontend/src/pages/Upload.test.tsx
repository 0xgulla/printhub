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

describe("UploadPage", () => {
  beforeEach(() => {
    resetCoreMock();
    usePrintFlow.getState().resetFlow();
  });

  it("rejects an unsupported file type before calling the backend", async () => {
    const actor = createMockActor();
    actor.listFiles.mockResolvedValue([]);
    coreMock.actor = actor;
    const user = userEvent.setup({ applyAccept: false });

    await renderWithProviders(<UploadPage />, { path: "/upload" });

    const input = document.querySelector<HTMLInputElement>(
      '[data-ocid="upload.input"]',
    ) as HTMLInputElement;
    await user.upload(
      input,
      new File(["x"], "notes.txt", { type: "text/plain" }),
    );

    expect(
      (await screen.findAllByText(/upload failed/i)).length,
    ).toBeGreaterThan(0);
    // The message renders in both the upload-failed state and the error toast;
    // scope to the dropzone's error state so the assertion stays unambiguous.
    const errorState = document.querySelector(
      '[data-ocid="upload.error_state"]',
    ) as HTMLElement;
    expect(errorState).not.toBeNull();
    expect(
      within(errorState).getByText(/only pdf files can be printed/i),
    ).toBeInTheDocument();
    expect(actor.validateUpload).not.toHaveBeenCalled();
  });

  it("rejects a file larger than 20 MB before calling the backend", async () => {
    const actor = createMockActor();
    actor.listFiles.mockResolvedValue([]);
    coreMock.actor = actor;
    const user = userEvent.setup();

    await renderWithProviders(<UploadPage />, { path: "/upload" });

    const input = document.querySelector<HTMLInputElement>(
      '[data-ocid="upload.input"]',
    ) as HTMLInputElement;
    const big = new File(["x"], "huge.pdf", { type: "application/pdf" });
    Object.defineProperty(big, "size", { value: 21 * 1024 * 1024 });
    await user.upload(input, big);

    expect(
      (await screen.findAllByText(/upload failed/i)).length,
    ).toBeGreaterThan(0);
    // The message renders in both the upload-failed state and the error toast;
    // scope to the dropzone's error state so the assertion stays unambiguous.
    const errorState = document.querySelector(
      '[data-ocid="upload.error_state"]',
    ) as HTMLElement;
    expect(errorState).not.toBeNull();
    expect(within(errorState).getByText(/too large/i)).toBeInTheDocument();
    expect(actor.validateUpload).not.toHaveBeenCalled();
  });

  it("registers and analyzes a valid file, then shows the AI analysis", async () => {
    const actor = createMockActor();
    actor.listFiles.mockResolvedValue([]);
    actor.validateUpload.mockResolvedValue({
      __kind__: "ok",
      ok: AllowedExtension.pdf,
    });
    actor.registerFile.mockResolvedValue(makeFile({ id: 7n, pageCount: 10n }));
    actor.analyzeFile.mockResolvedValue(
      makeAnalysis({ fileId: 7n, blankPages: [3n, 7n] }),
    );
    coreMock.actor = actor;
    const user = userEvent.setup();

    await renderWithProviders(<UploadPage />, { path: "/upload" });

    const input = document.querySelector<HTMLInputElement>(
      '[data-ocid="upload.input"]',
    ) as HTMLInputElement;
    await user.upload(input, pdfFile());

    // The upload pipeline intentionally holds the analysis for at least
    // MIN_ANALYSIS_MS (2s), so allow more than the 1s default.
    expect(
      await screen.findByText("PDF Uploaded", undefined, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(actor.registerFile).toHaveBeenCalledTimes(1);
    // The backend now receives the real per-page inspection alongside the id.
    expect(actor.analyzeFile).toHaveBeenCalledWith(7n, {
      totalPages: 10n,
      blankPages: [3n, 7n],
      nearlyBlankPages: [],
      lowContentPages: [],
      colorPages: [],
    });

    // AI analysis panel surfaces the blank pages it detected.
    expect(
      await screen.findByText("AI Analysis Complete", undefined, {
        timeout: 5000,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Blank Pages")).toBeInTheDocument();
    expect(screen.getByText(/2 blank pages detected/i)).toBeInTheDocument();
  });

  it("lets the user exclude a detected blank page from the job", async () => {
    const actor = createMockActor();
    actor.listFiles.mockResolvedValue([]);
    actor.validateUpload.mockResolvedValue({
      __kind__: "ok",
      ok: AllowedExtension.pdf,
    });
    actor.registerFile.mockResolvedValue(makeFile({ id: 7n, pageCount: 10n }));
    actor.analyzeFile.mockResolvedValue(
      makeAnalysis({ fileId: 7n, blankPages: [3n, 7n] }),
    );
    coreMock.actor = actor;
    const user = userEvent.setup();

    await renderWithProviders(<UploadPage />, { path: "/upload" });

    const input = document.querySelector<HTMLInputElement>(
      '[data-ocid="upload.input"]',
    ) as HTMLInputElement;
    await user.upload(input, pdfFile());
    await screen.findByText("AI Analysis Complete", undefined, {
      timeout: 5000,
    });

    await user.click(screen.getByRole("button", { name: /page 3/i }));

    await waitFor(() => {
      expect(usePrintFlow.getState().options.excludedBlankPages).toEqual([3]);
    });
  });

  it("enables Continue once the file is uploaded", async () => {
    const actor = createMockActor();
    actor.listFiles.mockResolvedValue([]);
    actor.validateUpload.mockResolvedValue({
      __kind__: "ok",
      ok: AllowedExtension.pdf,
    });
    actor.registerFile.mockResolvedValue(makeFile({ id: 7n }));
    actor.analyzeFile.mockResolvedValue(makeAnalysis({ fileId: 7n }));
    coreMock.actor = actor;
    const user = userEvent.setup();

    await renderWithProviders(<UploadPage />, {
      path: "/upload",
      routes: ["/options"],
    });

    const input = document.querySelector<HTMLInputElement>(
      '[data-ocid="upload.input"]',
    ) as HTMLInputElement;
    await user.upload(input, pdfFile());
    await screen.findByText("PDF Uploaded", undefined, { timeout: 5000 });

    expect(screen.getByRole("button", { name: /continue/i })).toBeEnabled();
  });

  it("lists this device's recent files from the backend", async () => {
    const actor = createMockActor();
    actor.listFiles.mockResolvedValue([
      makeFile({ id: 1n, fileName: "lecture-notes.pdf", pageCount: 12n }),
      makeFile({ id: 2n, fileName: "invoice.pdf", pageCount: 2n }),
    ]);
    coreMock.actor = actor;

    await renderWithProviders(<UploadPage />, { path: "/upload" });

    expect(await screen.findByText("lecture-notes.pdf")).toBeInTheDocument();
    expect(screen.getByText("invoice.pdf")).toBeInTheDocument();
    expect(screen.queryByText(/no recent files/i)).not.toBeInTheDocument();
  });

  it("shows the empty recent-files state when the device has none", async () => {
    const actor = createMockActor();
    actor.listFiles.mockResolvedValue([]);
    coreMock.actor = actor;

    await renderWithProviders(<UploadPage />, { path: "/upload" });

    expect(await screen.findByText(/no recent files/i)).toBeInTheDocument();
  });

  it("offers no printer selection step after uploading", async () => {
    const actor = createMockActor();
    actor.listFiles.mockResolvedValue([]);
    actor.validateUpload.mockResolvedValue({
      __kind__: "ok",
      ok: AllowedExtension.pdf,
    });
    actor.registerFile.mockResolvedValue(makeFile({ id: 7n }));
    actor.analyzeFile.mockResolvedValue(makeAnalysis({ fileId: 7n }));
    coreMock.actor = actor;
    const user = userEvent.setup();

    await renderWithProviders(<UploadPage />, { path: "/upload" });

    const input = document.querySelector<HTMLInputElement>(
      '[data-ocid="upload.input"]',
    ) as HTMLInputElement;
    await user.upload(input, pdfFile());
    await screen.findByText("PDF Uploaded", undefined, { timeout: 5000 });

    expect(screen.queryByText(/select a printer/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/find a printer/i)).not.toBeInTheDocument();
    expect(actor.listPrinters).not.toHaveBeenCalled();
  });
});
