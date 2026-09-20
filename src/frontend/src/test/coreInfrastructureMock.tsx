import type { MockActor } from "@/test/test-utils";
import { vi } from "vitest";

/**
 * Mutable state backing the `@caffeineai/core-infrastructure` mock. Tests
 * import this module and set `coreMock.actor` / `coreMock.isAuthenticated`
 * before rendering. The mock module reads these at call time.
 */
export const coreMock: {
  actor: MockActor | null;
  isFetching: boolean;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
} = {
  actor: null,
  isFetching: false,
  isAuthenticated: false,
  isInitializing: false,
  login: vi.fn(),
  clear: vi.fn(),
};

export function resetCoreMock() {
  coreMock.actor = null;
  coreMock.isFetching = false;
  coreMock.isAuthenticated = false;
  coreMock.isInitializing = false;
  coreMock.login.mockReset();
  coreMock.clear.mockReset();
}

/**
 * The factory passed to `vi.mock("@caffeineai/core-infrastructure", ...)`.
 * Kept in a module so every test file shares identical mock behavior.
 */
export function coreInfrastructureMock() {
  return {
    useActor: () => ({
      actor: coreMock.actor,
      isFetching: coreMock.isFetching,
    }),
    useInternetIdentity: () => ({
      isAuthenticated: coreMock.isAuthenticated,
      isInitializing: coreMock.isInitializing,
      login: coreMock.login,
      clear: coreMock.clear,
    }),
    InternetIdentityProvider: ({ children }: { children: React.ReactNode }) =>
      children,
  };
}
