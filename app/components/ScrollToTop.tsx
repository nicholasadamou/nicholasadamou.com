"use client";

import { useEffect, useState } from 'react';
import { ArrowUpIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

export const ScrollToTop = () => {
	const [isVisible, setIsVisible] = useState(false);
	const { theme } = useTheme();

	const toggleVisibility = () => {
		setIsVisible(window.scrollY > 300);
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		window.addEventListener('scroll', toggleVisibility);

		return () => {
			window.removeEventListener('scroll', toggleVisibility);
		};
	}, []);

	return (
		<div className="fixed bottom-2 right-2">
			<AnimatePresence>
				{isVisible && (
					<motion.button
						type="button"
						onClick={scrollToTop}
						className={clsx(
							theme === 'light'
								? 'bg-white bg-opacity-70 hover:bg-opacity-90 focus:ring-gray-500 text-black border-[1px] border-black'
								: 'bg-black bg-opacity-70 hover:bg-opacity-90 focus:ring-gray-300 text-white border-[1px] border-white',
							'inline-flex items-center rounded-full p-2 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-md backdrop-filter',
							'block lg:hidden'
						)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.7 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						<ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
					</motion.button>
				)}
			</AnimatePresence>
		</div>
	);
};
