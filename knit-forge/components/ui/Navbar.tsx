"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/design-system/cn";
import { Menu, Close, ChevronRight } from "@/components/icons";

const navLinks = [
  { href: "/row-counter", label: "Row Counter" },
  { href: "/gauge-calculator", label: "Gauge Calculator" },
  { href: "/chart-editor", label: "Chart Editor" },
  { href: "/image-to-chart", label: "Image to Chart" },
  { href: "/garment-placement", label: "Garment Placement" },
  { href: "/ai-generator", label: "AI Generator" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled
            ? "bg-cream/95 backdrop-blur-md shadow-md border-b border-tan"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                className="w-10 h-10 md:w-12 md:h-12"
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                  <circle cx="32" cy="32" r="28" fill="#B85C38" opacity="0.2" />
                  <circle cx="32" cy="32" r="24" fill="#B85C38" />
                  <path
                    d="M16 26C16 26 24 16 32 16C40 16 48 26 48 26"
                    stroke="#F5EDE0"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 34C12 34 22 28 32 28C42 28 52 34 52 34"
                    stroke="#F5EDE0"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18 42C18 42 24 38 32 38C40 38 46 42 46 42"
                    stroke="#F5EDE0"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
              <span className="font-display text-xl md:text-2xl font-bold text-warm-black">
                Knit<span className="text-sienna">Forge</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 rounded-lg font-body text-sm font-medium transition-colors",
                      isActive
                        ? "text-sienna bg-sienna/10"
                        : "text-warm-gray hover:text-warm-black hover:bg-oat"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-sienna rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/saved"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-dashed border-tan text-warm-black font-body text-sm font-medium hover:bg-oat hover:border-tan-dark transition-all"
              >
                My Patterns
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-warm-black hover:bg-oat rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-cream z-50 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-tan">
                  <span className="font-display text-xl font-bold text-warm-black">
                    Menu
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-warm-black hover:bg-oat rounded-lg transition-colors"
                    aria-label="Close menu"
                  >
                    <Close className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-1">
                    {navLinks.map((link, index) => {
                      const isActive = pathname === link.href;
                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={link.href}
                            className={cn(
                              "flex items-center justify-between p-4 rounded-xl transition-all",
                              isActive
                                ? "bg-sienna text-cream"
                                : "text-warm-black hover:bg-oat"
                            )}
                          >
                            <span className="font-body font-medium">
                              {link.label}
                            </span>
                            <ChevronRight
                              className={cn(
                                "w-5 h-5 transition-transform",
                                isActive ? "text-cream" : "text-warm-muted"
                              )}
                            />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </nav>

                <div className="p-4 border-t border-tan">
                  <Link
                    href="/saved"
                    className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-sienna text-cream font-body font-medium hover:bg-rust transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Patterns
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
