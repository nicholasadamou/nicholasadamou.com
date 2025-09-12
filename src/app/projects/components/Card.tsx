"use client";

import React, { ReactNode } from "react";

interface CardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function Card({
  icon,
  title,
  description,
}: CardProps): React.JSX.Element {
  return (
    <div className={"bg-tertiary flex flex-col rounded-2xl p-4"}>
      <div className="mb-2 flex items-start gap-3">
        <div className="mr-2 h-3 w-3" style={{ color: "var(--icon-color)" }}>
          {icon}
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="text-tertiary">{description}</p>
    </div>
  );
}
