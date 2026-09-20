import { JobStatus } from "@/backend";
import { PrintingStatusPage } from "@/pages/PrintingStatus";
import { usePrintFlow } from "@/store/printFlow";
import { coreMock, resetCoreMock } from "@/test/coreInfrastructureMock";
import {
  createMockActor,
  makeJob,
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

function seedJob() {
  const flow = usePrintFlow.getState();
  flow.setJob(
    makeJob({
      id: 5n,
      jobRef: "JOB-1001",
      status: JobStatus.Printing,
      printedPages: 4n,
      pageCount: 10n,
    }),
  );
}

describe("PrintingStatusPage", () => {
  beforeEach(() => {
    resetCoreMock();
    usePrintFlow.getState().resetFlow();
  });

  it("shows the job id, live page counter, and timeline", async () => {
    const actor = createMockActor();
    actor.getPrintProgress.mockResolvedValue({
      jobId: 5n,
      status: JobStatus.Printing,
      printedPages: 4n,
      totalPages: 10n,
      updatedAt: 1_700_000_000_000_000_000n,
    });
    actor.tickPrinting.mockResolvedValue(undefined);
    coreMock.actor = actor;
    seedJob();

    await renderWithProviders(<PrintingStatusPage />, { path: "/printing" });

    expect(screen.getByText(/Job ID: JOB-1001/)).toBeInTheDocument();
    expect(
      await screen.findByText(/Progress: 4 \/ 10 pages/),
    ).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
    expect(screen.getByText("Job timeline")).toBeInTheDocument();
    expect(screen.getByText("Printing…")).toBeInTheDocument();
    expect(
      within(
        document.querySelector(
          '[data-ocid="printing.timeline.6"]',
        ) as HTMLElement,
      ).getByText("Completed"),
    ).toBeInTheDocument();
  });

  it("renders the animated printer and a progress bar", async () => {
    const actor = createMockActor();
    actor.getPrintProgress.mockResolvedValue({
      jobId: 5n,
      status: JobStatus.Printing,
      printedPages: 4n,
      totalPages: 10n,
      updatedAt: 1_700_000_000_000_000_000n,
    });
    actor.tickPrinting.mockResolvedValue(undefined);
    coreMock.actor = actor;
    seedJob();

    await renderWithProviders(<PrintingStatusPage />, { path: "/printing" });

    expect(
      screen.getByRole("progressbar", { name: /printing progress/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/your document is printing/i)).toBeInTheDocument();
  });

  it("advances to the completed page once the backend reports Completed", async () => {
    const actor = createMockActor();
    actor.getPrintProgress.mockResolvedValue({
      jobId: 5n,
      status: JobStatus.Completed,
      printedPages: 10n,
      totalPages: 10n,
      updatedAt: 1_700_000_000_000_000_000n,
    });
    actor.tickPrinting.mockResolvedValue(undefined);
    coreMock.actor = actor;
    seedJob();

    const { router } = await renderWithProviders(<PrintingStatusPage />, {
      path: "/printing",
      routes: ["/completed"],
    });

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/completed");
    });
    expect(usePrintFlow.getState().job?.status).toBe(JobStatus.Completed);
  });

  it("shows an empty state when there is no active job", async () => {
    const actor = createMockActor();
    coreMock.actor = actor;

    await renderWithProviders(<PrintingStatusPage />, { path: "/printing" });

    expect(await screen.findByText(/no active print job/i)).toBeInTheDocument();
  });

  it("renders every timeline entry while a job is printing", async () => {
    const actor = createMockActor();
    actor.getPrintProgress.mockResolvedValue({
      jobId: 5n,
      status: JobStatus.Printing,
      printedPages: 4n,
      totalPages: 10n,
      updatedAt: 1_700_000_000_000_000_000n,
    });
    actor.tickPrinting.mockResolvedValue(undefined);
    coreMock.actor = actor;
    seedJob();

    await renderWithProviders(<PrintingStatusPage />, { path: "/printing" });

    const timeline = document.querySelector('[data-ocid="printing.timeline.1"]')
      ?.parentElement as HTMLElement;
    for (const label of [
      "File uploaded",
      "AI analysis complete",
      "Sent to PrintHub device",
      "Printer received",
      "Printing…",
      "Completed",
    ]) {
      expect(within(timeline).getByText(label)).toBeInTheDocument();
    }
  });

  it("cancels the job through the backend and reflects the cancelled state", async () => {
    const actor = createMockActor();
    actor.getPrintProgress.mockResolvedValue({
      jobId: 5n,
      status: JobStatus.Printing,
      printedPages: 4n,
      totalPages: 10n,
      updatedAt: 1_700_000_000_000_000_000n,
    });
    actor.tickPrinting.mockResolvedValue(undefined);
    actor.cancelJob.mockResolvedValue(
      makeJob({ id: 5n, jobRef: "JOB-1001", status: JobStatus.Cancelled }),
    );
    coreMock.actor = actor;
    seedJob();
    const user = userEvent.setup();

    await renderWithProviders(<PrintingStatusPage />, { path: "/printing" });

    await user.click(screen.getByRole("button", { name: /cancel job/i }));

    await waitFor(() => {
      expect(actor.cancelJob).toHaveBeenCalledWith(5n);
    });
    await waitFor(() => {
      expect(usePrintFlow.getState().job?.status).toBe(JobStatus.Cancelled);
    });
  });

  it("marks the final timeline entry current when the job is completed", async () => {
    const actor = createMockActor();
    actor.getPrintProgress.mockResolvedValue({
      jobId: 5n,
      status: JobStatus.Completed,
      printedPages: 10n,
      totalPages: 10n,
      updatedAt: 1_700_000_000_000_000_000n,
    });
    actor.tickPrinting.mockResolvedValue(undefined);
    coreMock.actor = actor;
    // Seed the completed status so the timeline renders its final state on the
    // first paint, before the completion redirect unmounts the page.
    usePrintFlow.getState().setJob(
      makeJob({
        id: 5n,
        jobRef: "JOB-1001",
        status: JobStatus.Completed,
        printedPages: 10n,
        pageCount: 10n,
      }),
    );

    await renderWithProviders(<PrintingStatusPage />, {
      path: "/printing",
      routes: ["/completed"],
    });

    const finalEntry = document.querySelector(
      '[data-ocid="printing.timeline.6"]',
    );
    expect(finalEntry).not.toBeNull();
    const finalLabel = within(finalEntry as HTMLElement).getByText("Completed");
    // The final entry is the active/current step, not a merely-done one.
    expect(finalLabel).toHaveClass("text-success");
    expect(finalEntry?.querySelector("svg")).not.toBeNull();

    const earlierDone = document.querySelector(
      '[data-ocid="printing.timeline.5"]',
    );
    const earlierLabel = within(earlierDone as HTMLElement).getByText(
      "Printing…",
    );
    expect(earlierLabel).not.toHaveClass("text-success");
  });

  it("navigates to the completion screen as soon as progress reaches 100 percent", async () => {
    const actor = createMockActor();
    actor.getPrintProgress.mockResolvedValue({
      jobId: 5n,
      status: JobStatus.Printing,
      printedPages: 10n,
      totalPages: 10n,
      updatedAt: 1_700_000_000_000_000_000n,
    });
    actor.tickPrinting.mockResolvedValue(undefined);
    coreMock.actor = actor;
    seedJob();

    const { router } = await renderWithProviders(<PrintingStatusPage />, {
      path: "/printing",
      routes: ["/completed"],
    });

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/completed");
    });
    expect(usePrintFlow.getState().job?.status).toBe(JobStatus.Completed);
  });

  it("shows the failed state with a start-again action and no completion redirect", async () => {
    const actor = createMockActor();
    actor.getPrintProgress.mockResolvedValue({
      jobId: 5n,
      status: JobStatus.Failed,
      printedPages: 4n,
      totalPages: 10n,
      updatedAt: 1_700_000_000_000_000_000n,
    });
    actor.tickPrinting.mockResolvedValue(undefined);
    coreMock.actor = actor;
    seedJob();

    const { router } = await renderWithProviders(<PrintingStatusPage />, {
      path: "/printing",
      routes: ["/upload", "/completed"],
    });

    expect(await screen.findByText(/printing failed/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start a new job/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /cancel job/i }),
    ).not.toBeInTheDocument();
    // A failed job must not be treated as complete.
    expect(router.state.location.pathname).toBe("/printing");
  });

  it("returns to upload from the failed state", async () => {
    const actor = createMockActor();
    actor.getPrintProgress.mockResolvedValue({
      jobId: 5n,
      status: JobStatus.Failed,
      printedPages: 4n,
      totalPages: 10n,
      updatedAt: 1_700_000_000_000_000_000n,
    });
    actor.tickPrinting.mockResolvedValue(undefined);
    coreMock.actor = actor;
    seedJob();
    const user = userEvent.setup();

    const { router } = await renderWithProviders(<PrintingStatusPage />, {
      path: "/printing",
      routes: ["/upload"],
    });

    await user.click(
      await screen.findByRole("button", { name: /start a new job/i }),
    );

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/upload");
    });
  });
});
