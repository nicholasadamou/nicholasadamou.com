'use client'

import Link from "next/link"
import React from "react"
import { Github } from 'lucide-react'
import { motion } from "framer-motion"
import CommitHashLink from "@/app/components/CommitHashLink"

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
				<CommitHashLink />
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
