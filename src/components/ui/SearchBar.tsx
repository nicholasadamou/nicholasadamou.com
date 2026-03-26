"use client";

import { Filter } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showFilterToggle?: boolean;
  onToggleFilters?: () => void;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  showFilterToggle = true,
  onToggleFilters,
}: SearchBarProps) {
  const { shouldUseDarkText } = useTheme();
  const dark = shouldUseDarkText();

  const inputBg = dark
    ? "bg-stone-950/5 placeholder:text-stone-950/30 focus:ring-stone-950/10"
    : "bg-white/5 placeholder:text-white/30 focus:ring-white/10";

  const funnelBg = dark ? "hover:bg-stone-950/5" : "hover:bg-white/5";
  const labelText = dark ? "text-stone-950/50" : "text-white/50";

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border-none px-4 py-2.5 pr-12 text-sm transition-colors outline-none focus:ring-1 ${inputBg}`}
      />
      {showFilterToggle && onToggleFilters && (
        <button
          onClick={onToggleFilters}
          className={`absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-md p-2 ${funnelBg}`}
          title="Toggle filters"
        >
          <Filter className={`h-4 w-4 ${labelText}`} />
        </button>
      )}
    </div>
  );
}
