import { j as jsxRuntimeExports, a as cn, u as useToast, b as useNavigate, r as reactExports, P as Printer, B as Button, e as CircleX } from "./index-CtAioZuW.js";
import { J as JobStatus, E as EmptyState, j as jobStatusLabel, b as formatPrice, c as jobStatusTone } from "./format-BiF1mUyr.js";
import { u as usePrintFlow, P as PageStepper, a as PRINT_FLOW_STEPS, C as Check } from "./printFlow-SIiwCbna.js";
import { B as Badge } from "./badge-DLa4_3or.js";
import { C as Card, a as CardContent } from "./card-M7tpU3-l.js";
import { u as useBackend, a as useQuery } from "./useBackend-ByTn_rus.js";
import { u as useMutation } from "./useMutation-DbEk_fzC.js";
function PrinterAnimation({
  percent,
  isPrinting,
  isComplete,
  isCancelled,
  className
}) {
  const clamped = Math.min(100, Math.max(0, percent));
  const sheetOffset = 26 - clamped / 100 * 26;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "printing.printer_animation",
      className: cn(
        "relative mx-auto flex h-44 w-full max-w-sm items-center justify-center",
        className
      ),
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-6 bottom-2 h-6 rounded-full bg-primary/10 blur-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            viewBox: "0 0 240 170",
            className: "relative h-full w-full",
            role: "img",
            "aria-label": "Printer illustration",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  x: "52",
                  y: "118",
                  width: "136",
                  height: "10",
                  rx: "5",
                  className: "fill-border"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "g",
                {
                  style: {
                    transform: `translateY(${sheetOffset}px)`,
                    transition: "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "rect",
                      {
                        x: "76",
                        y: "96",
                        width: "88",
                        height: "34",
                        rx: "3",
                        className: cn(
                          "stroke-border",
                          isComplete ? "fill-success/15" : "fill-card"
                        ),
                        strokeWidth: "1.5"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: "86",
                        y1: "106",
                        x2: "154",
                        y2: "106",
                        className: "stroke-muted-foreground/40",
                        strokeWidth: "2",
                        strokeLinecap: "round"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: "86",
                        y1: "114",
                        x2: "146",
                        y2: "114",
                        className: "stroke-muted-foreground/40",
                        strokeWidth: "2",
                        strokeLinecap: "round"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: "86",
                        y1: "122",
                        x2: "132",
                        y2: "122",
                        className: "stroke-muted-foreground/40",
                        strokeWidth: "2",
                        strokeLinecap: "round"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  x: "44",
                  y: "34",
                  width: "152",
                  height: "66",
                  rx: "10",
                  className: "fill-card stroke-border",
                  strokeWidth: "2"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  x: "66",
                  y: "28",
                  width: "108",
                  height: "8",
                  rx: "4",
                  className: "fill-secondary stroke-border",
                  strokeWidth: "1.5"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  x: "60",
                  y: "48",
                  width: "52",
                  height: "18",
                  rx: "4",
                  className: "fill-secondary"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: "70",
                  cy: "57",
                  r: "3",
                  className: cn(
                    isCancelled ? "fill-destructive" : isComplete ? "fill-success" : isPrinting ? "fill-primary animate-pulse-soft" : "fill-muted-foreground"
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "line",
                {
                  x1: "80",
                  y1: "57",
                  x2: "104",
                  y2: "57",
                  className: "stroke-muted-foreground/50",
                  strokeWidth: "2",
                  strokeLinecap: "round"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  x: "60",
                  y: "88",
                  width: "120",
                  height: "8",
                  rx: "4",
                  className: "fill-secondary stroke-border",
                  strokeWidth: "1.5"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: "176",
                  cy: "57",
                  r: "4",
                  className: cn(
                    isCancelled ? "fill-destructive" : isComplete ? "fill-success" : "fill-primary"
                  )
                }
              )
            ]
          }
        )
      ]
    }
  );
}
const TONE_CLASSES = {
  success: "bg-success/15 text-success",
  warning: "bg-accent/20 text-accent-foreground",
  danger: "bg-destructive/15 text-destructive",
  info: "bg-primary/15 text-primary",
  muted: "bg-muted text-muted-foreground"
};
const TIMELINE = [
  "File uploaded",
  "AI analysis complete",
  "Sent to PrintHub device",
  "Printer received",
  "Printing…",
  "Completed"
];
function timelineIndex(status) {
  switch (status) {
    case "Uploaded":
      return 0;
    case "Printing":
      return 4;
    case "Completed":
      return TIMELINE.length - 1;
    default:
      return 0;
  }
}
function PrintingStatusPage() {
  const { actor, isReady } = useBackend();
  const { toast } = useToast();
  const navigate = useNavigate();
  const job = usePrintFlow((state) => state.job);
  const setJob = usePrintFlow((state) => state.setJob);
  const completedRef = reactExports.useRef(false);
  const progressQuery = useQuery({
    queryKey: ["print-progress", (job == null ? void 0 : job.id.toString()) ?? "none"],
    queryFn: async () => {
      if (!actor || !job) return null;
      return actor.getPrintProgress(job.id);
    },
    enabled: isReady && !!job,
    refetchInterval: 2e3
  });
  const tickMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend is not ready");
      await actor.tickPrinting();
    }
  });
  const { mutate: tick } = tickMutation;
  reactExports.useEffect(() => {
    if (!isReady || !job) return;
    const interval = setInterval(() => tick(), 2e3);
    return () => clearInterval(interval);
  }, [isReady, job, tick]);
  const progress = progressQuery.data;
  const status = (progress == null ? void 0 : progress.status) ?? (job == null ? void 0 : job.status) ?? JobStatus.Uploaded;
  const totalPages = progress ? Number(progress.totalPages) : job ? Number(job.pageCount) : 0;
  const printedPages = progress ? Number(progress.printedPages) : job ? Number(job.printedPages) : 0;
  const percent = totalPages > 0 ? Math.min(100, Math.round(printedPages / totalPages * 100)) : 0;
  const isComplete = status === JobStatus.Completed;
  const isCancelled = status === JobStatus.Cancelled;
  const isFailed = status === JobStatus.Failed;
  const reachedFullProgress = !isCancelled && !isFailed && totalPages > 0 && printedPages >= totalPages;
  const showComplete = isComplete || reachedFullProgress;
  const isPrinting = !showComplete && !isCancelled && !isFailed;
  reactExports.useEffect(() => {
    if (!isComplete && !reachedFullProgress || !job || completedRef.current)
      return;
    completedRef.current = true;
    const finalPages = BigInt(Math.max(printedPages, totalPages));
    setJob({
      ...job,
      status: JobStatus.Completed,
      printedPages: finalPages,
      updatedAt: (progress == null ? void 0 : progress.updatedAt) ?? job.updatedAt
    });
    toast("Printing complete", {
      description: "Your document is ready to collect.",
      tone: "success"
    });
    void navigate({ to: "/completed" });
  }, [
    isComplete,
    reachedFullProgress,
    job,
    printedPages,
    totalPages,
    progress,
    setJob,
    toast,
    navigate
  ]);
  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !job) throw new Error("Backend is not ready");
      return actor.cancelJob(job.id);
    },
    onSuccess: (updated) => {
      setJob(updated);
      toast("Job cancelled", {
        description: "The print job was cancelled.",
        tone: "info"
      });
    },
    onError: (error) => {
      toast("Could not cancel job", {
        description: error.message,
        tone: "error"
      });
    }
  });
  if (!job) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-4 py-16 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Printer,
        title: "No active print job",
        message: "Start a print job to track its progress here in real time.",
        actionLabel: "Start a print job",
        onAction: () => void navigate({ to: "/upload" }),
        ocid: "printing.empty_state"
      }
    ) });
  }
  const activeStep = showComplete ? TIMELINE.length - 1 : timelineIndex(status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-gradient-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-10 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight text-foreground", children: "Printing status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-muted-foreground", children: [
        "Tracking job",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-medium text-foreground", children: job.jobRef })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 rounded-lg border border-border bg-card p-6 shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PageStepper, { current: 3, steps: PRINT_FLOW_STEPS }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.6fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-lg border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PrinterAnimation,
            {
              percent,
              isPrinting,
              isComplete: showComplete,
              isCancelled: isCancelled || isFailed
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: isCancelled ? "Printing cancelled" : isFailed ? "Printing failed" : showComplete ? "Printing complete!" : "Your document is printing!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 font-mono text-sm text-muted-foreground", children: [
              "Job ID: ",
              job.jobRef
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: progressQuery.isLoading ? "Preparing print job…" : `Progress: ${printedPages} / ${totalPages} pages` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-medium text-foreground", children: [
                percent,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                role: "progressbar",
                "aria-valuenow": percent,
                "aria-valuemin": 0,
                "aria-valuemax": 100,
                "aria-label": "Printing progress",
                tabIndex: 0,
                "data-ocid": "printing.progress_bar",
                className: "mt-3 h-2.5 w-full overflow-hidden rounded-full bg-border",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: cn(
                      "h-full rounded-full transition-smooth",
                      isCancelled || isFailed ? "bg-destructive" : showComplete ? "bg-success" : "bg-primary"
                    ),
                    style: { width: `${percent}%` }
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-col gap-3 sm:flex-row", children: [
            isPrinting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                disabled: cancelMutation.isPending,
                onClick: () => cancelMutation.mutate(),
                "data-ocid": "printing.cancel_button",
                className: "w-full rounded-full transition-smooth sm:w-auto",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4", "aria-hidden": "true" }),
                  cancelMutation.isPending ? "Cancelling…" : "Cancel Job"
                ]
              }
            ) : null,
            showComplete ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: () => void navigate({ to: "/completed" }),
                "data-ocid": "printing.view_completed_button",
                className: "w-full rounded-full transition-smooth sm:w-auto",
                children: "View completion"
              }
            ) : null,
            isCancelled || isFailed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: () => void navigate({ to: "/upload" }),
                "data-ocid": "printing.start_again_button",
                className: "w-full rounded-full transition-smooth sm:w-auto",
                children: "Start a new job"
              }
            ) : null
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-lg border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground", children: "Job timeline" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-5 space-y-1", children: TIMELINE.map((label, index) => {
            const isDone = index < activeStep;
            const isCurrent = index === activeStep;
            const isFinalDone = showComplete && index === TIMELINE.length - 1;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                "data-ocid": `printing.timeline.${index + 1}`,
                className: "flex items-start gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-smooth",
                          isFinalDone ? "border-success bg-success text-success-foreground shadow-ring-primary" : isCurrent ? "border-primary bg-primary text-primary-foreground shadow-ring-primary" : isDone ? "border-success bg-success text-success-foreground" : "border-border bg-card text-muted-foreground"
                        ),
                        children: isDone || isFinalDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5", "aria-hidden": "true" }) : index + 1
                      }
                    ),
                    index < TIMELINE.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: cn(
                          "my-1 h-6 w-0.5 rounded-full",
                          isDone ? "bg-success" : "bg-border"
                        ),
                        "aria-hidden": "true"
                      }
                    ) : null
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "pt-1 text-sm",
                        isFinalDone ? "font-semibold text-success" : isCurrent ? "font-semibold text-primary" : isDone ? "text-foreground" : "text-muted-foreground"
                      ),
                      children: label
                    }
                  )
                ]
              },
              label
            );
          }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-lg border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground", children: "Job details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: cn(
                  "shrink-0 rounded-full border-transparent px-2.5 py-1 text-xs font-medium",
                  TONE_CLASSES[jobStatusTone(status)]
                ),
                children: jobStatusLabel(status)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-4 space-y-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Document" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "min-w-0 truncate text-right font-medium text-foreground", children: job.fileName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Device" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "min-w-0 truncate text-right text-foreground", children: "PrintHub Portable" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Paper" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono text-foreground", children: job.options.paperSize })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Colour" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono text-foreground", children: job.options.colorMode === "Color" ? "Colour" : "B&W" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Copies" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono text-foreground", children: Number(job.options.copies) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono text-foreground", children: formatPrice(job.estimatedPrice) })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-lg border-border bg-secondary shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Keep this page open to watch progress live. The status refreshes automatically every couple of seconds." }) }) })
      ] })
    ] })
  ] });
}
export {
  PrintingStatusPage
};
