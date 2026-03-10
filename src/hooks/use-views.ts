import { useState, useEffect, useRef } from "react";

export function useViews(slug: string, increment = true) {
  const [count, setCount] = useState(0);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch(`/api/notes/${slug}/views`)
      .then((res) => res.json())
      .then((data) => setCount(data.count ?? 0))
      .catch(() => {});

    if (increment) {
      fetch(`/api/notes/${slug}/views`, { method: "POST" })
        .then((res) => {
          if (res.ok) setCount((c) => c + 1);
        })
        .catch(() => {});
    }
  }, [slug, increment]);

  return count;
}
