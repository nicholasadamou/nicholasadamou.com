import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/utils";

const LinkVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-tertiary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof LinkVariants> {
  asChild?: boolean;
  external?: boolean;
}

// Use a more specific ref type for the anchor element
type LinkRef = HTMLAnchorElement;

const Link = React.forwardRef<LinkRef, LinkProps>(
  (
    { className, variant, size, asChild = false, external = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "a";

    // Determine target and rel based on the external prop
    const target = external ? "_blank" : undefined;
    const rel = external ? "noopener noreferrer" : undefined;

    return (
      <Comp
        className={cn(LinkVariants({ variant, size, className }))}
        ref={ref as React.Ref<LinkRef>}
        target={target}
        rel={rel}
        {...props}
      />
    );
  }
);

Link.displayName = "Link";

export { Link, LinkVariants };
