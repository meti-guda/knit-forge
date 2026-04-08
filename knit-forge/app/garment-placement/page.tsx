"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/design-system/cn";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Shirt, Download, ChevronRight } from "@/components/icons";
import {
  GarmentType,
  PlacementMode,
  GARMENTS,
  DEFAULT_TILING_CONFIG,
} from "@/lib/garments/types";
import { renderPlacedMotif, exportPlacementAsSVG, getPlacementDescription } from "@/lib/garments/placement";
import { KnittingChart, DEFAULT_PALETTE, createEmptyChart } from "@/lib/canvas/types";

const PLACEMENT_MODES: { value: PlacementMode; label: string; description: string }[] = [
  { value: "centered", label: "Centered", description: "Motif in the middle" },
  { value: "two-ends", label: "Two Ends", description: "Motif at each end" },
  { value: "scattered", label: "Scattered", description: "Allover pattern" },
  { value: "border", label: "Border", description: "Motif at edges" },
];

export default function GarmentPlacementPage() {
  const [garmentType, setGarmentType] = useState<GarmentType>("scarf");
  const [placementMode, setPlacementMode] = useState<PlacementMode>("centered");
  const [targetWidth, setTargetWidth] = useState(50);
  const [targetHeight, setTargetHeight] = useState(200);
  const [gaugeSts, setGaugeSts] = useState(20);
  const [gaugeRows, setGaugeRows] = useState(28);
  const [borderWidth, setBorderWidth] = useState(4);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_PALETTE[5]);
  const [cellSize, setCellSize] = useState(4);
  const [showChartSelector, setShowChartSelector] = useState(false);
  const [chart, setChart] = useState<KnittingChart>(() => createEmptyChart(24, 24, DEFAULT_PALETTE));

  const garment = GARMENTS.find((g) => g.type === garmentType);

  const placedCells = renderPlacedMotif(chart, targetWidth, targetHeight, {
    mode: placementMode,
    repeatX: 1,
    repeatY: 1,
    offsetX: 0,
    offsetY: 0,
    backgroundColor,
    motifColor: DEFAULT_PALETTE[0],
    borderWidth,
  });

  const handleExportSVG = useCallback(() => {
    const svg = exportPlacementAsSVG(chart, targetWidth, targetHeight, {
      mode: placementMode,
      repeatX: 1,
      repeatY: 1,
      offsetX: 0,
      offsetY: 0,
      backgroundColor,
      motifColor: DEFAULT_PALETTE[0],
      borderWidth,
    }, cellSize);
    
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${garmentType}-placement.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [chart, targetWidth, targetHeight, placementMode, backgroundColor, borderWidth, cellSize, garmentType]);

  const handleQuickPattern = useCallback((type: "cat" | "heart" | "star") => {
    let newChart = createEmptyChart(24, 24, DEFAULT_PALETTE);
    const centerX = 12;
    const centerY = 12;

    for (let y = 0; y < 24; y++) {
      for (let x = 0; x < 24; x++) {
        let shouldFill = false;
        
        switch (type) {
          case "heart":
            const dx = Math.abs(x - centerX);
            const dy = Math.abs(y - centerY);
            shouldFill = (dx * dx + dy * dy + dx * dy) < 50;
            break;
          case "star":
            const sdx = Math.abs(x - centerX);
            const sdy = Math.abs(y - centerY);
            shouldFill = sdx + sdy < 8 || (sdx < 3 && sdy < 3);
            break;
          case "cat":
            const cdx = Math.abs(x - centerX);
            const cdy = Math.abs(y - centerY);
            const inEars = (x < 6 && y < 6 && (x + y) < 6) || (x > 17 && y < 6 && (x + y) > 35);
            const inHead = cdx < 8 && cdy < 6;
            const inBody = cdy > 8 && cdy < 16 && cdx < 6;
            shouldFill = inEars || inHead || inBody;
            break;
        }
        
        if (shouldFill) {
          newChart.cells[y][x] = DEFAULT_PALETTE[1];
        }
      }
    }
    
    setChart(newChart);
  }, []);

  return (
    <div className="min-h-screen bg-cream pt-16 md:pt-20 pb-12">
      <div className="max-w-[1800px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 text-rust">
              <Shirt className="w-full h-full" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-warm-black">
                Garment Placement
              </h1>
              <p className="font-body text-warm-gray">
                Visualize your motifs on real garment shapes
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="stitched" padding="lg">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  {targetWidth} × {targetHeight} stitches at {gaugeSts}×{gaugeRows} gauge
                </CardDescription>
              </CardHeader>

              <div className="bg-oat rounded-2xl p-4 overflow-auto max-h-[600px]">
                <div className="inline-block min-w-max">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={`${targetWidth}-${targetHeight}`}
                    className="border-4 border-charcoal shadow-xl"
                    style={{
                      width: targetWidth * cellSize,
                      height: targetHeight * cellSize,
                    }}
                  >
                    <div
                      className="w-full h-full grid gap-0"
                      style={{
                        gridTemplateColumns: `repeat(${targetWidth}, ${cellSize}px)`,
                      }}
                    >
                      {placedCells.map((row, y) =>
                        row.map((color, x) => (
                          <div
                            key={`${x}-${y}`}
                            className="transition-colors duration-100"
                            style={{
                              backgroundColor: color,
                              width: cellSize,
                              height: cellSize,
                            }}
                          />
                        ))
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="secondary">{targetWidth} sts wide</Badge>
                  <Badge variant="secondary">{targetHeight} rows tall</Badge>
                </div>
                <Button onClick={handleExportSVG} size="sm">
                  <Download className="w-4 h-4" />
                  Export SVG
                </Button>
              </div>
            </Card>

            <Card variant="stitched" padding="md" className="mt-6">
              <CardHeader>
                <CardTitle>Quick Patterns</CardTitle>
                <CardDescription>
                  Try these sample motifs to see how they look
                </CardDescription>
              </CardHeader>
              <div className="flex gap-3">
                <Button variant="secondary" size="sm" onClick={() => handleQuickPattern("heart")}>
                  Heart
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleQuickPattern("star")}>
                  Star
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleQuickPattern("cat")}>
                  Cat
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <Card variant="stitched" padding="md">
              <CardHeader>
                <CardTitle>Garment</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <Select
                  label="Type"
                  value={garmentType}
                  onChange={(e) => setGarmentType(e.target.value as GarmentType)}
                  options={GARMENTS.map((g) => ({
                    value: g.type,
                    label: g.name,
                  }))}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Width (sts)"
                    type="number"
                    value={targetWidth}
                    onChange={(e) => setTargetWidth(parseInt(e.target.value) || 50)}
                    min={10}
                    max={200}
                  />
                  <Input
                    label="Height (rows)"
                    type="number"
                    value={targetHeight}
                    onChange={(e) => setTargetHeight(parseInt(e.target.value) || 50)}
                    min={10}
                    max={500}
                  />
                </div>
              </div>
            </Card>

            <Card variant="stitched" padding="md">
              <CardHeader>
                <CardTitle>Your Gauge</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Sts / 10cm"
                  type="number"
                  value={gaugeSts}
                  onChange={(e) => setGaugeSts(parseInt(e.target.value) || 20)}
                  min={5}
                  max={50}
                />
                <Input
                  label="Rows / 10cm"
                  type="number"
                  value={gaugeRows}
                  onChange={(e) => setGaugeRows(parseInt(e.target.value) || 28)}
                  min={5}
                  max={50}
                />
              </div>
            </Card>

            <Card variant="stitched" padding="md">
              <CardHeader>
                <CardTitle>Placement Mode</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-2 gap-2">
                {PLACEMENT_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setPlacementMode(mode.value)}
                    className={cn(
                      "p-3 rounded-xl text-left transition-colors",
                      placementMode === mode.value
                        ? "bg-sienna text-cream"
                        : "bg-oat hover:bg-tan-light"
                    )}
                  >
                    <p className="font-body font-medium text-sm">{mode.label}</p>
                    <p className={cn(
                      "text-xs mt-0.5",
                      placementMode === mode.value ? "text-cream/70" : "text-warm-muted"
                    )}>
                      {mode.description}
                    </p>
                  </button>
                ))}
              </div>

              {placementMode === "border" && (
                <div className="mt-4">
                  <Input
                    label="Border width (sts)"
                    type="number"
                    value={borderWidth}
                    onChange={(e) => setBorderWidth(parseInt(e.target.value) || 4)}
                    min={2}
                    max={20}
                  />
                </div>
              )}
            </Card>

            <Card variant="stitched" padding="md">
              <CardHeader>
                <CardTitle>Display</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Background</label>
                  <div className="flex gap-2">
                    {DEFAULT_PALETTE.slice(4, 8).map((color) => (
                      <button
                        key={color}
                        onClick={() => setBackgroundColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-lg transition-all",
                          backgroundColor === color
                            ? "ring-2 ring-warm-black scale-110"
                            : "hover:scale-105"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Zoom</label>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    value={cellSize}
                    onChange={(e) => setCellSize(parseInt(e.target.value))}
                    className="w-full accent-sienna"
                  />
                  <div className="flex justify-between text-xs text-warm-muted mt-1">
                    <span>2px</span>
                    <span className="font-mono">{cellSize}px</span>
                    <span>12px</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="stitched" padding="md" className="bg-moss/10">
              <h4 className="font-heading text-sm mb-2">Placement Summary</h4>
              <p className="font-body text-xs text-warm-gray leading-relaxed">
                {getPlacementDescription(chart, targetWidth, targetHeight, {
                  mode: placementMode,
                  repeatX: 1,
                  repeatY: 1,
                  offsetX: 0,
                  offsetY: 0,
                  backgroundColor,
                  motifColor: DEFAULT_PALETTE[0],
                  borderWidth,
                })}
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
