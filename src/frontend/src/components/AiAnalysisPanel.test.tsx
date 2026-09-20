import { AiAnalysisPanel } from "@/components/AiAnalysisPanel";
import { makeAnalysis } from "@/test/test-utils";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

/**
 * Characterization of the AI analysis *display* contract that must survive the
 * workflow rework. The analysis source is intentionally changing (deterministic
 * simulation -> real per-page PDF inspection), but the panel that renders the
 * result — page counts, blank-page exclusion toggles, and the flagged-page
 * sections — is preserved behavior.
 */
describe("AiAnalysisPanel", () => {
  it("renders the total, blank, colour, and black-and-white page counts", () => {
    render(
      <AiAnalysisPanel
        analysis={makeAnalysis({
          totalPages: 10n,
          contentPageCount: 8n,
          blankPages: [3n, 7n],
          colorPages: [1n, 4n, 6n],
        })}
        isAnalyzing={false}
        thumbnails={[]}
        thumbnailsLoading={false}
        excludedPages={[]}
        onTogglePage={vi.fn()}
        onSelectAll={vi.fn()}
      />,
    );

    expect(screen.getByText("AI Analysis Complete")).toBeInTheDocument();
    expect(screen.getByText("Total Pages")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Blank Pages")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Color Pages")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Black & White")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText(/2 blank pages detected/i)).toBeInTheDocument();
  });

  it("toggles a blank page through the callback and reflects the excluded state", async () => {
    const onTogglePage = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <AiAnalysisPanel
        analysis={makeAnalysis({ blankPages: [3n, 7n] })}
        isAnalyzing={false}
        thumbnails={[]}
        thumbnailsLoading={false}
        excludedPages={[]}
        onTogglePage={onTogglePage}
        onSelectAll={vi.fn()}
      />,
    );

    const page3 = screen.getByRole("button", { name: /page 3/i });
    expect(page3).toHaveAttribute("aria-pressed", "false");

    await user.click(page3);
    expect(onTogglePage).toHaveBeenCalledWith(3);

    rerender(
      <AiAnalysisPanel
        analysis={makeAnalysis({ blankPages: [3n, 7n] })}
        isAnalyzing={false}
        thumbnails={[]}
        thumbnailsLoading={false}
        excludedPages={[3]}
        onTogglePage={onTogglePage}
        onSelectAll={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /excluded 3/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("offers Select all until every flagged page is excluded, then Clear all", async () => {
    const onSelectAll = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <AiAnalysisPanel
        analysis={makeAnalysis({ blankPages: [3n, 7n] })}
        isAnalyzing={false}
        thumbnails={[]}
        thumbnailsLoading={false}
        excludedPages={[]}
        onTogglePage={vi.fn()}
        onSelectAll={onSelectAll}
      />,
    );

    await user.click(screen.getByRole("button", { name: /select all/i }));
    expect(onSelectAll).toHaveBeenCalledTimes(1);

    rerender(
      <AiAnalysisPanel
        analysis={makeAnalysis({ blankPages: [3n, 7n] })}
        isAnalyzing={false}
        thumbnails={[]}
        thumbnailsLoading={false}
        excludedPages={[3, 7]}
        onTogglePage={vi.fn()}
        onSelectAll={onSelectAll}
      />,
    );
    expect(
      screen.getByRole("button", { name: /clear all/i }),
    ).toBeInTheDocument();
  });

  it("shows the no-blank state when no blank pages were detected", () => {
    render(
      <AiAnalysisPanel
        analysis={makeAnalysis({ blankPages: [] })}
        isAnalyzing={false}
        thumbnails={[]}
        thumbnailsLoading={false}
        excludedPages={[]}
        onTogglePage={vi.fn()}
        onSelectAll={vi.fn()}
      />,
    );

    expect(screen.getByText(/no blank pages detected/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /select all/i }),
    ).not.toBeInTheDocument();
  });

  it("lists nearly blank pages, low-content pages, and issue notes", () => {
    render(
      <AiAnalysisPanel
        analysis={makeAnalysis({
          blankPages: [],
          nearlyBlankPages: [2n, 9n],
          lowContentPages: [5n],
          issueNotes: ["Page 5 is mostly an image."],
        })}
        isAnalyzing={false}
        thumbnails={[]}
        thumbnailsLoading={false}
        excludedPages={[]}
        onTogglePage={vi.fn()}
        onSelectAll={vi.fn()}
      />,
    );

    expect(screen.getByText("Nearly blank pages")).toBeInTheDocument();
    expect(screen.getByText("2, 9")).toBeInTheDocument();
    expect(screen.getByText("Low-content pages")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Page 5 is mostly an image.")).toBeInTheDocument();
  });

  it("renders the analyzing state instead of results while analysis is in flight", () => {
    render(
      <AiAnalysisPanel
        analysis={null}
        isAnalyzing
        thumbnails={[]}
        thumbnailsLoading={false}
        excludedPages={[]}
        onTogglePage={vi.fn()}
        onSelectAll={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/printhub ai is checking your document/i),
    ).toBeInTheDocument();
    expect(screen.queryByText("AI Analysis Complete")).not.toBeInTheDocument();
  });

  it("renders nothing when there is no analysis and none is in flight", () => {
    const { container } = render(
      <AiAnalysisPanel
        analysis={null}
        isAnalyzing={false}
        thumbnails={[]}
        thumbnailsLoading={false}
        excludedPages={[]}
        onTogglePage={vi.fn()}
        onSelectAll={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
