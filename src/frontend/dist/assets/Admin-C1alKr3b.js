import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, S as ShieldCheck, B as Button, L as Link } from "./index-CtAioZuW.js";
import { L as Label, I as Input } from "./label-E7V8byIz.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "16", r: "1", key: "1au0dj" }],
  ["rect", { x: "3", y: "10", width: "18", height: "12", rx: "2", key: "6s8ecr" }],
  ["path", { d: "M7 10V7a5 5 0 0 1 10 0v3", key: "1pqi11" }]
];
const LockKeyhole = createLucideIcon("lock-keyhole", __iconNode);
function AdminLoginForm() {
  const [username, setUsername] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({});
  const [submitted, setSubmitted] = reactExports.useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (username.trim().length === 0) {
      nextErrors.username = "Enter your admin username.";
    }
    if (password.length === 0) {
      nextErrors.password = "Enter your password.";
    }
    setErrors(nextErrors);
    setSubmitted(Object.keys(nextErrors).length === 0);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      noValidate: true,
      onSubmit: handleSubmit,
      "data-ocid": "admin.login_form",
      className: "rounded-lg border border-border bg-card p-6 shadow-card sm:p-8",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5", "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground", children: "Administrator sign in" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Restricted to PrintHub network operators." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admin-username", children: "Username" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "admin-username",
                name: "username",
                autoComplete: "username",
                value: username,
                onChange: (event) => {
                  setUsername(event.target.value);
                  setSubmitted(false);
                },
                "aria-invalid": errors.username ? true : void 0,
                "aria-describedby": errors.username ? "admin-username-error" : void 0,
                placeholder: "admin",
                "data-ocid": "admin.username_input"
              }
            ),
            errors.username ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                id: "admin-username-error",
                "data-ocid": "admin.username_error",
                className: "text-sm font-medium text-destructive",
                children: errors.username
              }
            ) : null
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admin-password", children: "Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "admin-password",
                name: "password",
                type: "password",
                autoComplete: "current-password",
                value: password,
                onChange: (event) => {
                  setPassword(event.target.value);
                  setSubmitted(false);
                },
                "aria-invalid": errors.password ? true : void 0,
                "aria-describedby": errors.password ? "admin-password-error" : void 0,
                placeholder: "••••••••",
                "data-ocid": "admin.password_input"
              }
            ),
            errors.password ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                id: "admin-password-error",
                "data-ocid": "admin.password_error",
                className: "text-sm font-medium text-destructive",
                children: errors.password
              }
            ) : null
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "submit",
            "data-ocid": "admin.login_button",
            className: "mt-6 w-full rounded-full transition-smooth",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, { className: "h-4 w-4", "aria-hidden": "true" }),
              "Login"
            ]
          }
        ),
        submitted ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "output",
          {
            "data-ocid": "admin.login_notice",
            className: "mt-4 block rounded-lg border border-primary/30 bg-secondary px-4 py-3 text-sm font-medium text-primary",
            children: "Admin authentication will be connected later."
          }
        ) : null
      ]
    }
  );
}
const CAPABILITIES = [
  "Monitor every print job across the network",
  "Track device health and paper levels",
  "Review revenue and settlement summaries"
];
function AdminPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-gradient-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-12 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight text-foreground", children: "Admin Login" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-2xl text-muted-foreground", children: "Sign in to manage the PrintHub device network. This preview shows the sign-in experience only." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_420px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "order-2 lg:order-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "What administrators manage" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-5 space-y-3", children: CAPABILITIES.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4", "aria-hidden": "true" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: item })
            ]
          },
          item
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/dashboard",
            "data-ocid": "admin.back_dashboard_link",
            className: "mt-8 inline-flex items-center gap-2 rounded-full text-sm font-medium text-primary transition-quick hover:underline",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4", "aria-hidden": "true" }),
              "Back to Dashboard"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "order-1 lg:order-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLoginForm, {}) })
    ] })
  ] });
}
export {
  AdminPage
};
