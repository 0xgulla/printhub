import { c as createLucideIcon, j as jsxRuntimeExports, B as Button, L as Link } from "./index-CtAioZuW.js";
import { F as FileUp, S as ScanLine, a as StepCard } from "./StepCard-16O-S_8H.js";
import { S as Sparkles } from "./sparkles-DEBoEduX.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21",
      key: "182aya"
    }
  ],
  ["path", { d: "M22 21H7", key: "t4ddhn" }],
  ["path", { d: "m5 11 9 9", key: "1mo9qw" }]
];
const Eraser = createLucideIcon("eraser", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M20 7h-9", key: "3s1dr2" }],
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
];
const Settings2 = createLucideIcon("settings-2", __iconNode);
const STEPS = [
  {
    icon: FileUp,
    title: "Upload PDF",
    description: "Add a PDF from your device to start a print job."
  },
  {
    icon: Sparkles,
    title: "AI Analysis",
    description: "Every page is inspected to find blank, nearly blank, and low-content pages."
  },
  {
    icon: Eraser,
    title: "Remove Blank Pages",
    description: "Drop the pages you do not need so you only print what matters."
  },
  {
    icon: Settings2,
    title: "Customize Printing",
    description: "Set paper size, colour, copies, and a custom page range."
  },
  {
    icon: ScanLine,
    title: "Printing & Completed",
    description: "Follow live progress page by page, then review your completion summary."
  }
];
function HowItWorksPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-gradient-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-14 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-bold tracking-tight text-foreground", children: "How It Works" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-2xl text-lg text-muted-foreground", children: "PrintHub takes a PDF from your device to finished pages in five guided steps." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-16 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: STEPS.map((step, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          StepCard,
          {
            index: index + 1,
            icon: step.icon,
            title: step.title,
            description: step.description,
            ocid: `how.step.${index + 1}`,
            className: "animate-slide-up"
          },
          step.title
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-14 overflow-hidden rounded-lg border border-border bg-gradient-primary px-6 py-12 text-center shadow-card sm:px-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold tracking-tight text-primary-foreground", children: "Ready to send your first job?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-xl text-primary-foreground/85", children: "Upload a PDF and let PrintHub handle the rest." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col justify-center gap-3 sm:flex-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              size: "lg",
              variant: "secondary",
              "data-ocid": "how.cta_upload_button",
              className: "w-full rounded-full transition-smooth sm:w-auto",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/upload", children: "Upload & Print" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              size: "lg",
              variant: "outline",
              "data-ocid": "how.cta_start_printing_button",
              className: "w-full rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground transition-smooth hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/upload", children: "Start Printing" })
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  HowItWorksPage
};
