"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import GumroadLogo from "./GumroadLogo";

export default function ThemeAwareGumroadLogo({
  className = "",
}: {
  className?: string;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return <GumroadLogo className="text-gray-900" />;
  }

  // Apply correct color based on actual resolved theme
  const logoColor =
    resolvedTheme === "dark" ? "text-gray-100" : "text-gray-900";

  return <GumroadLogo className={`${logoColor} ${className}`} />;
}
