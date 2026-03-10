import { useState, useEffect, useRef } from "react";

export function useBatchViews(slugs: string[]) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current || slugs.length === 0) return;
    hasFetched.current = true;

    fetch(`/api/notes/views?slugs=${slugs.join(",")}`)
      .then((res) => res.json())
      .then((data) => setCounts(data.counts ?? {}))
      .catch(() => {});
  }, [slugs]);

  return counts;
}
