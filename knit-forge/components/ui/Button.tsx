"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/design-system/cn";
import { buttonTap } from "@/lib/design-system/animations";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "gold";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-sienna text-cream hover:bg-rust active:bg-rust shadow-md hover:shadow-lg",
  secondary:
    "bg-oat text-warm-black hover:bg-tan-light active:bg-tan border-2 border-dashed border-tan",
  ghost:
    "bg-transparent text-sienna hover:bg-sienna/10 active:bg-sienna/20",
  outline:
    "bg-transparent text-sienna border-2 border-sienna hover:bg-sienna hover:text-cream",
  gold:
    "bg-gold text-warm-black hover:bg-gold-light active:bg-gold shadow-md hover:shadow-lg",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-body font-medium rounded-xl",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        variants={buttonTap}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export function LoadingSpinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <motion.div
      className={cn(
        "relative flex items-center justify-center",
        sizeMap[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={cn("w-full h-full", sizeMap[size])}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="32"
          strokeDashoffset="12"
          className="text-tan"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="32"
          strokeDashoffset="48"
          className="text-sienna"
        />
      </svg>
    </motion.div>
  );
}

export function YarnBallSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 60,
  };

  return (
    <motion.div
      className="flex items-center justify-center"
      animate={{
        y: [0, -10, 0, -5, 0],
        rotate: [0, 15, -15, 5, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width={sizeMap[size]}
        height={sizeMap[size]}
        viewBox="0 0 64 64"
        fill="none"
      >
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="#B85C38"
          className="opacity-20"
        />
        <circle cx="32" cy="32" r="24" fill="#B85C38" />
        <path
          d="M20 28C20 28 26 20 32 20C38 20 44 28 44 28"
          stroke="#F5EDE0"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M16 36C16 36 24 32 32 32C40 32 48 36 48 36"
          stroke="#F5EDE0"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M24 44C24 44 28 40 32 40C36 40 40 44 40 44"
          stroke="#F5EDE0"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <ellipse cx="24" cy="24" rx="4" ry="2" fill="#D4714A" opacity="0.6" />
      </svg>
    </motion.div>
  );
}
