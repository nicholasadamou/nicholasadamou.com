"use client";

import { Toaster } from "react-hot-toast";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemedToaster() {
  const { shouldUseDarkText } = useTheme();
  const light = shouldUseDarkText();

  return (
    <Toaster
      position="bottom-center"
      containerStyle={{ bottom: 80 }}
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
