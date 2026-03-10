"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ReactDOM from "react-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "react-hot-toast";
import { useTheme } from "@/components/ThemeProvider";

const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false,
  loading: () => null,
});

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPageClient() {
  const {
    getTextColorClass,
    getOpacityClass,
    getLinkColorClass,
    shouldUseDarkText,
    isHydrated,
  } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [runConfetti, setRunConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const detectWindowSize = useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    detectWindowSize();
    window.addEventListener("resize", detectWindowSize);
    return () => window.removeEventListener("resize", detectWindowSize);
  }, [detectWindowSize]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Message sent successfully!");
        setShowConfetti(true);
        setRunConfetti(true);
        reset();
      } else {
        toast.error("Failed to send message.");
      }
    } catch {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) return <main className="min-h-screen" />;

  const light = shouldUseDarkText();
  const inputBg = light ? "bg-stone-950/[0.03]" : "bg-white/[0.04]";
  const inputBorder = light ? "border-stone-950/10" : "border-white/10";
  const inputFocus = light
    ? "focus:border-stone-950/30"
    : "focus:border-white/30";

  return (
    <main
      className={`min-h-screen font-sans transition-colors duration-200 ${getTextColorClass()}`}
    >
      <Toaster />
      <div className="mx-auto max-w-2xl px-5 pb-32 pt-24 sm:pb-48 sm:pt-32">
        <div className="animate-fadeInHome1 space-y-12">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-medium sm:text-4xl">
              Let&apos;s talk about your project
            </h1>
            <p className={`text-sm ${getOpacityClass()}`}>
              I help companies and individuals build out their digital presence.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="animate-fadeInHome2 space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Name"
                  {...register("name")}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors ${inputBg} ${inputBorder} ${inputFocus} placeholder:opacity-40`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors ${inputBg} ${inputBorder} ${inputFocus} placeholder:opacity-40`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Message"
                {...register("message")}
                className={`min-h-[140px] w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors ${inputBg} ${inputBorder} ${inputFocus} placeholder:opacity-40`}
              />
              {errors.message && (
                <p className="text-xs text-red-500">{errors.message.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 ${
                light ? "bg-stone-950 text-white" : "bg-white text-stone-950"
              }`}
            >
              {loading ? "Sending..." : "Let's talk"}
            </button>

            <p className={`text-xs ${getOpacityClass()}`}>
              By submitting this form, I agree to the{" "}
              <Link
                href="/privacy"
                className={`border-b border-dashed pb-0.5 transition-opacity hover:opacity-60 ${getLinkColorClass()}`}
              >
                privacy policy
              </Link>
              .
            </p>
          </form>
        </div>
      </div>

      {/* Confetti */}
      {showConfetti &&
        typeof document !== "undefined" &&
        ReactDOM.createPortal(
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            run={runConfetti}
            recycle={false}
            numberOfPieces={300}
            onConfettiComplete={() => setRunConfetti(false)}
            style={{ zIndex: 9999, position: "fixed", top: 0 }}
          />,
          document.body
        )}
    </main>
  );
}
