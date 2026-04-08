"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/design-system/cn";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Calculator } from "@/components/icons";
import {
  calculateGauge,
  calculateStitchCount,
  calculateRowCount,
  calculateScarfDimensions,
  calculateBeanieDimensions,
  calculateMittenDimensions,
} from "@/lib/knitting/gauge";
import { yarnWeights, popularYarns, getYarnWeightById } from "@/lib/knitting/yarn-weights";

type Unit = "cm" | "in";

export default function GaugeCalculatorPage() {
  const [mounted, setMounted] = useState(false);
  const [unit, setUnit] = useState<Unit>("cm");
  const [savedGauges, setSavedGauges] = useState<{ name: string; stsPer10: number; rowsPer10: number }[]>([]);

  const [swatchInput, setSwatchInput] = useState({
    stitches: "",
    rows: "",
    widthCm: "",
    heightCm: "",
  });

  const [gaugeResult, setGaugeResult] = useState<{
    stsPer10: number;
    rowsPer10: number;
    stsPerCm: number;
    rowsPerCm: number;
  } | null>(null);

  const [patternInput, setPatternInput] = useState({
    patternStitches: "",
    patternRows: "",
    originalWidth: "",
    originalHeight: "",
    targetWidth: "",
    targetHeight: "",
  });

  const [resizeResult, setResizeResult] = useState<{
    stitches: number;
    rows: number;
  } | null>(null);

  const [garmentCalc, setGarmentCalc] = useState({
    type: "scarf",
    width: "",
    length: "",
    circumference: "",
    thumbLength: "",
  });

  const [garmentResult, setGarmentResult] = useState<{
    stitches: number;
    rows: number;
    thumbStitches?: number;
    thumbRows?: number;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("knitforge-gauges");
    if (saved) {
      setSavedGauges(JSON.parse(saved));
    }
    setMounted(true);
  }, []);

  const handleSwatchChange = (field: string, value: string) => {
    setSwatchInput((prev) => ({ ...prev, [field]: value }));
  };

  const handlePatternChange = (field: string, value: string) => {
    setPatternInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleGarmentChange = (field: string, value: string) => {
    setGarmentCalc((prev) => ({ ...prev, [field]: value }));
  };

  const calculateSwatchGauge = () => {
    const stitches = parseFloat(swatchInput.stitches);
    const rows = parseFloat(swatchInput.rows);
    const widthCm = parseFloat(swatchInput.widthCm);
    const heightCm = parseFloat(swatchInput.heightCm);

    if (!stitches || !rows || !widthCm || !heightCm) return;

    const result = calculateGauge({ stitches, rows, widthCm, heightCm });
    setGaugeResult(result);
  };

  const calculateResize = () => {
    if (!gaugeResult) {
      calculateSwatchGauge();
    }
    if (!gaugeResult && !patternInput.targetWidth && !patternInput.targetHeight) return;

    const targetWidth = parseFloat(patternInput.targetWidth) || 20;
    const targetHeight = parseFloat(patternInput.targetHeight) || 30;

    setResizeResult({
      stitches: calculateStitchCount(gaugeResult?.stsPer10 || 20, targetWidth),
      rows: calculateRowCount(gaugeResult?.rowsPer10 || 28, targetHeight),
    });
  };

  const calculateGarment = () => {
    if (!gaugeResult) return;

    const width = parseFloat(garmentCalc.width) || 20;
    const length = parseFloat(garmentCalc.length) || 30;
    const circumference = parseFloat(garmentCalc.circumference) || 20;
    const thumbLength = parseFloat(garmentCalc.thumbLength) || 8;

    switch (garmentCalc.type) {
      case "scarf":
        setGarmentResult(calculateScarfDimensions(width, length, gaugeResult));
        break;
      case "beanie":
        setGarmentResult(calculateBeanieDimensions(circumference, length, gaugeResult));
        break;
      case "mittens":
        setGarmentResult(
          calculateMittenDimensions(circumference, length, thumbLength, gaugeResult)
        );
        break;
      default:
        break;
    }
  };

  const saveGauge = () => {
    if (!gaugeResult) return;
    const name = prompt("Name for this gauge:");
    if (!name) return;
    const newGauge = { name, stsPer10: gaugeResult.stsPer10, rowsPer10: gaugeResult.rowsPer10 };
    const updated = [newGauge, ...savedGauges].slice(0, 10);
    setSavedGauges(updated);
    localStorage.setItem("knitforge-gauges", JSON.stringify(updated));
  };

  const loadGauge = (gauge: { stsPer10: number; rowsPer10: number }) => {
    setGaugeResult({
      ...gauge,
      stsPerCm: gauge.stsPer10 / 10,
      rowsPerCm: gauge.rowsPer10 / 10,
    });
  };

  const exportGauge = () => {
    if (!gaugeResult) return;
    const data = JSON.stringify(gaugeResult, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `knitforge-gauge-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center pt-16">
        <div className="w-12 h-12 text-sienna animate-pulse">
          <Calculator className="w-full h-full" />
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-16 md:pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 text-moss">
              <Calculator className="w-full h-full" />
            </div>
            <h1 className="font-display text-4xl font-bold text-warm-black">
              Gauge Calculator
            </h1>
          </div>
          <p className="font-body text-warm-gray">
            Calculate your gauge, resize patterns, and plan your projects
          </p>
        </motion.div>

        <Tabs defaultValue="gauge" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TabsList className="w-full justify-center flex-wrap h-auto p-2 gap-2">
              <TabsTrigger value="gauge">Your Gauge</TabsTrigger>
              <TabsTrigger value="resize">Resize Pattern</TabsTrigger>
              <TabsTrigger value="garments">Project Calculator</TabsTrigger>
              <TabsTrigger value="reference">Reference</TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="gauge">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card variant="stitched" className="h-full">
                  <CardHeader>
                    <CardTitle>Measure Your Swatch</CardTitle>
                    <CardDescription>
                      Block your swatch, then measure {unit === "cm" ? "centimeters" : "inches"} across
                    </CardDescription>
                  </CardHeader>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label={`Stitches (${unit === "cm" ? "cm" : "in"})`}
                        type="number"
                        value={swatchInput.widthCm}
                        onChange={(e) => handleSwatchChange("widthCm", e.target.value)}
                        placeholder="10"
                      />
                      <Input
                        label={`Rows (${unit === "cm" ? "cm" : "in"})`}
                        type="number"
                        value={swatchInput.heightCm}
                        onChange={(e) => handleSwatchChange("heightCm", e.target.value)}
                        placeholder="10"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Stitches counted"
                        type="number"
                        value={swatchInput.stitches}
                        onChange={(e) => handleSwatchChange("stitches", e.target.value)}
                        placeholder="22"
                      />
                      <Input
                        label="Rows counted"
                        type="number"
                        value={swatchInput.rows}
                        onChange={(e) => handleSwatchChange("rows", e.target.value)}
                        placeholder="30"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Select
                        label="Unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value as Unit)}
                        options={[
                          { value: "cm", label: "Centimeters" },
                          { value: "in", label: "Inches" },
                        ]}
                      />
                    </div>

                    <Button onClick={calculateSwatchGauge} className="w-full">
                      Calculate Gauge
                    </Button>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card variant="stitched" className="h-full">
                  <CardHeader>
                    <CardTitle>Your Gauge</CardTitle>
                    <CardDescription>Stitches and rows per 10cm / 4 inches</CardDescription>
                  </CardHeader>

                  {gaugeResult ? (
                    <div className="space-y-4">
                      <div className="bg-oat rounded-xl p-4 text-center">
                        <p className="font-mono text-4xl font-bold text-sienna">
                          {gaugeResult.stsPer10}
                        </p>
                        <p className="font-body text-sm text-warm-muted">sts per 10cm</p>
                      </div>
                      <div className="bg-oat rounded-xl p-4 text-center">
                        <p className="font-mono text-4xl font-bold text-moss">
                          {gaugeResult.rowsPer10}
                        </p>
                        <p className="font-body text-sm text-warm-muted">rows per 10cm</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-tan-light rounded-lg">
                          <p className="font-mono text-lg font-semibold text-warm-black">
                            {gaugeResult.stsPerCm}
                          </p>
                          <p className="font-mono text-xs text-warm-muted">sts/cm</p>
                        </div>
                        <div className="text-center p-3 bg-tan-light rounded-lg">
                          <p className="font-mono text-lg font-semibold text-warm-black">
                            {gaugeResult.rowsPerCm}
                          </p>
                          <p className="font-mono text-xs text-warm-muted">rows/cm</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={saveGauge} className="flex-1">
                          Save Gauge
                        </Button>
                        <Button variant="ghost" size="sm" onClick={exportGauge} className="flex-1">
                          Export
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center">
                      <div className="w-16 h-16 text-tan mb-4">
                        <Calculator className="w-full h-full" />
                      </div>
                      <p className="font-body text-warm-muted">
                        Enter your swatch measurements to calculate your gauge
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>

            {savedGauges.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <Card variant="outlined" padding="md">
                  <h3 className="font-heading text-lg mb-3">Saved Gauges</h3>
                  <div className="flex flex-wrap gap-2">
                    {savedGauges.map((gauge, i) => (
                      <button
                        key={i}
                        onClick={() => loadGauge(gauge)}
                        className="px-3 py-2 bg-oat rounded-lg hover:bg-tan-light transition-colors text-left"
                      >
                        <p className="font-body text-sm font-medium">{gauge.name}</p>
                        <p className="font-mono text-xs text-warm-muted">
                          {gauge.stsPer10} × {gauge.rowsPer10}
                        </p>
                      </button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="resize">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card variant="stitched">
                  <CardHeader>
                    <CardTitle>Original Pattern</CardTitle>
                    <CardDescription>
                      Enter the pattern&apos;s stitch count and finished size
                    </CardDescription>
                  </CardHeader>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Pattern stitches"
                        type="number"
                        value={patternInput.patternStitches}
                        onChange={(e) => handlePatternChange("patternStitches", e.target.value)}
                        placeholder="80"
                      />
                      <Input
                        label="Pattern rows"
                        type="number"
                        value={patternInput.patternRows}
                        onChange={(e) => handlePatternChange("patternRows", e.target.value)}
                        placeholder="100"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Original width (cm)"
                        type="number"
                        value={patternInput.originalWidth}
                        onChange={(e) => handlePatternChange("originalWidth", e.target.value)}
                        placeholder="20"
                      />
                      <Input
                        label="Original height (cm)"
                        type="number"
                        value={patternInput.originalHeight}
                        onChange={(e) => handlePatternChange("originalHeight", e.target.value)}
                        placeholder="30"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card variant="stitched">
                  <CardHeader>
                    <CardTitle>Your Target Size</CardTitle>
                    <CardDescription>
                      Enter the finished measurements you want
                    </CardDescription>
                  </CardHeader>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Target width (cm)"
                        type="number"
                        value={patternInput.targetWidth}
                        onChange={(e) => handlePatternChange("targetWidth", e.target.value)}
                        placeholder="25"
                      />
                      <Input
                        label="Target height (cm)"
                        type="number"
                        value={patternInput.targetHeight}
                        onChange={(e) => handlePatternChange("targetHeight", e.target.value)}
                        placeholder="35"
                      />
                    </div>

                    <Button onClick={calculateResize} className="w-full">
                      Calculate with My Gauge
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>

            {resizeResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card variant="stitched" className="bg-gradient-to-br from-sienna/5 to-gold/5">
                  <CardHeader>
                    <CardTitle>Adjusted Pattern</CardTitle>
                  </CardHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 text-center">
                      <p className="font-mono text-3xl font-bold text-sienna">
                        {resizeResult.stitches}
                      </p>
                      <p className="font-body text-sm text-warm-muted">cast on stitches</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center">
                      <p className="font-mono text-3xl font-bold text-moss">
                        {resizeResult.rows}
                      </p>
                      <p className="font-body text-sm text-warm-muted">total rows</p>
                    </div>
                  </div>
                  <p className="mt-4 font-body text-sm text-warm-gray text-center">
                    These counts will give you a finished piece approximately {patternInput.targetWidth}cm × {patternInput.targetHeight}cm
                  </p>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="garments">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card variant="stitched">
                  <CardHeader>
                    <CardTitle>Project Calculator</CardTitle>
                    <CardDescription>
                      Calculate stitch counts for common projects
                    </CardDescription>
                  </CardHeader>

                  <div className="space-y-4">
                    <Select
                      label="Project type"
                      value={garmentCalc.type}
                      onChange={(e) => handleGarmentChange("type", e.target.value)}
                      options={[
                        { value: "scarf", label: "Scarf" },
                        { value: "beanie", label: "Beanie" },
                        { value: "mittens", label: "Mittens" },
                      ]}
                    />

                    {garmentCalc.type === "scarf" && (
                      <>
                        <Input
                          label="Width (cm)"
                          type="number"
                          value={garmentCalc.width}
                          onChange={(e) => handleGarmentChange("width", e.target.value)}
                          placeholder="20"
                        />
                        <Input
                          label="Length (cm)"
                          type="number"
                          value={garmentCalc.length}
                          onChange={(e) => handleGarmentChange("length", e.target.value)}
                          placeholder="180"
                        />
                      </>
                    )}

                    {(garmentCalc.type === "beanie" || garmentCalc.type === "mittens") && (
                      <>
                        <Input
                          label="Head/Hand circumference (cm)"
                          type="number"
                          value={garmentCalc.circumference}
                          onChange={(e) => handleGarmentChange("circumference", e.target.value)}
                          placeholder="20"
                        />
                        <Input
                          label={garmentCalc.type === "beanie" ? "Length (cm)" : "Length to fingertips (cm)"}
                          type="number"
                          value={garmentCalc.length}
                          onChange={(e) => handleGarmentChange("length", e.target.value)}
                          placeholder={garmentCalc.type === "beanie" ? "25" : "20"}
                        />
                        {garmentCalc.type === "mittens" && (
                          <Input
                            label="Thumb length (cm)"
                            type="number"
                            value={garmentCalc.thumbLength}
                            onChange={(e) => handleGarmentChange("thumbLength", e.target.value)}
                            placeholder="8"
                          />
                        )}
                      </>
                    )}

                    <Button onClick={calculateGarment} className="w-full">
                      Calculate
                    </Button>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card variant="stitched" className="h-full">
                  <CardHeader>
                    <CardTitle>Results</CardTitle>
                  </CardHeader>

                  {garmentResult ? (
                    <div className="space-y-4">
                      {garmentCalc.type === "scarf" && (
                        <>
                          <div className="bg-oat rounded-xl p-4 text-center">
                            <p className="font-mono text-4xl font-bold text-sienna">
                              {garmentResult.stitches}
                            </p>
                            <p className="font-body text-sm text-warm-muted">cast on stitches</p>
                          </div>
                          <div className="bg-oat rounded-xl p-4 text-center">
                            <p className="font-mono text-4xl font-bold text-moss">
                              {garmentResult.rows}
                            </p>
                            <p className="font-body text-sm text-warm-muted">total rows</p>
                          </div>
                        </>
                      )}

                      {garmentCalc.type === "beanie" && (
                        <>
                          <div className="bg-oat rounded-xl p-4 text-center">
                            <p className="font-mono text-4xl font-bold text-sienna">
                              {garmentResult.stitches}
                            </p>
                            <p className="font-body text-sm text-warm-muted">cast on stitches</p>
                          </div>
                          <div className="bg-oat rounded-xl p-4 text-center">
                            <p className="font-mono text-4xl font-bold text-moss">
                              {garmentResult.rows}
                            </p>
                            <p className="font-body text-sm text-warm-muted">total rows</p>
                          </div>
                        </>
                      )}

                      {garmentCalc.type === "mittens" && (
                        <>
                          <div className="bg-oat rounded-xl p-4 text-center">
                            <p className="font-mono text-3xl font-bold text-sienna">
                              {garmentResult.stitches}
                            </p>
                            <p className="font-body text-sm text-warm-muted">main stitches</p>
                          </div>
                          <div className="bg-oat rounded-xl p-4 text-center">
                            <p className="font-mono text-3xl font-bold text-plum">
                              {garmentResult.thumbStitches}
                            </p>
                            <p className="font-body text-sm text-warm-muted">thumb stitches</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-tan-light rounded-xl p-3 text-center">
                              <p className="font-mono text-lg font-bold text-warm-black">
                                {garmentResult.rows}
                              </p>
                              <p className="font-mono text-xs text-warm-muted">main rows</p>
                            </div>
                            <div className="bg-tan-light rounded-xl p-3 text-center">
                              <p className="font-mono text-lg font-bold text-warm-black">
                                {garmentResult.thumbRows}
                              </p>
                              <p className="font-mono text-xs text-warm-muted">thumb rows</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center">
                      <p className="font-body text-warm-muted">
                        Select a project and enter dimensions to calculate
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="reference">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="stitched">
                <CardHeader>
                  <CardTitle>Yarn Weight Reference</CardTitle>
                  <CardDescription>
                    Standard yarn weights and recommended gauges
                  </CardDescription>
                </CardHeader>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-tan">
                        <th className="text-left py-3 px-4 font-heading text-sm">Weight</th>
                        <th className="text-left py-3 px-4 font-heading text-sm hidden md:table-cell">Category</th>
                        <th className="text-left py-3 px-4 font-heading text-sm">Needle (mm)</th>
                        <th className="text-left py-3 px-4 font-heading text-sm hidden lg:table-cell">Gauge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yarnWeights.map((weight) => (
                        <tr key={weight.id} className="border-b border-tan-light hover:bg-oat/50">
                          <td className="py-3 px-4 font-body font-medium">{weight.name}</td>
                          <td className="py-3 px-4 font-mono text-sm text-warm-muted hidden md:table-cell">
                            #{weight.category}
                          </td>
                          <td className="py-3 px-4 font-mono text-sm">{weight.needleSize.mm}</td>
                          <td className="py-3 px-4 font-mono text-sm text-warm-muted hidden lg:table-cell">
                            {weight.gauge.sts} × {weight.gauge.rows}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Card variant="stitched">
                <CardHeader>
                  <CardTitle>Popular Yarns</CardTitle>
                  <CardDescription>
                    Reference for common yarn brands and their weights
                  </CardDescription>
                </CardHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {popularYarns.slice(0, 12).map((yarn) => {
                    const weight = getYarnWeightById(yarn.weightId);
                    return (
                      <div
                        key={yarn.id}
                        className="p-3 bg-oat rounded-xl flex justify-between items-center"
                      >
                        <div>
                          <p className="font-body font-medium text-sm">{yarn.name}</p>
                          <p className="font-mono text-xs text-warm-muted">{yarn.brand}</p>
                        </div>
                        {weight && (
                          <span className="px-2 py-1 bg-white rounded-lg font-mono text-xs">
                            {weight.name}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
