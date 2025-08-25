import React from 'react'
import { type LucideIcon } from 'lucide-react'

interface TabButtonProps {
	icon: LucideIcon
	isActive: boolean
	onClick: () => void
	label: string
}

export function TabButton({ icon: Icon, isActive, onClick, label }: TabButtonProps) {
	return (
		<button
			type="button"
			role="tab"
			aria-selected={isActive}
			data-state={isActive ? "active" : "inactive"}
			className={`inline-flex min-w-[50px] items-center justify-center px-3 py-1.5 text-sm font-medium text-secondary transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-secondary data-[state=active]:text-secondary data-[state=active]:shadow-sm dark:text-slate-200 dark:data-[state=active]:bg-secondary dark:data-[state=active]:text-slate-100 rounded-full md:min-w-[30px]`}
			onClick={onClick}
			aria-label={label}
		>
			<Icon className="w-4 h-4" />
		</button>
	)
}
