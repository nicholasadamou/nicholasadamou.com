import React from "react";

interface AnimatedSectionProps {
  index: number;
  ariaLabelledBy?: string;
  className?: string;
  children: React.ReactNode;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  index,
  ariaLabelledBy,
  className = "",
  children,
}) => (
  <section
    className={`animate-in flex flex-col gap-4 ${className}`.trim()}
    style={{ "--index": index } as React.CSSProperties}
    aria-labelledby={ariaLabelledBy}
  >
    {children}
  </section>
);
