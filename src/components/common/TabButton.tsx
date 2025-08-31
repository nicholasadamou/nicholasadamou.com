import React from "react";
import { type LucideIcon } from "lucide-react";

interface TabButtonProps {
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  label: string;
}

export function TabButton({
  icon: Icon,
  isActive,
  onClick,
  label,
}: TabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      className={`text-secondary data-[state=active]:bg-contrast data-[state=active]:text-primary hover:text-primary inline-flex min-w-[50px] cursor-pointer items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm md:min-w-[30px]`}
      onClick={onClick}
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
