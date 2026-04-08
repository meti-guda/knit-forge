"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/design-system/cn";

type BadgeVariant = "default" | "primary" | "secondary" | "gold" | "moss" | "plum" | "outline";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-tan-light text-warm-gray",
  primary: "bg-sienna/10 text-sienna",
  secondary: "bg-oat text-warm-black border border-tan",
  gold: "bg-gold/20 text-gold",
  moss: "bg-moss/10 text-moss",
  plum: "bg-plum/10 text-plum",
  outline: "bg-transparent border-2 border-tan text-warm-black",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full font-mono font-medium",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  removable?: boolean;
  onRemove?: () => void;
}

export function Tag({ className, children, removable, onRemove, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
        "bg-oat border border-tan text-warm-black",
        "font-body text-sm",
        "transition-colors duration-200 hover:bg-tan-light",
        className
      )}
      {...props}
    >
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 text-warm-muted hover:text-sienna transition-colors"
          aria-label="Remove tag"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  );
}
