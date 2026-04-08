export type Gauge = {
  stitches: number;
  rows: number;
  widthCm: number;
  heightCm: number;
};

export function calculateGauge(gauge: Gauge): {
  stsPer10: number;
  rowsPer10: number;
  stsPerCm: number;
  rowsPerCm: number;
} {
  const stsPerCm = gauge.stitches / gauge.widthCm;
  const rowsPerCm = gauge.rows / gauge.heightCm;
  return {
    stsPer10: Math.round(stsPerCm * 10 * 10) / 10,
    rowsPer10: Math.round(rowsPerCm * 10 * 10) / 10,
    stsPerCm: Math.round(stsPerCm * 100) / 100,
    rowsPerCm: Math.round(rowsPerCm * 100) / 100,
  };
}

export function calculateStitchCount(
  stsPer10: number,
  targetWidthCm: number
): number {
  const stsPerCm = stsPer10 / 10;
  return Math.round(stsPerCm * targetWidthCm);
}

export function calculateRowCount(
  rowsPer10: number,
  targetHeightCm: number
): number {
  const rowsPerCm = rowsPer10 / 10;
  return Math.round(rowsPerCm * targetHeightCm);
}

export function resizePattern(
  originalStitches: number,
  originalRows: number,
  originalWidthCm: number,
  originalHeightCm: number,
  targetWidthCm: number,
  targetHeightCm: number,
  gauge: { stsPer10: number; rowsPer10: number }
): { stitches: number; rows: number } {
  const newStitches = calculateStitchCount(
    gauge.stsPer10,
    targetWidthCm
  );
  const newRows = calculateRowCount(gauge.rowsPer10, targetHeightCm);
  return {
    stitches: newStitches,
    rows: newRows,
  };
}

export function calculateScarfDimensions(
  widthCm: number,
  lengthCm: number,
  gauge: { stsPer10: number; rowsPer10: number }
): { stitches: number; rows: number } {
  return {
    stitches: calculateStitchCount(gauge.stsPer10, widthCm),
    rows: calculateRowCount(gauge.rowsPer10, lengthCm),
  };
}

export function calculateBeanieDimensions(
  headCircumferenceCm: number,
  lengthCm: number,
  gauge: { stsPer10: number; rowsPer10: number }
): { stitches: number; rows: number } {
  const negativeEase = 0.9;
  const adjustedCirc = headCircumferenceCm * negativeEase;
  return {
    stitches: calculateStitchCount(gauge.stsPer10, adjustedCirc),
    rows: calculateRowCount(gauge.rowsPer10, lengthCm),
  };
}

export function calculateMittenDimensions(
  palmCircumferenceCm: number,
  lengthCm: number,
  thumbLengthCm: number,
  gauge: { stsPer10: number; rowsPer10: number }
): { stitches: number; rows: number; thumbStitches: number; thumbRows: number } {
  return {
    stitches: calculateStitchCount(gauge.stsPer10, palmCircumferenceCm),
    rows: calculateRowCount(gauge.rowsPer10, lengthCm),
    thumbStitches: Math.round(calculateStitchCount(gauge.stsPer10, palmCircumferenceCm) * 0.4),
    thumbRows: calculateRowCount(gauge.rowsPer10, thumbLengthCm),
  };
}

export function stitchesToCastOn(stitches: number, castOnType: string): string {
  switch (castOnType) {
    case "long-tail":
      return `Long-tail: approx ${Math.round(stitches * 1.5)} tail`;
    case "cable":
      return "Cable CO";
    case "provisional":
      return "Provisional CO";
    default:
      return "Standard CO";
  }
}

export function rowsToLength(rows: number, gauge: { rowsPer10: number }): string {
  const lengthCm = (rows / gauge.rowsPer10) * 10;
  if (lengthCm >= 100) {
    return `${(lengthCm / 100).toFixed(1)}m`;
  }
  return `${Math.round(lengthCm)}cm`;
}
