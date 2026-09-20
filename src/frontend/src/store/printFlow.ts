import {
  type AnalysisResultView,
  ColorMode,
  PageSelection,
  PaperSize,
  type PrintJobView,
  type PrintOptions,
  type UploadedFileView,
} from "@/backend";
import { create } from "zustand";

export interface PrintOptionsDraft {
  paperSize: PaperSize;
  colorMode: ColorMode;
  copies: number;
  pageSelection: PageSelection;
  customRange: string;
  excludedBlankPages: Array<number>;
}

export const defaultPrintOptions: PrintOptionsDraft = {
  paperSize: PaperSize.A4,
  colorMode: ColorMode.BlackAndWhite,
  copies: 1,
  pageSelection: PageSelection.All,
  customRange: "",
  excludedBlankPages: [],
};

/** Convert the local draft into the backend's PrintOptions shape. */
export function toPrintOptions(draft: PrintOptionsDraft): PrintOptions {
  return {
    paperSize: draft.paperSize,
    colorMode: draft.colorMode,
    copies: BigInt(draft.copies),
    pageSelection: draft.pageSelection,
    customRange: draft.customRange || undefined,
    excludedBlankPages: draft.excludedBlankPages.map((page) => BigInt(page)),
  };
}

interface PrintFlowState {
  file: UploadedFileView | null;
  /** The client-side File for preview; never sent to the backend. */
  localFile: File | null;
  analysis: AnalysisResultView | null;
  options: PrintOptionsDraft;
  price: bigint | null;
  job: PrintJobView | null;
  setFile: (file: UploadedFileView | null) => void;
  setLocalFile: (file: File | null) => void;
  setAnalysis: (analysis: AnalysisResultView | null) => void;
  setOptions: (options: Partial<PrintOptionsDraft>) => void;
  setPrice: (price: bigint | null) => void;
  setJob: (job: PrintJobView | null) => void;
  resetFlow: () => void;
}

export const usePrintFlow = create<PrintFlowState>((set) => ({
  file: null,
  localFile: null,
  analysis: null,
  options: defaultPrintOptions,
  price: null,
  job: null,
  setFile: (file) => set({ file }),
  setLocalFile: (localFile) => set({ localFile }),
  setAnalysis: (analysis) => set({ analysis }),
  setOptions: (options) =>
    set((state) => ({ options: { ...state.options, ...options } })),
  setPrice: (price) => set({ price }),
  setJob: (job) => set({ job }),
  resetFlow: () =>
    set({
      file: null,
      localFile: null,
      analysis: null,
      options: defaultPrintOptions,
      price: null,
      job: null,
    }),
}));
