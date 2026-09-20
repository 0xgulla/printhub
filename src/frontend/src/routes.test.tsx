import { router } from "@/routes";
import { coreMock, resetCoreMock } from "@/test/coreInfrastructureMock";
import { createMockActor, makeUserStats } from "@/test/test-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () =>
  import("@/test/coreInfrastructureMock").then((m) =>
    m.coreInfrastructureMock(),
  ),
);

/**
 * Mount the app's real router (the same route tree `main.tsx` uses) at a given
 * path. This proves every workflow route resolves to a real page rather than a
 * dead link or a blank screen.
 */
async function renderRoute(path: string) {
  await router.navigate({ to: path, replace: true });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe("workflow routes", () => {
  beforeEach(() => {
    resetCoreMock();
    const actor = createMockActor();
    actor.listFiles.mockResolvedValue([]);
    actor.listJobs.mockResolvedValue([]);
    actor.getUserStats.mockResolvedValue(makeUserStats());
    coreMock.actor = actor;
  });

  it("renders the home hero on the default route", async () => {
    await renderRoute("/");

    expect(
      await screen.findByRole("heading", { name: /print smarter/i }),
    ).toBeInTheDocument();
  });

  it("renders the home hero on /home", async () => {
    await renderRoute("/home");

    expect(
      await screen.findByRole("heading", { name: /print smarter/i }),
    ).toBeInTheDocument();
  });

  it("resolves the upload route", async () => {
    await renderRoute("/upload");

    expect(
      await screen.findByRole("heading", { name: /upload your document/i }),
    ).toBeInTheDocument();
  });

  it("resolves the how-it-works route", async () => {
    await renderRoute("/how-it-works");

    expect(
      await screen.findByRole("heading", { name: "How It Works" }),
    ).toBeInTheDocument();
  });

  it("resolves the options route", async () => {
    await renderRoute("/options");

    expect(
      await screen.findByText(/no document to configure/i),
    ).toBeInTheDocument();
  });

  it("resolves the printing route", async () => {
    await renderRoute("/printing");

    expect(await screen.findByText(/no active print job/i)).toBeInTheDocument();
  });

  it("resolves the completed route", async () => {
    await renderRoute("/completed");

    expect(
      await screen.findByText(/no completed job to show/i),
    ).toBeInTheDocument();
  });

  it("resolves the dashboard route without a sign-in gate", async () => {
    await renderRoute("/dashboard");

    expect(
      await screen.findByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();
  });

  it("resolves the admin route", async () => {
    await renderRoute("/admin");

    expect(
      await screen.findByRole("heading", { name: "Admin Login" }),
    ).toBeInTheDocument();
  });

  it("navigates from home to upload through the Start Printing button", async () => {
    await renderRoute("/home");

    // The sidebar and both home CTAs all point at /upload; assert the hero CTA.
    const heroCta = document.querySelector(
      '[data-ocid="home.start_printing_button"]',
    );
    expect(heroCta).not.toBeNull();
    expect(heroCta).toHaveAttribute("href", "/upload");

    await router.navigate({ to: "/upload" });

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/upload");
    });
    expect(
      await screen.findByRole("heading", { name: /upload your document/i }),
    ).toBeInTheDocument();
  });
});
