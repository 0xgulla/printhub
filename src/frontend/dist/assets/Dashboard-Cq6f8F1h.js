import { c as createLucideIcon, j as jsxRuntimeExports, T as TriangleAlert, B as Button, P as Printer, a as cn, r as reactExports, b as useNavigate, L as Link } from "./index-CtAioZuW.js";
import { E as EmptyState, e as formatNumber, d as formatDateTime, b as formatPrice, j as jobStatusLabel, c as jobStatusTone } from "./format-BiF1mUyr.js";
import { a as SkeletonRows } from "./Skeleton-C1gOROf1.js";
import { B as Badge } from "./badge-DLa4_3or.js";
import { R as RotateCcw } from "./rotate-ccw-DhqkpFAy.js";
import { C as Card, a as CardContent } from "./card-M7tpU3-l.js";
import { u as useBackend, a as useQuery } from "./useBackend-ByTn_rus.js";
import { U as Upload } from "./upload-DH97e68x.js";
import { F as FileText } from "./file-text-CEaOecWc.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 3h12", key: "ggurg9" }],
  ["path", { d: "M6 8h12", key: "6g4wlu" }],
  ["path", { d: "m6 13 8.5 8", key: "u1kupk" }],
  ["path", { d: "M6 13h3", key: "wdp6ag" }],
  ["path", { d: "M9 13c6.667 0 6.667-10 0-10", key: "1nkvk2" }]
];
const IndianRupee = createLucideIcon("indian-rupee", __iconNode);
const TONE_CLASSES = {
  success: "bg-success/15 text-success",
  warning: "bg-accent/20 text-accent-foreground",
  danger: "bg-destructive/15 text-destructive",
  info: "bg-primary/15 text-primary",
  muted: "bg-muted text-muted-foreground"
};
function RecentPrintsList({
  jobs,
  isLoading,
  isError = false,
  limit = 5,
  onStartPrinting,
  onRetry
}) {
  const visible = jobs.slice(0, limit);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.jobs_loading_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRows, { count: 4 }) });
  }
  if (isError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "dashboard.jobs_error_state",
        className: "flex flex-col items-center justify-center rounded-lg border border-dashed border-destructive/40 bg-card px-6 py-14 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-6 w-6", "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold text-foreground", children: "We couldn't load your print history" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-sm text-sm text-muted-foreground", children: "The PrintHub device may be offline. Check the connection and try again." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: onRetry,
              "data-ocid": "dashboard.jobs_retry_button",
              className: "mt-6 rounded-full transition-smooth",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4", "aria-hidden": "true" }),
                "Try Again"
              ]
            }
          )
        ]
      }
    );
  }
  if (jobs.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Printer,
        title: "No prints yet",
        message: "Upload a document and send it through your PrintHub device — your jobs will show up here.",
        actionLabel: "Start Printing",
        onAction: onStartPrinting,
        ocid: "dashboard.jobs_empty_state"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { "data-ocid": "dashboard.jobs_list", className: "space-y-3", children: visible.map((job, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "li",
    {
      "data-ocid": `dashboard.job_item.${index + 1}`,
      className: "flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-card transition-smooth hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-medium text-foreground", children: job.fileName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 font-mono text-xs text-muted-foreground", children: [
            formatNumber(job.pageCount),
            " pages · ",
            job.jobRef,
            " ·",
            " ",
            formatDateTime(job.createdAt)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-medium text-foreground", children: formatPrice(job.estimatedPrice) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: cn(
                "rounded-full border-transparent px-2.5 py-1 text-xs font-medium",
                TONE_CLASSES[jobStatusTone(job.status)]
              ),
              children: jobStatusLabel(job.status)
            }
          )
        ] })
      ]
    },
    job.id.toString()
  )) });
}
const TONE_STYLES = {
  primary: "bg-secondary text-primary",
  success: "bg-success/15 text-success",
  danger: "bg-destructive/15 text-destructive",
  accent: "bg-accent/20 text-accent-foreground"
};
function useCountUp(target, duration = 700) {
  const [display, setDisplay] = reactExports.useState(target === void 0 ? null : 0);
  const frame = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (target === void 0) {
      setDisplay(null);
      return;
    }
    const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(target);
      return;
    }
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(target * eased));
      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
      }
    };
    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [target, duration]);
  return display;
}
function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "primary",
  countTo,
  ocid = "stat_card"
}) {
  const counted = useCountUp(countTo);
  const shown = counted === null ? value : counted.toLocaleString();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      "data-ocid": ocid,
      className: "animate-fade-in rounded-lg border-border shadow-card transition-smooth hover:shadow-card-hover",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
              TONE_STYLES[tone]
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5", "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-2xl font-semibold tracking-tight text-foreground", children: shown }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm font-medium text-muted-foreground", children: label }),
          hint ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: hint }) : null
        ] })
      ] })
    }
  );
}
function DashboardPage() {
  const { actor, isReady } = useBackend();
  const navigate = useNavigate();
  const statsQuery = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserStats();
    },
    enabled: isReady
  });
  const jobsQuery = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listJobs();
    },
    enabled: isReady
  });
  const stats = statsQuery.data;
  const jobs = jobsQuery.data ?? [];
  const statsLoading = statsQuery.isLoading || !isReady;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-gradient-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-12 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight text-foreground", children: "Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-2xl text-muted-foreground", children: "Every job you send through this PrintHub device, with page counts and status." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 sm:flex-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          "data-ocid": "dashboard.start_printing_button",
          className: "rounded-full transition-smooth",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/upload", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4", "aria-hidden": "true" }),
            "Start Printing"
          ] })
        }
      ) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-12 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 sm:grid-cols-3", children: statsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: ["stat-skeleton-1", "stat-skeleton-2", "stat-skeleton-3"].map(
        (id) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "dashboard.stats_loading_state",
            className: "rounded-lg border border-border bg-card p-6 shadow-card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 h-11 w-11 animate-pulse-soft rounded-full bg-muted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 h-6 w-1/2 animate-pulse-soft rounded bg-muted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-2/3 animate-pulse-soft rounded bg-muted" })
            ]
          },
          id
        )
      ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: Printer,
            label: "Total Prints",
            value: stats ? Number(stats.totalPrints).toLocaleString() : "0",
            countTo: stats ? Number(stats.totalPrints) : 0,
            ocid: "dashboard.stat_card.1"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: IndianRupee,
            label: "Total Spent",
            value: stats ? formatPrice(stats.totalSpent) : formatPrice(0n),
            tone: "success",
            ocid: "dashboard.stat_card.2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: FileText,
            label: "Saved Files",
            value: stats ? Number(stats.savedFiles).toLocaleString() : "0",
            countTo: stats ? Number(stats.savedFiles) : 0,
            tone: "accent",
            ocid: "dashboard.stat_card.3"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "Print History" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: jobs.length > 0 ? `${jobs.length} job${jobs.length === 1 ? "" : "s"} on this device` : "This device" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          RecentPrintsList,
          {
            jobs,
            isLoading: jobsQuery.isLoading || !isReady,
            isError: jobsQuery.isError,
            onRetry: () => void jobsQuery.refetch(),
            onStartPrinting: () => void navigate({ to: "/upload" })
          }
        ) })
      ] })
    ] })
  ] });
}
export {
  DashboardPage
};
