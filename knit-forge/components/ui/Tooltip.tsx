"use client";

import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/design-system/cn";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

const positionStyles = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-tan",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-tan",
  left: "left-full top-1/2 -translate-y-1/2 border-l-tan",
  right: "right-full top-1/2 -translate-y-1/2 border-r-tan",
};

export function Tooltip({
  content,
  children,
  position = "top",
  delay = 200,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={cn(
              "absolute z-50 px-3 py-2 bg-warm-black text-cream rounded-lg",
              "text-sm font-body shadow-lg",
              "whitespace-nowrap pointer-events-none",
              positionStyles[position],
              className
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {content}
            <div
              className={cn(
                "absolute w-0 h-0 border-4 border-transparent",
                arrowStyles[position]
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Popover({
  trigger,
  children,
  position = "bottom",
  className,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className={cn(
                "absolute z-50 bg-cream rounded-xl shadow-xl border border-tan-light",
                "p-4 min-w-[200px]",
                positionStyles[position],
                className
              )}
              initial={{ opacity: 0, scale: 0.95, y: position === "bottom" ? -8 : 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: position === "bottom" ? -8 : 8 }}
              transition={{ duration: 0.15 }}
            >
              <div onClick={() => setIsOpen(false)}>{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
