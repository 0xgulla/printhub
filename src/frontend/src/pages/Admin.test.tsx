import { AdminPage } from "@/pages/Admin";
import { coreMock, resetCoreMock } from "@/test/coreInfrastructureMock";
import { createMockActor, renderWithProviders } from "@/test/test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () =>
  import("@/test/coreInfrastructureMock").then((m) =>
    m.coreInfrastructureMock(),
  ),
);

describe("AdminPage", () => {
  beforeEach(() => {
    resetCoreMock();
  });

  it("renders the UI-only admin login form with no dashboard behind it", async () => {
    const actor = createMockActor();
    coreMock.actor = actor;

    await renderWithProviders(<AdminPage />, { path: "/admin" });

    expect(
      screen.getByRole("heading", { name: "Admin Login" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    // No real admin dashboard is reachable from this page.
    expect(screen.queryByText("Total Prints")).not.toBeInTheDocument();
    expect(screen.queryByText("Revenue")).not.toBeInTheDocument();
  });

  it("validates the fields locally without navigating anywhere", async () => {
    const actor = createMockActor();
    coreMock.actor = actor;
    const user = userEvent.setup();

    const { router } = await renderWithProviders(<AdminPage />, {
      path: "/admin",
    });

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/enter your admin username/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/enter your password/i)).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/admin");
  });

  it("confirms the demo sign-in without opening a dashboard", async () => {
    const actor = createMockActor();
    coreMock.actor = actor;
    const user = userEvent.setup();

    const { router } = await renderWithProviders(<AdminPage />, {
      path: "/admin",
    });

    await user.type(screen.getByLabelText("Username"), "admin");
    await user.type(screen.getByLabelText("Password"), "secret");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/admin authentication will be connected later/i),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/admin");
  });

  it("offers a back link to the dashboard", async () => {
    const actor = createMockActor();
    coreMock.actor = actor;

    await renderWithProviders(<AdminPage />, {
      path: "/admin",
      routes: ["/dashboard"],
    });

    expect(
      screen.getByRole("link", { name: /back to dashboard/i }),
    ).toHaveAttribute("href", "/dashboard");
  });
});
