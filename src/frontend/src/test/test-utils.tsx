import type {
  AdminStats,
  AnalysisResultView,
  PrintJobView,
  PrinterView,
  UploadedFileView,
  UserStats,
} from "@/backend";
import { ColorMode, JobStatus, PageSelection, PaperSize } from "@/backend";
import { ToastProvider } from "@/components/ToastProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { vi } from "vitest";

/**
 * A typed stand-in for the generated backend actor. Every method is a
 * `vi.fn()` so tests can assert calls and control resolution. Tests should
 * override only the methods they exercise.
 */
export type MockActor = {
  [K in keyof import("@/backend").backendInterface]: ReturnType<typeof vi.fn>;
};

export function createMockActor(
  overrides: Partial<Record<string, unknown>> = {},
): MockActor {
  const base: Record<string, ReturnType<typeof vi.fn>> = {
    analyzeFile: vi.fn(),
    assignCallerUserRole: vi.fn(),
    cancelJob: vi.fn(),
    connectPrinter: vi.fn(),
    createJob: vi.fn(),
    estimatePrice: vi.fn(),
    execute: vi.fn(),
    getAdminStats: vi.fn(),
    getAnalysis: vi.fn(),
    getApiDoc: vi.fn(),
    getCallerUserRole: vi.fn(),
    getFile: vi.fn(),
    getJob: vi.fn(),
    getPrintProgress: vi.fn(),
    getPrinter: vi.fn(),
    getPrinterStatus: vi.fn(),
    getUserStats: vi.fn(),
    isCallerAdmin: vi.fn(),
    listFiles: vi.fn(),
    listJobs: vi.fn(),
    listPrinters: vi.fn(),
    registerFile: vi.fn(),
    schema: vi.fn(),
    searchPrinters: vi.fn(),
    tickPrinting: vi.fn(),
    validateUpload: vi.fn(),
  };
  return Object.assign(base, overrides) as unknown as MockActor;
}

export function makePrinter(overrides: Partial<PrinterView> = {}): PrinterView {
  return {
    id: "printer-1",
    name: "Central Library Printer",
    location: "Main Library, Floor 1",
    description: "High-speed duplex printer near the help desk.",
    openingHours: "Mon–Sat, 8:00–20:00",
    isOnline: true,
    rating: 45n,
    speedPagesPerMinute: 30n,
    paperSizes: [PaperSize.A4, PaperSize.A3],
    colorModes: [ColorMode.BlackAndWhite, ColorMode.Color],
    ...overrides,
  };
}

export function makeFile(
  overrides: Partial<UploadedFileView> = {},
): UploadedFileView {
  return {
    id: 1n,
    fileName: "assignment.pdf",
    contentType: "application/pdf",
    sizeBytes: 2048n,
    pageCount: 10n,
    uploadedAt: 1_700_000_000_000_000_000n,
    ...overrides,
  };
}

export function makeAnalysis(
  overrides: Partial<AnalysisResultView> = {},
): AnalysisResultView {
  return {
    fileId: 1n,
    totalPages: 10n,
    contentPageCount: 8n,
    blankPages: [3n, 7n],
    nearlyBlankPages: [],
    lowContentPages: [],
    colorPages: [],
    issueNotes: [],
    analyzedAt: 1_700_000_000_000_000_000n,
    ...overrides,
  };
}

export function makeJob(overrides: Partial<PrintJobView> = {}): PrintJobView {
  return {
    id: 1n,
    jobRef: "JOB-1001",
    fileId: 1n,
    fileName: "assignment.pdf",
    printerId: "printer-1",
    status: JobStatus.Printing,
    estimatedPrice: 40n,
    printedPages: 4n,
    pageCount: 10n,
    sizeBytes: 2048n,
    createdAt: 1_700_000_000_000_000_000n,
    updatedAt: 1_700_000_000_000_000_000n,
    options: {
      paperSize: PaperSize.A4,
      colorMode: ColorMode.BlackAndWhite,
      copies: 1n,
      pageSelection: PageSelection.All,
      excludedBlankPages: [],
    },
    ...overrides,
  };
}

export function makeUserStats(overrides: Partial<UserStats> = {}): UserStats {
  return { totalPrints: 12n, totalSpent: 480n, savedFiles: 3n, ...overrides };
}

export function makeAdminStats(
  overrides: Partial<AdminStats> = {},
): AdminStats {
  return {
    totalPrints: 120n,
    revenue: 4800n,
    onlineDevices: 4n,
    offlineDevices: 1n,
    ...overrides,
  };
}

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

export interface RenderOptions {
  /** Initial URL path, e.g. "/printers". */
  path?: string;
  /** Extra route paths to register so `navigate` targets resolve. */
  routes?: Array<string>;
  queryClient?: QueryClient;
}

/**
 * Build the memory router used by `renderWithProviders`. Kept as its own
 * function so its concrete router type is inferred from the actual
 * `createRouter` call rather than widened to the generic `RouterCore` default,
 * which is not assignable to the app's narrower router instance type.
 */
function createTestRouter(ui: ReactNode, path: string, routes: Array<string>) {
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const allPaths = Array.from(new Set([path, "/", ...routes]));
  const childRoutes = allPaths.map((routePath) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path: routePath,
      component: routePath === path ? () => <>{ui}</> : () => null,
    }),
  );
  return createRouter({
    routeTree: rootRoute.addChildren(childRoutes),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
}

/**
 * Render a component inside the app's real providers (React Query + Toast)
 * and a memory router so `Link`/`useNavigate` work. The component is mounted
 * at the root route, so navigation assertions can inspect `router.state`.
 */
export async function renderWithProviders(
  ui: ReactNode,
  options: RenderOptions = {},
): Promise<RenderResult & { router: ReturnType<typeof createTestRouter> }> {
  const {
    path = "/",
    routes = [],
    queryClient = createTestQueryClient(),
  } = options;

  const router = createTestRouter(ui, path, routes);

  await router.load();

  const result = render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryClientProvider>,
  );

  return { ...result, router };
}
