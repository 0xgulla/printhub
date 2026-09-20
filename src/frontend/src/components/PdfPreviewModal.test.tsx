import { PdfPreviewModal } from "@/components/PdfPreviewModal";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

function pdfFile(): File {
  return new File(["%PDF-1.4 content"], "assignment.pdf", {
    type: "application/pdf",
  });
}

describe("PdfPreviewModal", () => {
  it("shows the document name and page position", () => {
    render(
      <PdfPreviewModal
        open
        onOpenChange={vi.fn()}
        file={pdfFile()}
        fileName="assignment.pdf"
        pageCount={5}
      />,
    );

    expect(screen.getByText("assignment.pdf")).toBeInTheDocument();
    expect(screen.getByText("Page 1 / 5")).toBeInTheDocument();
  });

  it("navigates between pages with the previous and next controls", async () => {
    const user = userEvent.setup();
    render(
      <PdfPreviewModal
        open
        onOpenChange={vi.fn()}
        file={pdfFile()}
        fileName="assignment.pdf"
        pageCount={5}
      />,
    );

    const prev = screen.getByRole("button", { name: /previous page/i });
    const next = screen.getByRole("button", { name: /next page/i });
    expect(prev).toBeDisabled();

    await user.click(next);
    expect(screen.getByText("Page 2 / 5")).toBeInTheDocument();

    await user.click(prev);
    expect(screen.getByText("Page 1 / 5")).toBeInTheDocument();
  });

  it("zooms in and out within the allowed range", async () => {
    const user = userEvent.setup();
    render(
      <PdfPreviewModal
        open
        onOpenChange={vi.fn()}
        file={pdfFile()}
        fileName="assignment.pdf"
        pageCount={5}
      />,
    );

    expect(screen.getByText("100%")).toBeInTheDocument();
    const zoomOut = screen.getByRole("button", { name: /zoom out/i });
    const zoomIn = screen.getByRole("button", { name: /zoom in/i });

    await user.click(zoomIn);
    expect(screen.getByText("125%")).toBeInTheDocument();

    await user.click(zoomOut);
    expect(screen.getByText("100%")).toBeInTheDocument();

    // 75% is the lowest step, so zoom-out disables there.
    await user.click(zoomOut);
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(zoomOut).toBeDisabled();
  });

  it("explains when a format cannot be previewed", () => {
    render(
      <PdfPreviewModal
        open
        onOpenChange={vi.fn()}
        file={
          new File(["doc"], "notes.docx", {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          })
        }
        fileName="notes.docx"
        pageCount={3}
      />,
    );

    expect(
      screen.getByText(/preview unavailable for this format/i),
    ).toBeInTheDocument();
  });
});
