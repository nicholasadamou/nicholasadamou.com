import { useState, useEffect, useCallback } from "react";
import { VscoApiResponse, VscoError, VscoImage } from "@/types/vsco";

interface UseInfiniteVscoGalleryOptions {
  pageSize?: number;
}

interface UseInfiniteVscoGalleryReturn {
  images: VscoImage[];
  loading: boolean;
  error: VscoError | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
  totalCount: number;
}

export function useInfiniteVscoGallery(
  options: UseInfiniteVscoGalleryOptions = {}
): UseInfiniteVscoGalleryReturn {
  const { pageSize = 12 } = options;

  const [images, setImages] = useState<VscoImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<VscoError | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPage = useCallback(
    async (offset: number, reset: boolean = false) => {
      try {
        if (offset === 0) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const searchParams = new URLSearchParams();
        searchParams.set("limit", pageSize.toString());
        searchParams.set("offset", offset.toString());

        const url = `/api/vsco?${searchParams.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const galleryData: VscoApiResponse = await response.json();

        if (reset) {
          setImages(galleryData.images);
        } else {
          setImages((prev) => [...prev, ...galleryData.images]);
        }

        setHasMore(galleryData.hasMore);
        setTotalCount(galleryData.totalCount);
      } catch (err) {
        const error: VscoError = {
          message:
            err instanceof Error ? err.message : "Failed to fetch gallery",
          status: 500,
        };
        setError(error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [pageSize]
  );

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    await fetchPage(images.length);
  }, [images.length, loadingMore, hasMore, fetchPage]);

  const refetch = useCallback(async () => {
    await fetchPage(0, true);
  }, [fetchPage]);

  useEffect(() => {
    fetchPage(0, true);
  }, [fetchPage]);

  return {
    images,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
    totalCount,
  };
}
