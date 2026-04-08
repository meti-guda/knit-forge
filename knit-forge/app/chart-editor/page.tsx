"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Palette, ChevronRight } from "@/components/icons";
import Link from "next/link";

export default function ChartEditorPage() {
  return (
    <div className="min-h-screen bg-cream pt-16 md:pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 text-plum">
              <Palette className="w-full h-full" />
            </div>
            <h1 className="font-display text-4xl font-bold text-warm-black">
              Chart Editor
            </h1>
          </div>
          <p className="font-body text-lg text-warm-gray max-w-2xl mx-auto">
            Design and edit knitting charts with an intuitive grid canvas. 
            Create beautiful colorwork patterns, cable charts, and more.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="stitched" padding="lg" className="bg-gradient-to-br from-plum/5 to-sienna/5">
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                The Chart Editor is currently under development. Here&apos;s what you&apos;ll be able to do:
              </CardDescription>
            </CardHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {[
                "Draw on a grid canvas with click-to-paint",
                "Zoom and pan for precise editing",
                "Custom color palette (2-8 colors)",
                "Undo/redo support",
                "Import from image",
                "Export as PNG, SVG, or JSON",
                "Symbol overlay mode for cables",
                "Grid size customization",
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-white/50 rounded-xl"
                >
                  <span className="w-6 h-6 rounded-full bg-moss/20 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-moss"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <span className="font-body text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/image-to-chart">
                <Button variant="outline">
                  Try Image to Chart
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/row-counter">
                <Button variant="secondary">
                  Use Row Counter
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="font-body text-warm-muted text-sm">
            Want to be notified when this tool is ready?{" "}
            <button className="text-sienna hover:underline">
              Subscribe to updates
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
