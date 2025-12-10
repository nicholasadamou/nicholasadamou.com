"use client";

import React, { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "react-hot-toast";
import Confetti from "react-confetti";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  slideUpVariants,
  buttonVariants,
  getStaggerDelay,
  DURATION,
  EASING,
} from "@/lib/animations";

// Define the form validation schema using zod
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [runConfetti, setRunConfetti] = useState(false); // For controlling confetti

  const detectWindowSize = useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    detectWindowSize(); // Detect initial window size
    window.addEventListener("resize", detectWindowSize); // Update size on window resize

    return () => {
      window.removeEventListener("resize", detectWindowSize); // Cleanup on unmount
    };
  }, [detectWindowSize]);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setRunConfetti(true); // Start running confetti
  };

  const stopConfetti = () => {
    setRunConfetti(false); // Stop running confetti
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        triggerConfetti();
        reset();
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="mx-auto max-w-4xl"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: DURATION.slow,
            ease: EASING.easeOut,
            delayChildren: 0.2,
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <Toaster />
      <motion.div className="mx-auto">
        <motion.div className="relative isolate mx-auto w-full pb-16">
          {/* Header Section */}
          <motion.div
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
            transition={{
              delay: getStaggerDelay(0),
              duration: DURATION.slow,
              ease: EASING.spring,
            }}
          >
            <motion.h1
              className="text-3xl font-black tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: getStaggerDelay(0, 0.1),
                duration: DURATION.slow,
                ease: EASING.easeOut,
              }}
            >
              {"Let's talk about your project"}
            </motion.h1>
            <motion.p
              className="text-secondary mt-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: getStaggerDelay(1, 0.1),
                duration: DURATION.normal,
                ease: EASING.easeOut,
              }}
            >
              I help companies and individuals build out their digital presence.
            </motion.p>
          </motion.div>

          {/* Form Section */}
          <motion.div
            className="relative"
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
            transition={{
              delay: getStaggerDelay(1),
              duration: DURATION.slow,
              ease: EASING.spring,
            }}
          >
            <motion.form
              className="mt-16"
              onSubmit={handleSubmit(onSubmit)}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Name Field */}
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    delay: getStaggerDelay(0, 0.1),
                    duration: DURATION.normal,
                    ease: EASING.easeOut,
                  }}
                >
                  <motion.label
                    htmlFor="name"
                    className="block text-sm font-semibold leading-6"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: getStaggerDelay(0, 0.15),
                      duration: DURATION.fast,
                      ease: EASING.easeOut,
                    }}
                  >
                    Name
                  </motion.label>
                  <motion.input
                    id="name"
                    type="text"
                    placeholder="Name"
                    {...register("name")}
                    className="placeholder:text-tertiary input-field block w-full rounded-md border px-3.5 py-2 shadow-sm outline-none focus:outline-none focus:ring-0"
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: getStaggerDelay(0, 0.2),
                      duration: DURATION.normal,
                      ease: EASING.easeOut,
                    }}
                    whileFocus={{
                      scale: 1.02,
                      transition: {
                        duration: DURATION.fast,
                        ease: EASING.easeOut,
                      },
                    }}
                  />
                  {errors.name && (
                    <motion.p
                      className="mt-1 text-sm text-red-500"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: DURATION.fast }}
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Email Field */}
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    delay: getStaggerDelay(1, 0.1),
                    duration: DURATION.normal,
                    ease: EASING.easeOut,
                  }}
                >
                  <motion.label
                    htmlFor="email"
                    className="block text-sm font-semibold leading-6"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: getStaggerDelay(1, 0.15),
                      duration: DURATION.fast,
                      ease: EASING.easeOut,
                    }}
                  >
                    Email
                  </motion.label>
                  <motion.input
                    id="email"
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    className="placeholder:text-tertiary input-field block w-full rounded-md border px-3.5 py-2 shadow-sm outline-none focus:outline-none focus:ring-0"
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: getStaggerDelay(1, 0.2),
                      duration: DURATION.normal,
                      ease: EASING.easeOut,
                    }}
                    whileFocus={{
                      scale: 1.02,
                      transition: {
                        duration: DURATION.fast,
                        ease: EASING.easeOut,
                      },
                    }}
                  />
                  {errors.email && (
                    <motion.p
                      className="mt-1 text-sm text-red-500"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: DURATION.fast }}
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Message Field */}
                <motion.div
                  className="sm:col-span-2"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    delay: getStaggerDelay(2, 0.1),
                    duration: DURATION.normal,
                    ease: EASING.easeOut,
                  }}
                >
                  <motion.label
                    htmlFor="message"
                    className="block text-sm font-semibold leading-6"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: getStaggerDelay(2, 0.15),
                      duration: DURATION.fast,
                      ease: EASING.easeOut,
                    }}
                  >
                    Message
                  </motion.label>
                  <motion.textarea
                    id="message"
                    placeholder="Message"
                    {...register("message")}
                    className="placeholder:text-tertiary input-field block min-h-[120px] w-full rounded-md border px-3.5 py-2 shadow-sm outline-none focus:outline-none focus:ring-0"
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: getStaggerDelay(2, 0.2),
                      duration: DURATION.normal,
                      ease: EASING.easeOut,
                    }}
                    whileFocus={{
                      scale: 1.02,
                      transition: {
                        duration: DURATION.fast,
                        ease: EASING.easeOut,
                      },
                    }}
                  />
                  {errors.message && (
                    <motion.p
                      className="mt-1 text-sm text-red-500"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: DURATION.fast }}
                    >
                      {errors.message.message}
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: getStaggerDelay(3, 0.1),
                  duration: DURATION.normal,
                  ease: EASING.easeOut,
                }}
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="btn-filled mt-10 block w-full cursor-pointer rounded-md px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover={loading ? "initial" : "hover"}
                  whileTap={loading ? "initial" : "tap"}
                  animate={
                    loading
                      ? {
                          scale: [1, 1.02, 1],
                          transition: {
                            duration: 1,
                            ease: EASING.easeInOut,
                            repeat: Infinity,
                          },
                        }
                      : "initial"
                  }
                >
                  {loading ? "Sending..." : "Let's talk"}
                </motion.button>
              </motion.div>

              {/* Privacy Policy Text */}
              <motion.p
                className="text-tertiary mt-4 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: getStaggerDelay(4, 0.1),
                  duration: DURATION.normal,
                  ease: EASING.easeOut,
                }}
              >
                By submitting this form, I agree to the{" "}
                <motion.a
                  className="text-secondary hover:text-primary font-medium underline"
                  href="/privacy"
                  whileHover={{
                    x: 2,
                    transition: {
                      duration: DURATION.fast,
                      ease: EASING.easeOut,
                    },
                  }}
                >
                  privacy policy
                </motion.a>
                .
              </motion.p>
            </motion.form>
          </motion.div>

          {/* Confetti effect */}
          {showConfetti &&
            ReactDOM.createPortal(
              <Confetti
                width={windowSize.width}
                height={windowSize.height}
                run={runConfetti}
                recycle={false}
                numberOfPieces={300}
                onConfettiComplete={stopConfetti}
                style={{ zIndex: 9999, position: "fixed", top: 0 }}
              />,
              document.body
            )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
