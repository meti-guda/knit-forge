export type GarmentType = "scarf" | "sweater-front" | "cardigan-back";

export type PlacementMode = "centered" | "two-ends" | "scattered" | "border";

export type GarmentSpec = {
  type: GarmentType;
  name: string;
  widthStitches: number;
  heightRows: number;
  shape: GarmentShape;
};

export type GarmentShape = {
  viewBox: string;
  path: string;
  neckline?: string;
};

export const GARMENT_SHAPES: Record<GarmentType, GarmentShape> = {
  "scarf": {
    viewBox: "0 0 100 300",
    path: "M 10 0 L 90 0 L 90 300 L 10 300 Z",
  },
  "sweater-front": {
    viewBox: "0 0 200 250",
    path: "M 20 0 L 20 30 Q 20 50 40 60 L 40 250 L 160 250 L 160 60 Q 180 50 180 30 L 180 0 Z",
    neckline: "M 70 0 Q 100 40 130 0",
  },
  "cardigan-back": {
    viewBox: "0 0 200 250",
    path: "M 20 0 L 20 30 Q 20 50 40 60 L 40 250 L 160 250 L 160 60 Q 180 50 180 30 L 180 0 Z",
  },
};

export const GARMENTS: GarmentSpec[] = [
  {
    type: "scarf",
    name: "Scarf",
    widthStitches: 50,
    heightRows: 200,
    shape: GARMENT_SHAPES.scarf,
  },
  {
    type: "sweater-front",
    name: "Sweater Front",
    widthStitches: 100,
    heightRows: 150,
    shape: GARMENT_SHAPES["sweater-front"],
  },
  {
    type: "cardigan-back",
    name: "Cardigan Back",
    widthStitches: 100,
    heightRows: 150,
    shape: GARMENT_SHAPES["cardigan-back"],
  },
];

export function getGarmentSpec(type: GarmentType): GarmentSpec | undefined {
  return GARMENTS.find((g) => g.type === type);
}

export function calculateScarfFromDimensions(
  widthCm: number,
  lengthCm: number,
  gauge: { stsPer10: number; rowsPer10: number }
): { stitches: number; rows: number } {
  return {
    stitches: Math.round((gauge.stsPer10 / 10) * widthCm),
    rows: Math.round((gauge.rowsPer10 / 10) * lengthCm),
  };
}

export function calculateSweaterFromSize(
  size: "S" | "M" | "L" | "XL",
  gauge: { stsPer10: number; rowsPer10: number }
): { stitches: number; rows: number } {
  const sizes = {
    S: { width: 45, length: 60 },
    M: { width: 50, length: 65 },
    L: { width: 55, length: 70 },
    XL: { width: 60, length: 75 },
  };
  const { width, length } = sizes[size];
  return {
    stitches: Math.round((gauge.stsPer10 / 10) * width),
    rows: Math.round((gauge.rowsPer10 / 10) * length),
  };
}
