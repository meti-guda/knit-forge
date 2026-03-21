"use client";

import { useState, useEffect } from "react";

type PatternStep = {
     id: number;
     section: string;
     instruction: string;
};

const PATTERN: {
     title: string;
     description: string;
     materials: string[];
     steps: PatternStep[];
} = {
     title: "Simple Garter Scarf",
     description: "A beginner-friendly garter stitch scarf. Great for practicing row tracking.",
     materials: [
          "100g DK weight yarn",
          "4.5mm knitting needles",
          "Scissors + yarn needle",
     ],
     steps: [
          { id: 1, section: "Cast On", instruction: "Make a slip knot and cast on 40 stitches using the long-tail cast on method." },
          { id: 2, section: "Cast On", instruction: "Check your stitch count: you should have 40 stitches on your needle." },
          { id: 3, section: "Body", instruction: "Row 1 (RS): Knit all 40 stitches to end of row." },
          { id: 4, section: "Body", instruction: "Row 2 (WS): Knit all 40 stitches to end of row." },
          { id: 5, section: "Body", instruction: "Row 3: Knit all 40 stitches." },
          { id: 6, section: "Body", instruction: "Row 4: Knit all 40 stitches." },
          { id: 7, section: "Body", instruction: "Continue in garter stitch (knit every row) until piece measures 140 cm from cast on edge." },
          { id: 8, section: "Body", instruction: "Check length: lay flat and measure. Adjust by knitting more rows if needed." },
          { id: 9, section: "Finishing", instruction: "Cast off loosely: knit 2 sts, pass first stitch over second. Repeat to end." },
          { id: 10, section: "Finishing", instruction: "Cut yarn leaving a 15 cm tail. Pull tail through last stitch and tighten." },
          { id: 11, section: "Finishing", instruction: "Weave in ends using a yarn needle. Block if desired." },
     ],
};

const STORAGE_KEY = "knitforge-pattern-sample-progress";

export default function SamplePatternPage() {
     const [mounted, setMounted] = useState(false);
     const [currentId, setCurrentId] = useState<number>(1);
     const [doneIds, setDoneIds] = useState<number[]>([]);
     const [showMaterials, setShowMaterials] = useState(false);

     useEffect(() => {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
               const parsed = JSON.parse(saved);
               setCurrentId(parsed.currentId ?? 1);
               setDoneIds(parsed.doneIds ?? []);
          }
          setMounted(true);
     }, []);

     useEffect(() => {
          if (!mounted) return;
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentId, doneIds }));
     }, [currentId, doneIds, mounted]);

     const totalSteps = PATTERN.steps.length;
     const progress = Math.round((doneIds.length / totalSteps) * 100);

     const goNext = () => {
          const idx = PATTERN.steps.findIndex((s) => s.id === currentId);
          if (idx < PATTERN.steps.length - 1) {
               const nextId = PATTERN.steps[idx + 1].id;
               if (!doneIds.includes(currentId)) {
                    setDoneIds((prev) => [...prev, currentId]);
               }
               setCurrentId(nextId);
          }
     };

     const goPrev = () => {
          const idx = PATTERN.steps.findIndex((s) => s.id === currentId);
          if (idx > 0) setCurrentId(PATTERN.steps[idx - 1].id);
     };

     const jumpTo = (id: number) => setCurrentId(id);

     const toggleDone = (id: number) => {
          setDoneIds((prev) =>
               prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
          );
     };

     const resetProgress = () => {
          setCurrentId(1);
          setDoneIds([]);
     };

     const sections = PATTERN.steps.reduce<Record<string, PatternStep[]>>(
          (acc, step) => {
               if (!acc[step.section]) acc[step.section] = [];
               acc[step.section].push(step);
               return acc;
          },
          {}
     );

     if (!mounted) {
          return (
               <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <p className="text-gray-400">Loading...</p>
               </main>
          );
     }

     return (
          <main className="min-h-screen bg-gray-100 p-6">
               <div className="max-w-2xl mx-auto space-y-5">

                    <div className="bg-white rounded-2xl shadow p-5">
                         <div className="flex justify-between items-start">
                              <div>
                                   <h1 className="text-2xl font-bold text-rose-600">
                                        {PATTERN.title}
                                   </h1>
                                   <p className="text-md text-gray-500 mt-2">{PATTERN.description}</p>
                              </div>
                              <button
                                   onClick={resetProgress}
                                   className="text-sm text-gray-400 hover:text-red-500"
                              >
                                   Reset
                              </button>
                         </div>

                         <div className="mt-4">
                              <div className="flex justify-between text-md text-gray-500 mb-1">
                                   <span>{doneIds.length} of {totalSteps} steps done</span>
                                   <span>{progress}%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                   <div
                                        className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                   />
                              </div>
                         </div>

                         <button
                              onClick={() => setShowMaterials((v) => !v)}
                              className="mt-3 text-sm text-rose-600 hover:underline"
                         >
                              {showMaterials ? "Hide materials ▲" : "Show materials ▼"}
                         </button>
                         {showMaterials && (
                              <ul className="mt-2 space-y-1">
                                   {PATTERN.materials.map((m, i) => (
                                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                                             <span className="text-rose-400">•</span> {m}
                                        </li>
                                   ))}
                              </ul>
                         )}
                    </div>

                    {Object.entries(sections).map(([section, steps]) => (
                         <div key={section}>
                              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2 px-1">
                                   {section}
                              </h2>
                              <div className="space-y-2">
                                   {steps.map((step) => {
                                        const isCurrent = step.id === currentId;
                                        const isDone = doneIds.includes(step.id);
                                        return (
                                             <div
                                                  key={step.id}
                                                  onClick={() => jumpTo(step.id)}
                                                  className={[
                                                       "cursor-pointer rounded-2xl border p-4 flex gap-3 items-start transition-all",
                                                       isCurrent
                                                            ? "border-rose-500 bg-rose-50"
                                                            : isDone
                                                                 ? "border-gray-200 bg-gray-50 opacity-90"
                                                                 : "border-gray-200 bg-white hover:bg-gray-50",
                                                  ].join(" ")}
                                             >
                                                  <button
                                                       onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleDone(step.id);
                                                       }}
                                                       className={[
                                                            "min-w-[28px] h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center border",
                                                            isDone
                                                                 ? "bg-rose-500 border-rose-500 text-white "
                                                                 : "border-gray-300 text-gray-400",
                                                       ].join(" ")}
                                                  >
                                                       {isDone ? "✓" : step.id}
                                                  </button>

                                                  <div>
                                                       <p className={["text-sm", isDone ? "line-through text-gray-400 " : "text-gray-800"].join(" ")}>
                                                            {step.instruction}
                                                       </p>
                                                       {isCurrent && (
                                                            <span className="text-[11px] text-rose-500 mt-1 block">
                                                                 ← You are here
                                                            </span>
                                                       )}
                                                  </div>
                                             </div>
                                        );
                                   })}
                              </div>
                         </div>
                    ))}

                    <div className="flex justify-between pb-6">
                         <button
                              onClick={goPrev}
                              className="px-5 py-2 rounded-xl bg-gray-300 text-sm font-semibold text-white hover:bg-gray-400 border border-gray-400"
                         >
                              ←  Prev
                         </button>
                         <button
                              onClick={goNext}
                              className="px-5 py-2 rounded-xl border border-rose-500 bg-rose-400 text-white text-sm font-semibold hover:bg-rose-600"
                         >
                              {currentId === PATTERN.steps[PATTERN.steps.length - 1].id
                                   ? "Finish 🎉"
                                   : "Next →"}
                         </button>
                    </div>

               </div>
          </main>
     );
}
