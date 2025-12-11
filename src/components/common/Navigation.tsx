"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Bars3Icon } from "@heroicons/react/20/solid";
import NavLink from "@/components/common/NavLink";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import TabThemeChanger from "@/components/common/TabThemeChanger";
import { Link } from "@/components/ui/link";
import { Sheet } from "@/components/ui/sheet";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FileText } from "lucide-react";
import Image from "next/image";

const links = [
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Projects", href: "/projects" },
  { label: "Notes", href: "/notes" },
  { label: "Contact", href: "/contact" },
];

export default function Navigation() {
  const pathname = `/${usePathname().split("/")[1]}`; // active paths on dynamic sub-pages
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const socialLinks = [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/nicholas-adamou",
      icon: <FaLinkedin className="h-4 w-4" style={{ color: "#0A66C2" }} />,
    },
    {
      label: "GitHub",
      href: "https://github.com/nicholasadamou",
      icon: (
        <FaGithub
          className="h-4 w-4"
          style={{ color: resolvedTheme === "dark" ? "#FFFFFF" : "#333333" }}
        />
      ),
    },
    {
      label: "LeetCode",
      href: "https://leetcode.com/nicholasadamou",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-4 w-4"
        >
          <path
            fill="#FFA116"
            d="M13.483 0a1.37 1.37 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.3 5.3 0 0 0-1.209 2.104a5 5 0 0 0-.125.513a5.5 5.5 0 0 0 .062 2.362a6 6 0 0 0 .349 1.017a5.9 5.9 0 0 0 1.271 1.818l4.277 4.193l.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.38 1.38 0 0 0-1.951-.003l-2.396 2.392a3.02 3.02 0 0 1-4.205.038l-.02-.019l-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.7 2.7 0 0 1 .066-.523a2.55 2.55 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0m-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382a1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382a1.38 1.38 0 0 0-1.38-1.382z"
          />
        </svg>
      ),
    },
  ];

  const companyLinks = [
    {
      label: "DotBrains",
      href: "https://dotbrains.dev",
      icon: (
        <Image
          src="/logos/dotbrains.png"
          alt="DotBrains"
          width={16}
          height={16}
          className="h-4 w-4"
        />
      ),
    },
    {
      label: "You Build It",
      href: "https://youbuildit.dev",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
        >
          <rect width="24" height="24" rx="6" fill="#2fbc77" />
          <path
            d="M6 8L10 12L6 16"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 16H18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  // Prevent rendering theme-dependent logic until after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const [svgFill, setSvgFill] = useState(
    resolvedTheme === "dark" ? "white" : "black"
  );
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Update the fill color based on the current theme and scroll state
    if (resolvedTheme) {
      if (isScrolled) {
        // When scrolled: bg-contrast (white in light, dark in dark) - logo needs to be opposite
        setSvgFill(resolvedTheme === "dark" ? "white" : "black");
      } else {
        // When not scrolled: transparent bg, use theme-appropriate logo color
        setSvgFill(resolvedTheme === "dark" ? "white" : "black");
      }
    }
  }, [resolvedTheme, isScrolled]);

  useEffect(() => {
    setIsScrolled(window.scrollY > 20); // On initial load, apply blur if scrolled

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20); // Apply blur after scrolling 20px
    };

    // Use `requestAnimationFrame` for smoother scroll handling
    const handleScrollThrottled = () => requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", handleScrollThrottled);

    return () => window.removeEventListener("scroll", handleScrollThrottled);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <motion.header
        style={{ willChange: "transform, opacity" }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        {...({
          className: clsx(
            "z-30 mx-auto py-4 px-8 md:px-0 fixed top-0 left-1/2 transform -translate-x-1/2 w-full transition-all duration-300",
            isScrolled
              ? "bg-contrast/90 text-primary backdrop-blur-sm"
              : "bg-transparent text-primary"
          ),
        } as any)}
      >
        <div className="mx-auto flex max-w-4xl justify-between pl-0">
          <nav className="flex gap-3 py-3">
            <Link
              href="/"
              variant="ghost"
              className="text-primary shrink-0 pl-0"
            >
              <svg
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24.672 25.224C24.48 25.4373 24.128 25.608 23.616 25.736C23.104 25.864 22.528 25.9387 21.888 25.96C21.248 26.0027 20.5867 25.992 19.904 25.928C19.2213 25.8853 18.6133 25.7787 18.08 25.608C17.056 24.8827 16.16 24.0187 15.392 23.016C14.6453 22.0133 13.9733 21.064 13.376 20.168C12.8 19.2507 12.288 18.4827 11.84 17.864C11.392 17.224 10.9867 16.904 10.624 16.904C10.2827 16.904 10.0693 16.968 9.984 17.096C9.92 17.2027 9.888 17.4587 9.888 17.864C9.888 18.312 9.92 18.8027 9.984 19.336C10.0693 19.8693 10.1547 20.4133 10.24 20.968C10.3467 21.5013 10.432 22.0347 10.496 22.568C10.5813 23.1013 10.624 23.592 10.624 24.04C10.624 24.3387 10.6027 24.6267 10.56 24.904C10.5173 25.1813 10.4 25.4373 10.208 25.672C9.71733 25.9707 9.09867 26.184 8.352 26.312C7.62667 26.4613 6.86933 26.5467 6.08 26.568C5.29067 26.6107 4.53333 26.6 3.808 26.536C3.08267 26.4933 2.47467 26.4187 1.984 26.312C1.792 26.056 1.67467 25.8107 1.632 25.576C1.52533 25.1493 1.42933 24.6587 1.344 24.104C1.25867 23.528 1.184 22.952 1.12 22.376C1.07733 21.7787 1.03467 21.2027 0.992 20.648C0.970667 20.072 0.96 19.56 0.96 19.112C0.96 17.256 0.992 15.4427 1.056 13.672C1.14133 11.88 1.36533 10.1307 1.728 8.424C1.77067 8.25333 1.792 8.136 1.792 8.072C1.81333 7.98667 1.824 7.912 1.824 7.848C1.824 7.592 1.76 7.41067 1.632 7.304C1.52533 7.176 1.38667 7.06933 1.216 6.984C1.06667 6.87733 0.906667 6.77067 0.736 6.664C0.586667 6.536 0.458667 6.344 0.352 6.088C0.309333 5.98133 0.266667 5.82133 0.224 5.608C0.202667 5.39467 0.181333 5.18133 0.16 4.968C0.138667 4.73333 0.117333 4.52 0.096 4.328C0.096 4.11467 0.096 3.944 0.096 3.816C0.096 2.92 0.149333 2.22666 0.256 1.736C0.362667 1.24533 0.565333 0.882665 0.864 0.647999C1.16267 0.413333 1.568 0.274666 2.08 0.231998C2.592 0.189332 3.24267 0.167999 4.032 0.167999C4.672 0.167999 5.312 0.189332 5.952 0.231998C6.592 0.253332 7.232 0.263998 7.872 0.263998C8.42667 0.263998 9.00267 0.295998 9.6 0.359999C10.2187 0.423999 10.7627 0.637332 11.232 0.999998C11.5733 1.256 11.904 1.704 12.224 2.344C12.544 2.984 12.8533 3.70933 13.152 4.52C13.472 5.33066 13.7707 6.184 14.048 7.08C14.3467 7.95467 14.6453 8.76533 14.944 9.512C15.2427 10.2373 15.5307 10.8347 15.808 11.304C16.1067 11.7733 16.4053 12.008 16.704 12.008C17.0027 12.008 17.1733 11.848 17.216 11.528C17.28 11.208 17.312 10.8773 17.312 10.536C17.312 9.21333 17.2587 7.96533 17.152 6.792C17.0667 5.61867 17.024 4.38133 17.024 3.08C17.024 2.696 17.0453 2.25867 17.088 1.768C17.152 1.27733 17.3333 0.893333 17.632 0.615999C18.08 0.423999 18.6133 0.285332 19.232 0.199999C19.872 0.114665 20.5333 0.0719986 21.216 0.0719986C21.92 0.0719986 22.6027 0.125332 23.264 0.231998C23.9467 0.338665 24.544 0.487998 25.056 0.679998C25.4187 0.978665 25.6747 1.34133 25.824 1.768C26.0587 2.36533 26.24 3.048 26.368 3.816C26.496 4.584 26.592 5.37333 26.656 6.184C26.72 6.97333 26.7627 7.76267 26.784 8.552C26.8053 9.34133 26.816 10.056 26.816 10.696C26.816 11.272 26.8053 11.9653 26.784 12.776C26.784 13.5653 26.7627 14.4187 26.72 15.336C26.6773 16.232 26.6133 17.1493 26.528 18.088C26.464 19.0267 26.3573 19.9333 26.208 20.808C26.0587 21.6613 25.8667 22.4613 25.632 23.208C25.4187 23.9333 25.152 24.5307 24.832 25C24.7893 25.0427 24.7573 25.0747 24.736 25.096C24.736 25.1387 24.7147 25.1813 24.672 25.224Z"
                  fill={svgFill}
                />
              </svg>
            </Link>
            <ul className="hidden items-center gap-4 md:flex">
              {links.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href}>{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex">
              <TabThemeChanger />
            </div>
            <button
              className="text-secondary hover:text-primary mr-[-5px] flex h-8 w-8 items-center justify-center rounded-lg transition-colors md:hidden"
              onClick={() => setIsSheetOpen(true)}
              aria-label="Open menu"
            >
              <Bars3Icon className="text-primary h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile slide-in navigation */}
      <Sheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        logo={
          <svg
            width="32"
            height="32"
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer"
          >
            <path
              d="M24.672 25.224C24.48 25.4373 24.128 25.608 23.616 25.736C23.104 25.864 22.528 25.9387 21.888 25.96C21.248 26.0027 20.5867 25.992 19.904 25.928C19.2213 25.8853 18.6133 25.7787 18.08 25.608C17.056 24.8827 16.16 24.0187 15.392 23.016C14.6453 22.0133 13.9733 21.064 13.376 20.168C12.8 19.2507 12.288 18.4827 11.84 17.864C11.392 17.224 10.9867 16.904 10.624 16.904C10.2827 16.904 10.0693 16.968 9.984 17.096C9.92 17.2027 9.888 17.4587 9.888 17.864C9.888 18.312 9.92 18.8027 9.984 19.336C10.0693 19.8693 10.1547 20.4133 10.24 20.968C10.3467 21.5013 10.432 22.0347 10.496 22.568C10.5813 23.1013 10.624 23.592 10.624 24.04C10.624 24.3387 10.6027 24.6267 10.56 24.904C10.5173 25.1813 10.4 25.4373 10.208 25.672C9.71733 25.9707 9.09867 26.184 8.352 26.312C7.62667 26.4613 6.86933 26.5467 6.08 26.568C5.29067 26.6107 4.53333 26.6 3.808 26.536C3.08267 26.4933 2.47467 26.4187 1.984 26.312C1.792 26.056 1.67467 25.8107 1.632 25.576C1.52533 25.1493 1.42933 24.6587 1.344 24.104C1.25867 23.528 1.184 22.952 1.12 22.376C1.07733 21.7787 1.03467 21.2027 0.992 20.648C0.970667 20.072 0.96 19.56 0.96 19.112C0.96 17.256 0.992 15.4427 1.056 13.672C1.14133 11.88 1.36533 10.1307 1.728 8.424C1.77067 8.25333 1.792 8.136 1.792 8.072C1.81333 7.98667 1.824 7.912 1.824 7.848C1.824 7.592 1.76 7.41067 1.632 7.304C1.52533 7.176 1.38667 7.06933 1.216 6.984C1.06667 6.87733 0.906667 6.77067 0.736 6.664C0.586667 6.536 0.458667 6.344 0.352 6.088C0.309333 5.98133 0.266667 5.82133 0.224 5.608C0.202667 5.39467 0.181333 5.18133 0.16 4.968C0.138667 4.73333 0.117333 4.52 0.096 4.328C0.096 4.11467 0.096 3.944 0.096 3.816C0.096 2.92 0.149333 2.22666 0.256 1.736C0.362667 1.24533 0.565333 0.882665 0.864 0.647999C1.16267 0.413333 1.568 0.274666 2.08 0.231998C2.592 0.189332 3.24267 0.167999 4.032 0.167999C4.672 0.167999 5.312 0.189332 5.952 0.231998C6.592 0.253332 7.232 0.263998 7.872 0.263998C8.42667 0.263998 9.00267 0.295998 9.6 0.359999C10.2187 0.423999 10.7627 0.637332 11.232 0.999998C11.5733 1.256 11.904 1.704 12.224 2.344C12.544 2.984 12.8533 3.70933 13.152 4.52C13.472 5.33066 13.7707 6.184 14.048 7.08C14.3467 7.95467 14.6453 8.76533 14.944 9.512C15.2427 10.2373 15.5307 10.8347 15.808 11.304C16.1067 11.7733 16.4053 12.008 16.704 12.008C17.0027 12.008 17.1733 11.848 17.216 11.528C17.28 11.208 17.312 10.8773 17.312 10.536C17.312 9.21333 17.2587 7.96533 17.152 6.792C17.0667 5.61867 17.024 4.38133 17.024 3.08C17.024 2.696 17.0453 2.25867 17.088 1.768C17.152 1.27733 17.3333 0.893333 17.632 0.615999C18.08 0.423999 18.6133 0.285332 19.232 0.199999C19.872 0.114665 20.5333 0.0719986 21.216 0.0719986C21.92 0.0719986 22.6027 0.125332 23.264 0.231998C23.9467 0.338665 24.544 0.487998 25.056 0.679998C25.4187 0.978665 25.6747 1.34133 25.824 1.768C26.0587 2.36533 26.24 3.048 26.368 3.816C26.496 4.584 26.592 5.37333 26.656 6.184C26.72 6.97333 26.7627 7.76267 26.784 8.552C26.8053 9.34133 26.816 10.056 26.816 10.696C26.816 11.272 26.8053 11.9653 26.784 12.776C26.784 13.5653 26.7627 14.4187 26.72 15.336C26.6773 16.232 26.6133 17.1493 26.528 18.088C26.464 19.0267 26.3573 19.9333 26.208 20.808C26.0587 21.6613 25.8667 22.4613 25.632 23.208C25.4187 23.9333 25.152 24.5307 24.832 25C24.7893 25.0427 24.7573 25.0747 24.736 25.096C24.736 25.1387 24.7147 25.1813 24.672 25.224Z"
              fill={svgFill}
            />
          </svg>
        }
      >
        <nav className="flex flex-col gap-6">
          {/* Navigation links */}
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                variant="ghost"
                className={clsx(
                  "rounded-lg px-4 py-3 text-base no-underline transition-colors",
                  pathname === link.href
                    ? "bg-secondary text-primary font-medium"
                    : "text-secondary hover:text-primary hover:bg-tertiary font-normal"
                )}
                onClick={() => setIsSheetOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="border-secondary border-t" />

          {/* Resume */}
          <div className="flex flex-col gap-3">
            <span className="text-secondary text-sm font-medium uppercase tracking-wider">
              Resume
            </span>
            <a
              href="https://nicholas-adamou-cv.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary hover:bg-tertiary flex items-center gap-3 rounded-lg px-4 py-2 text-sm no-underline transition-colors"
            >
              <FileText className="h-4 w-4" />
              View Resume
            </a>
          </div>

          {/* Divider */}
          <div className="border-secondary border-t" />

          {/* Social Links */}
          <div className="flex flex-col gap-3">
            <span className="text-secondary text-sm font-medium uppercase tracking-wider">
              Social
            </span>
            <div className="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-primary hover:bg-tertiary flex items-center gap-3 rounded-lg px-4 py-2 text-sm no-underline transition-colors"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-secondary border-t" />

          {/* Company Links */}
          <div className="flex flex-col gap-3">
            <span className="text-secondary text-sm font-medium uppercase tracking-wider">
              Companies
            </span>
            <div className="flex flex-col gap-2">
              {companyLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-primary hover:bg-tertiary flex items-center gap-3 rounded-lg px-4 py-2 text-sm no-underline transition-colors"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-secondary border-t" />

          {/* Theme switcher */}
          <div className="flex flex-col gap-3">
            <span className="text-secondary text-sm font-medium uppercase tracking-wider">
              Theme
            </span>
            <div className="w-fit">
              <TabThemeChanger />
            </div>
          </div>

          {/* Divider */}
          <div className="border-secondary border-t" />

          {/* Copyright */}
          <div className="text-tertiary text-center text-xs">
            © 2025 Nicholas Adamou. All rights reserved.
          </div>
        </nav>
      </Sheet>
    </>
  );
}
