import { useState, useEffect, useCallback } from "react";
import type { VscoApiResponse, VscoError } from "@/types/vsco";

interface UseVscoGalleryOptions {
  limit?: number;
}

export function useVscoGallery(options: UseVscoGalleryOptions = {}) {
  const [data, setData] = useState<VscoApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<VscoError | null>(null);

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.limit) params.set("limit", options.limit.toString());

      const url = `/api/vsco${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      setData(await response.json());
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Failed to fetch gallery",
        status: 500,
      });
    } finally {
      setLoading(false);
    }
  }, [options.limit]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  return { data, loading, error, refetch: fetchGallery };
}
