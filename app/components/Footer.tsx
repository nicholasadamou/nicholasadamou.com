'use client'

import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Github, GitCommit } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip"
import { motion } from "framer-motion"

const footerVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: "easeOut",
			when: "beforeChildren",
			staggerChildren: 0.1
		}
	}
}

const childVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.3, ease: "easeOut" }
	}
}

export function Footer(): React.JSX.Element {
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

	return (
		<motion.footer
			className="absolute bottom-0 inset-x-0 px-8 md:px-4 max-w-[700px] mx-auto flex flex-row gap-2 mt-32 py-6 w-full shrink-0 items-center justify-between"
			initial="hidden"
			animate="visible"
			variants={footerVariants}
		>
			<motion.p className="text-sm text-secondary" variants={childVariants}>
				&copy; {new Date().getFullYear()} Nicholas Adamou.
			</motion.p>
			<motion.nav className="sm:ml-auto flex gap-4 sm:gap-6 items-center" variants={childVariants}>
				{commitHash && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Link
										className="text-sm transition-colors duration-200 text-secondary flex items-center gap-1 bg-[#191919] py-1 px-2 rounded-full"
										href={`https://github.com/nicholasadamou/nicholasadamou.com/commit/${commitHash}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<GitCommit className="w-4 h-4" />
										<span className="font-mono">{commitHash.slice(0, 7)}</span>
									</Link>
								</motion.div>
							</TooltipTrigger>
							<TooltipContent>
								<p>View latest commit</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
				<motion.div
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
				>
					<Link
						className="text-sm hover:text-primary transition-colors duration-200 text-secondary flex items-center gap-1"
						href="https://github.com/nicholasadamou/nicholasadamou.com"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Github className="w-4 h-4" />
					</Link>
				</motion.div>
			</motion.nav>
		</motion.footer>
	)
}
