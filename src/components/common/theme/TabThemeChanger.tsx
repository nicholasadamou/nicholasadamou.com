"use client";

import React, { useEffect, useState } from "react";
import { TabButton } from "../ui/TabButton";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { themeConfigs } from "./ThemeIcons";

const tabs = themeConfigs.map((config) => ({
  id: config.value,
  icon: config.icon,
  label: `${config.label} mode`,
}));

export default function TabThemeChanger() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

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
              isActive={theme === tab.id}
              onClick={() => setTheme(tab.id)}
              label={tab.label}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
