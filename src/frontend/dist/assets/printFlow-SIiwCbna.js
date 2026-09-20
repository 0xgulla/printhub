import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, q as React } from "./index-CtAioZuW.js";
import { a as PageSelection, C as ColorMode, P as PaperSize } from "./format-BiF1mUyr.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode);
const PRINT_FLOW_STEPS = [
  { label: "Upload" },
  { label: "AI Analysis" },
  { label: "Customize" },
  { label: "Printing" },
  { label: "Completed" }
];
function PageStepper({ steps, current, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "nav",
    {
      "aria-label": "Print progress",
      "data-ocid": "page_stepper",
      className: cn("w-full", className),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "flex items-start justify-between gap-1 sm:gap-2", children: steps.map((step, index) => {
        const isComplete = index < current;
        const isCurrent = index === current;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "flex min-w-0 flex-1 flex-col items-center text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "h-0.5 flex-1 rounded-full transition-smooth",
                      index === 0 ? "bg-transparent" : isComplete || isCurrent ? "bg-primary" : "bg-border"
                    ),
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-smooth",
                      isComplete && "border-primary bg-primary text-primary-foreground",
                      isCurrent && "border-primary bg-primary text-primary-foreground shadow-ring-primary",
                      !isComplete && !isCurrent && "border-border bg-card text-muted-foreground"
                    ),
                    children: isComplete ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4", "aria-hidden": "true" }) : index + 1
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "h-0.5 flex-1 rounded-full transition-smooth",
                      index === steps.length - 1 ? "bg-transparent" : isComplete ? "bg-primary" : "bg-border"
                    ),
                    "aria-hidden": "true"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "mt-2 truncate text-xs font-medium sm:text-sm",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  ),
                  children: step.label
                }
              )
            ]
          },
          step.label
        );
      }) })
    }
  );
}
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
const identity = (arg) => arg;
function useStore(api, selector = identity) {
  const slice = React.useSyncExternalStore(
    api.subscribe,
    React.useCallback(() => selector(api.getState()), [api, selector]),
    React.useCallback(() => selector(api.getInitialState()), [api, selector])
  );
  React.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;
const defaultPrintOptions = {
  paperSize: PaperSize.A4,
  colorMode: ColorMode.BlackAndWhite,
  copies: 1,
  pageSelection: PageSelection.All,
  customRange: "",
  excludedBlankPages: []
};
function toPrintOptions(draft) {
  return {
    paperSize: draft.paperSize,
    colorMode: draft.colorMode,
    copies: BigInt(draft.copies),
    pageSelection: draft.pageSelection,
    customRange: draft.customRange || void 0,
    excludedBlankPages: draft.excludedBlankPages.map((page) => BigInt(page))
  };
}
const usePrintFlow = create((set) => ({
  file: null,
  localFile: null,
  analysis: null,
  options: defaultPrintOptions,
  price: null,
  job: null,
  setFile: (file) => set({ file }),
  setLocalFile: (localFile) => set({ localFile }),
  setAnalysis: (analysis) => set({ analysis }),
  setOptions: (options) => set((state) => ({ options: { ...state.options, ...options } })),
  setPrice: (price) => set({ price }),
  setJob: (job) => set({ job }),
  resetFlow: () => set({
    file: null,
    localFile: null,
    analysis: null,
    options: defaultPrintOptions,
    price: null,
    job: null
  })
}));
export {
  Check as C,
  PageStepper as P,
  PRINT_FLOW_STEPS as a,
  toPrintOptions as t,
  usePrintFlow as u
};
