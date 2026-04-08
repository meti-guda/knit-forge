import { KnittingChart, ChartCell, DEFAULT_PALETTE } from './types';

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function imageToCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  return canvas;
}

export function getImageData(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext('2d')!;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

interface ColorBox {
  r: number;
  g: number;
  b: number;
  count: number;
  colors: Array<{ r: number; g: number; b: number }>;
}

function getColorBox(data: Uint8ClampedArray, colors: Array<{ r: number; g: number; b: number }>): ColorBox {
  let rSum = 0, gSum = 0, bSum = 0;
  
  for (const c of colors) {
    rSum += c.r;
    gSum += c.g;
    bSum += c.b;
  }
  
  return {
    r: Math.round(rSum / colors.length),
    g: Math.round(gSum / colors.length),
    b: Math.round(bSum / colors.length),
    count: colors.length,
    colors,
  };
}

function splitBox(box: ColorBox): [ColorBox, ColorBox] {
  const { colors } = box;
  const rangeR = Math.max(...colors.map(c => c.r)) - Math.min(...colors.map(c => c.r));
  const rangeG = Math.max(...colors.map(c => c.g)) - Math.min(...colors.map(c => c.g));
  const rangeB = Math.max(...colors.map(c => c.b)) - Math.min(...colors.map(c => c.b));
  
  let sortKey: 'r' | 'g' | 'b';
  if (rangeR >= rangeG && rangeR >= rangeB) sortKey = 'r';
  else if (rangeG >= rangeR && rangeG >= rangeB) sortKey = 'g';
  else sortKey = 'b';
  
  colors.sort((a, b) => a[sortKey] - b[sortKey]);
  
  const mid = Math.floor(colors.length / 2);
  const leftColors = colors.slice(0, mid);
  const rightColors = colors.slice(mid);
  
  return [getColorBox([], leftColors), getColorBox([], rightColors)];
}

export function medianCutQuantize(
  imageData: ImageData,
  numColors: number = 4
): string[] {
  const { data } = imageData;
  const colorList: Array<{ r: number; g: number; b: number }> = [];
  
  for (let i = 0; i < data.length; i += 4) {
    colorList.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
  }
  
  let boxes: ColorBox[] = [getColorBox(data, colorList)];
  
  while (boxes.length < numColors) {
    let maxVolume = 0;
    let maxIndex = 0;
    
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      const rangeR = Math.max(...box.colors.map(c => c.r)) - Math.min(...box.colors.map(c => c.r));
      const rangeG = Math.max(...box.colors.map(c => c.g)) - Math.min(...box.colors.map(c => c.g));
      const rangeB = Math.max(...box.colors.map(c => c.b)) - Math.min(...box.colors.map(c => c.b));
      const volume = (rangeR + 1) * (rangeG + 1) * (rangeB + 1) * box.count;
      
      if (volume > maxVolume) {
        maxVolume = volume;
        maxIndex = i;
      }
    }
    
    const [box1, box2] = splitBox(boxes[maxIndex]);
    boxes.splice(maxIndex, 1, box1, box2);
  }
  
  return boxes.map(box => {
    const hex = '#' + 
      box.r.toString(16).padStart(2, '0') +
      box.g.toString(16).padStart(2, '0') +
      box.b.toString(16).padStart(2, '0');
    return hex.toUpperCase();
  });
}

export function resizeImage(
  imageData: ImageData,
  targetWidth: number,
  targetHeight: number
): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(imageData, 0, 0);
  
  const resizedCanvas = document.createElement('canvas');
  resizedCanvas.width = targetWidth;
  resizedCanvas.height = targetHeight;
  const resizedCtx = resizedCanvas.getContext('2d')!;
  
  resizedCtx.imageSmoothingEnabled = true;
  resizedCtx.imageSmoothingQuality = 'high';
  resizedCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
  
  return resizedCtx.getImageData(0, 0, targetWidth, targetHeight);
}

export function mapImageToPalette(
  imageData: ImageData,
  palette: string[]
): string[][] {
  const { data, width, height } = imageData;
  const result: string[][] = [];
  
  const paletteRGB = palette.map(hex => ({
    hex,
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }));
  
  function colorDistance(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }): number {
    return Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
    );
  }
  
  function findClosestPaletteColor(r: number, g: number, b: number): string {
    let minDist = Infinity;
    let closest = palette[0];
    
    for (const p of paletteRGB) {
      const dist = colorDistance({ r, g, b }, p);
      if (dist < minDist) {
        minDist = dist;
        closest = p.hex;
      }
    }
    
    return closest;
  }
  
  for (let y = 0; y < height; y++) {
    const row: string[] = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      row.push(findClosestPaletteColor(r, g, b));
    }
    result.push(row);
  }
  
  return result;
}

export function imageToChart(
  imageData: ImageData,
  palette: string[],
  width: number,
  height: number,
  gaugeRatio: number = 1.0
): KnittingChart {
  const adjustedHeight = Math.round(height * gaugeRatio);
  
  const resized = resizeImage(imageData, width, adjustedHeight);
  const cells = mapImageToPalette(resized, palette);
  
  return {
    id: crypto.randomUUID(),
    name: 'Converted Chart',
    width,
    height: adjustedHeight,
    cells,
    palette,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function applyGaugeRatio(
  chart: KnittingChart,
  stitchRatio: number
): KnittingChart {
  const newHeight = Math.round(chart.height * stitchRatio);
  const newCells: string[][] = [];
  
  for (let y = 0; y < newHeight; y++) {
    const sourceY = Math.min(Math.floor((y / newHeight) * chart.height), chart.height - 1);
    newCells.push([...chart.cells[sourceY]]);
  }
  
  return {
    ...chart,
    height: newHeight,
    cells: newCells,
    updatedAt: new Date(),
  };
}
