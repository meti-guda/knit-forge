"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react";
import { cn } from "@/lib/design-system/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-body text-sm font-medium text-warm-black mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              "w-full bg-cream border-2 rounded-xl",
              "px-4 py-2.5",
              "font-body text-warm-black placeholder:text-warm-muted",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1 focus:ring-offset-cream",
              error
                ? "border-sienna focus:border-sienna"
                : focused
                ? "border-sienna"
                : "border-tan hover:border-tan-dark",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-sienna font-body">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-warm-muted font-body">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-body text-sm font-medium text-warm-black mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-cream border-2 rounded-xl",
            "px-4 py-3",
            "font-body text-warm-black placeholder:text-warm-muted",
            "transition-all duration-200 resize-none",
            "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1 focus:ring-offset-cream",
            error
              ? "border-sienna focus:border-sienna"
              : focused
              ? "border-sienna"
              : "border-tan hover:border-tan-dark",
            className
          )}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-sienna font-body">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-warm-muted font-body">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-body text-sm font-medium text-warm-black mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-cream border-2 rounded-xl",
            "px-4 py-2.5",
            "font-body text-warm-black",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1 focus:ring-offset-cream",
            "cursor-pointer appearance-none",
            error
              ? "border-sienna focus:border-sienna"
              : focused
              ? "border-sienna"
              : "border-tan hover:border-tan-dark",
            className
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B6560' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1.25rem",
          }}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-sienna font-body">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
