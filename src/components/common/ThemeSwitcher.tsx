import React, { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

import { CheckIcon, MoonIcon } from "@heroicons/react/20/solid";
import { ComputerDesktopIcon, SunIcon } from "@heroicons/react/24/outline";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme, themes } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Listbox value={theme} onChange={(value) => setTheme(value)}>
        {({ open }) => {
          const iconClassName = clsx(
            "w-5 h-5 cursor-pointer transition-colors text-primary"
          );
          return (
            <div className={clsx("relative rounded-full")}>
              <Listbox.Button
                className={clsx(
                  "relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg"
                )}
              >
                {theme === "system" ? (
                  <ComputerDesktopIcon className={iconClassName} />
                ) : resolvedTheme === "dark" ? (
                  <MoonIcon className={iconClassName} />
                ) : (
                  <SunIcon className={iconClassName} />
                )}
              </Listbox.Button>
              <AnimatePresence>
                {open && (
                  <Listbox.Options
                    as={motion.ul}
                    static
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.3 }}
                    {...({
                      className:
                        "w-42 absolute right-0 z-10 mt-2 max-h-60 origin-top-right overflow-auto rounded-xl bg-contrast p-2 text-base capitalize shadow-md focus:outline-none sm:text-sm",
                    } as any)}
                  >
                    {themes.map((theme) => (
                      <Listbox.Option
                        key={theme}
                        className={({ active }) =>
                          clsx(
                            "relative cursor-pointer select-none rounded-md py-2 pl-10 pr-4 text-primary",
                            active ? "bg-secondary" : ""
                          )
                        }
                        value={theme}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {theme === "system" ? "System" : theme}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                )}
              </AnimatePresence>
            </div>
          );
        }}
      </Listbox>
    </>
  );
}
