import { useState, useEffect, useCallback, useRef } from "react";
import type { VscoApiResponse, VscoError, VscoImage } from "@/types/vsco";

interface UseInfiniteVscoGalleryOptions {
  pageSize?: number;
}

export function useInfiniteVscoGallery(
  options: UseInfiniteVscoGalleryOptions = {}
) {
  const { pageSize = 12 } = options;

  const [images, setImages] = useState<VscoImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<VscoError | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPage = useCallback(
    async (offset: number, reset = false) => {
      try {
        if (offset === 0) setLoading(true);
        else setLoadingMore(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("limit", pageSize.toString());
        params.set("offset", offset.toString());

        const response = await fetch(`/api/vsco?${params.toString()}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const data: VscoApiResponse = await response.json();

        if (reset) {
          setImages(data.images);
        } else {
          setImages((prev) => {
            const seen = new Set(prev.map((img) => img.id));
            const unique = data.images.filter((img) => !seen.has(img.id));
            return [...prev, ...unique];
          });
        }

        setHasMore(data.hasMore);
        setTotalCount(data.totalCount);
      } catch (err) {
        setError({
          message:
            err instanceof Error ? err.message : "Failed to fetch gallery",
          status: 500,
        });
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [pageSize]
  );

  const imagesRef = useRef(images);
  imagesRef.current = images;

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    await fetchPage(imagesRef.current.length);
  }, [loadingMore, hasMore, fetchPage]);

  useEffect(() => {
    fetchPage(0, true);
  }, [fetchPage]);

  return { images, loading, error, hasMore, loadMore, totalCount };
}
