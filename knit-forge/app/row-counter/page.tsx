"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/design-system/cn";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Counter, YarnBall } from "@/components/icons";
import { v4 as uuidv4 } from "uuid";

type Counter = {
  id: string;
  name: string;
  count: number;
  alertEvery: number;
  color: string;
};

type Session = {
  id: string;
  name: string;
  counters: Counter[];
  createdAt: Date;
};

const counterColors = [
  { name: "Sienna", value: "#B85C38" },
  { name: "Gold", value: "#D4A853" },
  { name: "Moss", value: "#5C6B4A" },
  { name: "Plum", value: "#7B5D7A" },
  { name: "Rust", value: "#8B3A2F" },
];

const defaultCounters: Counter[] = [
  { id: uuidv4(), name: "Main Counter", count: 0, alertEvery: 0, color: counterColors[0].value },
];

export default function RowCounterPage() {
  const [mounted, setMounted] = useState(false);
  const [counters, setCounters] = useState<Counter[]>(defaultCounters);
  const [newName, setNewName] = useState("");
  const [selectedColor, setSelectedColor] = useState(counterColors[0].value);
  const [modal, setModal] = useState<{ visible: boolean; message: string; counterName: string }>({
    visible: false,
    message: "",
    counterName: "",
  });
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("knitforge-counters");
    if (saved) {
      setCounters(JSON.parse(saved));
    }
    const savedSessions = localStorage.getItem("knitforge-sessions");
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    const savedSound = localStorage.getItem("knitforge-sound");
    if (savedSound) {
      setSoundEnabled(JSON.parse(savedSound));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("knitforge-counters", JSON.stringify(counters));
  }, [counters, mounted]);

  useEffect(() => {
    localStorage.setItem("knitforge-sound", JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const playSound = useCallback(() => {
    if (!soundEnabled) return;
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, [soundEnabled]);

  const vibrate = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  }, []);

  const showModal = (message: string, counterName: string) => {
    setModal({ visible: true, message, counterName });
    playSound();
    vibrate();
  };

  const increment = (id: string) => {
    setCounters((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const next = c.count + 1;
        if (c.alertEvery > 0 && next % c.alertEvery === 0) {
          showModal(`Reached row ${next}!`, c.name);
        }
        return { ...c, count: next };
      })
    );
    playSound();
    vibrate();
  };

  const decrement = (id: string) => {
    setCounters((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, count: Math.max(0, c.count - 1) } : c
      )
    );
  };

  const reset = (id: string) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, count: 0 } : c))
    );
  };

  const remove = (id: string) => {
    setCounters((prev) => prev.filter((c) => c.id !== id));
  };

  const addCounter = () => {
    const name = newName.trim() || `Counter ${counters.length + 1}`;
    setCounters((prev) => [
      ...prev,
      { id: uuidv4(), name, count: 0, alertEvery: 0, color: selectedColor },
    ]);
    setNewName("");
  };

  const setAlert = (id: string, value: string) => {
    setCounters((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, alertEvery: parseInt(value) || 0 } : c
      )
    );
  };

  const saveSession = () => {
    const newSession: Session = {
      id: uuidv4(),
      name: `Session ${new Date().toLocaleDateString()}`,
      counters: [...counters],
      createdAt: new Date(),
    };
    const updatedSessions = [newSession, ...sessions].slice(0, 20);
    setSessions(updatedSessions);
    localStorage.setItem("knitforge-sessions", JSON.stringify(updatedSessions));
  };

  const loadSession = (session: Session) => {
    setCounters(session.counters);
    setShowHistory(false);
  };

  const deleteSession = (id: string) => {
    const updatedSessions = sessions.filter((s) => s.id !== id);
    setSessions(updatedSessions);
    localStorage.setItem("knitforge-sessions", JSON.stringify(updatedSessions));
  };

  const exportCounters = () => {
    const data = JSON.stringify(counters, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `knitforge-counters-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateCounter = (updated: Counter) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setEditingCounter(null);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center pt-16">
        <YarnBallSpinner />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-16 md:pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 text-sienna">
              <Counter className="w-full h-full" />
            </div>
            <h1 className="font-display text-4xl font-bold text-warm-black">
              Row Counter
            </h1>
          </div>
          <p className="font-body text-warm-gray">
            Track your knitting progress with multiple counters
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                soundEnabled ? "bg-sienna text-cream" : "bg-oat text-warm-gray"
              )}
              title={soundEnabled ? "Sound enabled" : "Sound disabled"}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {soundEnabled ? (
                  <>
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </>
                ) : (
                  <>
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                )}
              </svg>
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                showHistory ? "bg-sienna text-cream" : "bg-oat text-warm-gray"
              )}
              title="Session history"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </button>
          </div>
          <Button variant="ghost" size="sm" onClick={saveSession}>
            Save Session
          </Button>
        </motion.div>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <Card variant="stitched" padding="md">
                <h3 className="font-heading text-lg mb-4">Session History</h3>
                {sessions.length === 0 ? (
                  <p className="text-warm-muted font-body text-sm">
                    No saved sessions yet. Save your current counters to start.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 bg-oat rounded-lg"
                      >
                        <div>
                          <p className="font-body text-sm font-medium">
                            {session.name}
                          </p>
                          <p className="font-mono text-xs text-warm-muted">
                            {session.counters.length} counters
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => loadSession(session)}
                          >
                            Load
                          </Button>
                          <button
                            onClick={() => deleteSession(session.id)}
                            className="p-1 text-warm-muted hover:text-sienna"
                          >
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {counters.map((c, index) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  variant="stitched"
                  className="overflow-hidden"
                  padding="none"
                >
                  <div
                    className="h-1"
                    style={{ backgroundColor: c.color }}
                  />
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="font-heading text-lg text-warm-black">
                          {c.name}
                        </h2>
                        {c.alertEvery > 0 && (
                          <Badge variant="gold" size="sm">
                            Alert every {c.alertEvery}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingCounter(c)}
                          className="p-1.5 text-warm-muted hover:text-sienna rounded-lg hover:bg-sienna/10 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => remove(c.id)}
                          className="p-1.5 text-warm-muted hover:text-sienna rounded-lg hover:bg-sienna/10 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <motion.div
                      className="text-center py-4"
                      key={c.count}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      <span
                        className="font-mono text-6xl font-bold"
                        style={{ color: c.color }}
                      >
                        {c.count}
                      </span>
                    </motion.div>

                    <div className="flex gap-3 justify-center mb-4">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => decrement(c.id)}
                        className="w-14 h-14 rounded-xl bg-oat border-2 border-dashed border-tan text-warm-black hover:bg-tan-light transition-colors flex items-center justify-center text-2xl font-bold"
                      >
                        −
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => increment(c.id)}
                        className="w-20 h-14 rounded-xl text-cream text-2xl font-bold shadow-md flex items-center justify-center"
                        style={{ backgroundColor: c.color }}
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        + Add
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => reset(c.id)}
                        className="w-14 h-14 rounded-xl bg-oat border-2 border-dashed border-tan text-warm-gray hover:bg-tan-light hover:text-warm-black transition-colors flex items-center justify-center"
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" />
                          <path d="M21 3v5h-5" />
                          <path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16" />
                          <path d="M8 16H3v5" />
                        </svg>
                      </motion.button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-warm-muted">Alert every</span>
                      <input
                        type="number"
                        min={0}
                        value={c.alertEvery || ""}
                        onChange={(e) => setAlert(c.id, e.target.value)}
                        placeholder="0"
                        className="w-16 bg-oat border border-tan rounded-lg px-2 py-1 text-center font-mono text-warm-black text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                      <span className="text-warm-muted">rows</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-oat rounded-2xl border-2 border-dashed border-tan"
        >
          <div className="flex gap-3">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Counter name..."
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && addCounter()}
            />
            <Button onClick={addCounter}>+ Add</Button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-warm-muted">Color:</span>
            <div className="flex gap-2">
              {counterColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={cn(
                    "w-6 h-6 rounded-full transition-transform",
                    selectedColor === color.value && "ring-2 ring-offset-2 ring-warm-black scale-110"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex justify-center"
        >
          <Button variant="ghost" size="sm" onClick={exportCounters}>
            Export Counters
          </Button>
        </motion.div>
      </div>

      <Modal
        isOpen={modal.visible}
        onClose={() => setModal({ ...modal, visible: false })}
        title="Row Alert!"
        size="sm"
      >
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-4 text-sienna"
          >
            <YarnBall className="w-full h-full" />
          </motion.div>
          <p className="font-body text-lg text-warm-black mb-2">
            {modal.message}
          </p>
          <p className="font-body text-warm-muted mb-6">
            {modal.counterName}
          </p>
          <Button onClick={() => setModal({ ...modal, visible: false })}>
            Keep Going!
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={!!editingCounter}
        onClose={() => setEditingCounter(null)}
        title="Edit Counter"
        size="sm"
      >
        {editingCounter && (
          <div className="space-y-4">
            <Input
              label="Counter Name"
              value={editingCounter.name}
              onChange={(e) =>
                setEditingCounter({ ...editingCounter, name: e.target.value })
              }
            />
            <div>
              <label className="block text-sm font-medium text-warm-black mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {counterColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() =>
                      setEditingCounter({ ...editingCounter, color: color.value })
                    }
                    className={cn(
                      "w-8 h-8 rounded-full transition-transform",
                      editingCounter.color === color.value &&
                        "ring-2 ring-offset-2 ring-warm-black scale-110"
                    )}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setEditingCounter(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={() => updateCounter(editingCounter)} className="flex-1">
                Save
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function YarnBallSpinner() {
  return (
    <motion.div
      className="flex items-center justify-center"
      animate={{ y: [0, -10, 0, -5, 0], rotate: [0, 10, -10, 5, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="60" height="60" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="#B85C38" opacity="0.2" />
        <circle cx="32" cy="32" r="24" fill="#B85C38" />
        <path
          d="M20 28C20 28 26 20 32 20C38 20 44 28 44 28"
          stroke="#F5EDE0"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M16 36C16 36 24 32 32 32C40 32 48 36 48 36"
          stroke="#F5EDE0"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M24 44C24 44 28 40 32 40C36 40 40 44 40 44"
          stroke="#F5EDE0"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <ellipse cx="24" cy="24" rx="4" ry="2" fill="#D4714A" opacity="0.6" />
      </svg>
    </motion.div>
  );
}
