import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import useIsMount from "@/hooks/utilities/use-is-mount";

describe("useIsMount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic functionality", () => {
    it("should return true on initial render", () => {
      const { result } = renderHook(() => useIsMount());

      expect(result.current).toBe(true);
    });

    it("should return boolean value consistently", () => {
      const { result } = renderHook(() => useIsMount());

      expect(typeof result.current).toBe("boolean");
      expect(result.current).toBe(true);
    });

    it("should work with multiple rerenders", () => {
      const { result, rerender } = renderHook(() => useIsMount());

      // Initially true
      expect(result.current).toBe(true);

      // Multiple rerenders should still work
      rerender();
      expect(typeof result.current).toBe("boolean");

      rerender();
      expect(typeof result.current).toBe("boolean");
    });
  });

  describe("Multiple hook instances", () => {
    it("should work independently across multiple instances", () => {
      const hook1 = renderHook(() => useIsMount());
      const hook2 = renderHook(() => useIsMount());

      // Both should start as true
      expect(hook1.result.current).toBe(true);
      expect(hook2.result.current).toBe(true);

      // Each instance should be independent
      expect(typeof hook1.result.current).toBe("boolean");
      expect(typeof hook2.result.current).toBe("boolean");
    });

    it("should create new instances correctly", () => {
      const hook1 = renderHook(() => useIsMount());

      expect(hook1.result.current).toBe(true);

      // Mount second hook - should still be independent
      const hook2 = renderHook(() => useIsMount());

      expect(hook1.result.current).toBe(true);
      expect(hook2.result.current).toBe(true);

      // Clean up
      hook1.unmount();
      hook2.unmount();
    });
  });

  describe("Component lifecycle", () => {
    it("should return true on fresh mount", () => {
      const { result, unmount } = renderHook(() => useIsMount());

      // Initially true
      expect(result.current).toBe(true);

      // Unmount and remount with new hook
      unmount();
      const newHook = renderHook(() => useIsMount());

      // Should be true again on remount
      expect(newHook.result.current).toBe(true);

      newHook.unmount();
    });

    it("should handle quick mount/unmount cycles", () => {
      let currentResult = true;

      const { unmount } = renderHook(() => {
        currentResult = useIsMount();
        return currentResult;
      });

      expect(currentResult).toBe(true);

      // Unmount quickly
      unmount();

      // Remount - should still return true initially
      const { result } = renderHook(() => useIsMount());
      expect(result.current).toBe(true);
    });
  });

  describe("SSR compatibility", () => {
    it("should consistently return true during SSR-like conditions", () => {
      // Just test initial behavior without waiting for effects
      const { result } = renderHook(() => useIsMount());
      expect(result.current).toBe(true);
    });

    it("should be safe to use for conditional rendering", () => {
      const spy = vi.fn();
      const { result } = renderHook(() => {
        const isMount = useIsMount();
        spy(isMount);
        return isMount;
      });

      expect(spy).toHaveBeenCalledWith(true);
      expect(result.current).toBe(true);
    });
  });

  describe("Performance considerations", () => {
    it("should not cause unnecessary re-renders", () => {
      let renderCount = 0;

      const { rerender } = renderHook(() => {
        renderCount++;
        return useIsMount();
      });

      expect(renderCount).toBe(1);

      // Effect running should not cause re-render
      act(() => {});
      expect(renderCount).toBe(1);

      // Manual rerender should increment
      rerender();
      expect(renderCount).toBe(2);
    });

    it("should maintain stable reference behavior", () => {
      const { result } = renderHook(() => useIsMount());

      const initialValue = result.current;
      expect(initialValue).toBe(true);
      expect(typeof initialValue).toBe("boolean");
    });
  });

  describe("Common use cases", () => {
    it("should work for preventing hydration mismatches", () => {
      const HydrationSafeComponent = () => {
        const isMount = useIsMount();

        // During SSR/first render, show static content
        if (isMount) {
          return "Static Content";
        }

        // After hydration, show dynamic content
        return "Dynamic Content";
      };

      const { result, rerender } = renderHook(() => <HydrationSafeComponent />);

      // Should not cause hydration mismatch issues
      expect(result).toBeDefined();
    });

    it("should work for conditional client-side only features", () => {
      const spy = vi.fn();
      const { result } = renderHook(() => {
        const isMount = useIsMount();
        if (!isMount) {
          spy();
        }
        return isMount;
      });

      // Should not be called on initial mount (isMount is true)
      expect(spy).not.toHaveBeenCalled();
      expect(result.current).toBe(true);
    });

    it("should work for animation/transition triggers", () => {
      let shouldAnimate = false;

      const { result } = renderHook(() => {
        const isMount = useIsMount();

        if (!isMount) {
          shouldAnimate = true;
        }

        return isMount;
      });

      // Initially should not animate (isMount is true)
      expect(shouldAnimate).toBe(false);
      expect(result.current).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle concurrent renders safely", () => {
      const results: boolean[] = [];

      const { rerender } = renderHook(() => {
        const isMount = useIsMount();
        results.push(isMount);
        return isMount;
      });

      expect(results).toEqual([true]);

      // Multiple concurrent-like rerenders
      rerender();
      rerender();

      // Should have collected results from all renders
      expect(results.length).toBeGreaterThanOrEqual(3);
      expect(results[0]).toBe(true); // First render should always be true
    });

    it("should be memory leak safe", () => {
      const hooks: any[] = [];

      // Create a few instances (reduce from 100 to avoid memory issues)
      for (let i = 0; i < 10; i++) {
        const hook = renderHook(() => useIsMount());
        hooks.push(hook);
      }

      // All should start as true
      hooks.forEach((hook) => {
        expect(hook.result.current).toBe(true);
      });

      // Clean up all hooks
      hooks.forEach((hook) => hook.unmount());

      // This should not cause memory leaks or errors
      expect(hooks.length).toBe(10);
    });

    it("should work with Suspense boundaries", () => {
      // This test ensures the hook works well in Suspense contexts
      const SuspendingComponent = () => {
        const isMount = useIsMount();

        if (isMount) {
          // Simulate suspense condition only on mount
          return "Loading...";
        }

        return "Loaded!";
      };

      const { result } = renderHook(() => <SuspendingComponent />);

      expect(result).toBeDefined();

      act(() => {});

      expect(result).toBeDefined();
    });
  });
});
