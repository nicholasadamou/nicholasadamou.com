import React from "react";

import { cn } from "@/lib/utils/utils";

interface CardItemProps {
  className?: string;
  children?: React.ReactNode;
}

export function CardItem({ className, children }: CardItemProps) {
  return (
    <div
      className={cn(
        "border-primary bg-tertiary flex size-full items-center justify-center rounded-xl border",
        className
      )}
    >
      {children}
    </div>
  );
}
