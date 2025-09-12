import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TabButtons } from "./TabButtons";
import { FeaturedItemDetails } from "./FeaturedItemDetails";
import { FeaturedSectionProps } from "./types";

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  items,
  title,
  description,
  buttonText,
  componentsTitle = "Key Components",
  autoRotateInterval = 8000,
}) => {
  const [activeTab, setActiveTab] = useState<string>(items[0]?.name || "");

  // Auto-cycle through items
  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = items.findIndex((item) => item.name === prev);
        const nextIndex = (currentIndex + 1) % items.length;
        return items[nextIndex].name;
      });
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [items, autoRotateInterval]);

  if (items.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="mb-3 w-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h3 className="text-md mb-2 font-bold">{title}</h3>
      <p className="mb-6">{description}</p>
      <TabButtons
        items={items}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <AnimatePresence mode="wait">
        {items.map(
          (item) =>
            item.name === activeTab && (
              <FeaturedItemDetails
                key={item.name}
                item={item}
                buttonText={buttonText}
                componentsTitle={componentsTitle}
              />
            )
        )}
      </AnimatePresence>
    </motion.section>
  );
};
