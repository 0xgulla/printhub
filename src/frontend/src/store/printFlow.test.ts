import { ColorMode, PageSelection, PaperSize } from "@/backend";
import {
  defaultPrintOptions,
  toPrintOptions,
  usePrintFlow,
} from "@/store/printFlow";
import { makeFile, makeJob } from "@/test/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

describe("printFlow store", () => {
  beforeEach(() => {
    usePrintFlow.getState().resetFlow();
  });

  it("converts the local options draft into the backend PrintOptions shape", () => {
    const options = toPrintOptions({
      ...defaultPrintOptions,
      paperSize: PaperSize.A3,
      colorMode: ColorMode.Color,
      copies: 3,
      pageSelection: PageSelection.Custom,
      customRange: "1-5",
      excludedBlankPages: [2, 4],
    });

    expect(options.paperSize).toBe(PaperSize.A3);
    expect(options.colorMode).toBe(ColorMode.Color);
    expect(options.copies).toBe(3n);
    expect(options.pageSelection).toBe(PageSelection.Custom);
    expect(options.customRange).toBe("1-5");
    expect(options.excludedBlankPages).toEqual([2n, 4n]);
  });

  it("omits an empty custom range rather than sending an empty string", () => {
    const options = toPrintOptions({ ...defaultPrintOptions, customRange: "" });
    expect(options.customRange).toBeUndefined();
  });

  it("merges partial option updates without dropping the other fields", () => {
    usePrintFlow.getState().setOptions({ copies: 5 });
    usePrintFlow.getState().setOptions({ colorMode: ColorMode.Color });

    const { options } = usePrintFlow.getState();
    expect(options.copies).toBe(5);
    expect(options.colorMode).toBe(ColorMode.Color);
    expect(options.paperSize).toBe(defaultPrintOptions.paperSize);
  });

  it("clears every step of the flow on reset", () => {
    const store = usePrintFlow.getState();
    store.setFile(makeFile());
    store.setAnalysis({
      fileId: 1n,
      totalPages: 10n,
      contentPageCount: 8n,
      blankPages: [],
      nearlyBlankPages: [],
      lowContentPages: [],
      colorPages: [],
      issueNotes: [],
      analyzedAt: 1_700_000_000_000_000_000n,
    });
    store.setOptions({ copies: 4 });
    store.setPrice(120n);
    store.setJob(makeJob());

    usePrintFlow.getState().resetFlow();

    const state = usePrintFlow.getState();
    expect(state.file).toBeNull();
    expect(state.localFile).toBeNull();
    expect(state.analysis).toBeNull();
    expect(state.price).toBeNull();
    expect(state.job).toBeNull();
    expect(state.options).toEqual(defaultPrintOptions);
  });
});
