"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, ChevronRight } from "@/components/icons";
import Link from "next/link";

const aiFeatures = [
  {
    title: "Text to Motif",
    description: "Describe a pattern in words and watch AI generate a knitting chart",
    example: '"Geometric heart pattern with diamonds"',
  },
  {
    title: "Simple Garment Patterns",
    description: "Generate patterns for scarves, beanies, mittens, and cowls",
    example: "Scarf with seed stitch border",
  },
  {
    title: "Placement Reasoning",
    description: "Get written knitting instructions for your motif placements",
    example: '"Row 1-20: follow chart A. Row 21-40: stockinette..."',
  },
  {
    title: "Knitting Assistant",
    description: "Ask questions about techniques, yarn choices, or troubleshooting",
    example: '"How do I Kitchener stitch?"',
  },
];

export default function AIGeneratorPage() {
  return (
    <div className="min-h-screen bg-charcoal pt-16 md:pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 text-gold">
              <Sparkles className="w-full h-full" />
            </div>
            <h1 className="font-display text-4xl font-bold text-cream">
              AI Pattern Generator
            </h1>
          </div>
          <p className="font-body text-lg text-cream/80 max-w-2xl mx-auto">
            Generate custom patterns and get intelligent knitting advice powered by AI. 
            All processing happens locally on your computer — no data leaves your device.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="stitched" padding="lg" className="bg-gradient-to-br from-charcoal to-warm-black border-cream/20">
            <CardHeader>
              <CardTitle className="text-cream">Coming Soon</CardTitle>
              <CardDescription className="text-cream/60">
                The AI Generator is currently under development. Here&apos;s what you&apos;ll be able to do:
              </CardDescription>
            </CardHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {aiFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="p-4 bg-cream/5 rounded-xl border border-cream/10"
                >
                  <h4 className="font-heading text-lg text-gold mb-2">{feature.title}</h4>
                  <p className="font-body text-sm text-cream/70 mb-3">{feature.description}</p>
                  <div className="p-2 bg-cream/5 rounded-lg">
                    <p className="font-mono text-xs text-cream/50 italic">
                      {feature.example}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gold/10 rounded-xl border border-gold/20">
              <div className="flex items-start gap-3">
                <span className="text-gold text-xl">ℹ️</span>
                <div>
                  <h4 className="font-heading text-gold mb-1">Powered by Ollama</h4>
                  <p className="font-body text-sm text-cream/70">
                    This tool uses Ollama to run AI models locally on your computer. 
                    No API keys required, no subscription fees, and your data never leaves your device.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chart-editor">
                <Button variant="outline" className="border-cream/30 text-cream hover:bg-cream/10">
                  View Chart Editor
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/garment-placement">
                <Button variant="gold">
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
          <Card variant="outlined" padding="md" className="border-cream/20 bg-transparent">
            <h3 className="font-heading text-lg text-cream mb-3">Setup Instructions</h3>
            <ol className="space-y-3 font-body text-sm text-cream/70">
              <li className="flex items-start gap-3">
                <span className="font-mono font-bold text-gold">1.</span>
                <span>
                  Install Ollama from{" "}
                  <a href="https://ollama.com" className="text-gold hover:underline" target="_blank" rel="noopener">
                    ollama.com
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono font-bold text-gold">2.</span>
                <span>Download a model: <code className="bg-cream/10 px-2 py-0.5 rounded">ollama pull llama3.2</code></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono font-bold text-gold">3.</span>
                <span>Ollama will automatically start running in the background</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono font-bold text-gold">4.</span>
                <span>Return here and start using AI features!</span>
              </li>
            </ol>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
