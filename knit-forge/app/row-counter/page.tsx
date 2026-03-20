"use client";

import { useState, useEffect } from "react";

type Counter = {
     id: number;
     name: string;
     count: number;
     alertEvery: number;
};

type ModalState = {
     visible: boolean;
     message: string;
};

const DEFAULT_COUNTERS: Counter[] = [
     { id: 1, name: "Main Counter", count: 0, alertEvery: 0 },
];

export default function RowCounterPage() {
     const [mounted, setMounted] = useState(false);
     const [counters, setCounters] = useState<Counter[]>(DEFAULT_COUNTERS);
     const [newName, setNewName] = useState("");
     const [modal, setModal] = useState<ModalState>({ visible: false, message: "" });

     useEffect(() => {
          const saved = localStorage.getItem("knitforge-counters");
          if (saved) {
               setCounters(JSON.parse(saved));
          }
          setMounted(true);
     }, []);


     useEffect(() => {
          if (!mounted) return;
          localStorage.setItem("knitforge-counters", JSON.stringify(counters));
     }, [counters, mounted]);

     const showModal = (message: string) => {
          setModal({ visible: true, message });
     };

     const closeModal = () => {
          setModal({ visible: false, message: "" });
     };

     const increment = (id: number) => {
          setCounters((prev) =>
               prev.map((c) => {
                    if (c.id !== id) return c;
                    const next = c.count + 1;
                    if (c.alertEvery > 0 && next % c.alertEvery === 0) {
                         showModal(`🧶 ${c.name}: reached row ${next}!`);
                    }
                    return { ...c, count: next };
               })
          );
     };

     const decrement = (id: number) => {
          setCounters((prev) =>
               prev.map((c) =>
                    c.id === id ? { ...c, count: Math.max(0, c.count - 1) } : c
               )
          );
     };

     const reset = (id: number) => {
          setCounters((prev) =>
               prev.map((c) => (c.id === id ? { ...c, count: 0 } : c))
          );
     };

     const remove = (id: number) => {
          setCounters((prev) => prev.filter((c) => c.id !== id));
     };

     const addCounter = () => {
          const name = newName.trim() || `Counter ${counters.length + 1}`;
          setCounters((prev) => [
               ...prev,
               { id: Date.now(), name, count: 0, alertEvery: 0 },
          ]);
          setNewName("");
     };

     const setAlert = (id: number, value: string) => {
          setCounters((prev) =>
               prev.map((c) =>
                    c.id === id ? { ...c, alertEvery: parseInt(value) || 0 } : c
               )
          );
     };

     if (!mounted) {
          return (
               <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <p className="text-gray-400">Loading...</p>
               </main>
          );
     }

     return (
          <main className="min-h-screen bg-gray-50 p-6">
               <h1 className="text-3xl font-bold text-center mb-8 text-rose-600">
                    🧶 Row Counter
               </h1>

               <div className="max-w-md mx-auto space-y-4">
                    {counters.map((c) => (
                         <div
                              key={c.id}
                              className="bg-white rounded-2xl shadow p-5 space-y-3"
                         >
                              <div className="flex justify-between items-center">
                                   <h2 className="text-lg font-semibold text-gray-400">{c.name}</h2>
                                   <button
                                        onClick={() => remove(c.id)}
                                        className="text-red-400 text-sm hover:text-red-600"
                                   >
                                        Remove
                                   </button>
                              </div>

                              <p className="text-5xl font-mono text-center text-rose-700">
                                   {c.count}
                              </p>

                              <div className="flex gap-2 justify-center">
                                   <button
                                        onClick={() => decrement(c.id)}
                                        className="text-white bg-gray-300 px-5 py-2 rounded-xl text-xl font-bold hover:bg-gray-400"
                                   >
                                        −
                                   </button>
                                   <button
                                        onClick={() => increment(c.id)}
                                        className="bg-rose-500 text-white px-5 py-2 rounded-xl text-xl font-bold hover:bg-rose-600"
                                   >
                                        +
                                   </button>
                                   <button
                                        onClick={() => reset(c.id)}
                                        className="text-white bg-gray-400 px-4 py-2 rounded-xl text-sm hover:bg-gray-500"
                                   >
                                        Reset
                                   </button>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                   <span>Alert every</span>
                                   <input
                                        type="number"
                                        min={0}
                                        value={c.alertEvery || ""}
                                        onChange={(e) => setAlert(c.id, e.target.value)}
                                        placeholder="0 = off"
                                        className="border rounded-lg w-20 px-2 py-1 text-center"
                                   />
                                   <span>rows</span>
                              </div>
                         </div>
                    ))}

                    <div className="flex gap-2">
                         <input
                              type="text"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              placeholder="New counter name..."
                              className="border bg-white text-gray-500 rounded-xl px-3 py-2 flex-1"
                         />
                         <button
                              onClick={addCounter}
                              className="bg-rose-500 text-white px-4 py-2 rounded-xl hover:bg-rose-600"
                         >
                              + Add
                         </button>
                    </div>
               </div>

               {modal.visible && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                         <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center space-y-4">
                              <p className="text-xl font-semibold text-rose-700">{modal.message}</p>
                              <button
                                   onClick={closeModal}
                                   className="bg-rose-500 text-white px-6 py-2 rounded-xl hover:bg-rose-600"
                              >
                                   OK, keep going!
                              </button>
                         </div>
                    </div>
               )}
          </main>
     );
}
