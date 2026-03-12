"use client";

import { Toaster } from "react-hot-toast";
import { useTheme } from "@/components/ThemeProvider";
import { useHomeLayout } from "@/hooks/use-home-layout";

export default function ThemedToaster() {
  const { shouldUseDarkText } = useTheme();
  const { layout } = useHomeLayout();
  const light = shouldUseDarkText();

  return (
    <Toaster
      position="bottom-center"
      containerStyle={{ bottom: layout === "two-column" ? 24 : 80 }}
      toastOptions={{
        style: {
          background: light ? "#1c1917" : "#fafaf9",
          color: light ? "#fafaf9" : "#1c1917",
          fontSize: "0.875rem",
        },
      }}
    />
  );
}
