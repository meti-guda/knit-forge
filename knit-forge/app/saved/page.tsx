"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ChevronRight } from "@/components/icons";

export default function SavedPage() {
  const savedPatterns: Array<{
    id: string;
    name: string;
    type: string;
    createdAt: Date;
    thumbnail?: string;
  }> = [];

  return (
    <div className="min-h-screen bg-cream pt-16 md:pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl font-bold text-warm-black mb-4">
            My Patterns
          </h1>
          <p className="font-body text-lg text-warm-gray">
            Save and organize your knitting patterns and projects
          </p>
        </motion.div>

        {savedPatterns.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="stitched" padding="lg" className="text-center">
              <div className="py-12">
                <div className="w-24 h-24 mx-auto mb-6 text-tan">
                  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M20 32L28 40L44 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="font-heading text-2xl mb-2">No Saved Patterns Yet</h2>
                <p className="font-body text-warm-gray mb-6 max-w-md mx-auto">
                  Start creating by using our tools to design charts, 
                  convert images, or generate patterns with AI.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/chart-editor">
                    <Button>
                      Create a Chart
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/image-to-chart">
                    <Button variant="outline">
                      Image to Chart
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {savedPatterns.map((pattern) => (
              <Card key={pattern.id} hover padding="none">
                <div className="aspect-square bg-oat rounded-t-2xl" />
                <div className="p-4">
                  <h3 className="font-heading text-lg mb-2">{pattern.name}</h3>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" size="sm">
                      {pattern.type}
                    </Badge>
                    <span className="font-mono text-xs text-warm-muted">
                      {pattern.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card variant="outlined" padding="md">
            <h3 className="font-heading text-lg mb-3">Features Coming Soon</h3>
            <ul className="space-y-2 font-body text-sm text-warm-gray">
              <li className="flex items-center gap-2">
                <span className="text-moss">✓</span>
                Save patterns from any tool
              </li>
              <li className="flex items-center gap-2">
                <span className="text-moss">✓</span>
                Organize with folders and tags
              </li>
              <li className="flex items-center gap-2">
                <span className="text-moss">✓</span>
                Export patterns as PDF
              </li>
              <li className="flex items-center gap-2">
                <span className="text-moss">✓</span>
                Share patterns with others
              </li>
              <li className="flex items-center gap-2">
                <span className="text-moss">✓</span>
                Sync across devices
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
