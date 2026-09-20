import { Sidebar, SidebarNav } from "@/components/layout/Sidebar";
import { renderWithProviders } from "@/test/test-utils";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Sidebar", () => {
  it("renders the PrintHub logo and the four primary destinations", async () => {
    await renderWithProviders(<Sidebar />, { path: "/home" });

    expect(
      screen.getByRole("link", { name: /printhub home/i }),
    ).toBeInTheDocument();

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
  });

  it("keeps Admin Login separated at the bottom, outside the primary nav", async () => {
    await renderWithProviders(<Sidebar />, { path: "/home" });

    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    expect(
      within(nav).queryByRole("link", { name: /admin login/i }),
    ).not.toBeInTheDocument();

    const adminLink = screen.getByRole("link", { name: /admin login/i });
    expect(adminLink).toHaveAttribute("href", "/admin");
  });

  it("marks the current route as active and leaves the others inactive", async () => {
    await renderWithProviders(<Sidebar />, { path: "/dashboard" });

    const dashboard = screen.getByRole("link", { name: "Dashboard" });
    expect(dashboard).toHaveAttribute("aria-current", "page");

    const home = screen.getByRole("link", { name: "Home" });
    expect(home).not.toHaveAttribute("aria-current");
  });

  it("treats the root path as the Home destination", async () => {
    await renderWithProviders(<Sidebar />, { path: "/" });

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("navigates to the upload page when Start Printing is clicked", async () => {
    const user = userEvent.setup();
    const { router } = await renderWithProviders(<Sidebar />, {
      path: "/home",
      routes: ["/upload"],
    });

    await user.click(screen.getByRole("link", { name: "Start Printing" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/upload");
    });
  });

  it("renders the same destinations in the mobile navigation", async () => {
    await renderWithProviders(<SidebarNav />, { path: "/home" });

    const nav = screen.getByRole("navigation", { name: /mobile navigation/i });
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
    expect(
      screen.getByRole("link", { name: /admin login/i }),
    ).toBeInTheDocument();
  });
});
