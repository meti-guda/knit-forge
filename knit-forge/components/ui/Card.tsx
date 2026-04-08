"use client";

import { HTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/design-system/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "stitched" | "elevated" | "outlined";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      hover = false,
      padding = "md",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "rounded-2xl bg-cream relative overflow-hidden";

    const variantStyles = {
      default: "shadow-md border border-tan-light",
      stitched: "border-2 border-dashed border-tan shadow-[0_2px_0_0_#C4B8A8,0_4px_8px_-2px_rgba(26,25,22,0.1)]",
      elevated: "shadow-xl border border-tan-light",
      outlined: "border-2 border-tan bg-transparent",
    };

    const hoverVariants = hover
      ? {
          rest: {
            y: 0,
            boxShadow:
              "0 2px 4px 0 rgba(26, 25, 22, 0.08)",
            transition: { duration: 0.2 },
          },
          hover: {
            y: -4,
            boxShadow:
              "0 10px 15px -3px rgba(26, 25, 22, 0.1), 0 4px 6px -2px rgba(26, 25, 22, 0.05)",
            transition: { type: "spring", stiffness: 300, damping: 30 },
          },
        }
      : {};

    const Component = hover ? motion.div : "div";

    return (
      <Component
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        variants={hoverVariants}
        initial={hover ? "rest" : undefined}
        animate={hover ? "rest" : undefined}
        whileHover={hover ? "hover" : undefined}
        {...props}
      >
        <div className="paper-texture absolute inset-0" />
        <div className="relative z-10">{children}</div>
      </Component>
    );
  }
);

Card.displayName = "Card";

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-heading text-2xl text-warm-black",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "font-body text-warm-gray text-sm mt-1",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 pt-4 border-t border-tan-light flex items-center gap-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
