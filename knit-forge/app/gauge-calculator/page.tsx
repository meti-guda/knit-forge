"use client";

import { useState } from "react";

type GaugeInput = {
     stitches: string;
     rows: string;
     widthCm: string;
     heightCm: string;
};

type PatternInput = {
     patternSts: string;
     patternRows: string;
     targetWidthCm: string;
     targetHeightCm: string;
};

export default function GaugeCalculatorPage() {
     const [gaugeInput, setGaugeInput] = useState<GaugeInput>({
          stitches: "",
          rows: "",
          widthCm: "",
          heightCm: "",
     });

     const [patternInput, setPatternInput] = useState<PatternInput>({
          patternSts: "",
          patternRows: "",
          targetWidthCm: "",
          targetHeightCm: "",
     });

     const [result, setResult] = useState<{
          stsPer10: number | null;
          rowsPer10: number | null;
          adjustedSts: number | null;
          adjustedRows: number | null;
     }>({
          stsPer10: null,
          rowsPer10: null,
          adjustedSts: null,
          adjustedRows: null,
     });

     const handleGaugeChange = (field: keyof GaugeInput, value: string) => {
          setGaugeInput((prev) => ({ ...prev, [field]: value }));
     };

     const handlePatternChange = (field: keyof PatternInput, value: string) => {
          setPatternInput((prev) => ({ ...prev, [field]: value }));
     };

     const calculateGauge = () => {
          const stitches = parseFloat(gaugeInput.stitches);
          const rows = parseFloat(gaugeInput.rows);
          const widthCm = parseFloat(gaugeInput.widthCm);
          const heightCm = parseFloat(gaugeInput.heightCm);

          if (!stitches || !rows || !widthCm || !heightCm) {
               setResult({
                    stsPer10: null,
                    rowsPer10: null,
                    adjustedSts: null,
                    adjustedRows: null,
               });
               return;
          }

          const stsPerCm = stitches / widthCm;
          const rowsPerCm = rows / heightCm;

          const stsPer10 = parseFloat((stsPerCm * 10).toFixed(2));
          const rowsPer10 = parseFloat((rowsPerCm * 10).toFixed(2));

          setResult((prev) => ({
               ...prev,
               stsPer10,
               rowsPer10,
          }));
     };

     const calculateAdjustedPattern = () => {
          const patternSts = parseFloat(patternInput.patternSts);
          const patternRows = parseFloat(patternInput.patternRows);
          const targetWidthCm = parseFloat(patternInput.targetWidthCm);
          const targetHeightCm = parseFloat(patternInput.targetHeightCm);

          if (
               !result.stsPer10 ||
               !result.rowsPer10 ||
               !patternSts ||
               !patternRows ||
               !targetWidthCm ||
               !targetHeightCm
          ) {
               return;
          }

          const stsPerCm = result.stsPer10 / 10;
          const rowsPerCm = result.rowsPer10 / 10;

          const neededSts = Math.round(stsPerCm * targetWidthCm);
          const neededRows = Math.round(rowsPerCm * targetHeightCm);

          setResult((prev) => ({
               ...prev,
               adjustedSts: neededSts,
               adjustedRows: neededRows,
          }));
     };

     const handleBothCalculations = () => {
          calculateGauge();
          setTimeout(calculateAdjustedPattern, 0);
     };

     return (
          <main className="min-h-screen bg-gray-100 p-8">
               <h1 className="text-3xl font-bold text-center mb-6 text-rose-600">
                    Gauge Calculator
               </h1>

               <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-7">
                    <section className="bg-white rounded-2xl shadow p-5 space-y-3">
                         <h2 className="text-lg font-semibold text-gray-700">
                              1. Your Swatch
                         </h2>
                         <p className="text-sm text-gray-500">
                              Measure a blocked swatch and enter how many stitches and rows you
                              have over the measured width/height in cm.
                         </p>

                         <div className="grid grid-cols-2 gap-5 text-sm">
                              <label className="space-y-3">
                                   <span className="text-gray-600">Stitches in swatch</span>
                                   <input
                                        type="number"
                                        value={gaugeInput.stitches}
                                        onChange={(e) => handleGaugeChange("stitches", e.target.value)}
                                        className="border  rounded-xl px-3 py-2 text-gray-400 w-full my-2"
                                        placeholder="e.g. 22"
                                   />
                              </label>
                              <label className="space-y-3">
                                   <span className="text-gray-600">Rows in swatch</span>
                                   <input
                                        type="number"
                                        value={gaugeInput.rows}
                                        onChange={(e) => handleGaugeChange("rows", e.target.value)}
                                        className="border rounded-xl px-3 py-2 text-gray-400 w-full my-2"
                                        placeholder="e.g. 30"
                                   />
                              </label>
                              <label className="space-y-3">
                                   <span className="text-gray-600">Width of swatch (cm)</span>
                                   <input
                                        type="number"
                                        value={gaugeInput.widthCm}
                                        onChange={(e) => handleGaugeChange("widthCm", e.target.value)}
                                        className="border rounded-xl px-3 py-2  text-gray-400  w-full my-2"
                                        placeholder="e.g. 10"
                                   />
                              </label>
                              <label className="space-y-3">
                                   <span className="text-gray-600">Height of swatch (cm)</span>
                                   <input
                                        type="number"
                                        value={gaugeInput.heightCm}
                                        onChange={(e) => handleGaugeChange("heightCm", e.target.value)}
                                        className="border rounded-xl px-3 py-2 text-gray-400 w-full my-2"
                                        placeholder="e.g. 10"
                                   />
                              </label>
                         </div>

                         <button
                              onClick={calculateGauge}
                              className="mt-2 bg-rose-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-rose-600"
                         >
                              Calculate my gauge
                         </button>

                         {result.stsPer10 && result.rowsPer10 && (
                              <div className="mt-3 text-md bg-rose-100 border border-rose-200 rounded-xl p-3">
                                   <p className="font-semibold text-rose-700 mb-2">Your gauge:</p>
                                   <p className=" font-mono  text-gray-700">
                                        {result.stsPer10} sts / 10 cm · {result.rowsPer10} rows / 10 cm
                                   </p>
                              </div>
                         )}
                    </section>

                    <section className="bg-white rounded-2xl shadow p-5 space-y-3">
                         <h2 className="text-lg font-semibold text-gray-700">
                              2. Resize a Pattern
                         </h2>
                         <p className="text-sm text-gray-500">
                              Enter the pattern&apos;s stitch & row counts and the finished
                              measurements you want.
                         </p>

                         <div className="grid grid-cols-2 gap-5 text-sm">
                              <label className="space-y-3">
                                   <span className="text-gray-600">Pattern stitches</span>
                                   <input
                                        type="number"
                                        value={patternInput.patternSts}
                                        onChange={(e) =>
                                             handlePatternChange("patternSts", e.target.value)
                                        }
                                        className="border rounded-xl px-3 py-2 text-gray-400 w-full my-2"
                                        placeholder="e.g. 80"
                                   />
                              </label>
                              <label className="space-y-3">
                                   <span className="text-gray-600">Pattern rows</span>
                                   <input
                                        type="number"
                                        value={patternInput.patternRows}
                                        onChange={(e) =>
                                             handlePatternChange("patternRows", e.target.value)
                                        }
                                        className="border rounded-xl px-3 py-2 text-gray-400  w-full my-2"
                                        placeholder="e.g. 100"
                                   />
                              </label>
                              <label className="space-y-3">
                                   <span className="text-gray-600">Target width (cm)</span>
                                   <input
                                        type="number"
                                        value={patternInput.targetWidthCm}
                                        onChange={(e) =>
                                             handlePatternChange("targetWidthCm", e.target.value)
                                        }
                                        className="border rounded-xl px-3 py-2  text-gray-400 w-full my-2"
                                        placeholder="e.g. 50"
                                   />
                              </label>
                              <label className="space-y-3">
                                   <span className="text-gray-600">Target height (cm)</span>
                                   <input
                                        type="number"
                                        value={patternInput.targetHeightCm}
                                        onChange={(e) =>
                                             handlePatternChange("targetHeightCm", e.target.value)
                                        }
                                        className="border rounded-xl px-3 py-2 text-gray-400 w-full my-2"
                                        placeholder="e.g. 60"
                                   />
                              </label>
                         </div>

                         <button
                              onClick={handleBothCalculations}
                              className="mt-2 bg-rose-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-rose-600"
                         >
                              Use my gauge to resize
                         </button>

                         {result.adjustedSts !== null && result.adjustedRows !== null && (
                              <div className="mt-3 text-md bg-emerald-100 border border-emerald-200 rounded-xl p-3">
                                   <p className="font-semibold text-emerald-700 mb-2">
                                        Adjusted stitch counts:
                                   </p>
                                   <p className="text-gray-700">
                                        Cast on approximately  {" "}
                                        <span className="font-mono font-semibold mx-1">
                                             {result.adjustedSts} sts
                                        </span>{" "}
                                        and work about{" "}
                                        <span className="font-mono font-semibold mx-1">
                                             {result.adjustedRows} rows
                                        </span>{" "}
                                        to reach your target size with your gauge.
                                   </p>
                              </div>
                         )}
                    </section>
               </div>
          </main>
     );
}
