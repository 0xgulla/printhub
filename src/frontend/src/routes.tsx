import { AppLayout } from "@/components/layout/AppLayout";
import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { lazy } from "react";

const HomePage = lazy(() =>
  import("@/pages/Home").then((m) => ({ default: m.HomePage })),
);
const HowItWorksPage = lazy(() =>
  import("@/pages/HowItWorks").then((m) => ({ default: m.HowItWorksPage })),
);
const UploadPage = lazy(() =>
  import("@/pages/Upload").then((m) => ({ default: m.UploadPage })),
);
const PrintOptionsPage = lazy(() =>
  import("@/pages/PrintOptions").then((m) => ({ default: m.PrintOptionsPage })),
);
const PrintingStatusPage = lazy(() =>
  import("@/pages/PrintingStatus").then((m) => ({
    default: m.PrintingStatusPage,
  })),
);
const PrintCompletedPage = lazy(() =>
  import("@/pages/PrintCompleted").then((m) => ({
    default: m.PrintCompletedPage,
  })),
);
const DashboardPage = lazy(() =>
  import("@/pages/Dashboard").then((m) => ({ default: m.DashboardPage })),
);
const AdminPage = lazy(() =>
  import("@/pages/Admin").then((m) => ({ default: m.AdminPage })),
);

const rootRoute = createRootRoute({ component: AppLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const homeAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: HomePage,
});

const howItWorksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/how-it-works",
  component: HowItWorksPage,
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upload",
  component: UploadPage,
});

const printOptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/options",
  component: PrintOptionsPage,
});

const printingStatusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/printing",
  component: PrintingStatusPage,
});

const printCompletedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/completed",
  component: PrintCompletedPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  homeAliasRoute,
  howItWorksRoute,
  uploadRoute,
  printOptionsRoute,
  printingStatusRoute,
  printCompletedRoute,
  dashboardRoute,
  adminRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
