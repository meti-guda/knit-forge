"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/design-system/cn";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { ChartCanvas } from "@/components/charts/ChartCanvas";
import { ColorPalette } from "@/components/charts/ColorPalette";
import { Toolbar } from "@/components/charts/Toolbar";
import { Palette, Download, Upload, Save } from "@/components/icons";
import {
  KnittingChart,
  ChartSettings,
  ChartTool,
  DEFAULT_PALETTE,
  DEFAULT_CHART_SETTINGS,
  createEmptyChart,
  chartToJSON,
  chartFromJSON,
  exportChartAsSVG,
  exportChartAsPNG,
} from "@/lib/canvas/types";
import Link from "next/link";

type Tool = "select" | "paint" | "fill" | "erase" | "pan";

const presetSizes = [
  { value: "small", label: "Small (20×20)", width: 20, height: 20 },
  { value: "medium", label: "Medium (30×40)", width: 30, height: 40 },
  { value: "large", label: "Large (40×60)", width: 40, height: 60 },
  { value: "scarf", label: "Scarf (50×200)", width: 50, height: 200 },
  { value: "custom", label: "Custom", width: 0, height: 0 },
];

export default function ChartEditorPage() {
  const [chart, setChart] = useState<KnittingChart>(() =>
    createEmptyChart(20, 20, DEFAULT_PALETTE)
  );
  const [settings, setSettings] = useState<ChartSettings>(DEFAULT_CHART_SETTINGS);
  const [currentTool, setCurrentTool] = useState<Tool>("paint");
  const [currentColor, setCurrentColor] = useState(DEFAULT_PALETTE[1]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [history, setHistory] = useState<KnittingChart[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [chartName, setChartName] = useState("Untitled Chart");
  const [customWidth, setCustomWidth] = useState("30");
  const [customHeight, setCustomHeight] = useState("40");
  const [selectedPreset, setSelectedPreset] = useState("small");

  useEffect(() => {
    const saved = localStorage.getItem("knitforge-current-chart");
    if (saved) {
      try {
        const parsed = chartFromJSON(saved);
        setChart(parsed);
        setChartName(parsed.name);
      } catch (e) {
        console.error("Failed to load chart:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (chart) {
      localStorage.setItem("knitforge-current-chart", chartToJSON(chart));
    }
  }, [chart]);

  const pushHistory = useCallback((newChart: KnittingChart) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newChart);
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const handleChartChange = useCallback((newChart: KnittingChart) => {
    setChart(newChart);
    pushHistory(newChart);
  }, [pushHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setChart(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setChart(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const createNewChart = (width: number, height: number) => {
    const newChart = createEmptyChart(width, height, DEFAULT_PALETTE);
    setChart(newChart);
    setChartName("Untitled Chart");
    setHistory([]);
    setHistoryIndex(-1);
    pushHistory(newChart);
    setShowNewModal(false);
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    if (preset !== "custom") {
      const size = presetSizes.find((s) => s.value === preset);
      if (size) {
        setCustomWidth(size.width.toString());
        setCustomHeight(size.height.toString());
      }
    }
  };

  const handleExportSVG = () => {
    const svg = exportChartAsSVG(chart, settings.gridSize);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chart.name || "chart"}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleExportPNG = async () => {
    const blob = await exportChartAsPNG(chart, settings.gridSize);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chart.name || "chart"}.png`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleExportJSON = () => {
    const json = chartToJSON({ ...chart, name: chartName });
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chartName || "chart"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleImportJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const imported = chartFromJSON(e.target?.result as string);
            setChart(imported);
            setChartName(imported.name);
            setHistory([]);
            setHistoryIndex(-1);
            pushHistory(imported);
          } catch (err) {
            alert("Invalid chart file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleColorSelect = (color: string) => {
    setCurrentColor(color);
  };

  const handleColorAdd = () => {
    if (chart.palette.length < 8) {
      const newPalette = [...chart.palette, "#808080"];
      setChart({ ...chart, palette: newPalette });
    }
  };

  const handleColorRemove = (index: number) => {
    if (chart.palette.length > 2) {
      const newPalette = chart.palette.filter((_, i) => i !== index);
      setChart({ ...chart, palette: newPalette });
    }
  };

  const handleColorChange = (index: number, color: string) => {
    const newPalette = [...chart.palette];
    newPalette[index] = color;
    setChart({ ...chart, palette: newPalette });
    if (chart.palette[index] === currentColor) {
      setCurrentColor(color);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-16 md:pt-20 pb-12">
      <div className="max-w-[1800px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 text-plum">
              <Palette className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chartName}
                  onChange={(e) => {
                    setChartName(e.target.value);
                    setChart({ ...chart, name: e.target.value });
                  }}
                  className="font-display text-2xl font-bold bg-transparent border-b-2 border-transparent hover:border-tan focus:border-sienna outline-none"
                />
                <Badge variant="secondary" size="sm">
                  {chart.width}×{chart.height}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowNewModal(true)}>
              New
            </Button>
            <Button variant="secondary" size="sm" onClick={handleImportJSON}>
              Import
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowExportModal(true)}>
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <Card variant="stitched" padding="md">
              <Toolbar
                currentTool={currentTool}
                onToolChange={setCurrentTool}
                settings={settings}
                onSettingsChange={setSettings}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                onUndo={undo}
                onRedo={redo}
              />
            </Card>

            <Card variant="stitched" padding="md">
              <ColorPalette
                colors={chart.palette}
                selectedColor={currentColor}
                onColorSelect={handleColorSelect}
                onColorAdd={handleColorAdd}
                onColorRemove={handleColorRemove}
                onColorChange={handleColorChange}
              />
            </Card>

            <Card variant="stitched" padding="md">
              <h3 className="font-heading text-sm mb-3">Quick Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-warm-muted">Dimensions</span>
                  <span className="font-mono">{chart.width} × {chart.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-muted">Colors</span>
                  <span className="font-mono">{chart.palette.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-muted">Grid</span>
                  <span className="font-mono">{settings.gridSize}px</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="min-h-[500px] lg:min-h-[600px]"
          >
            <ChartCanvas
              chart={chart}
              settings={settings}
              currentColor={currentColor}
              currentTool={currentTool}
              onChartChange={handleChartChange}
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </div>

      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Create New Chart"
        size="sm"
      >
        <div className="space-y-4">
          <Select
            label="Preset Size"
            value={selectedPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            options={presetSizes.map((s) => ({
              value: s.value,
              label: s.label,
            }))}
          />

          {selectedPreset === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Width"
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
                min={5}
                max={200}
              />
              <Input
                label="Height"
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                min={5}
                max={500}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowNewModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const width = parseInt(customWidth) || 20;
                const height = parseInt(customHeight) || 20;
                createNewChart(Math.min(Math.max(width, 5), 200), Math.min(Math.max(height, 5), 500));
              }}
              className="flex-1"
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Chart"
        size="sm"
      >
        <div className="space-y-4">
          <p className="font-body text-warm-gray">
            Choose a format to export your chart:
          </p>

          <div className="space-y-2">
            <Button onClick={handleExportPNG} className="w-full justify-start" variant="secondary">
              <Download className="w-4 h-4" />
              Export as PNG
            </Button>
            <Button onClick={handleExportSVG} className="w-full justify-start" variant="secondary">
              <Download className="w-4 h-4" />
              Export as SVG
            </Button>
            <Button onClick={handleExportJSON} className="w-full justify-start" variant="secondary">
              <Download className="w-4 h-4" />
              Export as JSON
            </Button>
          </div>

          <div className="pt-4 border-t border-tan">
            <Button
              variant="ghost"
              onClick={() => setShowExportModal(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
