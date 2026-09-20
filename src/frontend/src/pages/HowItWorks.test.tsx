import { HowItWorksPage } from "@/pages/HowItWorks";
import { renderWithProviders } from "@/test/test-utils";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("HowItWorksPage", () => {
  it("renders the heading and the five PDF-only workflow steps", async () => {
    await renderWithProviders(<HowItWorksPage />, { path: "/how-it-works" });

    expect(
      screen.getByRole("heading", { name: "How It Works" }),
    ).toBeInTheDocument();

    for (const title of [
      "Upload PDF",
      "AI Analysis",
      "Remove Blank Pages",
      "Customize Printing",
      "Printing & Completed",
    ]) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("describes a PDF-only flow with no printer or payment references", async () => {
    await renderWithProviders(<HowItWorksPage />, { path: "/how-it-works" });

    const body = document.body.textContent ?? "";
    expect(body).not.toMatch(/find a printer/i);
    expect(body).not.toMatch(/select a printer/i);
    expect(body).not.toMatch(/choose a printer/i);
    expect(body).not.toMatch(/payment/i);
    expect(body).not.toMatch(/pricing/i);
  });

  it("sends both calls to action straight to the upload page", async () => {
    await renderWithProviders(<HowItWorksPage />, {
      path: "/how-it-works",
      routes: ["/upload"],
    });

    const upload = screen.getByRole("link", { name: /upload & print/i });
    const start = screen.getByRole("link", { name: /start printing/i });
    expect(upload).toHaveAttribute("href", "/upload");
    expect(start).toHaveAttribute("href", "/upload");
  });

  it("navigates to upload when the primary call to action is clicked", async () => {
    const user = userEvent.setup();
    const { router } = await renderWithProviders(<HowItWorksPage />, {
      path: "/how-it-works",
      routes: ["/upload"],
    });

    await user.click(screen.getByRole("link", { name: /upload & print/i }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/upload");
    });
  });

  it("numbers the steps one through five in order", async () => {
    await renderWithProviders(<HowItWorksPage />, { path: "/how-it-works" });

    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(5);
    for (const [index, item] of items.entries()) {
      const label = String(index + 1).padStart(2, "0");
      expect(within(item).getByText(label)).toBeInTheDocument();
    }
  });
});
