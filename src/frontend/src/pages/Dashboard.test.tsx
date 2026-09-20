import { JobStatus } from "@/backend";
import { DashboardPage } from "@/pages/Dashboard";
import { coreMock, resetCoreMock } from "@/test/coreInfrastructureMock";
import {
  createMockActor,
  makeJob,
  makeUserStats,
  renderWithProviders,
} from "@/test/test-utils";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () =>
  import("@/test/coreInfrastructureMock").then((m) =>
    m.coreInfrastructureMock(),
  ),
);

describe("DashboardPage", () => {
  beforeEach(() => {
    resetCoreMock();
  });

  it("renders without a sign-in gate for an unauthenticated visitor", async () => {
    const actor = createMockActor();
    actor.getUserStats.mockResolvedValue(makeUserStats());
    actor.listJobs.mockResolvedValue([]);
    coreMock.actor = actor;
    coreMock.isAuthenticated = false;

    await renderWithProviders(<DashboardPage />, { path: "/dashboard" });

    expect(
      screen.getByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/sign in to view your dashboard/i),
    ).not.toBeInTheDocument();
    expect(await screen.findByText("Total Prints")).toBeInTheDocument();
  });

  it("shows the heading, three stat cards, and print history", async () => {
    const actor = createMockActor();
    actor.getUserStats.mockResolvedValue(
      makeUserStats({ totalPrints: 12n, totalSpent: 480n, savedFiles: 3n }),
    );
    actor.listJobs.mockResolvedValue([
      makeJob({
        id: 5n,
        jobRef: "JOB-1001",
        fileName: "assignment.pdf",
        status: JobStatus.Completed,
        pageCount: 10n,
        estimatedPrice: 40n,
      }),
    ]);
    coreMock.actor = actor;

    await renderWithProviders(<DashboardPage />, { path: "/dashboard" });

    expect(
      screen.getByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Total Prints")).toBeInTheDocument();
    expect(screen.getByText("Total Spent")).toBeInTheDocument();
    expect(screen.getByText("Saved Files")).toBeInTheDocument();
    expect(screen.getByText("Print History")).toBeInTheDocument();
    expect(await screen.findByText("assignment.pdf")).toBeInTheDocument();
    expect(screen.getByText("₹40")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("shows an empty print-history state when the device has no jobs", async () => {
    const actor = createMockActor();
    actor.getUserStats.mockResolvedValue(makeUserStats());
    actor.listJobs.mockResolvedValue([]);
    coreMock.actor = actor;

    await renderWithProviders(<DashboardPage />, { path: "/dashboard" });

    expect(await screen.findByText(/no prints yet/i)).toBeInTheDocument();
  });
});
