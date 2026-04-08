"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/design-system/cn";

interface ColorPaletteProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onColorAdd: () => void;
  onColorRemove: (index: number) => void;
  onColorChange: (index: number, color: string) => void;
  maxColors?: number;
}

export function ColorPalette({
  colors,
  selectedColor,
  onColorSelect,
  onColorAdd,
  onColorRemove,
  onColorChange,
  maxColors = 8,
}: ColorPaletteProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm text-warm-black">Colors</h3>
        <span className="font-mono text-xs text-warm-muted">
          {colors.length}/{maxColors}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {colors.map((color, index) => (
          <motion.div
            key={`${color}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative group"
          >
            <button
              onClick={() => onColorSelect(color)}
              onContextMenu={(e) => {
                e.preventDefault();
                if (colors.length > 2) {
                  onColorRemove(index);
                }
              }}
              className={cn(
                "w-full aspect-square rounded-xl transition-all",
                "ring-offset-2 ring-offset-cream",
                selectedColor === color
                  ? "ring-2 ring-warm-black scale-110 shadow-md"
                  : "hover:scale-105 shadow-sm"
              )}
              style={{ backgroundColor: color }}
              title={`Click to select, right-click to remove`}
            />
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(index, e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Click to change color"
            />
            {selectedColor === color && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-warm-black rounded-full flex items-center justify-center">
                <span className="text-cream text-[8px]">✓</span>
              </div>
            )}
          </motion.div>
        ))}

        {colors.length < maxColors && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: colors.length * 0.05 }}
            onClick={onColorAdd}
            className={cn(
              "w-full aspect-square rounded-xl",
              "border-2 border-dashed border-tan",
              "flex items-center justify-center",
              "text-warm-muted hover:text-sienna hover:border-sienna",
              "transition-colors"
            )}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </motion.button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg shadow-inner"
          style={{ backgroundColor: selectedColor }}
        />
        <input
          type="text"
          value={selectedColor}
          onChange={(e) => onColorSelect(e.target.value.toUpperCase())}
          className={cn(
            "flex-1 px-3 py-1.5 rounded-lg",
            "border border-tan bg-cream",
            "font-mono text-sm uppercase",
            "focus:outline-none focus:ring-2 focus:ring-gold"
          )}
          placeholder="#000000"
        />
      </div>

      <p className="text-xs text-warm-muted">
        Right-click to remove a color
      </p>
    </div>
  );
}
