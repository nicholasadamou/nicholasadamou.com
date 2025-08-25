/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

import type { MockedFunction } from "vitest";

// Extend global namespace for test mocks
declare global {
  // Mock fetch with vitest mock functions
  var fetch: MockedFunction<typeof globalThis.fetch>;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
    }
  }
}
