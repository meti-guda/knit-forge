/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
const TOTAL = PATTERN.steps.length;
const LAST_ID = PATTERN.steps[TOTAL - 1].id;

const CONFETTI_COLORS = ["#f43f5e", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#c084fc"];

function Confetti() {
     return (
          <div className="pointer-events-none fixed inset-0 z-100 overflow-hidden">
               {Array.from({ length: 60 }).map((_, i) => {
                    const left = `${Math.random() * 100}%`;
                    const delay = `${Math.random() * 1.5}s`;
                    const duration = `${1.5 + Math.random() * 2}s`;
                    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
                    const size = `${6 + Math.floor(Math.random() * 8)}px`;
                    return (
                         <span
                              key={i}
                              style={{
                                   position: "absolute",
                                   top: "-20px",
                                   left,
                                   width: size,
                                   height: size,
                                   backgroundColor: color,
                                   borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                                   animation: `confettiFall ${duration} ${delay} ease-in forwards`,
                              }}
                         />
                    );
               })}
               <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
          </div>
     );
}

export default function SamplePatternPage() {
     const [mounted, setMounted] = useState(false);
     const [currentId, setCurrentId] = useState<number>(1);
     const [doneIds, setDoneIds] = useState<number[]>([]);
     const [showMaterials, setShowMaterials] = useState(false);
     const [showCelebration, setShowCelebration] = useState(false);

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

     const progress = Math.round((doneIds.length / TOTAL) * 100);

     const goNext = () => {
          const idx = PATTERN.steps.findIndex((s) => s.id === currentId);
          const newDone = doneIds.includes(currentId)
               ? doneIds
               : [...doneIds, currentId];
          setDoneIds(newDone);

          if (currentId === LAST_ID) {
               setShowCelebration(true);
               return;
          }
          if (idx < PATTERN.steps.length - 1) {
               setCurrentId(PATTERN.steps[idx + 1].id);
          }
     };

     const goPrev = () => {
          const idx = PATTERN.steps.findIndex((s) => s.id === currentId);
          if (idx > 0) {
               const prevId = PATTERN.steps[idx - 1].id;
               setDoneIds((prev) => prev.filter((d) => d !== prevId));
               setCurrentId(prevId);
          }
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
          setShowCelebration(false);
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
               <main className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">Loading...</p>
               </main>
          );
     }

     return (
          <main className="min-h-screen bg-gray-50 p-6">
               <div className="max-w-2xl mx-auto space-y-5">

                    <Link
                         href="/patterns"
                         className="inline-flex items-center gap-1 text-sm text-shadow-sm text-gray-400 hover:text-rose-500"
                    >
                         ← Back to patterns
                    </Link>

                    <div className="bg-white rounded-2xl  shadow-md shadow-rose-200 p-5">
                         <div className="flex justify-between items-start">
                              <div>
                                   <h1 className="text-2xl font-bold text-rose-600">{PATTERN.title}</h1>
                                   <p className="text-md text-gray-500 mt-2">{PATTERN.description}</p>
                              </div>
                              <button onClick={resetProgress} className="text-sm text-gray-400 hover:text-red-500">
                                   Reset
                              </button>
                         </div>

                         <div className="mt-4">
                              <div className="flex justify-between text-md text-gray-500 mb-1">
                                   <span>{doneIds.length} of {TOTAL} steps done</span>
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
                              className="mt-5 text-sm text-rose-400 hover:underline"
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
                              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mt-4 mb-2 px-1">
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
                                                       "cursor-pointer rounded-2xl border p-4 flex gap-3 items-start transition-all shadow-sm ",
                                                       isCurrent
                                                            ? "border-rose-500 bg-rose-50"
                                                            : isDone
                                                                 ? "border-gray-200 bg-gray-100 opacity-70"
                                                                 : "border-gray-200 bg-white hover:bg-rose-50 hover:border-rose-200",
                                                  ].join(" ")}
                                             >
                                                  <button
                                                       onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleDone(step.id);
                                                       }}
                                                       className={[
                                                            "min-w-7 h-7 rounded-full text-xs text-shadow-sm font-mono font-bold flex items-center justify-center border ",
                                                            isDone
                                                                 ? "bg-rose-500 border-rose-500 text-white"
                                                                 : "border-gray-300 text-gray-400",
                                                       ].join(" ")}
                                                  >
                                                       {isDone ? "✓" : step.id}
                                                  </button>

                                                  <div className="flex-1">
                                                       <p className={["text-sm", isDone ? "line-through text-gray-400" : "text-gray-800"].join(" ")}>
                                                            {step.instruction}
                                                       </p>

                                                       {isCurrent && (
                                                            <div className="flex items-center gap-2 mt-2">
                                                                 <span className="text-sm text-rose-500">← You are here</span>
                                                                 <div className="flex gap-2 ml-auto">
                                                                      <button
                                                                           onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                                                           className="px-3 py-1 rounded-lg bg-gray-300 text-white text-shadow-md text-xs font-semibold hover:bg-gray-400 border border-gray-400"
                                                                      >
                                                                           ← Prev
                                                                      </button>
                                                                      <button
                                                                           onClick={(e) => { e.stopPropagation(); goNext(); }}
                                                                           className="px-3 py-1 rounded-lg bg-rose-400 text-white text-shadow-md text-xs font-semibold hover:bg-rose-600 border border-rose-500"
                                                                      >
                                                                           {step.id === LAST_ID ? "Finish 🎉" : "Next →"}
                                                                      </button>
                                                                 </div>
                                                            </div>
                                                       )}
                                                  </div>
                                             </div>
                                        );
                                   })}
                              </div>
                         </div>
                    ))}

                    <div className="pb-6" />
               </div>

               {showCelebration && (
                    <>
                         <Confetti />
                         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                              <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full mx-4 text-center space-y-4">
                                   <div className="text-6xl">🎉</div>
                                   <h2 className="text-2xl font-bold text-rose-600">Pattern Complete!</h2>
                                   <p className="text-gray-600 text-sm">
                                        You finished <span className="font-semibold">{PATTERN.title}</span>. Amazing work! Your scarf is done. 🧶
                                   </p>
                                   <div className="flex flex-col gap-3 pt-2">
                                        <button
                                             onClick={() => setShowCelebration(false)}
                                             className="px-5 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm hover:bg-gray-200"
                                        >
                                             View completed pattern
                                        </button>
                                        <button
                                             onClick={resetProgress}
                                             className="px-5 py-2 rounded-xl bg-rose-100 text-rose-600 text-sm hover:bg-rose-200"
                                        >
                                             Start this pattern over
                                        </button>
                                        <Link
                                             href="/patterns"
                                             className="px-5 py-2 rounded-xl bg-rose-500 text-white text-sm hover:bg-rose-600"
                                        >
                                             Back to all patterns
                                        </Link>
                                   </div>
                              </div>
                         </div>
                    </>
               )}
          </main>
     );
}
