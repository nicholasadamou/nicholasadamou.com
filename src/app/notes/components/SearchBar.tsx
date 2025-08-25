import React from 'react';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	kind: string;
}

export default function SearchBar({ searchTerm, setSearchTerm, kind, ...props }: SearchBarProps) {
	return (
		<div className="w-full" {...props}>
			<input
				type="text"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				placeholder={`Search ${kind}`}
				className="w-full px-4 py-2 border text-primary border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
	);
}

