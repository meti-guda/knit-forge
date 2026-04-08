export type ChartCell = {
  x: number;
  y: number;
  color: string;
  symbol?: string;
};

export type KnittingChart = {
  id: string;
  name: string;
  width: number;
  height: number;
  cells: string[][];
  palette: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ChartTool = 
  | 'select'
  | 'paint'
  | 'fill'
  | 'erase'
  | 'pan';

export type ChartSettings = {
  gridSize: number;
  showGrid: boolean;
  showSymbols: boolean;
  snapToGrid: boolean;
  backgroundColor: string;
};

export const DEFAULT_PALETTE = [
  '#1A1916', // Black
  '#B85C38', // Sienna
  '#D4A853', // Gold
  '#5C6B4A', // Moss
  '#7B5D7A', // Plum
  '#F5EDE0', // Cream
  '#8B3A2F', // Rust
  '#2C2A28', // Charcoal
];

export const DEFAULT_CHART_SETTINGS: ChartSettings = {
  gridSize: 20,
  showGrid: true,
  showSymbols: false,
  snapToGrid: true,
  backgroundColor: '#F5EDE0',
};

export function createEmptyChart(width: number, height: number, palette: string[]): KnittingChart {
  const cells: string[][] = [];
  for (let y = 0; y < height; y++) {
    const row: string[] = [];
    for (let x = 0; x < width; x++) {
      row.push(palette[0]);
    }
    cells.push(row);
  }

  return {
    id: crypto.randomUUID(),
    name: 'Untitled Chart',
    width,
    height,
    cells,
    palette,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function cloneChart(chart: KnittingChart): KnittingChart {
  return {
    ...chart,
    id: crypto.randomUUID(),
    cells: chart.cells.map(row => [...row]),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function chartToJSON(chart: KnittingChart): string {
  return JSON.stringify(chart, null, 2);
}

export function chartFromJSON(json: string): KnittingChart {
  return JSON.parse(json);
}

export function exportChartAsSVG(
  chart: KnittingChart,
  cellSize: number = 20,
  options: {
    showGrid?: boolean;
    showRowNumbers?: boolean;
    showColNumbers?: boolean;
  } = {}
): string {
  const { showGrid = true, showRowNumbers = true, showColNumbers = true } = options;
  
  const padding = 30;
  const rowNumWidth = showRowNumbers ? 30 : 0;
  const colNumHeight = showColNumbers ? 20 : 0;
  
  const width = chart.width * cellSize + padding * 2 + rowNumWidth;
  const height = chart.height * cellSize + padding * 2 + colNumHeight;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="knitting-chart">`;
  
  // Background
  svg += `<rect width="${width}" height="${height}" fill="#F5EDE0"/>`;
  
  // Grid and cells
  for (let y = 0; y < chart.height; y++) {
    const rowY = padding + colNumHeight + y * cellSize;
    
    // Row number
    if (showRowNumbers) {
      svg += `<text x="${padding}" y="${rowY + cellSize / 2 + 4}" 
        font-family="monospace" font-size="10" fill="#6B6560" text-anchor="middle">${y + 1}</text>`;
    }
    
    for (let x = 0; x < chart.width; x++) {
      const colX = padding + rowNumWidth + x * cellSize;
      const color = chart.cells[y][x];
      
      // Cell
      svg += `<rect x="${colX}" y="${rowY}" width="${cellSize}" height="${cellSize}" fill="${color}" stroke="#D9CFC0" stroke-width="0.5"/>`;
      
      // Column number (first row only)
      if (showColNumbers && y === 0) {
        svg += `<text x="${colX + cellSize / 2}" y="${padding + 12}" 
          font-family="monospace" font-size="10" fill="#6B6560" text-anchor="middle">${x + 1}</text>`;
      }
    }
  }
  
  svg += '</svg>';
  return svg;
}

export function exportChartAsPNG(
  chart: KnittingChart,
  cellSize: number = 20
): Promise<Blob> {
  return new Promise((resolve) => {
    const svg = exportChartAsSVG(chart, cellSize);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    const padding = 30;
    const rowNumWidth = 30;
    const colNumHeight = 20;
    
    canvas.width = chart.width * cellSize + padding * 2 + rowNumWidth;
    canvas.height = chart.height * cellSize + padding * 2 + colNumHeight;
    
    img.onload = () => {
      ctx.fillStyle = '#F5EDE0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  });
}
