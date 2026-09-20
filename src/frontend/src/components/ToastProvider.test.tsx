import { ToastProvider, useToast } from "@/components/ToastProvider";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

function Trigger({
  title,
  description,
  tone,
}: {
  title: string;
  description?: string;
  tone?: "success" | "error" | "info" | "warning";
}) {
  const { toast } = useToast();
  return (
    <button type="button" onClick={() => toast(title, { description, tone })}>
      Fire toast
    </button>
  );
}

/**
 * Characterization of the shared notification primitive that must survive the
 * workflow rework: uploads, printing, and completion all report through it.
 */
describe("ToastProvider", () => {
  it("renders a toast with its title and description", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger
          title="Upload complete"
          description="assignment.pdf is ready."
        />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: /fire toast/i }));

    expect(screen.getByText("Upload complete")).toBeInTheDocument();
    expect(screen.getByText("assignment.pdf is ready.")).toBeInTheDocument();
  });

  it("stacks multiple toasts and dismisses one without clearing the rest", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger title="First" />
        <Trigger title="Second" />
      </ToastProvider>,
    );

    const buttons = screen.getAllByRole("button", { name: /fire toast/i });
    await user.click(buttons[0]);
    await user.click(buttons[1]);

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();

    const dismissButtons = screen.getAllByRole("button", {
      name: /dismiss notification/i,
    });
    await user.click(dismissButtons[0]);

    expect(screen.queryByText("First")).not.toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("exposes an aria-live region for assistive technology", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger title="Announced" />
      </ToastProvider>,
    );

    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();

    await user.click(screen.getByRole("button", { name: /fire toast/i }));

    expect(liveRegion).toHaveTextContent("Announced");
  });
});
