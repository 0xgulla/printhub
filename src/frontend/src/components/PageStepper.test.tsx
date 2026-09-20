import { PRINT_FLOW_STEPS, PageStepper } from "@/components/PageStepper";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const STEPS = [
  { label: "Upload" },
  { label: "Options" },
  { label: "Payment" },
  { label: "Confirm" },
];

describe("PageStepper", () => {
  it("renders every step label", () => {
    render(<PageStepper steps={STEPS} current={0} />);

    for (const step of STEPS) {
      expect(screen.getByText(step.label)).toBeInTheDocument();
    }
  });

  it("marks steps before the current one as complete with a check icon", () => {
    const { container } = render(<PageStepper steps={STEPS} current={2} />);

    // Two completed steps (indices 0 and 1) render a check svg instead of a number.
    const checks = container.querySelectorAll("svg.lucide-check");
    expect(checks).toHaveLength(2);
    // The current step (index 2) still shows its number.
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("exposes an accessible print-progress navigation landmark", () => {
    render(<PageStepper steps={STEPS} current={1} />);

    expect(
      screen.getByRole("navigation", { name: /print progress/i }),
    ).toBeInTheDocument();
  });

  it("defines the canonical five-step PrintHub flow with no payment step", () => {
    expect(PRINT_FLOW_STEPS.map((step) => step.label)).toEqual([
      "Upload",
      "AI Analysis",
      "Customize",
      "Printing",
      "Completed",
    ]);
  });

  it("renders the canonical flow labels and numbers them one through five", () => {
    render(<PageStepper steps={PRINT_FLOW_STEPS} current={0} />);

    for (const label of [
      "Upload",
      "AI Analysis",
      "Customize",
      "Printing",
      "Completed",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    for (const number of ["1", "2", "3", "4", "5"]) {
      expect(screen.getByText(number)).toBeInTheDocument();
    }
    expect(screen.queryByText(/payment/i)).not.toBeInTheDocument();
  });
});
