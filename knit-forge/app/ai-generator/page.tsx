"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/design-system/cn";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Send, RefreshCw, Check, AlertCircle, Loader2 } from "@/components/icons";
import { checkOllamaStatus, generateChatCompletion, OllamaStatus } from "@/lib/ai/ollama";
import { buildMotifPrompt, buildScarfPrompt, buildBeaniePrompt, EXAMPLE_PROMPTS } from "@/lib/ai/prompts";
import { KnittingChart, DEFAULT_PALETTE, createEmptyChart, chartToJSON } from "@/lib/canvas/types";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function AIGeneratorPage() {
  const router = useRouter();
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus>({ available: false, model: null });
  const [isLoading, setIsLoading] = useState(false);
  const [patternType, setPatternType] = useState<"motif" | "scarf" | "beanie" | "mittens">("motif");
  const [description, setDescription] = useState("");
  const [generatedChart, setGeneratedChart] = useState<KnittingChart | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkOllama();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const checkOllama = async () => {
    const status = await checkOllamaStatus();
    setOllamaStatus(status);
  };

  const handleGeneratePattern = async () => {
    if (!description.trim() || isLoading) return;
    setIsLoading(true);
    setGeneratedChart(null);

    try {
      let prompt = "";
      switch (patternType) {
        case "motif":
          prompt = buildMotifPrompt(description);
          break;
        case "scarf":
          prompt = buildScarfPrompt(description, { sts: 20, rows: 28 }, { width: 20, length: 180 });
          break;
        case "beanie":
          prompt = buildBeaniePrompt(description, { sts: 20, rows: 28 }, 56);
          break;
        case "mittens":
          prompt = buildMittensPrompt(description, { sts: 20, rows: 28 }, 20);
          break;
      }

      const response = await generateChatCompletion([
        { role: "system", content: "You are a knitting pattern expert. Always respond with valid JSON." },
        { role: "user", content: prompt },
      ]);

      if (patternType === "motif") {
        try {
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            const colors = parsed.colors || ["#B85C38", "#F5EDE0"];
            let chart = createEmptyChart(parsed.width || 20, parsed.height || 20, colors);
            
            for (let y = 0; y < Math.min(chart.height, parsed.grid?.length || 0); y++) {
              for (let x = 0; x < Math.min(chart.width, parsed.grid[y]?.length || 0); x++) {
                chart.cells[y][x] = parsed.grid[y][x];
              }
            }
            
            setGeneratedChart(chart);
          }
        } catch (e) {
          console.error("Failed to parse chart:", e);
        }
      }
    } catch (error) {
      console.error("Generation failed:", error);
    }

    setIsLoading(false);
  };

  const handleChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await generateChatCompletion([
        { role: "system", content: "You are a helpful knitting assistant. Provide clear, practical advice." },
        ...chatMessages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user", content: chatInput },
      ]);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat failed:", error);
    }

    setIsChatLoading(false);
  };

  const handleSendToEditor = useCallback(() => {
    if (generatedChart) {
      localStorage.setItem("knitforge-current-chart", chartToJSON(generatedChart));
      router.push("/chart-editor");
    }
  }, [generatedChart, router]);

  return (
    <div className="min-h-screen bg-charcoal pt-16 md:pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 text-gold">
              <Sparkles className="w-full h-full" />
            </div>
            <h1 className="font-display text-4xl font-bold text-cream">
              AI Pattern Generator
            </h1>
          </div>
          <p className="font-body text-lg text-cream/70 max-w-2xl mx-auto">
            Generate custom patterns with AI. Describe what you want and watch it come to life.
          </p>
        </motion.div>

        <div className="mb-6">
          <div
            className={cn(
              "p-4 rounded-xl border flex items-center gap-3",
              ollamaStatus.available
                ? "bg-moss/20 border-moss text-cream"
                : "bg-sienna/20 border-sienna text-cream"
            )}
          >
            {ollamaStatus.available ? (
              <>
                <Check className="w-5 h-5 text-moss" />
                <div className="flex-1">
                  <p className="font-body font-medium text-moss">Ollama Connected</p>
                  <p className="font-mono text-xs text-cream/60">
                    {ollamaStatus.model} ready
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-sienna" />
                <div className="flex-1">
                  <p className="font-body font-medium text-sienna">Ollama Not Connected</p>
                  <p className="font-body text-xs text-cream/60">
                    {ollamaStatus.error || "Install Ollama to use AI features"}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={checkOllama} className="border-cream/30 text-cream hover:bg-cream/10">
                  Retry
                </Button>
              </>
            )}
          </div>
        </div>

        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="w-full justify-center bg-charcoal/50 border border-cream/20">
            <TabsTrigger value="generator" className="data-[state=active]:bg-gold data-[state=active]:text-warm-black text-cream">
              Pattern Generator
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-gold data-[state=active]:text-warm-black text-cream">
              Knitting Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card variant="stitched" padding="lg" className="bg-cream border-cream/20">
                  <CardHeader>
                    <CardTitle>Describe Your Pattern</CardTitle>
                    <CardDescription>
                      Tell the AI what you want to create
                    </CardDescription>
                  </CardHeader>

                  <div className="space-y-4">
                    <Select
                      label="Pattern Type"
                      value={patternType}
                      onChange={(e) => setPatternType(e.target.value as typeof patternType)}
                      options={[
                        { value: "motif", label: "Motif / Chart" },
                        { value: "scarf", label: "Scarf" },
                        { value: "beanie", label: "Beanie" },
                        { value: "mittens", label: "Mittens" },
                      ]}
                    />

                    <Textarea
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={
                        patternType === "motif"
                          ? "e.g., A geometric heart pattern in pink and cream"
                          : patternType === "scarf"
                          ? "e.g., Chunky infinity scarf with seed stitch border"
                          : patternType === "beanie"
                          ? "e.g., Ribbed beanie with cable pattern"
                          : "e.g., Colorwork mittens with snowflake motif"
                      }
                      rows={4}
                    />

                    <div>
                      <p className="font-heading text-sm mb-2">Try These:</p>
                      <div className="flex flex-wrap gap-2">
                        {EXAMPLE_PROMPTS.motifs.slice(0, 3).map((example) => (
                          <button
                            key={example}
                            onClick={() => {
                              setDescription(example);
                              setPatternType("motif");
                            }}
                            className="px-3 py-1 bg-oat rounded-full text-sm text-warm-gray hover:bg-tan-light transition-colors"
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleGeneratePattern}
                      disabled={!description.trim() || isLoading || !ollamaStatus.available}
                      className="w-full"
                      variant="gold"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate Pattern
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card variant="stitched" padding="lg" className="bg-cream border-cream/20 min-h-[400px]">
                  <CardHeader>
                    <CardTitle>Generated Pattern</CardTitle>
                  </CardHeader>

                  {generatedChart ? (
                    <div className="space-y-4">
                      <div className="bg-oat rounded-xl p-4 overflow-auto max-h-[300px]">
                        <div
                          className="grid gap-0 mx-auto"
                          style={{
                            gridTemplateColumns: `repeat(${generatedChart.width}, 12px)`,
                          }}
                        >
                          {generatedChart.cells.map((row, y) =>
                            row.map((color, x) => (
                              <div
                                key={`${x}-${y}`}
                                className="w-3 h-3 border border-tan/30"
                                style={{ backgroundColor: color }}
                              />
                            ))
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          {generatedChart.width}×{generatedChart.height} stitches
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleSendToEditor} variant="gold" className="flex-1">
                          Edit in Chart Editor
                        </Button>
                        <Button variant="outline" onClick={() => setGeneratedChart(null)}>
                          Clear
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <div className="w-16 h-16 text-tan mb-4">
                        <Sparkles className="w-full h-full" />
                      </div>
                      <p className="font-body text-warm-muted">
                        Describe a pattern and click Generate
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <Card variant="stitched" padding="lg" className="bg-cream border-cream/20">
              <CardHeader>
                <CardTitle>Knitting Assistant</CardTitle>
                <CardDescription>
                  Ask questions about techniques, yarn, or get help with patterns
                </CardDescription>
              </CardHeader>

              <div className="space-y-4">
                <div className="bg-oat rounded-xl p-4 h-80 overflow-y-auto space-y-3">
                  {chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <p className="font-body text-warm-muted">
                        Start a conversation about knitting
                      </p>
                    </div>
                  ) : (
                    chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "p-3 rounded-xl max-w-[85%]",
                          message.role === "user"
                            ? "bg-sienna text-cream ml-auto"
                            : "bg-white"
                        )}
                      >
                        <p className="font-body text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    ))
                  )}
                  {isChatLoading && (
                    <div className="flex items-center gap-2 text-warm-muted">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about knitting techniques..."
                    onKeyDown={(e) => e.key === "Enter" && handleChat()}
                    className="flex-1"
                    disabled={!ollamaStatus.available}
                  />
                  <Button onClick={handleChat} disabled={!chatInput.trim() || !ollamaStatus.available || isChatLoading}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 bg-gold/10 rounded-2xl border border-gold/20"
        >
          <h3 className="font-heading text-lg text-gold mb-3">Getting Started with Ollama</h3>
          <ol className="space-y-2 font-body text-sm text-cream/70 list-decimal list-inside">
            <li>Install Ollama from <a href="https://ollama.com" target="_blank" rel="noopener" className="text-gold hover:underline">ollama.com</a></li>
            <li>Run <code className="bg-cream/10 px-2 py-0.5 rounded text-gold">ollama pull llama3.2</code> to download the model</li>
            <li>Restart KnitForge and the AI features will be ready</li>
          </ol>
        </motion.div>
      </div>
    </div>
  );
}
