"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import {
  contactSchema,
  contactFields,
  projectTypes,
  timelines,
  type ContactFormData,
} from "@/lib/content/contact";

export default function ContactPageClient() {
  const { getTextColorClass, getOpacityClass, shouldUseDarkText } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });
  const [status, setStatus] = useState("");
  const [sent, setSent] = useState(false);
  const light = shouldUseDarkText();
  const inputClass = `w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors placeholder:opacity-40 ${light ? "border-stone-950/15 bg-stone-950/[0.03] focus:border-stone-950/50" : "border-white/15 bg-white/[0.04] focus:border-white/50"}`;

  const onSubmit = async (data: ContactFormData) => {
    setStatus("");
    const source =
      new URLSearchParams(window.location.search).get("from") === "clients"
        ? "clients"
        : "contact";
    try {
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(
          result.message ||
            "Your project brief could not be sent. Please try again."
        );
      }
      setSent(true);
      reset();
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to connect. Your details are still here; please try again."
      );
    }
  };

  return (
    <main
      className={`min-h-screen px-6 pt-24 pb-32 sm:pt-32 ${getTextColorClass()}`}
    >
      <div className="mx-auto max-w-2xl">
        <p
          className={`mb-5 text-xs tracking-[0.18em] uppercase ${getOpacityClass()}`}
        >
          A good place to start
        </p>
        <h1 className="max-w-xl text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
          Tell me what you’re
          <br />
          working toward.
        </h1>
        <p
          className={`mt-6 max-w-xl text-base leading-relaxed ${getOpacityClass()}`}
        >
          A new website, a fresh direction, or software that makes your work
          easier. Share a little context so we can have a useful first
          conversation.
        </p>
        <div
          className={`mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm ${getOpacityClass()}`}
        >
          <span>I usually reply within a couple of days.</span>
          <Link href="/clients" className="underline underline-offset-4">
            Explore client work ↗
          </Link>
        </div>

        {sent ? (
          <div
            role="status"
            className="mt-12 rounded-2xl border border-current/15 p-8"
          >
            <CheckCircle2 size={28} aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-medium">
              Thanks for the introduction.
            </h2>
            <p className={`mt-3 leading-relaxed ${getOpacityClass()}`}>
              Your project brief is on its way. I’ll review the details and
              reply to the email address you provided.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-6 cursor-pointer underline underline-offset-4"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-12 space-y-10"
          >
            <p className={`text-xs ${getOpacityClass()}`}>
              Fields marked * are required. Everything else is optional.
            </p>
            <fieldset disabled={isSubmitting} className="space-y-5">
              <legend className="mb-5 text-lg font-medium">
                01 / About you
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                {contactFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label htmlFor={field.name} className="text-sm">
                      {field.label}
                      {"required" in field ? " *" : ""}
                    </label>
                    <input
                      id={field.name}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      placeholder={field.placeholder}
                      {...register(field.name)}
                      required={"required" in field}
                      aria-invalid={!!errors[field.name]}
                      aria-describedby={
                        errors[field.name] ? `${field.name}-error` : undefined
                      }
                      className={inputClass}
                    />
                    {errors[field.name] && (
                      <p
                        id={`${field.name}-error`}
                        className="text-xs text-red-500"
                      >
                        {errors[field.name]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </fieldset>
            <fieldset disabled={isSubmitting} className="space-y-5">
              <legend className="mb-5 text-lg font-medium">
                02 / The project
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  {
                    name: "projectType",
                    label: "What do you need?",
                    options: projectTypes,
                  },
                  {
                    name: "timeline",
                    label: "When would you like to start?",
                    options: timelines,
                  },
                ].map((field) => {
                  const name = field.name as "projectType" | "timeline";
                  return (
                    <div key={name} className="space-y-2">
                      <label htmlFor={name} className="text-sm">
                        {field.label} *
                      </label>
                      <select
                        id={name}
                        {...register(name)}
                        defaultValue=""
                        required
                        aria-invalid={!!errors[name]}
                        aria-describedby={
                          errors[name] ? `${name}-error` : undefined
                        }
                        className={inputClass}
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        {field.options.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="bg-background text-foreground"
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors[name] && (
                        <p
                          id={`${name}-error`}
                          className="text-xs text-red-500"
                        >
                          {errors[name]?.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2">
                <label htmlFor="budget" className="text-sm">
                  Approximate budget
                </label>
                <input
                  id="budget"
                  {...register("budget")}
                  maxLength={150}
                  placeholder="A range and currency, or ‘not sure yet’"
                  aria-describedby="budget-hint"
                  className={inputClass}
                />
                <p id="budget-hint" className={`text-xs ${getOpacityClass()}`}>
                  A rough idea helps me suggest an appropriate scope. This isn’t
                  a quote or commitment.
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm">
                  What would a successful project look like? *
                </label>
                <textarea
                  id="message"
                  {...register("message")}
                  required
                  maxLength={5000}
                  rows={6}
                  placeholder="Tell me about your audience, what you want to improve, any features you need, and whether you already have content or designs."
                  aria-invalid={!!errors.message}
                  aria-describedby="message-hint message-error"
                  className={inputClass}
                />
                <p id="message-hint" className={`text-xs ${getOpacityClass()}`}>
                  20–5,000 characters. Please leave out passwords and sensitive
                  personal information.
                </p>
                <p id="message-error" className="text-xs text-red-500">
                  {errors.message?.message}
                </p>
              </div>
            </fieldset>
            {status && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/30 p-4 text-sm text-red-500"
              >
                {status}
              </p>
            )}
            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full px-6 py-4 text-sm font-medium disabled:cursor-wait disabled:opacity-50 ${light ? "bg-stone-950 text-white" : "bg-white text-stone-950"}`}
              >
                {isSubmitting ? "Sending your brief…" : "Send project brief"}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <p className={`text-xs leading-relaxed ${getOpacityClass()}`}>
                I’ll use these details to respond to your inquiry. By
                submitting, you agree to the{" "}
                <Link href="/privacy" className="underline underline-offset-4">
                  privacy policy
                </Link>
                .
              </p>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
