"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Shirt, ChevronRight } from "@/components/icons";
import Link from "next/link";

const placementModes = [
  {
    title: "Centered",
    description: "Place your motif in the center of the garment",
    icon: "◉",
  },
  {
    title: "Two Ends",
    description: "Motif appears at each end, background in the middle",
    icon: "⊕",
  },
  {
    title: "Scattered",
    description: "Allover pattern tiling across the entire garment",
    icon: "⊞",
  },
  {
    title: "Border",
    description: "Motif as a decorative border at the edges",
    icon: "⊟",
  },
];

export default function GarmentPlacementPage() {
  return (
    <div className="min-h-screen bg-cream pt-16 md:pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 text-rust">
              <Shirt className="w-full h-full" />
            </div>
            <h1 className="font-display text-4xl font-bold text-warm-black">
              Garment Placement
            </h1>
          </div>
          <p className="font-body text-lg text-warm-gray max-w-2xl mx-auto">
            Visualize your motifs on real garment shapes before you knit. 
            See exactly how your design will look on scarves, sweaters, and more.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="stitched" padding="lg" className="bg-gradient-to-br from-rust/5 to-gold/5">
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                The Garment Placement tool is currently under development. Here&apos;s what you&apos;ll be able to do:
              </CardDescription>
            </CardHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="md:col-span-2">
                <h4 className="font-heading text-lg mb-4">Garment Shapes</h4>
              </div>
              {["Scarf", "Sweater Front", "Cardigan Back"].map((garment, i) => (
                <motion.div
                  key={garment}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="p-4 bg-white/50 rounded-xl text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-2 bg-oat rounded-lg flex items-center justify-center">
                    <Shirt className="w-10 h-10 text-rust" />
                  </div>
                  <p className="font-body font-medium">{garment}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="font-heading text-lg mb-4">Placement Modes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {placementModes.map((mode, i) => (
                  <motion.div
                    key={mode.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-white/50 rounded-xl"
                  >
                    <span className="text-2xl">{mode.icon}</span>
                    <div>
                      <h5 className="font-body font-medium">{mode.title}</h5>
                      <p className="font-body text-sm text-warm-muted">{mode.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/image-to-chart">
                <Button variant="outline">
                  Try Image to Chart
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/ai-generator">
                <Button variant="secondary">
                  Generate Pattern with AI
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card variant="outlined" padding="md">
            <h3 className="font-heading text-lg mb-3">How It Works</h3>
            <ol className="space-y-3 font-body text-sm text-warm-gray">
              <li className="flex items-start gap-3">
                <span className="font-mono font-bold text-sienna">1.</span>
                <span>Upload or create a knitting chart (coming from Image to Chart or Chart Editor)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono font-bold text-sienna">2.</span>
                <span>Choose a garment shape and enter your dimensions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono font-bold text-sienna">3.</span>
                <span>Select a placement mode (centered, scattered, etc.)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono font-bold text-sienna">4.</span>
                <span>See real-time preview with accurate stitch proportions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono font-bold text-sienna">5.</span>
                <span>Export the placed design or get written instructions from AI</span>
              </li>
            </ol>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
