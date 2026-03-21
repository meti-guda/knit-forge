"use client";

import { useState, useEffect } from "react";

type PatternRow = {
     number: number;
     instruction: string;
};

const SAMPLE_ROWS: PatternRow[] = [
     { number: 1, instruction: "Cast on 40 sts." },
     { number: 2, instruction: "Row 1: Knit all sts." },
     { number: 3, instruction: "Row 2: Knit all sts." },
     { number: 4, instruction: "Repeat Rows 1–2 until length is 150 cm." },
];

const STORAGE_KEY = "knitforge-pattern-sample-current-row";

export default function SamplePatternPage() {
     const [currentRow, setCurrentRow] = useState<number>(1);

     useEffect(() => {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
               const n = parseInt(saved, 10);
               if (!Number.isNaN(n)) setCurrentRow(n);
          }
     }, []);

     useEffect(() => {
          localStorage.setItem(STORAGE_KEY, String(currentRow));
     }, [currentRow]);

     const goNext = () => {
          setCurrentRow((prev) =>
               prev < SAMPLE_ROWS[SAMPLE_ROWS.length - 1].number ? prev + 1 : prev
          );
     };

     const goPrev = () => {
          setCurrentRow((prev) => (prev > 1 ? prev - 1 : prev));
     };

     const jumpTo = (rowNumber: number) => {
          setCurrentRow(rowNumber);
     };

     return (
          <main className="min-h-screen bg-gray-50 p-6">
               <div className="max-w-2xl mx-auto space-y-4">
                    <header className="flex items-center justify-between">
                         <div>
                              <h1 className="text-2xl font-bold text-rose-600">
                                   Simple Garter Scarf
                              </h1>
                              <p className="text-xs text-gray-500">
                                   Sample pattern to test the row tracker.
                              </p>
                         </div>
                         <div className="flex gap-2">
                              <button
                                   onClick={goPrev}
                                   className="px-3 py-2 rounded-xl bg-gray-200 text-sm hover:bg-gray-300"
                              >
                                   ← Prev
                              </button>
                              <button
                                   onClick={goNext}
                                   className="px-3 py-2 rounded-xl bg-rose-500 text-sm text-white hover:bg-rose-600"
                              >
                                   Next →
                              </button>
                         </div>
                    </header>

                    <section className="bg-white rounded-2xl shadow p-4 space-y-2">
                         {SAMPLE_ROWS.map((row) => {
                              const isCurrent = row.number === currentRow;
                              return (
                                   <button
                                        key={row.number}
                                        onClick={() => jumpTo(row.number)}
                                        className={[
                                             "w-full text-left px-3 py-2 rounded-xl border text-sm",
                                             isCurrent
                                                  ? "border-rose-500 bg-rose-50"
                                                  : "border-gray-200 hover:bg-gray-50",
                                        ].join(" ")}
                                   >
                                        <span className="font-mono text-xs text-gray-500">
                                             Row {row.number}
                                        </span>
                                        <p className="text-gray-800">{row.instruction}</p>
                                        {isCurrent && (
                                             <p className="text-[11px] text-rose-500 mt-1">
                                                  Current row
                                             </p>
                                        )}
                                   </button>
                              );
                         })}
                    </section>
               </div>
          </main>
     );
}
