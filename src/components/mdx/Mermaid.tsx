"use client";

import { useEffect, useId, useRef, useState } from "react";

export default function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const container = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    async function render() {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "neutral",
          fontFamily: "sans-serif",
        });
        const { svg } = await mermaid.render(`diagram-${id}`, chart);
        if (active && container.current) {
          container.current.innerHTML = svg;
          setError(false);
        }
      } catch (cause) {
        console.error("Unable to render case-study diagram", cause);
        if (active) setError(true);
      }
    }
    void render();
    return () => {
      active = false;
    };
  }, [chart, id]);
  return (
    <figure className="not-prose my-8 overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 p-4 text-stone-950">
      <div
        ref={container}
        role="img"
        aria-label="Project architecture diagram"
        className="[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      >
        <pre className="overflow-x-auto text-xs">{chart}</pre>
      </div>
      {error && (
        <figcaption className="mt-2 text-sm">
          Diagram preview unavailable. The source is shown above.
        </figcaption>
      )}
    </figure>
  );
}
