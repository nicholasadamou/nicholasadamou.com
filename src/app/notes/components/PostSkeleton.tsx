"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  skeletonVariants,
  itemVariants,
  DURATION,
  EASING,
} from "@/lib/animations";

export default function PostSkeleton() {
  return (
    <motion.div
      className="py-3 transition-opacity"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.normal, ease: EASING.easeOut }}
      >
        <motion.div
          {...({ className: "flex items-center justify-between" } as any)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.1,
            duration: DURATION.normal,
            ease: EASING.easeOut,
          }}
        >
          <motion.div
            {...({ className: "flex-1" } as any)}
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "75%" }}
              transition={{
                delay: 0.2,
                duration: DURATION.slow,
                ease: EASING.easeOut,
              }}
            >
              <Skeleton className="mb-2 h-6 w-full" />
            </motion.div>
            <motion.div
              className="mt-1 flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.3,
                duration: DURATION.normal,
                ease: EASING.easeOut,
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.4,
                  duration: DURATION.normal,
                  ease: EASING.bouncy,
                }}
              >
                <Skeleton className="h-4 w-20" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.45,
                  duration: DURATION.normal,
                  ease: EASING.bouncy,
                }}
              >
                <Skeleton className="h-4 w-4 rounded-full" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.5,
                  duration: DURATION.normal,
                  ease: EASING.bouncy,
                }}
              >
                <Skeleton className="h-4 w-24" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          {...({ className: "mt-2" } as any)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: DURATION.normal,
            ease: EASING.easeOut,
          }}
        >
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{
              delay: 0.7,
              duration: DURATION.slow,
              ease: EASING.easeOut,
            }}
          >
            <Skeleton className="mt-2 h-4 w-full" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{
              delay: 0.8,
              duration: DURATION.slow,
              ease: EASING.easeOut,
            }}
          >
            <Skeleton className="mt-2 h-4 w-full" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "66.67%" }}
            transition={{
              delay: 0.9,
              duration: DURATION.slow,
              ease: EASING.easeOut,
            }}
          >
            <Skeleton className="mt-2 h-4 w-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
