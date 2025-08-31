"use client";

import React, { useEffect, useState } from "react";
import { Moon, Monitor, Sun } from "lucide-react";
import { TabButton } from "./TabButton";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";

const tabs = [
  { id: "dark", icon: Moon, label: "Dark mode" },
  { id: "system", icon: Monitor, label: "System mode" },
  { id: "light", icon: Sun, label: "Light mode" },
];

export default function TabThemeChanger() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className="bg-tertiary flex items-center justify-center rounded-full p-1"
      tabIndex={0}
    >
      <AnimatePresence>
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <TabButton
              icon={tab.icon}
              isActive={
                !!(
                  theme === tab.id ||
                  (tab.id === "system" && theme === "system" && resolvedTheme)
                )
              }
              onClick={() => setTheme(tab.id)}
              label={tab.label}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
