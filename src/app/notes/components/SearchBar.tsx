import React from "react";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  kind: string;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  kind,
  ...props
}: SearchBarProps) {
  return (
    <div className="w-full" {...props}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={`Search ${kind}`}
        className="w-full rounded-md border border-secondary px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
