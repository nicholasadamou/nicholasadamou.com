import { Button, ButtonProps } from "@/components/ui/button";
import { type LucideIcon } from "lucide-react";
import React from "react";

interface LinkButtonProps extends ButtonProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function LinkButton({
  href,
  icon: Icon,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Button asChild {...props}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Icon className="mr-2 h-4 w-4" />
        {children}
      </a>
    </Button>
  );
}
