"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Github, Linkedin, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { themeConfigs, type ThemeConfig } from "../ThemeIcons";

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
} as const;

const childVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
} as const;

// Compact Theme Switcher for Footer
function FooterThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-tertiary inline-flex h-8 rounded-full p-0.5">
        <div className="bg-secondary mr-0.5 h-7 w-7 animate-pulse rounded-full" />
        <div className="bg-secondary mr-0.5 h-7 w-7 animate-pulse rounded-full" />
        <div className="bg-secondary h-7 w-7 animate-pulse rounded-full" />
      </div>
    );
  }

  return (
    <fieldset className="bg-tertiary inline-flex gap-0 rounded-full p-0.5">
      <legend className="sr-only">Select a display theme:</legend>
      {themeConfigs.map((themeConfig: ThemeConfig) => {
        // Check if this option is actually selected (what user clicked)
        const isSelected = theme === themeConfig.value;
        // For visual indication, we want to show what the user selected, not the resolved theme
        const isVisuallyActive = isSelected;
        const IconComponent = themeConfig.icon;

        return (
          <div key={themeConfig.value} className="relative">
            <input
              type="radio"
              value={themeConfig.value}
              checked={isSelected}
              onChange={() => setTheme(themeConfig.value)}
              id={`theme-switch-${themeConfig.value}`}
              className="sr-only"
            />
            <motion.label
              htmlFor={`theme-switch-${themeConfig.value}`}
              className={`
                relative z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-all duration-200
                ${isVisuallyActive ? "text-primary dark:text-secondary" : "text-secondary hover:text-primary"}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">{themeConfig.label}</span>
              <IconComponent className="h-4 w-4" />
            </motion.label>
            {isVisuallyActive && (
              <motion.div
                className="bg-secondary absolute inset-0 rounded-full"
                layoutId="footer-theme-switcher-bg"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </div>
        );
      })}
    </fieldset>
  );
}

// Scroll to Top Button Component
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <motion.button
      onClick={scrollToTop}
      className="text-secondary hover:text-primary cursor-pointer transition-colors duration-200"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-4 w-4" />
    </motion.button>
  );
}

export function Footer(): React.ReactElement {
  return (
    <motion.footer initial="hidden" animate="visible" variants={footerVariants}>
      <div className="mx-auto max-w-4xl px-4 py-4 md:px-0">
        {/* Main Footer Content */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:gap-6">
          {/* Left Section - Copyright */}
          <motion.div
            className="flex flex-col gap-2 sm:gap-0"
            variants={childVariants}
          >
            <p className="text-secondary text-sm">
              &copy; {new Date().getFullYear()} Nicholas Adamou. All rights
              reserved.
            </p>
          </motion.div>

          {/* Right Section - Social Links & Theme Switcher */}
          <motion.div
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
            variants={childVariants}
          >
            {/* Social Links */}
            <nav
              className="flex items-center gap-3"
              aria-label="Social Media Links"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  className="text-secondary hover:text-primary group transition-colors duration-200"
                  href="https://vsco.co/nicholasadamou"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="VSCO Profile"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="transition-transform duration-200 group-hover:rotate-12"
                  >
                    <title>VSCO</title>
                    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm11.52 12c0 .408-.023.792-.072 1.176l-2.04-.24c.024-.312.05-.624.05-.936 0-.288-.025-.6-.05-.888l2.04-.24c.072.384.072.744.072 1.128zM.479 12c0-.384.024-.769.049-1.152l2.04.24c-.024.312-.047.6-.047.912s.023.6.047.912l-2.04.24C.479 12.769.479 12.384.479 12zm20.472-3.096l1.921-.72c.264.72.433 1.464.552 2.232l-2.04.24c-.097-.6-.24-1.2-.433-1.752zM21 12c0 .6-.072 1.176-.167 1.752l-2.017-.455c.071-.409.119-.841.119-1.297s-.048-.912-.119-1.344l2.017-.457c.118.577.167 1.177.167 1.801zm-9 6.456C8.435 18.455 5.545 15.565 5.544 12 5.545 8.435 8.435 5.545 12 5.544c3.565.001 6.455 2.891 6.456 6.456.008 3.559-2.871 6.448-6.429 6.456H12zM12.216 21v-2.064c.885-.029 1.756-.224 2.568-.575l.888 1.872c-1.09.482-2.264.742-3.456.767zm-3.936-.791l.912-1.873c.792.359 1.656.575 2.568.6V21c-1.202-.023-2.386-.293-3.48-.791zM3 12c0-.624.072-1.224.192-1.824l2.016.456c-.098.45-.146.908-.144 1.368 0 .432.048.864.12 1.272l-2.016.455C3.051 13.159 2.994 12.58 3 12zm8.76-9v2.064c-.877.029-1.74.224-2.544.576l-.888-1.871C9.411 3.291 10.577 3.03 11.76 3zm3.935.792l-.911 1.872c-.809-.363-1.682-.559-2.568-.576V3.024c1.248 0 2.424.288 3.479.768zm5.088 4.656c-.231-.56-.513-1.098-.84-1.608l1.681-1.152c.407.648.768 1.32 1.056 2.04l-1.897.72zm-.07 1.296l-2.018.456c-.23-.85-.621-1.648-1.151-2.352l1.632-1.295c.72.959 1.248 2.015 1.537 3.191zm-3.457-2.256c-.572-.667-1.264-1.22-2.04-1.633l.912-1.871c1.056.549 1.993 1.299 2.76 2.208l-1.632 1.296zm-.6-3.744l.96-1.824c.672.384 1.295.816 1.896 1.32L18.145 4.8c-.461-.401-.959-.754-1.489-1.056zm-.408-.216c-.54-.266-1.102-.483-1.68-.648l.504-1.992c.744.216 1.464.48 2.159.84l-.983 1.8zm-2.16-.768c-.6-.144-1.2-.216-1.824-.239V.479c.793.024 1.584.12 2.328.289l-.504 1.992zm-2.28-.239c-.605.021-1.207.094-1.8.216L9.528.744c.72-.168 1.487-.265 2.28-.265v2.042zm-2.28.334c-.586.167-1.156.384-1.704.649l-.96-1.824c.691-.343 1.415-.616 2.16-.816l.504 1.991zm-2.112.865c-.529.294-1.027.64-1.488 1.032L4.56 3.216c.6-.504 1.224-.936 1.896-1.319l.96 1.823zm.48.264l.888 1.871c-.792.408-1.464.96-2.04 1.608L5.136 6.168c.775-.895 1.711-1.636 2.76-2.184zM4.848 6.552l1.608 1.295c-.53.705-.921 1.503-1.152 2.353l-2.016-.456c.312-1.2.84-2.28 1.56-3.192zM3.24 8.4l-1.92-.72c.287-.72.648-1.416 1.08-2.04l1.68 1.176c-.341.494-.623 1.025-.84 1.584zm-.168.455c-.192.577-.36 1.152-.432 1.776L.6 10.393c.12-.769.288-1.537.553-2.257l1.919.719zm-.456 4.513c.096.6.239 1.2.432 1.776l-1.92.72c-.271-.728-.456-1.485-.552-2.257l2.04-.239zm.624 2.208c.239.576.528 1.104.84 1.607L2.4 18.336c-.435-.629-.797-1.306-1.08-2.016l1.92-.744zm.024-1.392l2.017-.456c.216.864.624 1.681 1.128 2.376L4.8 17.4c-.725-.957-1.247-2.051-1.536-3.216zm3.432 2.28c.577.672 1.272 1.248 2.064 1.656l-.912 1.872c-1.063-.557-2.009-1.315-2.784-2.232l1.632-1.296zm.72 3.815l-.96 1.825c-.674-.376-1.31-.819-1.896-1.321l1.368-1.535c.456.407.936.744 1.488 1.031zm.408.217c.528.264 1.104.48 1.705.647l-.504 1.992c-.747-.196-1.471-.469-2.16-.815l.959-1.824zm2.16.768c.576.12 1.176.193 1.8.217v2.039c-.774-.026-1.544-.114-2.305-.264l.505-1.992zm2.28.216c.605-.021 1.207-.094 1.801-.217l.479 1.992c-.749.168-1.513.264-2.28.287V21.48zm2.257-.336c.586-.165 1.155-.382 1.703-.647l.96 1.824c-.688.35-1.412.623-2.159.815l-.504-1.992zm2.086-.865c.528-.287 1.032-.647 1.488-1.031l1.369 1.535c-.588.502-1.223.945-1.896 1.321l-.961-1.825zm-.479-.263l-.888-1.871c.788-.414 1.489-.977 2.064-1.656l1.606 1.296c-.778.91-1.722 1.668-2.782 2.231zm3.071-2.592l-1.607-1.296c.532-.708.916-1.517 1.128-2.376l2.017.456c-.311 1.157-.831 2.248-1.538 3.216zM20.76 15.6l1.92.721c-.288.72-.648 1.392-1.079 2.04l-1.682-1.177c.337-.504.624-1.032.841-1.584zm.168-.455c.192-.553.336-1.152.433-1.752l2.039.239c-.11.761-.294 1.508-.551 2.232l-1.921-.719zm.456-9.841l-1.681 1.152c-.358-.49-.76-.947-1.199-1.368l1.368-1.536c.552.552 1.056 1.128 1.512 1.752zM4.2 3.528l1.368 1.536c-.456.408-.84.864-1.2 1.368l-1.68-1.176c.431-.636.94-1.216 1.512-1.728zM2.664 18.744l1.68-1.152c.36.48.769.937 1.2 1.369l-1.368 1.535c-.548-.545-1.054-1.131-1.512-1.752zm17.16 1.729l-1.368-1.537c.432-.407.841-.863 1.199-1.344l1.682 1.176c-.457.6-.961 1.175-1.513 1.705z" />
                  </svg>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  className="text-secondary hover:text-primary group transition-colors duration-200"
                  href="https://github.com/nicholasadamou"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                >
                  <Github className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  className="text-secondary hover:text-primary group transition-colors duration-200"
                  href="https://www.linkedin.com/in/nicholas-adamou"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  className="text-secondary hover:text-primary group transition-colors duration-200"
                  href="https://leetcode.com/nicholasadamou"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LeetCode Profile"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    className="transition-transform duration-200 group-hover:rotate-12"
                  >
                    <path
                      fill="currentColor"
                      d="M13.483 0a1.37 1.37 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.3 5.3 0 0 0-1.209 2.104a5 5 0 0 0-.125.513a5.5 5.5 0 0 0 .062 2.362a6 6 0 0 0 .349 1.017a5.9 5.9 0 0 0 1.271 1.818l4.277 4.193l.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.38 1.38 0 0 0-1.951-.003l-2.396 2.392a3.02 3.02 0 0 1-4.205.038l-.02-.019l-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.7 2.7 0 0 1 .066-.523a2.55 2.55 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0m-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382a1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382a1.38 1.38 0 0 0-1.38-1.382z"
                    />
                  </svg>
                </Link>
              </motion.div>

              <ScrollToTopButton />
            </nav>

            {/* Theme Switcher */}
            <div className="self-start">
              <FooterThemeSwitcher />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}
