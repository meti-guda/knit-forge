"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/design-system/cn";
import {
  staggerContainer,
  fadeInUp,
  fadeIn,
  float,
  staggerItem,
} from "@/lib/design-system/animations";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  YarnBall,
  Needle,
  Stitch,
  Counter,
  Calculator,
  Palette,
  Image,
  Shirt,
  Sparkles,
} from "@/components/icons";

const tools = [
  {
    href: "/row-counter",
    title: "Row Counter",
    description: "Track multiple counters with customizable alerts for any pattern.",
    icon: Counter,
    color: "#B85C38",
    accent: "gold",
  },
  {
    href: "/gauge-calculator",
    title: "Gauge Calculator",
    description: "Calculate your personal gauge, resize patterns to any size.",
    icon: Calculator,
    color: "#5C6B4A",
    accent: "moss",
  },
  {
    href: "/chart-editor",
    title: "Chart Editor",
    description: "Design and edit knitting charts with an intuitive grid canvas.",
    icon: Stitch,
    color: "#7B5D7A",
    accent: "plum",
  },
  {
    href: "/image-to-chart",
    title: "Image to Chart",
    description: "Transform any image into a beautiful knitting chart pattern.",
    icon: Image,
    color: "#D4A853",
    accent: "gold",
  },
  {
    href: "/garment-placement",
    title: "Garment Placement",
    description: "Visualize your motifs on real garment shapes before you knit.",
    icon: Shirt,
    color: "#8B3A2F",
    accent: "primary",
  },
  {
    href: "/ai-generator",
    title: "AI Pattern Generator",
    description: "Generate custom patterns and get intelligent knitting advice.",
    icon: Sparkles,
    color: "#D4A853",
    accent: "gold",
  },
];

const features = [
  {
    title: "Works Offline",
    description: "No internet required. All tools work offline at your knitting circle.",
    icon: "🌐",
  },
  {
    title: "AI-Powered",
    description: "Intelligent pattern generation and placement suggestions.",
    icon: "✨",
  },
  {
    title: "Professional Tools",
    description: "Industry-grade features without the complexity.",
    icon: "📐",
  },
  {
    title: "Save Your Work",
    description: "Store patterns locally or sync across devices.",
    icon: "💾",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 paper-texture" />
        <div className="absolute top-20 left-10 w-32 h-32 text-sienna/10 animate-float">
          <YarnBall className="w-full h-full" />
        </div>
        <div className="absolute bottom-20 right-10 w-24 h-24 text-moss/10 animate-float" style={{ animationDelay: "1s" }}>
          <Needle className="w-full h-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-sienna/10 text-sienna font-mono text-sm mb-4">
                Your Knitting Studio
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-warm-black leading-tight mb-6"
            >
              Knit
              <span className="relative inline-block">
                <span className="text-sienna">Forge</span>
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-gold/40"
                  viewBox="0 0 200 12"
                  fill="none"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                >
                  <path
                    d="M2 6C40 2 80 10 120 6C160 2 198 8 198 8"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="font-body text-lg md:text-xl text-warm-gray max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              Transform your knitting projects with AI-powered tools. Design custom patterns, 
              convert images to charts, and bring your creative vision to life — all in one place.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/row-counter">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Creating
                </Button>
              </Link>
              <Link href="#tools">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Tools
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-12 flex items-center justify-center gap-2 text-warm-muted"
            >
              <span className="font-mono text-sm">6 Tools</span>
              <span className="text-tan">•</span>
              <span className="font-mono text-sm">AI Powered</span>
              <span className="text-tan">•</span>
              <span className="font-mono text-sm">100% Free</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="tools" className="py-16 md:py-24 bg-oat/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl text-warm-black mb-4">
              Your Knitting Toolkit
            </h2>
            <p className="font-body text-warm-gray max-w-2xl mx-auto">
              Everything you need for your knitting journey, from simple row counting 
              to advanced AI-powered pattern generation.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {tools.map((tool) => (
              <motion.div key={tool.href} variants={staggerItem}>
                <Link href={tool.href}>
                  <Card
                    hover
                    className="h-full group cursor-pointer"
                    padding="lg"
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${tool.color}15` }}
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <tool.icon
                          className="w-8 h-8"
                          style={{ color: tool.color }}
                        />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-xl text-warm-black group-hover:text-sienna transition-colors">
                          {tool.title}
                        </h3>
                        <p className="font-body text-sm text-warm-gray mt-1 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-tan flex items-center gap-2">
                      <span className="text-sm font-mono text-warm-muted group-hover:text-sienna transition-colors">
                        Open tool
                      </span>
                      <svg
                        className="w-4 h-4 text-warm-muted group-hover:text-sienna transition-colors group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-charcoal text-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-40 h-40">
            <Stitch className="w-full h-full" />
          </div>
          <div className="absolute bottom-10 right-10 w-32 h-32">
            <YarnBall className="w-full h-full" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold font-mono text-sm mb-4"
              >
                AI-Powered Features
              </motion.span>

              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Turn Your Ideas Into{" "}
                <span className="text-gold">Beautiful Patterns</span>
              </h2>

              <p className="font-body text-lg text-cream/80 mb-8 leading-relaxed">
                Upload any image — your pet, a favorite design, a photo from your phone — 
                and watch it transform into a knit-worthy chart. Position it on scarves, 
                sweaters, and more with our smart placement engine.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Image to chart conversion with AI",
                  "Smart garment placement preview",
                  "Automatic stitch count calculations",
                  "Generate written instructions",
                ].map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 font-body"
                  >
                    <span className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-gold"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </span>
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <Link href="/ai-generator">
                <Button variant="gold" size="lg">
                  Try AI Tools
                </Button>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="bg-oat/10 rounded-3xl p-6 border-2 border-dashed border-cream/20">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-sienna/20 to-plum/20 p-8 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <motion.div
                      className="absolute top-0 left-1/4 w-1/2 h-1/2"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                        <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-sienna to-rust rounded-lg" />
                        <span className="font-mono text-xs text-warm-gray">
                          Upload Image
                        </span>
                      </div>
                    </motion.div>

                    <motion.div
                      className="absolute top-1/2 left-0 w-1/3 h-1/3"
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                      <div className="bg-white rounded-xl shadow-lg p-3 text-center">
                        <div className="grid grid-cols-4 gap-1 w-12 mx-auto mb-1">
                          {[...Array(16)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 rounded-sm"
                              style={{
                                backgroundColor: ["#B85C38", "#D4A853", "#5C6B4A", "#7B5D7A"][i % 4],
                              }}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-xs text-warm-gray">
                          Chart
                        </span>
                      </div>
                    </motion.div>

                    <motion.div
                      className="absolute bottom-0 right-0 w-1/2 h-1/2"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                      <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                        <div className="w-full h-12 bg-gradient-to-r from-sienna/30 via-gold/30 to-plum/30 rounded-lg mb-2 flex items-center justify-center">
                          <Shirt className="w-10 h-10 text-sienna/50" />
                        </div>
                        <span className="font-mono text-xs text-warm-gray">
                          Garment Preview
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl text-warm-black mb-4">
              Built for Knitters
            </h2>
            <p className="font-body text-warm-gray max-w-2xl mx-auto">
              Designed with care for the knitting community. Every feature crafted 
              to make your creative process smoother.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="text-center p-6"
              >
                <motion.div
                  className="text-4xl mb-4"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="font-heading text-lg text-warm-black mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-warm-gray">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-oat/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-warm-black mb-6">
              Ready to Start Knitting?
            </h2>
            <p className="font-body text-lg text-warm-gray mb-8 max-w-2xl mx-auto">
              Join knitters worldwide who use KnitForge to bring their creative visions to life. 
              Free, forever, with no sign-up required.
            </p>
            <Link href="/row-counter">
              <Button size="lg">Get Started Free</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 border-t border-tan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8">
                <YarnBall className="w-full h-full" />
              </div>
              <span className="font-display text-lg font-bold text-warm-black">
                Knit<span className="text-sienna">Forge</span>
              </span>
            </div>
            <p className="font-body text-sm text-warm-muted">
              Made with 🧶 for knitters everywhere
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/saved"
                className="font-body text-sm text-warm-gray hover:text-sienna transition-colors"
              >
                My Patterns
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
