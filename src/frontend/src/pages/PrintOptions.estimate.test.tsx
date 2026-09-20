import { ColorMode, PaperSize } from "@/backend";
import { PrintOptionsPage } from "@/pages/PrintOptions";
import { usePrintFlow } from "@/store/printFlow";
import { coreMock, resetCoreMock } from "@/test/coreInfrastructureMock";
import {
  createMockActor,
  makeAnalysis,
  makeFile,
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
  flow.setAnalysis(makeAnalysis({ fileId: 7n, blankPages: [] }));
}

/**
 * Characterization of the price-estimation resilience that must survive the
 * workflow rework: when the live `estimatePrice` call fails, the page falls
 * back to a locally computed price, tells the user, and lets them retry —
 * rather than blocking the flow.
 */
describe("PrintOptionsPage price estimation", () => {
  beforeEach(() => {
    resetCoreMock();
    usePrintFlow.getState().resetFlow();
  });

  it("falls back to a local estimate when the live estimate fails", async () => {
    const actor = createMockActor();
    actor.estimatePrice.mockRejectedValue(new Error("network down"));
    coreMock.actor = actor;
    seedFlow();

    await renderWithProviders(<PrintOptionsPage />, { path: "/options" });

    // 10 pages, black & white, A4, 1 copy -> 10 rupees locally.
    expect(await screen.findByText("₹10")).toBeInTheDocument();
    expect(screen.getByText(/live estimate unavailable/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /retry estimate/i }),
    ).toBeInTheDocument();
  });

  it("recomputes the local fallback when options change after a failure", async () => {
    const actor = createMockActor();
    actor.estimatePrice.mockRejectedValue(new Error("network down"));
    coreMock.actor = actor;
    seedFlow();
    const user = userEvent.setup();

    await renderWithProviders(<PrintOptionsPage />, { path: "/options" });
    await screen.findByText("₹10");

    await user.click(screen.getByRole("button", { name: "Color" }));

    await waitFor(() => {
      expect(usePrintFlow.getState().options.colorMode).toBe(ColorMode.Color);
    });
    // Colour is 5x per page: 10 pages -> 50 rupees.
    expect(await screen.findByText("₹50")).toBeInTheDocument();
  });

  it("recovers the live price when the retry succeeds", async () => {
    const actor = createMockActor();
    actor.estimatePrice
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce(40n);
    coreMock.actor = actor;
    seedFlow();
    const user = userEvent.setup();

    await renderWithProviders(<PrintOptionsPage />, { path: "/options" });
    await screen.findByText(/live estimate unavailable/i);

    await user.click(screen.getByRole("button", { name: /retry estimate/i }));

    expect(await screen.findByText("₹40")).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByText(/live estimate unavailable/i),
      ).not.toBeInTheDocument();
    });
  });

  it("sends the current options to the backend estimate", async () => {
    const actor = createMockActor();
    actor.estimatePrice.mockResolvedValue(40n);
    coreMock.actor = actor;
    seedFlow();

    await renderWithProviders(<PrintOptionsPage />, { path: "/options" });
    await screen.findByText("₹40");

    expect(actor.estimatePrice).toHaveBeenCalledWith(
      10n,
      expect.objectContaining({
        paperSize: PaperSize.A4,
        colorMode: ColorMode.BlackAndWhite,
        copies: 1n,
      }),
    );
  });
});
