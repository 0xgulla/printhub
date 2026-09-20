import { HomePage } from "@/pages/Home";
import { renderWithProviders } from "@/test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("HomePage", () => {
  it("renders the hero headline and primary calls to action", async () => {
    await renderWithProviders(<HomePage />, { path: "/" });

    expect(
      screen.getByRole("heading", { name: /print smarter/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /start printing/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: /see how it works/i }).length,
    ).toBeGreaterThan(0);
  });

  it("renders all four feature cards", async () => {
    await renderWithProviders(<HomePage />, { path: "/" });

    for (const title of [
      "Quick & Easy",
      "Secure Printing",
      "AI Paper Check",
      "Works With Any Printer",
    ]) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("renders the five-step how-it-works preview", async () => {
    await renderWithProviders(<HomePage />, { path: "/" });

    for (const label of [
      "Upload a PDF",
      "PrintHub AI Checks It",
      "The Device Sends It",
      "The Document Prints",
      "You Get the Document",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
});
