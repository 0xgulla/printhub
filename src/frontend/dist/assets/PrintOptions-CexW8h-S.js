import { c as createLucideIcon, u as useToast, b as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Button, a as cn } from "./index-CtAioZuW.js";
import { E as EmptyState, C as ColorMode, P as PaperSize, a as PageSelection, b as formatPrice } from "./format-BiF1mUyr.js";
import { u as usePrintFlow, P as PageStepper, a as PRINT_FLOW_STEPS, t as toPrintOptions } from "./printFlow-SIiwCbna.js";
import { E as Eye, L as LoaderCircle, P as PdfPreviewModal } from "./PdfPreviewModal-REr9djem.js";
import { C as Card, a as CardContent } from "./card-M7tpU3-l.js";
import { L as Label, I as Input } from "./label-E7V8byIz.js";
import { u as useBackend } from "./useBackend-ByTn_rus.js";
import { u as useMutation } from "./useMutation-DbEk_fzC.js";
import { F as FileText } from "./file-text-CEaOecWc.js";
import { S as Sparkles } from "./sparkles-DEBoEduX.js";
import "./Modal-BIi-jFyp.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
const PAPER_SIZES = [PaperSize.A4, PaperSize.A3];
const COLOR_MODES = [
  { value: ColorMode.BlackAndWhite, label: "Black & White" },
  { value: ColorMode.Color, label: "Color" }
];
function localEstimate(pageCount, draft) {
  const printable = Math.max(0, pageCount - draft.excludedBlankPages.length);
  const perPage = draft.colorMode === ColorMode.Color ? 5 : 1;
  const paperMultiplier = draft.paperSize === PaperSize.A3 ? 2 : 1;
  return BigInt(printable * perPage * paperMultiplier * draft.copies);
}
function PrintOptionsPage() {
  const { actor, isReady } = useBackend();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = reactExports.useState(false);
  const file = usePrintFlow((state) => state.file);
  const localFile = usePrintFlow((state) => state.localFile);
  const analysis = usePrintFlow((state) => state.analysis);
  const options = usePrintFlow((state) => state.options);
  const price = usePrintFlow((state) => state.price);
  const setOptions = usePrintFlow((state) => state.setOptions);
  const setPrice = usePrintFlow((state) => state.setPrice);
  const setJob = usePrintFlow((state) => state.setJob);
  const blankPages = analysis ? analysis.blankPages.map((page) => Number(page)) : [];
  const hasBlankSuggestion = blankPages.length > 0 && options.excludedBlankPages.length === 0;
  const priceMutation = useMutation({
    mutationFn: async (draft) => {
      if (!actor || !file) throw new Error("Backend is not ready");
      return actor.estimatePrice(file.pageCount, toPrintOptions(draft));
    },
    onSuccess: (value) => setPrice(value),
    onError: () => {
      if (file) setPrice(localEstimate(Number(file.pageCount), options));
    }
  });
  const { mutate: estimate } = priceMutation;
  reactExports.useEffect(() => {
    if (!isReady || !file) return;
    estimate(options);
  }, [isReady, file, options, estimate]);
  const startMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !file) throw new Error("Backend is not ready");
      return actor.createJob(file.id, toPrintOptions(options));
    },
    onSuccess: (job) => {
      setJob(job);
      toast("Printing started", {
        description: `Job ${job.jobRef} was sent to the PrintHub device.`,
        tone: "success"
      });
      void navigate({ to: "/printing" });
    },
    onError: (error) => {
      toast("Could not start printing", {
        description: error.message,
        tone: "error"
      });
    }
  });
  const estimateFailed = priceMutation.isError;
  const isEstimating = priceMutation.isPending;
  const effectivePrice = price ?? (file ? localEstimate(Number(file.pageCount), options) : null);
  const canContinue = !!file && effectivePrice !== null;
  const excludeAllBlank = () => {
    setOptions({ excludedBlankPages: blankPages });
    toast("Blank pages excluded", {
      description: `${blankPages.length} page${blankPages.length === 1 ? "" : "s"} removed from this job.`,
      tone: "success"
    });
  };
  if (!file) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-4 py-16 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: FileText,
        title: "No document to configure",
        message: "Upload a document first, then choose your paper size, colour, and copies.",
        actionLabel: "Upload a document",
        onAction: () => void navigate({ to: "/upload" }),
        ocid: "options.empty_state"
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-gradient-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-10 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight text-foreground", children: "Customize printing" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Configure how your document should be printed." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 rounded-lg border border-border bg-card p-6 shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PageStepper, { current: 2, steps: PRINT_FLOW_STEPS }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.6fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-lg border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5", "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-medium text-foreground", children: file.fileName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 font-mono text-xs text-muted-foreground", children: [
              Number(file.pageCount),
              " page",
              Number(file.pageCount) === 1 ? "" : "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: () => setPreviewOpen(true),
              "data-ocid": "options.preview_button",
              className: "shrink-0 rounded-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4", "aria-hidden": "true" }),
                "Preview"
              ]
            }
          )
        ] }) }),
        hasBlankSuggestion ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "options.ai_suggestion_banner",
            className: "flex flex-col gap-3 rounded-lg border border-accent/50 bg-accent/10 p-4 sm:flex-row sm:items-center sm:justify-between",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Sparkles,
                  {
                    className: "mt-0.5 h-4 w-4 shrink-0 text-accent",
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground", children: [
                  "AI detected ",
                  blankPages.length,
                  " blank page",
                  blankPages.length === 1 ? "" : "s",
                  ". Exclude them to save paper and lower the price."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  onClick: excludeAllBlank,
                  "data-ocid": "options.exclude_blank_button",
                  className: "shrink-0 rounded-full transition-smooth",
                  children: "Exclude blank pages"
                }
              )
            ]
          }
        ) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-lg border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Colour mode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-col gap-3 sm:flex-row", children: COLOR_MODES.map((mode) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setOptions({ colorMode: mode.value }),
                "aria-pressed": options.colorMode === mode.value,
                "data-ocid": `options.color_mode.${mode.value.toLowerCase()}`,
                className: cn(
                  "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-smooth",
                  options.colorMode === mode.value ? "border-primary bg-secondary text-primary shadow-ring-primary" : "border-border bg-card text-foreground hover:border-primary/40"
                ),
                children: mode.label
              },
              mode.value
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "copies", className: "text-sm font-medium", children: "Copies" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "icon",
                  "aria-label": "Decrease copies",
                  disabled: options.copies <= 1,
                  onClick: () => setOptions({ copies: Math.max(1, options.copies - 1) }),
                  "data-ocid": "options.copies_decrease_button",
                  className: "rounded-full",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4", "aria-hidden": "true" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "copies",
                  type: "number",
                  min: 1,
                  max: 99,
                  value: options.copies,
                  onChange: (event) => {
                    const next = Number(event.target.value);
                    setOptions({
                      copies: Number.isFinite(next) ? Math.min(99, Math.max(1, Math.floor(next))) : 1
                    });
                  },
                  "data-ocid": "options.copies_input",
                  className: "h-10 w-20 text-center font-mono"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "icon",
                  "aria-label": "Increase copies",
                  disabled: options.copies >= 99,
                  onClick: () => setOptions({ copies: Math.min(99, options.copies + 1) }),
                  "data-ocid": "options.copies_increase_button",
                  className: "rounded-full",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4", "aria-hidden": "true" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Paper size" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex gap-3", children: PAPER_SIZES.map((size) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setOptions({ paperSize: size }),
                "aria-pressed": options.paperSize === size,
                "data-ocid": `options.paper_size.${size.toLowerCase()}`,
                className: cn(
                  "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-smooth",
                  options.paperSize === size ? "border-primary bg-secondary text-primary shadow-ring-primary" : "border-border bg-card text-foreground hover:border-primary/40"
                ),
                children: size
              },
              size
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Pages" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex gap-3", children: [
              { value: PageSelection.All, label: "All Pages" },
              { value: PageSelection.Custom, label: "Custom Range" }
            ].map((mode) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setOptions({ pageSelection: mode.value }),
                "aria-pressed": options.pageSelection === mode.value,
                "data-ocid": `options.page_range.${mode.value.toLowerCase()}`,
                className: cn(
                  "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-smooth",
                  options.pageSelection === mode.value ? "border-primary bg-secondary text-primary shadow-ring-primary" : "border-border bg-card text-foreground hover:border-primary/40"
                ),
                children: mode.label
              },
              mode.value
            )) }),
            options.pageSelection === PageSelection.Custom ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: options.customRange,
                onChange: (event) => setOptions({ customRange: event.target.value }),
                placeholder: "e.g. 1-5, 8-10",
                "aria-label": "Custom page range",
                "data-ocid": "options.custom_range_input",
                className: "mt-3 font-mono"
              }
            ) : null
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-lg border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground", children: "Estimated price" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              "data-ocid": "options.price_display",
              className: "mt-4 font-display text-4xl font-bold text-foreground",
              children: isEstimating && price === null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 text-2xl text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  LoaderCircle,
                  {
                    className: "h-5 w-5 animate-spin",
                    "aria-hidden": "true"
                  }
                ),
                "Calculating…"
              ] }) : effectivePrice !== null ? formatPrice(effectivePrice) : "—"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Updates live from pages, colour, copies, and paper size." }),
          estimateFailed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "options.price_error_state",
              className: "mt-4 flex flex-col gap-3 rounded-lg border border-accent/50 bg-accent/10 p-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-2 text-xs text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CircleAlert,
                    {
                      className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-accent",
                      "aria-hidden": "true"
                    }
                  ),
                  "Live estimate unavailable — showing an offline estimate. You can still continue."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: () => estimate(options),
                    "data-ocid": "options.retry_estimate_button",
                    className: "self-start rounded-full transition-smooth",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5", "aria-hidden": "true" }),
                      "Retry estimate"
                    ]
                  }
                )
              ]
            }
          ) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-5 space-y-3 border-t border-border pt-5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Device" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "min-w-0 truncate text-right font-medium text-foreground", children: "PrintHub Portable" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Excluded pages" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono text-foreground", children: options.excludedBlankPages.length })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "lg",
            disabled: !canContinue || startMutation.isPending,
            onClick: () => startMutation.mutate(),
            "data-ocid": "options.continue_button",
            className: "w-full rounded-full transition-smooth",
            children: startMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin", "aria-hidden": "true" }),
              "Starting printing…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "Continue to Printing",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "Your document is sent straight to the PrintHub device — no payment step." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PdfPreviewModal,
      {
        open: previewOpen,
        onOpenChange: setPreviewOpen,
        file: localFile,
        fileName: file.fileName,
        pageCount: Number(file.pageCount)
      }
    )
  ] });
}
export {
  PrintOptionsPage
};
