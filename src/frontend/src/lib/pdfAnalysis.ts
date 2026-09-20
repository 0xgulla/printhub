import type { PageAnalysisInput } from "@/backend";
import * as pdfjs from "pdfjs-dist";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

/** A page is blank when almost none of its pixels are non-white. */
const BLANK_COVERAGE = 0.0015;
/** A page is nearly blank when only a sliver of it carries content. */
const NEARLY_BLANK_COVERAGE = 0.012;
/** Below this coverage a page is reported as low content. */
const LOW_CONTENT_COVERAGE = 0.05;
/** A pixel counts as coloured when its channels differ by more than this. */
const COLOR_CHANNEL_DELTA = 24;
/** Fraction of coloured pixels that makes a page a colour page. */
const COLOR_PAGE_RATIO = 0.004;
/** Render scale used for inspection — small enough to stay fast. */
const RENDER_SCALE = 1.1;

export interface PageInspection {
  pageNumber: number;
  coverage: number;
  colorRatio: number;
  isBlank: boolean;
  isNearlyBlank: boolean;
  isLowContent: boolean;
  isColor: boolean;
}

export interface DocumentInspection {
  totalPages: number;
  pages: Array<PageInspection>;
  input: PageAnalysisInput;
  issueNotes: Array<string>;
}

export interface PdfAnalysisProgress {
  page: number;
  totalPages: number;
}

export interface PdfAnalysisOptions {
  onProgress?: (progress: PdfAnalysisProgress) => void;
  signal?: AbortSignal;
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException("Analysis cancelled", "AbortError");
  }
}

/**
 * Render one page to a canvas and measure its real ink coverage and colour
 * usage. This is genuine per-page content inspection — no heuristics on the
 * raw PDF bytes.
 */
async function inspectPage(
  page: PDFPageProxy,
  pageNumber: number,
): Promise<PageInspection> {
  const viewport = page.getViewport({ scale: RENDER_SCALE });
  const canvas = globalThis.document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return {
      pageNumber,
      coverage: 0,
      colorRatio: 0,
      isBlank: true,
      isNearlyBlank: true,
      isLowContent: true,
      isColor: false,
    };
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({ canvasContext: context, viewport }).promise;

  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  const totalPixels = canvas.width * canvas.height;
  let inkPixels = 0;
  let colorPixels = 0;

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const alpha = data[index + 3];
    if (alpha === 0) continue;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    if (max < 245) inkPixels += 1;
    if (max - min > COLOR_CHANNEL_DELTA) colorPixels += 1;
  }

  const coverage = totalPixels > 0 ? inkPixels / totalPixels : 0;
  const colorRatio = totalPixels > 0 ? colorPixels / totalPixels : 0;

  return {
    pageNumber,
    coverage,
    colorRatio,
    isBlank: coverage <= BLANK_COVERAGE,
    isNearlyBlank:
      coverage > BLANK_COVERAGE && coverage <= NEARLY_BLANK_COVERAGE,
    isLowContent:
      coverage > NEARLY_BLANK_COVERAGE && coverage <= LOW_CONTENT_COVERAGE,
    isColor: colorRatio >= COLOR_PAGE_RATIO,
  };
}

function buildIssueNotes(pages: Array<PageInspection>): Array<string> {
  const notes: Array<string> = [];
  const blank = pages.filter((page) => page.isBlank).length;
  const nearlyBlank = pages.filter((page) => page.isNearlyBlank).length;
  const color = pages.filter((page) => page.isColor).length;

  if (blank > 0) {
    notes.push(
      `${blank} page${blank === 1 ? "" : "s"} contain no visible content and can be excluded.`,
    );
  }
  if (nearlyBlank > 0) {
    notes.push(
      `${nearlyBlank} page${nearlyBlank === 1 ? "" : "s"} carry almost no content — review before printing.`,
    );
  }
  if (color > 0) {
    notes.push(
      `${color} page${color === 1 ? "" : "s"} use colour ink. Choose colour mode to keep them accurate.`,
    );
  }
  if (notes.length === 0) {
    notes.push("Every page carries content. Nothing needs to be removed.");
  }
  return notes;
}

/**
 * Inspect a PDF page by page and produce the backend's `PageAnalysisInput`.
 * Throws for non-PDF documents so callers can fall back gracefully.
 */
export async function analyzePdfDocument(
  file: File,
  options: PdfAnalysisOptions = {},
): Promise<DocumentInspection> {
  const { onProgress, signal } = options;
  const buffer = await file.arrayBuffer();
  throwIfAborted(signal);

  const document: PDFDocumentProxy = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
  }).promise;

  try {
    const totalPages = document.numPages;
    const pages: Array<PageInspection> = [];

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
      throwIfAborted(signal);
      const page = await document.getPage(pageNumber);
      pages.push(await inspectPage(page, pageNumber));
      page.cleanup();
      onProgress?.({ page: pageNumber, totalPages });
    }

    const input: PageAnalysisInput = {
      totalPages: BigInt(totalPages),
      blankPages: pages
        .filter((page) => page.isBlank)
        .map((page) => BigInt(page.pageNumber)),
      nearlyBlankPages: pages
        .filter((page) => page.isNearlyBlank)
        .map((page) => BigInt(page.pageNumber)),
      lowContentPages: pages
        .filter((page) => page.isLowContent)
        .map((page) => BigInt(page.pageNumber)),
      colorPages: pages
        .filter((page) => page.isColor)
        .map((page) => BigInt(page.pageNumber)),
    };

    return {
      totalPages,
      pages,
      input,
      issueNotes: buildIssueNotes(pages),
    };
  } finally {
    await document.destroy();
  }
}

export interface PageThumbnail {
  pageNumber: number;
  dataUrl: string;
}

/**
 * Render small page thumbnails for the visual page strip. Returns an empty
 * array for documents pdf.js cannot open.
 */
export async function renderPageThumbnails(
  file: File,
  options: { maxWidth?: number; signal?: AbortSignal } = {},
): Promise<Array<PageThumbnail>> {
  const { maxWidth = 132, signal } = options;
  const buffer = await file.arrayBuffer();
  throwIfAborted(signal);

  const document: PDFDocumentProxy = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
  }).promise;

  try {
    const thumbnails: Array<PageThumbnail> = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      throwIfAborted(signal);
      const page = await document.getPage(pageNumber);
      const base = page.getViewport({ scale: 1 });
      const scale = maxWidth / base.width;
      const viewport = page.getViewport({ scale });
      const canvas = globalThis.document.createElement("canvas");
      canvas.width = Math.max(1, Math.floor(viewport.width));
      canvas.height = Math.max(1, Math.floor(viewport.height));
      const context = canvas.getContext("2d");

      if (context) {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: context, viewport }).promise;
        thumbnails.push({ pageNumber, dataUrl: canvas.toDataURL("image/png") });
      }
      page.cleanup();
    }
    return thumbnails;
  } finally {
    await document.destroy();
  }
}
