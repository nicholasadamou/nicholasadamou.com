"use client";

import React, { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "react-hot-toast";
import Confetti from "react-confetti";
import ReactDOM from "react-dom";

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
    <div className="mx-auto max-w-[700px] px-4">
      <Toaster />
      <div className="mx-auto">
        <div className="animate-in relative isolate mx-auto w-full overflow-hidden pb-16 pt-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Let’s talk about your project
            </h1>
            <p className="text-secondary mt-5">
              I help companies and individuals build out their digital presence.
            </p>
          </div>
          <div className="relative">
            <form className="mt-16" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 px-2 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold leading-6"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Name"
                    {...register("name")}
                    className="block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-zinc-200 placeholder:text-zinc-400 focus:ring-1 focus:ring-inset dark:ring-zinc-700"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold leading-6"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    className="block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-zinc-200 placeholder:text-zinc-400 focus:ring-1 focus:ring-inset dark:ring-zinc-700"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold leading-6"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Message"
                    {...register("message")}
                    className="block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-zinc-200 placeholder:text-zinc-400 focus:ring-1 focus:ring-inset dark:ring-zinc-700"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-10 block w-full rounded-md bg-[#111] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-opacity-90 dark:bg-white dark:text-black dark:hover:bg-opacity-90"
              >
                {loading ? "Sending..." : "Let’s talk"}
              </button>
              <p className="mt-4 text-sm text-zinc-500">
                By submitting this form, I agree to the{" "}
                <a className="font-medium underline" href="/privacy">
                  privacy policy
                </a>
                .
              </p>
            </form>
          </div>
          {/* Confetti effect */}
          {showConfetti &&
            ReactDOM.createPortal(
              <Confetti
                width={windowSize.width}
                height={windowSize.height}
                run={runConfetti} // Control whether confetti runs or not
                recycle={false}
                numberOfPieces={300}
                onConfettiComplete={stopConfetti} // Stop confetti when it reaches the bottom
                style={{ zIndex: 9999, position: "fixed", top: 0 }}
              />,
              document.body
            )}
        </div>
      </div>
    </div>
  );
}
