"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GitCommit } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

function CommitHashLink(): React.JSX.Element | null {
  const [commitHash, setCommitHash] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommitHash = async () => {
      try {
        const response = await fetch("/api/commit");
        if (response.ok) {
          const data = await response.json();
          setCommitHash(data.commitHash);
        } else {
          console.error("Failed to fetch commit hash");
        }
      } catch (error) {
        console.error("Error fetching commit hash:", error);
      }
    };

    fetchCommitHash();
  }, []);

  if (!commitHash) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              className="flex items-center gap-1 rounded-full bg-tertiary px-2 py-1 text-sm text-secondary transition-colors duration-200 hover:bg-tertiary dark:bg-secondary"
              href={`https://github.com/nicholasadamou/nicholasadamou.com/commit/${commitHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitCommit className="h-4 w-4" />
              <span className="font-mono">{commitHash.slice(0, 7)}</span>
            </Link>
          </motion.div>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
}

export default CommitHashLink;
