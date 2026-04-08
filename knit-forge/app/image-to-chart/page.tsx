"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/design-system/cn";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Image, Download, ChevronRight, RefreshCw, Check } from "@/components/icons";
import {
  loadImage,
  imageToCanvas,
  getImageData,
  medianCutQuantize,
  resizeImage,
  mapImageToPalette,
  imageToChart,
} from "@/lib/canvas/imageProcessing";
import { KnittingChart, DEFAULT_PALETTE, exportChartAsSVG, exportChartAsPNG, chartToJSON } from "@/lib/canvas/types";
import { useRouter } from "next/navigation";

type Step = "upload" | "configure" | "preview" | "edit";

export default function ImageToChartPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [targetWidth, setTargetWidth] = useState("30");
  const [targetHeight, setTargetHeight] = useState("30");
  const [numColors, setNumColors] = useState(4);
  const [palette, setPalette] = useState<string[]>(DEFAULT_PALETTE.slice(0, 4));
  const [gaugeRatio, setGaugeRatio] = useState(1.3);
  const [chart, setChart] = useState<KnittingChart | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      
      try {
        const img = await loadImage(src);
        setImage(img);
        setTargetWidth(Math.min(50, Math.round(img.width / 10)).toString());
        setTargetHeight(Math.min(50, Math.round(img.height / 10)).toString());
        setStep("configure");
      } catch (err) {
        alert("Failed to load image");
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleAnalyzeColors = useCallback(async () => {
    if (!image) return;

    setIsProcessing(true);
    
    try {
      const canvas = imageToCanvas(image);
      const imageData = getImageData(canvas);
      
      const extractedColors = medianCutQuantize(imageData, numColors);
      setPalette(extractedColors);
    } catch (err) {
      console.error("Failed to analyze colors:", err);
    }
    
    setIsProcessing(false);
  }, [image, numColors]);

  const handleGenerateChart = useCallback(async () => {
    if (!image) return;

    setIsProcessing(true);
    
    try {
      const canvas = imageToCanvas(image);
      const imageData = getImageData(canvas);
      
      const resized = resizeImage(
        imageData,
        parseInt(targetWidth),
        Math.round(parseInt(targetHeight) * gaugeRatio)
      );
      
      const cells = mapImageToPalette(resized, palette);
      
      const newChart: KnittingChart = {
        id: crypto.randomUUID(),
        name: "Converted Chart",
        width: parseInt(targetWidth),
        height: Math.round(parseInt(targetHeight) * gaugeRatio),
        cells,
        palette,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setChart(newChart);
      setStep("preview");
    } catch (err) {
      console.error("Failed to generate chart:", err);
      alert("Failed to generate chart");
    }
    
    setIsProcessing(false);
  }, [image, targetWidth, targetHeight, gaugeRatio, palette]);

  const handleSendToEditor = useCallback(() => {
    if (!chart) return;
    localStorage.setItem("knitforge-current-chart", chartToJSON(chart));
    router.push("/chart-editor");
  }, [chart, router]);

  const handleExportSVG = useCallback(() => {
    if (!chart) return;
    const svg = exportChartAsSVG(chart, 20);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chart.svg";
    a.click();
    URL.revokeObjectURL(url);
  }, [chart]);

  const handleExportPNG = useCallback(async () => {
    if (!chart) return;
    const blob = await exportChartAsPNG(chart, 20);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chart.png";
    a.click();
    URL.revokeObjectURL(url);
  }, [chart]);

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
            Transform any image into a beautiful knitting chart pattern
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {(["upload", "configure", "preview"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-colors",
                    step === s
                      ? "bg-sienna text-cream"
                      : i < ["upload", "configure", "preview"].indexOf(step)
                      ? "bg-moss text-cream"
                      : "bg-oat text-warm-muted"
                  )}
                >
                  {i < ["upload", "configure", "preview"].indexOf(step) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={cn(
                    "font-body text-sm hidden sm:block",
                    step === s ? "text-warm-black font-medium" : "text-warm-muted"
                  )}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
                {i < 2 && (
                  <div className="w-8 h-0.5 bg-tan mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card variant="stitched" padding="lg">
                <CardHeader>
                  <CardTitle>Upload Your Image</CardTitle>
                  <CardDescription>
                    Choose any image — a photo of your pet, a flower, a geometric pattern
                  </CardDescription>
                </CardHeader>

                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors",
                    dragOver
                      ? "border-sienna bg-sienna/5"
                      : "border-tan hover:border-sienna hover:bg-oat/50"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="hidden"
                  />
                  
                  <div className="w-20 h-20 mx-auto mb-4 text-tan">
                    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                      <rect x="6" y="10" width="52" height="44" rx="4" stroke="currentColor" strokeWidth="3" fill="none" />
                      <path d="M6 42L20 28L32 40L44 28L58 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="20" cy="22" r="6" fill="currentColor" opacity="0.3" />
                    </svg>
                  </div>
                  
                  <p className="font-body text-warm-gray mb-2">
                    Drag and drop an image here, or click to select
                  </p>
                  <p className="font-mono text-xs text-warm-muted">
                    Supports PNG, JPG, GIF, WebP
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {step === "configure" && (
            <motion.div
              key="configure"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <Card variant="stitched" padding="md">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  {imageSrc && (
                    <div className="relative rounded-xl overflow-hidden">
                      <img
                        src={imageSrc}
                        alt="Preview"
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </Card>

                <div className="space-y-4">
                  <Card variant="stitched" padding="md">
                    <CardHeader>
                      <CardTitle>Chart Size</CardTitle>
                      <CardDescription>
                        Target stitch count for your chart
                      </CardDescription>
                    </CardHeader>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Width (stitches)"
                        type="number"
                        value={targetWidth}
                        onChange={(e) => setTargetWidth(e.target.value)}
                        min={5}
                        max={200}
                      />
                      <Input
                        label="Height (rows)"
                        type="number"
                        value={targetHeight}
                        onChange={(e) => setTargetHeight(e.target.value)}
                        min={5}
                        max={500}
                      />
                    </div>

                    <div className="mt-4 p-3 bg-oat rounded-xl">
                      <div className="flex justify-between text-sm">
                        <span className="text-warm-muted">Actual height:</span>
                        <span className="font-mono">
                          {Math.round(parseInt(targetHeight) * gaugeRatio)} rows
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card variant="stitched" padding="md">
                    <CardHeader>
                      <CardTitle>Colors</CardTitle>
                      <CardDescription>
                        Number of colors in your chart
                      </CardDescription>
                    </CardHeader>

                    <Select
                      label="Color Count"
                      value={numColors.toString()}
                      onChange={(e) => {
                        const count = parseInt(e.target.value);
                        setNumColors(count);
                        if (palette.length < count) {
                          setPalette([...palette, ...DEFAULT_PALETTE.slice(palette.length, count)]);
                        } else if (palette.length > count) {
                          setPalette(palette.slice(0, count));
                        }
                      }}
                      options={[
                        { value: "2", label: "2 Colors" },
                        { value: "3", label: "3 Colors" },
                        { value: "4", label: "4 Colors" },
                        { value: "5", label: "5 Colors" },
                        { value: "6", label: "6 Colors" },
                        { value: "8", label: "8 Colors" },
                      ]}
                    />

                    <Button
                      variant="secondary"
                      onClick={handleAnalyzeColors}
                      className="w-full mt-4"
                      disabled={isProcessing}
                    >
                      <RefreshCw className={cn("w-4 h-4", isProcessing && "animate-spin")} />
                      Analyze Image Colors
                    </Button>

                    <div className="mt-4">
                      <p className="font-heading text-sm mb-2">Extracted Colors:</p>
                      <div className="flex gap-2 flex-wrap">
                        {palette.map((color, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-lg shadow-inner"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </Card>

                  <Card variant="stitched" padding="md">
                    <CardHeader>
                      <CardTitle>Gauge Adjustment</CardTitle>
                      <CardDescription>
                        Knitted stitches are wider than tall
                      </CardDescription>
                    </CardHeader>

                    <div className="space-y-3">
                      <input
                        type="range"
                        min="1"
                        max="2"
                        step="0.1"
                        value={gaugeRatio}
                        onChange={(e) => setGaugeRatio(parseFloat(e.target.value))}
                        className="w-full accent-sienna"
                      />
                      <div className="flex justify-between text-sm text-warm-muted">
                        <span>1:1 (Square)</span>
                        <span className="font-mono">{gaugeRatio.toFixed(1)}:1</span>
                        <span>2:1 (Stretched)</span>
                      </div>
                    </div>
                  </Card>

                  <Button
                    onClick={handleGenerateChart}
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Generate Chart
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "preview" && chart && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card variant="stitched" padding="lg">
                <CardHeader>
                  <CardTitle>Chart Preview</CardTitle>
                  <CardDescription>
                    Your converted knitting chart — {chart.width}×{chart.height} stitches
                  </CardDescription>
                </CardHeader>

                <div className="mb-6 p-4 bg-oat rounded-2xl overflow-x-auto">
                  <div className="inline-block min-w-max">
                    <div
                      className="grid gap-0"
                      style={{
                        gridTemplateColumns: `repeat(${chart.width}, 16px)`,
                      }}
                    >
                      {chart.cells.map((row, y) =>
                        row.map((color, x) => (
                          <div
                            key={`${x}-${y}`}
                            className="w-4 h-4 border border-tan/30"
                            style={{ backgroundColor: color }}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-sm text-warm-muted">Palette:</span>
                  {chart.palette.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded shadow-inner"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => setStep("configure")} variant="secondary">
                    Adjust Settings
                  </Button>
                  <Button onClick={handleExportPNG}>
                    <Download className="w-4 h-4" />
                    Export PNG
                  </Button>
                  <Button onClick={handleExportSVG} variant="outline">
                    Export SVG
                  </Button>
                  <Button onClick={handleSendToEditor} variant="gold">
                    Edit in Chart Editor
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
