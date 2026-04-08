"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/design-system/cn";
import { ChartSettings } from "@/lib/canvas/types";

type Tool = "select" | "paint" | "fill" | "erase" | "pan";

interface ToolbarProps {
  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
  settings: ChartSettings;
  onSettingsChange: (settings: Partial<ChartSettings>) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
  {
    id: "select",
    label: "Select",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      </svg>
    ),
  },
  {
    id: "paint",
    label: "Paint",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    id: "erase",
    label: "Erase",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M20 20H7L3 16c-.8-.8-.8-2 0-2.8L13.8 2.4c.8-.8 2-.8 2.8 0l5.4 5.4c.8.8.8 2 0 2.8L12 20" />
        <path d="M6.5 13.5L12 8l4 4" />
      </svg>
    ),
  },
  {
    id: "fill",
    label: "Fill",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M19 11H5a4 4 0 00-4 4v6h22v-6a4 4 0 00-4-4z" />
        <path d="M12 11V3" />
        <path d="M8 7l4-4 4 4" />
      </svg>
    ),
  },
];

export function Toolbar({
  currentTool,
  onToolChange,
  settings,
  onSettingsChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: ToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-heading text-sm text-warm-black">Tools</h3>
        <div className="flex flex-wrap gap-2">
          {tools.map((tool) => (
            <motion.button
              key={tool.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToolChange(tool.id)}
              className={cn(
                "p-3 rounded-xl transition-colors flex flex-col items-center gap-1",
                currentTool === tool.id
                  ? "bg-sienna text-cream shadow-md"
                  : "bg-oat text-warm-black hover:bg-tan-light"
              )}
              title={tool.label}
            >
              {tool.icon}
              <span className="text-xs font-mono">{tool.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-sm text-warm-black">History</h3>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUndo}
            disabled={!canUndo}
            className={cn(
              "p-2 rounded-lg transition-colors",
              canUndo
                ? "bg-oat hover:bg-tan-light"
                : "bg-oat/50 text-warm-muted cursor-not-allowed"
            )}
            title="Undo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M3 10h10a5 5 0 015 5v2" />
              <path d="M7 6l-4 4 4 4" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRedo}
            disabled={!canRedo}
            className={cn(
              "p-2 rounded-lg transition-colors",
              canRedo
                ? "bg-oat hover:bg-tan-light"
                : "bg-oat/50 text-warm-muted cursor-not-allowed"
            )}
            title="Redo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M21 10H11a5 5 0 00-5 5v2" />
              <path d="M17 6l4 4-4 4" />
            </svg>
          </motion.button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-sm text-warm-black">Display</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showGrid}
              onChange={(e) => onSettingsChange({ showGrid: e.target.checked })}
              className="w-4 h-4 accent-sienna"
            />
            <span className="text-sm text-warm-gray">Show Grid</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showSymbols}
              onChange={(e) => onSettingsChange({ showSymbols: e.target.checked })}
              className="w-4 h-4 accent-sienna"
            />
            <span className="text-sm text-warm-gray">Show Symbols</span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-sm text-warm-black">Grid Size</h3>
        <input
          type="range"
          min="10"
          max="40"
          value={settings.gridSize}
          onChange={(e) => onSettingsChange({ gridSize: parseInt(e.target.value) })}
          className="w-full accent-sienna"
        />
        <div className="flex justify-between text-xs text-warm-muted">
          <span>10px</span>
          <span className="font-mono">{settings.gridSize}px</span>
          <span>40px</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-sm text-warm-black">Background</h3>
        <div className="flex gap-2">
          {["#F5EDE0", "#FFFFFF", "#2C2A28", "#EDE5D8"].map((color) => (
            <button
              key={color}
              onClick={() => onSettingsChange({ backgroundColor: color })}
              className={cn(
                "w-8 h-8 rounded-lg transition-all",
                settings.backgroundColor === color
                  ? "ring-2 ring-warm-black scale-110"
                  : "hover:scale-105"
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
