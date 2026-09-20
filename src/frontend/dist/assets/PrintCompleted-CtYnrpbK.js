import { c as createLucideIcon, j as jsxRuntimeExports, B as Button, b as useNavigate, u as useToast, r as reactExports, P as Printer, L as Link } from "./index-CtAioZuW.js";
import { E as EmptyState, b as formatPrice, d as formatDateTime } from "./format-BiF1mUyr.js";
import { u as usePrintFlow, P as PageStepper, a as PRINT_FLOW_STEPS } from "./printFlow-SIiwCbna.js";
import { M as Modal } from "./Modal-BIi-jFyp.js";
import { C as Card, a as CardContent } from "./card-M7tpU3-l.js";
import { R as RotateCcw } from "./rotate-ccw-DhqkpFAy.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5.8 11.3 2 22l10.7-3.79", key: "gwxi1d" }],
  ["path", { d: "M4 3h.01", key: "1vcuye" }],
  ["path", { d: "M22 8h.01", key: "1mrtc2" }],
  ["path", { d: "M15 2h.01", key: "1cjtqr" }],
  ["path", { d: "M22 20h.01", key: "1mrys2" }],
  [
    "path",
    {
      d: "m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10",
      key: "hbicv8"
    }
  ],
  [
    "path",
    { d: "m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17", key: "1i94pl" }
  ],
  ["path", { d: "m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7", key: "1cofks" }],
  [
    "path",
    {
      d: "M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z",
      key: "4kbmks"
    }
  ]
];
const PartyPopper = createLucideIcon("party-popper", __iconNode);
function ThankYouPopup({ open, onOpenChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onOpenChange,
      title: "Thank you for using PrintHub",
      description: "We hope we made printing a little easier for you.",
      ocid: "completed.thank_you_modal",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-20 w-20 items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "absolute inset-0 animate-pulse-soft rounded-full bg-primary/15",
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "absolute inset-2 animate-pulse-soft rounded-full bg-primary/20",
              style: { animationDelay: "0.2s" },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PartyPopper,
            {
              className: "relative h-9 w-9 text-primary",
              "aria-hidden": "true"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex justify-center gap-1.5", "aria-hidden": "true", children: ["a", "b", "c", "d", "e"].map((key, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "h-2 w-2 animate-float rounded-full bg-primary/60",
            style: { animationDelay: `${index * 0.15}s` }
          },
          key
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-sm text-muted-foreground", children: "Your document is ready to collect. Print again any time — we will be right here." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            onClick: () => onOpenChange(false),
            "data-ocid": "completed.thank_you_close_button",
            className: "mt-6 w-full rounded-full transition-smooth sm:w-auto",
            children: "Done"
          }
        )
      ] })
    }
  );
}
function PrintCompletedPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const job = usePrintFlow((state) => state.job);
  const resetFlow = usePrintFlow((state) => state.resetFlow);
  const [thankYouOpen, setThankYouOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!job) return;
    const timer = setTimeout(() => setThankYouOpen(true), 900);
    return () => clearTimeout(timer);
  }, [job]);
  if (!job) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-4 py-16 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Printer,
        title: "No completed job to show",
        message: "Once a print job finishes, its completion summary will appear here.",
        actionLabel: "Start a print job",
        onAction: () => void navigate({ to: "/upload" }),
        ocid: "completed.empty_state"
      }
    ) });
  }
  const handleDownloadReceipt = () => {
    const lines = [
      "PrintHub — Print Receipt",
      "========================",
      `Job ID:      ${job.jobRef}`,
      `Document:    ${job.fileName}`,
      `Pages:       ${Number(job.printedPages)} / ${Number(job.pageCount)}`,
      `Paper size:  ${job.options.paperSize}`,
      `Colour mode: ${job.options.colorMode === "Color" ? "Colour" : "Black & white"}`,
      `Copies:      ${Number(job.options.copies)}`,
      "Device:      PrintHub Portable",
      `Total:       ${formatPrice(job.estimatedPrice)}`,
      `Completed:   ${formatDateTime(job.updatedAt)}`,
      "",
      "Thank you for using PrintHub."
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `printhub-receipt-${job.jobRef}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    toast("Receipt downloaded", {
      description: `Saved as printhub-receipt-${job.jobRef}.txt`,
      tone: "success"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-gradient-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-10 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-card p-6 shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PageStepper, { current: 4, steps: PRINT_FLOW_STEPS }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-3xl px-4 py-12 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        "data-ocid": "completed.success_state",
        className: "rounded-lg border-success/30 shadow-card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex h-20 w-20 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              viewBox: "0 0 64 64",
              className: "h-20 w-20",
              role: "img",
              "aria-label": "Print completed",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "32",
                    cy: "32",
                    r: "28",
                    fill: "none",
                    strokeWidth: "3",
                    strokeLinecap: "round",
                    strokeDasharray: "176",
                    strokeDashoffset: "176",
                    className: "stroke-success animate-draw-check"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    d: "M20 33 L28 41 L45 24",
                    fill: "none",
                    strokeWidth: "4",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "100",
                    strokeDashoffset: "100",
                    className: "stroke-success animate-draw-check",
                    style: { animationDelay: "0.35s" }
                  }
                )
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-5 font-display text-3xl font-bold tracking-tight text-foreground", children: "Print Completed!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-md text-muted-foreground", children: "Your document has been printed successfully." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 rounded-lg border border-border bg-secondary p-5 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "space-y-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Job ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono text-foreground", children: job.jobRef })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "File" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "min-w-0 truncate text-right font-medium text-foreground", children: job.fileName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Pages printed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "font-mono text-foreground", children: [
                Number(job.printedPages),
                " / ",
                Number(job.pageCount)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono text-foreground", children: formatPrice(job.estimatedPrice) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Completed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono text-foreground", children: formatDateTime(job.updatedAt) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                onClick: () => {
                  resetFlow();
                  void navigate({ to: "/upload" });
                },
                "data-ocid": "completed.print_again_button",
                className: "w-full rounded-full transition-smooth sm:w-auto",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4", "aria-hidden": "true" }),
                  "Print Again"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: handleDownloadReceipt,
                "data-ocid": "completed.download_receipt_button",
                className: "w-full rounded-full transition-smooth sm:w-auto",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4", "aria-hidden": "true" }),
                  "Download Receipt"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 border-t border-border pt-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-semibold text-foreground", children: "Thank you for using PrintHub" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "We hope we made printing a little easier for you." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "mt-5 flex justify-center gap-1.5",
                "aria-hidden": "true",
                children: ["a", "b", "c", "d", "e"].map((key, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "h-2 w-2 animate-float rounded-full bg-primary/60",
                    style: { animationDelay: `${index * 0.15}s` }
                  },
                  key
                ))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                variant: "ghost",
                "data-ocid": "completed.dashboard_link",
                className: "mt-5 rounded-full transition-smooth",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: "Go to dashboard" })
              }
            )
          ] })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ThankYouPopup, { open: thankYouOpen, onOpenChange: setThankYouOpen })
  ] });
}
export {
  PrintCompletedPage
};
