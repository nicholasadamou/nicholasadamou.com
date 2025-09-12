"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  challenge: string;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  title?: string;
  autoRotateInterval?: number;
}

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
  testimonial,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.4 }}
    className="bg-tertiary rounded-2xl p-6"
  >
    <div className="mb-4 flex items-start gap-3">
      <div className="bg-primary flex-shrink-0 rounded-full p-2">
        <Quote className="h-4 w-4" style={{ color: "var(--icon-color)" }} />
      </div>
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-tertiary mb-4 italic leading-relaxed">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold">{testimonial.name}</p>
        <p className="text-tertiary text-sm">
          {testimonial.role} at {testimonial.company}
        </p>
      </div>
      <span className="bg-secondary text-tertiary rounded-full px-2 py-1 text-xs">
        {testimonial.challenge}
      </span>
    </div>
  </motion.div>
);

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  title = "What Developers Are Saying",
  autoRotateInterval = 5000,
}) => {
  const [activeTestimonial, setActiveTestimonial] = useState<number>(0);

  // Auto-cycle through testimonials
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [testimonials.length, autoRotateInterval]);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="text-md mb-4 font-bold">{title}</h4>
      <div className="max-w-2xl">
        <AnimatePresence mode="wait">
          <TestimonialCard
            key={activeTestimonial}
            testimonial={testimonials[activeTestimonial]}
          />
        </AnimatePresence>
      </div>

      {/* Testimonial indicators */}
      <div className="mt-4 flex justify-start gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveTestimonial(index)}
            className="cursor-pointer rounded-full transition-all duration-300"
            style={{
              height: "8px",
              width: activeTestimonial === index ? "24px" : "8px",
              backgroundColor:
                activeTestimonial === index
                  ? "var(--gray-12, #000)"
                  : "var(--gray-3, #f5f5f5)",
            }}
            onMouseEnter={(e) => {
              if (activeTestimonial !== index) {
                e.currentTarget.style.width = "16px";
                e.currentTarget.style.backgroundColor = "var(--gray-12, #000)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTestimonial !== index) {
                e.currentTarget.style.width = "8px";
                e.currentTarget.style.backgroundColor =
                  "var(--gray-3, #f5f5f5)";
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};
