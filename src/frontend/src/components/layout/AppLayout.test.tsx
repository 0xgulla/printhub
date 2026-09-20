import { AppLayout } from "@/components/layout/AppLayout";
import { coreMock, resetCoreMock } from "@/test/coreInfrastructureMock";
import { createTestQueryClient } from "@/test/test-utils";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () =>
  import("@/test/coreInfrastructureMock").then((m) =>
    m.coreInfrastructureMock(),
  ),
);

/**
 * Mount `AppLayout` as the root route with a child route so its `<Outlet />`
 * renders real content. `renderWithProviders` mounts the UI at the root route
 * itself, which would leave the outlet empty.
 */
async function renderLayout() {
  const rootRoute = createRootRoute({ component: AppLayout });
  const childRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/home",
    component: () => <p>Child page content</p>,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([childRoute]),
    history: createMemoryHistory({ initialEntries: ["/home"] }),
  });
  await router.load();

  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
}

describe("AppLayout", () => {
  beforeEach(() => {
    resetCoreMock();
  });

  it("composes the sidebar, mobile header, footer, and routed content", async () => {
    await renderLayout();

    expect(
      screen.getByRole("navigation", { name: /main navigation/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /open navigation menu/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Child page content")).toBeInTheDocument();
    expect(
      screen.getByText(/upload, print, and collect from the printhub device/i),
    ).toBeInTheDocument();
  });

  it("renders the sidebar navigation links around the routed page", async () => {
    await renderLayout();

    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    for (const label of [
      "Home",
      "Start Printing",
      "How It Works",
      "Dashboard",
    ]) {
      expect(
        within(nav).getByRole("link", { name: label }),
      ).toBeInTheDocument();
    }
    expect(nav).toBeInTheDocument();
  });
});
