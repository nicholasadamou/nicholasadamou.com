import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@/components/ui/link";
import { Card } from "@/app/projects/components/Card";
import { FeaturedItem } from "./types";

interface FeaturedItemDetailsProps {
  item: FeaturedItem;
  buttonText: (itemName: string) => string;
  componentsTitle?: string;
}

export const FeaturedItemDetails: React.FC<FeaturedItemDetailsProps> = ({
  item,
  buttonText,
  componentsTitle = "Key Components",
}) => (
  <motion.div
    key={item.name}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
  >
    <div>
      <h3 className="mb-6 text-xl font-bold">{item.name}</h3>
      <p className="text-secondary mb-6 text-lg">{item.description}</p>
      <div className="mb-6 grid place-content-center gap-8 md:grid-cols-2">
        {item.features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <Card
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </motion.div>
        ))}
      </div>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h4 className="text-lg font-bold">{componentsTitle}</h4>
        <ul className="text-md list-none space-y-4">
          {item.components.map((component, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0">{component.icon}</div>
              <div>
                <h3 className="text-primary text-lg font-bold">
                  {component.title}
                </h3>
                <p className="text-secondary mt-1 text-base">
                  {component.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <Link
            asChild
            className="mt-5 rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <a href={item.url} className="flex items-center" target="_blank">
              {buttonText(item.name)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>
      </motion.div>
    </div>
  </motion.div>
);
