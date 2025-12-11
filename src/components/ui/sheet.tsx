"use client";

import React, { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "left" | "right";
  logo?: React.ReactNode;
}

export function Sheet({
  isOpen,
  onClose,
  children,
  side = "right",
  logo,
}: SheetProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Sheet panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div
            className={clsx(
              "absolute inset-y-0 flex max-w-full",
              side === "right" ? "right-0" : "left-0"
            )}
          >
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom={
                side === "right" ? "translate-x-full" : "-translate-x-full"
              }
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leaveFrom="translate-x-0"
              leaveTo={
                side === "right" ? "translate-x-full" : "-translate-x-full"
              }
            >
              <Dialog.Panel className="w-screen max-w-sm">
                <div className="bg-primary flex h-full flex-col shadow-xl">
                  {/* Header */}
                  <div className="border-secondary flex items-center justify-between border-b px-6 py-4">
                    <Dialog.Title className="text-primary flex items-center gap-2">
                      {logo ? (
                        <Link href="/" onClick={onClose}>
                          {logo}
                        </Link>
                      ) : (
                        <span className="text-lg font-semibold">Menu</span>
                      )}
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-secondary hover:text-primary rounded-lg p-2 transition-colors"
                      onClick={onClose}
                      aria-label="Close menu"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    {children}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
