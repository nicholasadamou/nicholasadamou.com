"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/app/components/ui/skeleton";

const skeletonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: "easeOut",
      opacity: { duration: 0.5, ease: "easeOut" },
    },
  }),
  pulse: {
    opacity: [0.7, 0.9, 0.7],
    transition: {
      repeat: Infinity,
      duration: 2,
    },
  },
};

export default function PostSkeleton() {
  return (
    <div className="py-3 transition-opacity">
      <div className="transition-opacity">
        <motion.div
          {...({className: "flex items-center justify-between"} as any)}
          initial="hidden"
          animate="visible"
          custom={0}
          variants={skeletonVariants}
        >
          <motion.div
            {...({className: "flex-1"} as any)}
            variants={skeletonVariants}
            animate="pulse"
          >
            <Skeleton className="h-6 w-3/4 mb-2" />
            <div className="flex items-center space-x-2 mt-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          {...({className: "mt-2"} as any)}
          initial="hidden"
          animate="visible"
          custom={1}
          variants={skeletonVariants}
        >
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </motion.div>
      </div>
    </div>
  );
}
