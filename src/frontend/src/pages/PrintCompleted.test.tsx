import { JobStatus } from "@/backend";
import { PrintCompletedPage } from "@/pages/PrintCompleted";
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

function seedCompletedJob() {
  const flow = usePrintFlow.getState();
  flow.setJob(
    makeJob({
      id: 5n,
      jobRef: "JOB-1001",
      fileName: "assignment.pdf",
      status: JobStatus.Completed,
      printedPages: 10n,
      pageCount: 10n,
      estimatedPrice: 40n,
    }),
  );
}

describe("PrintCompletedPage", () => {
  beforeEach(() => {
    resetCoreMock();
    usePrintFlow.getState().resetFlow();
  });

  it("shows the drawn green check, heading, and job details", async () => {
    const actor = createMockActor();
    coreMock.actor = actor;
    seedCompletedJob();

    await renderWithProviders(<PrintCompletedPage />, { path: "/completed" });

    expect(
      screen.getByRole("img", { name: /print completed/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Print Completed!")).toBeInTheDocument();
    expect(screen.getByText("JOB-1001")).toBeInTheDocument();
    expect(screen.getByText("assignment.pdf")).toBeInTheDocument();
    expect(screen.getByText("10 / 10")).toBeInTheDocument();
    expect(screen.getByText("₹40")).toBeInTheDocument();
  });

  it("offers Print Again and Download Receipt actions", async () => {
    const actor = createMockActor();
    coreMock.actor = actor;
    seedCompletedJob();

    await renderWithProviders(<PrintCompletedPage />, { path: "/completed" });

    expect(
      screen.getByRole("button", { name: /print again/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /download receipt/i }),
    ).toBeInTheDocument();
  });

  it("resets the flow and returns to upload when Print Again is clicked", async () => {
    const actor = createMockActor();
    coreMock.actor = actor;
    seedCompletedJob();
    const user = userEvent.setup();

    const { router } = await renderWithProviders(<PrintCompletedPage />, {
      path: "/completed",
      routes: ["/upload"],
    });

    await user.click(screen.getByRole("button", { name: /print again/i }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/upload");
    });
    expect(usePrintFlow.getState().job).toBeNull();
  });

  it("shows an empty state when there is no completed job", async () => {
    const actor = createMockActor();
    coreMock.actor = actor;

    await renderWithProviders(<PrintCompletedPage />, { path: "/completed" });

    expect(
      await screen.findByText(/no completed job to show/i),
    ).toBeInTheDocument();
  });

  it("downloads a receipt and confirms it when Download Receipt is clicked", async () => {
    const actor = createMockActor();
    coreMock.actor = actor;
    seedCompletedJob();
    const user = userEvent.setup();

    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:receipt");
    const revokeObjectURL = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    await renderWithProviders(<PrintCompletedPage />, { path: "/completed" });

    await user.click(screen.getByRole("button", { name: /download receipt/i }));

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:receipt");
    expect(await screen.findByText(/receipt downloaded/i)).toBeInTheDocument();
  });

  it("opens the Thank You popup after completion and closes it on Done", async () => {
    const actor = createMockActor();
    coreMock.actor = actor;
    seedCompletedJob();
    const user = userEvent.setup();

    await renderWithProviders(<PrintCompletedPage />, { path: "/completed" });

    // The popup is delayed by a short celebration timer.
    const dialog = await screen.findByRole("dialog", {}, { timeout: 3000 });
    expect(
      within(dialog).getByText(/thank you for using printhub/i),
    ).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: /done/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("links to the dashboard from the completion screen", async () => {
    const actor = createMockActor();
    coreMock.actor = actor;
    seedCompletedJob();

    await renderWithProviders(<PrintCompletedPage />, {
      path: "/completed",
      routes: ["/dashboard"],
    });

    expect(
      screen.getByRole("link", { name: /go to dashboard/i }),
    ).toHaveAttribute("href", "/dashboard");
  });
});
