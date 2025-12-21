import React from "react";
import { motion } from "framer-motion";
import { FeaturedItem } from "./types";

interface TabButtonsProps {
  items: FeaturedItem[];
  activeTab: string;
  onTabClick: (name: string) => void;
}

export const TabButtons: React.FC<TabButtonsProps> = ({
  items,
  activeTab,
  onTabClick,
}) => (
  <div className="mb-4 flex flex-wrap justify-start gap-2">
    {items.map((item) => (
      <motion.button
        key={item.name}
        className={`text-md cursor-pointer rounded-2xl px-4 py-2 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          activeTab === item.name
            ? "bg-tertiary text-primary dark:bg-white dark:text-white"
            : "bg-white text-black dark:bg-black dark:text-white"
        }`}
        onClick={() => onTabClick(item.name)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-pressed={activeTab === item.name}
      >
        {item.name}
      </motion.button>
    ))}
  </div>
);
