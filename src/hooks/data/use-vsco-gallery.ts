import { useState, useEffect, useCallback } from "react";
import { VscoApiResponse, VscoError } from "@/types/vsco";

interface UseVscoGalleryOptions {
  limit?: number;
}

interface UseVscoGalleryReturn {
  data: VscoApiResponse | null;
  loading: boolean;
  error: VscoError | null;
  refetch: () => Promise<void>;
}

export function useVscoGallery(
  options: UseVscoGalleryOptions = {}
): UseVscoGalleryReturn {
  const [data, setData] = useState<VscoApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<VscoError | null>(null);

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      if (options.limit) {
        searchParams.set("limit", options.limit.toString());
      }

      const url = `/api/vsco${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const galleryData = await response.json();
      setData(galleryData);
    } catch (err) {
      const error: VscoError = {
        message: err instanceof Error ? err.message : "Failed to fetch gallery",
        status: 500,
      };
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [options.limit]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  return {
    data,
    loading,
    error,
    refetch: fetchGallery,
  };
}
