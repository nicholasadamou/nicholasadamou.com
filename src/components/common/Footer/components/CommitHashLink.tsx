'use client'

import Link from "next/link"
import React, { useEffect, useState } from "react"
import { GitCommit } from 'lucide-react'
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

function CommitHashLink(): React.JSX.Element | null {
	const [commitHash, setCommitHash] = useState<string | null>(null)

	useEffect(() => {
		const fetchCommitHash = async () => {
			try {
				const response = await fetch('/api/commit')
				if (response.ok) {
					const data = await response.json()
					setCommitHash(data.commitHash)
				} else {
					console.error('Failed to fetch commit hash')
				}
			} catch (error) {
				console.error('Error fetching commit hash:', error)
			}
		}

		fetchCommitHash()
	}, [])

	if (!commitHash) return null

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Link
							className="text-sm transition-colors duration-200 text-secondary flex items-center gap-1 bg-tertiary dark:bg-secondary hover:bg-tertiary py-1 px-2 rounded-full"
							href={`https://github.com/nicholasadamou/nicholasadamou.com/commit/${commitHash}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<GitCommit className="w-4 h-4" />
							<span className="font-mono">{commitHash.slice(0, 7)}</span>
						</Link>
					</motion.div>
				</TooltipTrigger>
			</Tooltip>
		</TooltipProvider>
	)
}

export default CommitHashLink
