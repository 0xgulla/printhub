import { TopNav } from "@/components/layout/TopNav";
import { coreMock, resetCoreMock } from "@/test/coreInfrastructureMock";
import { renderWithProviders } from "@/test/test-utils";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () =>
  import("@/test/coreInfrastructureMock").then((m) =>
    m.coreInfrastructureMock(),
  ),
);

describe("TopNav", () => {
  beforeEach(() => {
    resetCoreMock();
  });

  it("opens the mobile navigation sheet from the menu button", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<TopNav />, { path: "/" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /open navigation menu/i }),
    );

    const sheet = await screen.findByRole("dialog");
    const mobileNav = within(sheet).getByRole("navigation", {
      name: /mobile navigation/i,
    });
    for (const label of [
      "Home",
      "Start Printing",
      "How It Works",
      "Dashboard",
    ]) {
      expect(
        within(mobileNav).getByRole("link", { name: label }),
      ).toBeInTheDocument();
    }
  });

  it("closes the mobile sheet after choosing a destination", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<TopNav />, {
      path: "/",
      routes: ["/upload"],
    });

    await user.click(
      screen.getByRole("button", { name: /open navigation menu/i }),
    );
    const sheet = await screen.findByRole("dialog");

    await user.click(
      within(sheet).getByRole("link", { name: "Start Printing" }),
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("offers the admin login link without login or sign-up buttons", async () => {
    await renderWithProviders(<TopNav />, { path: "/" });

    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: /open navigation menu/i }));
    const sheet = await screen.findByRole("dialog");

    expect(
      within(sheet).getByRole("link", { name: /admin login/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^login$/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /sign up/i }),
    ).not.toBeInTheDocument();
  });
});
