"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { fabric } from "fabric";
import { motion } from "framer-motion";
import { cn } from "@/lib/design-system/cn";
import { KnittingChart, ChartSettings, DEFAULT_CHART_SETTINGS } from "@/lib/canvas/types";

interface ChartCanvasProps {
  chart: KnittingChart;
  settings: ChartSettings;
  currentColor: string;
  currentTool: string;
  onChartChange: (chart: KnittingChart) => void;
  className?: string;
}

export function ChartCanvas({
  chart,
  settings,
  currentColor,
  currentTool,
  onChartChange,
  className,
}: ChartCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  const drawGrid = useCallback(() => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;
    const objects = canvas.getObjects();
    const gridObjects = objects.filter(
      (obj) => (obj as fabric.Group & { isGrid?: boolean }).isGrid
    );
    gridObjects.forEach((obj) => canvas.remove(obj));

    const gridSize = settings.gridSize;
    const gridColor = settings.showGrid ? "#D9CFC0" : "transparent";
    const gridLines: fabric.Group[] = [];

    for (let i = 0; i <= chart.width; i++) {
      const x = i * gridSize;
      const vLine = new fabric.Line([x, 0, x, chart.height * gridSize], {
        stroke: gridColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        originX: "left",
        originY: "top",
      });
      (vLine as fabric.Line & { isGrid?: boolean }).isGrid = true;
      gridLines.push(vLine);
    }

    for (let i = 0; i <= chart.height; i++) {
      const y = i * gridSize;
      const hLine = new fabric.Line([0, y, chart.width * gridSize, y], {
        stroke: gridColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        originX: "left",
        originY: "top",
      });
      (hLine as fabric.Line & { isGrid?: boolean }).isGrid = true;
      gridLines.push(hLine);
    }

    if (gridLines.length > 0) {
      const gridGroup = new fabric.Group(gridLines, {
        selectable: false,
        evented: false,
      });
      (gridGroup as fabric.Group & { isGrid?: boolean }).isGrid = true;
      canvas.add(gridGroup);
      canvas.sendObjectToBack(gridGroup);
    }

    canvas.renderAll();
  }, [chart.width, chart.height, settings.gridSize, settings.showGrid]);

  const drawCells = useCallback(() => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;
    const objects = canvas.getObjects();
    const cellObjects = objects.filter(
      (obj) => (obj as fabric.Group & { isCell?: boolean }).isCell
    );
    cellObjects.forEach((obj) => canvas.remove(obj));

    const gridSize = settings.gridSize;
    const cellRects: fabric.Rect[] = [];

    for (let y = 0; y < chart.height; y++) {
      for (let x = 0; x < chart.width; x++) {
        const color = chart.cells[y][x];
        const rect = new fabric.Rect({
          left: x * gridSize,
          top: y * gridSize,
          width: gridSize,
          height: gridSize,
          fill: color,
          selectable: false,
          evented: false,
          stroke: "#E8DFD1",
          strokeWidth: 0.5,
        });
        (rect as fabric.Rect & { isCell?: boolean; gridX?: number; gridY?: number }).isCell = true;
        (rect as fabric.Rect & { isCell?: boolean; gridX?: number; gridY?: number }).gridX = x;
        (rect as fabric.Rect & { isCell?: boolean; gridX?: number; gridY?: number }).gridY = y;
        cellRects.push(rect);
      }
    }

    if (cellRects.length > 0) {
      canvas.add(...cellRects);
    }

    drawGrid();
    canvas.renderAll();
  }, [chart, settings.gridSize, drawGrid]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const gridSize = settings.gridSize;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: chart.width * gridSize,
      height: chart.height * gridSize,
      backgroundColor: settings.backgroundColor,
      selection: false,
      renderOnAddRemove: true,
    });

    fabricRef.current = canvas;
    setIsReady(true);

    canvas.on("mouse:down", (opt) => {
      const pointer = canvas.getPointer(opt.e);
      const x = Math.floor(pointer.x / gridSize);
      const y = Math.floor(pointer.y / gridSize);

      if (x >= 0 && x < chart.width && y >= 0 && y < chart.height) {
        if (currentTool === "paint" || currentTool === "erase") {
          const newCells = [...chart.cells];
          newCells[y] = [...newCells[y]];
          newCells[y][x] = currentTool === "erase" 
            ? chart.palette[0] 
            : currentColor;
          onChartChange({ ...chart, cells: newCells, updatedAt: new Date() });
        }
      }
    });

    canvas.on("mouse:move", (opt) => {
      if (opt.e.buttons !== 1) return;
      
      const pointer = canvas.getPointer(opt.e);
      const x = Math.floor(pointer.x / gridSize);
      const y = Math.floor(pointer.y / gridSize);

      if (x >= 0 && x < chart.width && y >= 0 && y < chart.height) {
        if (currentTool === "paint" || currentTool === "erase") {
          const newCells = [...chart.cells];
          newCells[y] = [...newCells[y]];
          newCells[y][x] = currentTool === "erase" 
            ? chart.palette[0] 
            : currentColor;
          onChartChange({ ...chart, cells: newCells, updatedAt: new Date() });
        }
      }
    });

    const handleResize = () => {
      if (fabricRef.current) {
        fabricRef.current.setDimensions({
          width: chart.width * gridSize,
          height: chart.height * gridSize,
        });
        fabricRef.current.renderAll();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      drawCells();
    }
  }, [isReady, drawCells]);

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.setDimensions({
        width: chart.width * settings.gridSize,
        height: chart.height * settings.gridSize,
      });
      fabricRef.current.setBackgroundColor(
        settings.backgroundColor,
        () => fabricRef.current?.renderAll()
      );
      drawCells();
    }
  }, [chart.width, chart.height, settings.gridSize, settings.backgroundColor, drawCells]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-auto bg-oat rounded-2xl border-2 border-dashed border-tan p-4",
        className
      )}
    >
      <div className="inline-block shadow-lg rounded-lg overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <canvas ref={canvasRef} />
        </motion.div>
      </div>
    </div>
  );
}
