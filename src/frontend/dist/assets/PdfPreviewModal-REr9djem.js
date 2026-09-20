import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, a as cn, B as Button } from "./index-CtAioZuW.js";
import { M as Modal } from "./Modal-BIi-jFyp.js";
import { F as FileText } from "./file-text-CEaOecWc.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "11", x2: "11", y1: "8", y2: "14", key: "1vmskp" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
];
const ZoomIn = createLucideIcon("zoom-in", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
];
const ZoomOut = createLucideIcon("zoom-out", __iconNode);
const ZOOM_STEPS = [0.75, 1, 1.25, 1.5, 2];
function PdfPreviewModal({
  open,
  onOpenChange,
  file,
  fileName,
  pageCount
}) {
  const [page, setPage] = reactExports.useState(1);
  const [zoomIndex, setZoomIndex] = reactExports.useState(1);
  const objectUrl = reactExports.useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);
  reactExports.useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);
  reactExports.useEffect(() => {
    if (open) {
      setPage(1);
      setZoomIndex(1);
    }
  }, [open]);
  const isImage = (file == null ? void 0 : file.type.startsWith("image/")) ?? false;
  const isPdf = (file == null ? void 0 : file.type) === "application/pdf" || (file == null ? void 0 : file.name.toLowerCase().endsWith(".pdf"));
  const totalPages = Math.max(1, pageCount);
  const zoom = ZOOM_STEPS[zoomIndex];
  const goToPage = (next) => {
    setPage(Math.min(totalPages, Math.max(1, next)));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Modal,
    {
      open,
      onOpenChange,
      title: "Document preview",
      description: fileName,
      ocid: "preview.modal",
      className: "sm:max-w-3xl",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "icon",
              "aria-label": "Zoom out",
              disabled: zoomIndex === 0,
              onClick: () => setZoomIndex((index) => Math.max(0, index - 1)),
              "data-ocid": "preview.zoom_out_button",
              className: "rounded-full",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomOut, { className: "h-4 w-4", "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-14 text-center font-mono text-xs text-muted-foreground", children: [
            Math.round(zoom * 100),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "icon",
              "aria-label": "Zoom in",
              disabled: zoomIndex === ZOOM_STEPS.length - 1,
              onClick: () => setZoomIndex(
                (index) => Math.min(ZOOM_STEPS.length - 1, index + 1)
              ),
              "data-ocid": "preview.zoom_in_button",
              className: "rounded-full",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "h-4 w-4", "aria-hidden": "true" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "icon",
              "aria-label": "Previous page",
              disabled: page <= 1,
              onClick: () => goToPage(page - 1),
              "data-ocid": "preview.prev_page_button",
              className: "rounded-full",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4", "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
            "Page ",
            page,
            " / ",
            totalPages
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "icon",
              "aria-label": "Next page",
              disabled: page >= totalPages,
              onClick: () => goToPage(page + 1),
              "data-ocid": "preview.next_page_button",
              className: "rounded-full",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4", "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "preview.viewer",
            className: "flex min-h-[320px] items-center justify-center overflow-auto rounded-lg border border-border bg-secondary p-4",
            children: objectUrl && isPdf ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "iframe",
              {
                src: `${objectUrl}#page=${page}&zoom=${Math.round(zoom * 100)}`,
                title: `Preview of ${fileName}`,
                className: "h-[420px] w-full rounded-md border border-border bg-card"
              },
              `${objectUrl}-${page}`
            ) : objectUrl && isImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: objectUrl,
                alt: `Preview of ${fileName}`,
                style: { transform: `scale(${zoom})` },
                className: "max-h-[420px] rounded-md border border-border bg-card object-contain transition-smooth"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center px-6 py-12 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-card text-primary shadow-card", children: isImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-6 w-6", "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-6 w-6", "aria-hidden": "true" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-semibold text-foreground", children: "Preview unavailable for this format" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 max-w-sm text-sm text-muted-foreground", children: [
                fileName,
                " is registered with ",
                totalPages,
                " page",
                totalPages === 1 ? "" : "s",
                ". Word documents can be previewed after conversion to PDF."
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: cn(
              "mt-3 text-center text-xs text-muted-foreground",
              !objectUrl && "hidden"
            ),
            children: "Use the page and zoom controls to inspect your document before printing."
          }
        )
      ]
    }
  );
}
export {
  Eye as E,
  LoaderCircle as L,
  PdfPreviewModal as P
};
