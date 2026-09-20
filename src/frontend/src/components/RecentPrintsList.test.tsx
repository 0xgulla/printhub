import { JobStatus } from "@/backend";
import { RecentPrintsList } from "@/components/RecentPrintsList";
import { makeJob } from "@/test/test-utils";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("RecentPrintsList", () => {
  it("renders a loading state while jobs are in flight", () => {
    render(<RecentPrintsList jobs={[]} isLoading onStartPrinting={vi.fn()} />);

    expect(
      document.querySelector('[data-ocid="dashboard.jobs_loading_state"]'),
    ).not.toBeNull();
  });

  it("renders an error state with a retry action", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(
      <RecentPrintsList
        jobs={[]}
        isLoading={false}
        isError
        onStartPrinting={vi.fn()}
        onRetry={onRetry}
      />,
    );

    expect(
      screen.getByText(/we couldn't load your print history/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders an empty state that starts a new print", async () => {
    const onStartPrinting = vi.fn();
    const user = userEvent.setup();
    render(
      <RecentPrintsList
        jobs={[]}
        isLoading={false}
        onStartPrinting={onStartPrinting}
      />,
    );

    expect(screen.getByText(/no prints yet/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /start printing/i }));
    expect(onStartPrinting).toHaveBeenCalledTimes(1);
  });

  it("lists jobs with their file, page count, price, and status", () => {
    render(
      <RecentPrintsList
        jobs={[
          makeJob({
            id: 5n,
            jobRef: "JOB-1001",
            fileName: "assignment.pdf",
            status: JobStatus.Completed,
            pageCount: 10n,
            estimatedPrice: 40n,
          }),
        ]}
        isLoading={false}
        onStartPrinting={vi.fn()}
      />,
    );

    expect(screen.getByText("assignment.pdf")).toBeInTheDocument();
    expect(screen.getByText(/10 pages/)).toBeInTheDocument();
    expect(screen.getByText("₹40")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("caps the visible jobs at the requested limit", () => {
    const jobs = Array.from({ length: 7 }, (_, index) =>
      makeJob({
        id: BigInt(index + 1),
        jobRef: `JOB-${1000 + index}`,
        fileName: `doc-${index + 1}.pdf`,
      }),
    );

    render(
      <RecentPrintsList
        jobs={jobs}
        isLoading={false}
        limit={3}
        onStartPrinting={vi.fn()}
      />,
    );

    expect(screen.getByText("doc-1.pdf")).toBeInTheDocument();
    expect(screen.getByText("doc-3.pdf")).toBeInTheDocument();
    expect(screen.queryByText("doc-4.pdf")).not.toBeInTheDocument();
  });
});
