"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Image, ChevronRight } from "@/components/icons";
import Link from "next/link";

export default function ImageToChartPage() {
  return (
    <div className="min-h-screen bg-cream pt-16 md:pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 text-gold">
              <Image className="w-full h-full" />
            </div>
            <h1 className="font-display text-4xl font-bold text-warm-black">
              Image to Chart
            </h1>
          </div>
          <p className="font-body text-lg text-warm-gray max-w-2xl mx-auto">
            Transform any image into a beautiful knitting chart pattern. 
            Upload a photo of your pet, a design, or any image.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="stitched" padding="lg" className="bg-gradient-to-br from-gold/5 to-sienna/5">
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                The Image to Chart converter is currently under development. Here&apos;s how it will work:
              </CardDescription>
            </CardHeader>

            <div className="space-y-6 mt-6">
              <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono font-bold text-gold">1</span>
                </div>
                <div>
                  <h4 className="font-heading text-lg mb-1">Upload Your Image</h4>
                  <p className="font-body text-sm text-warm-gray">
                    Choose any image — a photo of your cat, a flower, a geometric pattern
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-sienna/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono font-bold text-sienna">2</span>
                </div>
                <div>
                  <h4 className="font-heading text-lg mb-1">Set Your Gauge</h4>
                  <p className="font-body text-sm text-warm-gray">
                    Enter your stitches per 10cm to ensure proper proportions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-moss/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono font-bold text-moss">3</span>
                </div>
                <div>
                  <h4 className="font-heading text-lg mb-1">Choose Colors</h4>
                  <p className="font-body text-sm text-warm-gray">
                    Reduce to 2-8 colors that work great for knitting
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-plum/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono font-bold text-plum">4</span>
                </div>
                <div>
                  <h4 className="font-heading text-lg mb-1">Fine-tune & Export</h4>
                  <p className="font-body text-sm text-warm-gray">
                    Edit the chart in our editor and export as PNG, SVG, or JSON
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chart-editor">
                <Button variant="outline">
                  View Chart Editor
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/garment-placement">
                <Button variant="secondary">
                  Preview on Garment
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
            <h3 className="font-heading text-lg mb-3">Pro Tips</h3>
            <ul className="space-y-2 font-body text-sm text-warm-gray">
              <li className="flex items-center gap-2">
                <span className="text-gold">•</span>
                High contrast images work best for conversion
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">•</span>
                Simpler images with fewer details create cleaner charts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">•</span>
                Consider the stitch ratio (knitted stitches are wider than tall)
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
