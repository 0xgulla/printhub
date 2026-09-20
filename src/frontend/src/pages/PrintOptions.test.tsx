import { ColorMode, JobStatus, PageSelection, PaperSize } from "@/backend";
import { PrintOptionsPage } from "@/pages/PrintOptions";
import { usePrintFlow } from "@/store/printFlow";
import { coreMock, resetCoreMock } from "@/test/coreInfrastructureMock";
import {
  createMockActor,
  makeAnalysis,
  makeFile,
  makeJob,
  renderWithProviders,
} from "@/test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () =>
  import("@/test/coreInfrastructureMock").then((m) =>
    m.coreInfrastructureMock(),
  ),
);

function seedFlow() {
  const flow = usePrintFlow.getState();
  flow.setFile(
    makeFile({ id: 7n, fileName: "assignment.pdf", pageCount: 10n }),
  );
  flow.setAnalysis(makeAnalysis({ fileId: 7n, blankPages: [3n, 7n] }));
}

describe("PrintOptionsPage", () => {
  beforeEach(() => {
    resetCoreMock();
    usePrintFlow.getState().resetFlow();
  });

  it("shows the file, preview button, and every option control", async () => {
    const actor = createMockActor();
    actor.estimatePrice.mockResolvedValue(40n);
    coreMock.actor = actor;
    seedFlow();

    await renderWithProviders(<PrintOptionsPage />, { path: "/options" });

    expect(screen.getByText("assignment.pdf")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /preview/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Colour mode")).toBeInTheDocument();
    expect(screen.getByText("Copies")).toBeInTheDocument();
    expect(screen.getByText("Paper size")).toBeInTheDocument();
    expect(screen.getByText("Pages")).toBeInTheDocument();
    expect(screen.getByText("Estimated price")).toBeInTheDocument();
  });

  it("shows the live estimated price returned by the backend", async () => {
    const actor = createMockActor();
    actor.estimatePrice.mockResolvedValue(40n);
    coreMock.actor = actor;
    seedFlow();

    await renderWithProviders(<PrintOptionsPage />, { path: "/options" });

    expect(await screen.findByText("₹40")).toBeInTheDocument();
    expect(actor.estimatePrice).toHaveBeenCalledWith(
      10n,
      expect.objectContaining({ copies: 1n, paperSize: PaperSize.A4 }),
    );
  });

  it("updates the price when the user changes colour mode", async () => {
    const actor = createMockActor();
    actor.estimatePrice.mockResolvedValue(40n);
    coreMock.actor = actor;
    seedFlow();
    const user = userEvent.setup();

    await renderWithProviders(<PrintOptionsPage />, { path: "/options" });
    await screen.findByText("₹40");

    actor.estimatePrice.mockResolvedValue(80n);
    await user.click(screen.getByRole("button", { name: "Color" }));

    await waitFor(() => {
      expect(usePrintFlow.getState().options.colorMode).toBe(ColorMode.Color);
    });
    expect(await screen.findByText("₹80")).toBeInTheDocument();
  });

  it("steps copies up and down within the allowed range", async () => {
    const actor = createMockActor();
    actor.estimatePrice.mockResolvedValue(40n);
    coreMock.actor = actor;
    seedFlow();
    const user = userEvent.setup();

    await renderWithProviders(<PrintOptionsPage />, { path: "/options" });
    await screen.findByText("₹40");

    const decrease = screen.getByRole("button", { name: /decrease copies/i });
    expect(decrease).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /increase copies/i }));
    await waitFor(() => {
      expect(usePrintFlow.getState().options.copies).toBe(2);
    });

    await user.click(decrease);
    await waitFor(() => {
      expect(usePrintFlow.getState().options.copies).toBe(1);
    });
  });

  it("switches paper size and page selection, revealing the custom range input", async () => {
    const actor = createMockActor();
    actor.estimatePrice.mockResolvedValue(40n);
    coreMock.actor = actor;
    seedFlow();
    const user = userEvent.setup();

    await renderWithProviders(<PrintOptionsPage />, { path: "/options" });
    await screen.findByText("₹40");

    await user.click(screen.getByRole("button", { name: "A3" }));
    await waitFor(() => {
      expect(usePrintFlow.getState().options.paperSize).toBe(PaperSize.A3);
    });

    expect(
      screen.queryByLabelText(/custom page range/i),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /custom range/i }));
    await waitFor(() => {
      expect(usePrintFlow.getState().options.pageSelection).toBe(
        PageSelection.Custom,
      );
    });
    expect(screen.getByLabelText(/custom page range/i)).toBeInTheDocument();
  });

  it("shows an empty state when no document is in the flow", async () => {
    const actor = createMockActor();
    coreMock.actor = actor;

    await renderWithProviders(<PrintOptionsPage />, { path: "/options" });

    expect(
      await screen.findByText(/no document to configure/i),
    ).toBeInTheDocument();
  });

  it("starts printing straight from the options page with no payment step", async () => {
    const actor = createMockActor();
    actor.estimatePrice.mockResolvedValue(40n);
    actor.createJob.mockResolvedValue(
      makeJob({ id: 5n, jobRef: "JOB-1001", status: JobStatus.Printing }),
    );
    coreMock.actor = actor;
    seedFlow();
    const user = userEvent.setup();

    const { router } = await renderWithProviders(<PrintOptionsPage />, {
      path: "/options",
      routes: ["/printing"],
    });

    await screen.findByText("₹40");

    const forward = screen.getByRole("button", {
      name: /continue to printing/i,
    });
    expect(forward).toBeEnabled();

    await user.click(forward);

    await waitFor(() => {
      expect(actor.createJob).toHaveBeenCalledWith(
        7n,
        expect.objectContaining({ copies: 1n, paperSize: PaperSize.A4 }),
      );
    });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/printing");
    });
  });

  it("tells the user the job goes straight to the device with no payment", async () => {
    const actor = createMockActor();
    actor.estimatePrice.mockResolvedValue(40n);
    coreMock.actor = actor;
    seedFlow();

    await renderWithProviders(<PrintOptionsPage />, { path: "/options" });
    await screen.findByText("₹40");

    expect(screen.getByText(/no payment step/i)).toBeInTheDocument();
  });

  it("shows a loading state on the forward control while the estimate is in flight and keeps it enabled", async () => {
    const actor = createMockActor();
    let resolveEstimate: (value: bigint) => void = () => {};
    actor.estimatePrice.mockImplementation(
      () =>
        new Promise<bigint>((resolve) => {
          resolveEstimate = resolve;
        }),
    );
    coreMock.actor = actor;
    seedFlow();

    await renderWithProviders(<PrintOptionsPage />, { path: "/options" });

    const loading = await screen.findByRole("button", {
      name: /continue to printing/i,
    });
    expect(loading).toBeEnabled();

    resolveEstimate(40n);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /continue to printing/i }),
      ).toBeEnabled();
    });
  });

  it("suggests excluding detected blank pages and applies it in one click", async () => {
    const actor = createMockActor();
    actor.estimatePrice.mockResolvedValue(40n);
    coreMock.actor = actor;
    seedFlow();
    const user = userEvent.setup();

    await renderWithProviders(<PrintOptionsPage />, { path: "/options" });
    await screen.findByText("₹40");

    expect(screen.getByText(/ai detected 2 blank pages/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /exclude blank pages/i }),
    );

    await waitFor(() => {
      expect(usePrintFlow.getState().options.excludedBlankPages).toEqual([
        3, 7,
      ]);
    });
    // Once every flagged page is excluded the suggestion disappears.
    await waitFor(() => {
      expect(
        screen.queryByText(/ai detected 2 blank pages/i),
      ).not.toBeInTheDocument();
    });
  });

  it("hides the blank-page suggestion when there are no blank pages", async () => {
    const actor = createMockActor();
    actor.estimatePrice.mockResolvedValue(40n);
    coreMock.actor = actor;
    const flow = usePrintFlow.getState();
    flow.setFile(
      makeFile({ id: 7n, fileName: "assignment.pdf", pageCount: 10n }),
    );
    flow.setAnalysis(makeAnalysis({ fileId: 7n, blankPages: [] }));

    await renderWithProviders(<PrintOptionsPage />, { path: "/options" });
    await screen.findByText("₹40");

    expect(
      screen.queryByRole("button", { name: /exclude blank pages/i }),
    ).not.toBeInTheDocument();
  });
});
