import { j as jsxRuntimeExports, a as cn } from "./index-CtAioZuW.js";
function Skeleton$1({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
function Skeleton({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton$1, { className: cn("bg-muted", className) });
}
function SkeletonRows({ count = 4 }) {
  const ids = Array.from({ length: count }, (_, i) => `skeleton-row-${i}`);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ids.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-4 rounded-lg border border-border bg-card p-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-10 shrink-0 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20 shrink-0 rounded-full" })
      ]
    },
    id
  )) });
}
export {
  Skeleton as S,
  SkeletonRows as a
};
