"use client";

import { getCalApi } from "@calcom/embed-react";
import React, { useEffect } from "react";

interface CalButtonProps {
  icon?: React.ReactNode;
  label?: string;
}

export default function CalButton(props: CalButtonProps) {
  const { icon, label } = props;

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "15min" });
      cal("ui", {
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <button
      data-cal-namespace="15min"
      data-cal-link="nicholas-adamou/15min"
      data-cal-config='{"layout":"month_view"}'
      className="inline-grid w-full rounded-lg bg-secondary p-4 no-underline transition-opacity"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="ml-auto h-5 w-5 text-secondary"
        >
          <path
            fillRule="evenodd"
            d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </button>
  );
}
