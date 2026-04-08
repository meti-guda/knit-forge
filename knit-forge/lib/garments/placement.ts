import { KnittingChart, DEFAULT_PALETTE } from "@/lib/canvas/types";
import { PlacementMode } from "@/lib/garments/types";

export type TilingConfig = {
  mode: PlacementMode;
  repeatX: number;
  repeatY: number;
  offsetX: number;
  offsetY: number;
  backgroundColor: string;
  motifColor: string;
  borderWidth: number;
};

export const DEFAULT_TILING_CONFIG: TilingConfig = {
  mode: "centered",
  repeatX: 1,
  repeatY: 1,
  offsetX: 0,
  offsetY: 0,
  backgroundColor: DEFAULT_PALETTE[5],
  motifColor: DEFAULT_PALETTE[0],
  borderWidth: 4,
};

export function renderPlacedMotif(
  chart: KnittingChart,
  targetWidth: number,
  targetHeight: number,
  config: TilingConfig
): string[][] {
  const result: string[][] = [];
  
  for (let y = 0; y < targetHeight; y++) {
    const row: string[] = [];
    for (let x = 0; x < targetWidth; x++) {
      row.push(config.backgroundColor);
    }
    result.push(row);
  }

  switch (config.mode) {
    case "centered":
      placeCentered(chart, result, config);
      break;
    case "two-ends":
      placeTwoEnds(chart, result, config);
      break;
    case "scattered":
      placeScattered(chart, result, config);
      break;
    case "border":
      placeBorder(chart, result, config);
      break;
  }

  return result;
}

function placeCentered(chart: KnittingChart, result: string[][], config: TilingConfig) {
  const startX = Math.floor((result[0].length - chart.width) / 2);
  const startY = Math.floor((result.length - chart.height) / 2);

  for (let y = 0; y < chart.height; y++) {
    for (let x = 0; x < chart.width; x++) {
      const targetX = startX + x;
      const targetY = startY + y;
      if (targetX >= 0 && targetX < result[0].length && targetY >= 0 && targetY < result.length) {
        result[targetY][targetX] = chart.cells[y][x];
      }
    }
  }
}

function placeTwoEnds(chart: KnittingChart, result: string[][], config: TilingConfig) {
  const topY = Math.floor(chart.height / 2);
  const bottomY = result.length - Math.floor(chart.height / 2) - chart.height;

  const startX = Math.floor((result[0].length - chart.width) / 2);
  
  for (let y = 0; y < chart.height; y++) {
    for (let x = 0; x < chart.width; x++) {
      const color = chart.cells[y][x];
      
      const topTargetX = startX + x;
      if (topTargetX >= 0 && topTargetX < result[0].length) {
        result[topY + y][topTargetX] = color;
      }
      
      const bottomTargetX = startX + x;
      if (bottomTargetX >= 0 && bottomTargetX < result[0].length && bottomY + y >= 0 && bottomY + y < result.length) {
        result[bottomY + y][bottomTargetX] = color;
      }
    }
  }
}

function placeScattered(chart: KnittingChart, result: string[][], config: TilingConfig) {
  const tileWidth = Math.ceil(chart.width / config.repeatX);
  const tileHeight = Math.ceil(chart.height / config.repeatY);

  for (let y = 0; y < result.length; y++) {
    for (let x = 0; x < result[0].length; x++) {
      let tileX = Math.floor(x / tileWidth);
      let tileY = Math.floor(y / tileHeight);
      
      if (tileY % 2 === 1 && config.offsetY > 0) {
        tileX = Math.floor((x - tileWidth / 2) / tileWidth);
        if (tileX < 0) tileX = 0;
      }
      
      const localX = x % tileWidth;
      const localY = y % tileHeight;
      
      const chartX = Math.floor((localX / tileWidth) * chart.width);
      const chartY = Math.floor((localY / tileHeight) * chart.height);
      
      if (chartX >= 0 && chartX < chart.width && chartY >= 0 && chartY < chart.height) {
        result[y][x] = chart.cells[chartY][chartX];
      }
    }
  }
}

function placeBorder(chart: KnittingChart, result: string[][], config: TilingConfig) {
  const bw = config.borderWidth;
  
  for (let y = 0; y < bw; y++) {
    for (let x = 0; x < result[0].length; x++) {
      const chartX = Math.floor((x / result[0].length) * chart.width);
      const chartY = y < chart.height / 2 ? chart.height - 1 - y : y - Math.floor(chart.height / 2);
      
      if (chartX >= 0 && chartX < chart.width && chartY >= 0 && chartY < chart.height) {
        result[y][x] = chart.cells[chartY][chartX];
      }
    }
  }
  
  for (let y = result.length - bw; y < result.length; y++) {
    for (let x = 0; x < result[0].length; x++) {
      const chartX = Math.floor((x / result[0].length) * chart.width);
      const chartY = y < result.length - chart.height / 2 
        ? chart.height - 1 - (result.length - y)
        : (result.length - y) % chart.height;
      
      if (chartX >= 0 && chartX < chart.width && chartY >= 0 && chartY < chart.height) {
        result[y][x] = chart.cells[chartY][chartX];
      }
    }
  }
  
  for (let y = 0; y < result.length; y++) {
    for (let x = 0; x < bw; x++) {
      const chartX = x < chart.width / 2 ? chart.width - 1 - x : x - Math.floor(chart.width / 2);
      const chartY = Math.floor((y / result.length) * chart.height);
      
      if (chartX >= 0 && chartX < chart.width && chartY >= 0 && chartY < chart.height) {
        result[y][x] = chart.cells[chartY][chartX];
      }
    }
  }
  
  for (let y = 0; y < result.length; y++) {
    for (let x = result[0].length - bw; x < result[0].length; x++) {
      const chartX = x < result[0].length - chart.width / 2 
        ? chart.width - 1 - (result[0].length - x)
        : (x - (result[0].length - chart.width / 2)) % chart.width;
      const chartY = Math.floor((y / result.length) * chart.height);
      
      if (chartX >= 0 && chartX < chart.width && chartY >= 0 && chartY < chart.height) {
        result[y][x] = chart.cells[chartY][chartX];
      }
    }
  }
}

export function exportPlacementAsSVG(
  chart: KnittingChart,
  targetWidth: number,
  targetHeight: number,
  config: TilingConfig,
  cellSize: number = 4
): string {
  const placedCells = renderPlacedMotif(chart, targetWidth, targetHeight, config);
  
  const width = targetWidth * cellSize;
  const height = targetHeight * cellSize;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`;
  svg += `<rect width="${width}" height="${height}" fill="${config.backgroundColor}"/>`;
  
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const color = placedCells[y][x];
      if (color !== config.backgroundColor) {
        svg += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="${color}"/>`;
      }
    }
  }
  
  svg += '</svg>';
  return svg;
}

export function getPlacementDescription(
  chart: KnittingChart,
  targetWidth: number,
  targetHeight: number,
  config: TilingConfig
): string {
  const motifWidth = chart.width;
  const motifHeight = chart.height;
  
  switch (config.mode) {
    case "centered":
      return `Center a ${motifWidth}×${motifHeight} motif in the middle of a ${targetWidth}×${targetHeight} piece.`;
    case "two-ends":
      return `Place ${motifWidth}×${motifHeight} motifs at both ends of a ${targetWidth}×${targetHeight} piece, leaving the center as background.`;
    case "scattered":
      return `Tile a ${motifWidth}×${motifHeight} motif across a ${targetWidth}×${targetHeight} piece in a ${config.repeatX}×${config.repeatY} pattern.`;
    case "border":
      return `Create a ${config.borderWidth}-stitch border using a ${motifWidth}×${motifHeight} motif on a ${targetWidth}×${targetHeight} piece.`;
    default:
      return `Custom placement configuration for a ${targetWidth}×${targetHeight} piece.`;
  }
}
