export type YarnWeight = {
  id: string;
  name: string;
  category: string;
  weight: number;
  needleSize: {
    mm: string;
    us: string;
  };
  gauge: {
    sts: string;
    rows: string;
  };
  meteragePerGram: number;
};

export const yarnWeights: YarnWeight[] = [
  {
    id: "lace",
    name: "Lace",
    category: "0",
    weight: 0,
    needleSize: { mm: "2-3", us: "0-2" },
    gauge: { sts: "32-40", rows: "40-50" },
    meteragePerGram: 800,
  },
  {
    id: "fingering",
    name: "Fingering",
    category: "1",
    weight: 1,
    needleSize: { mm: "2.25-3.5", us: "1-3" },
    gauge: { sts: "28-32", rows: "36-40" },
    meteragePerGram: 400,
  },
  {
    id: "sport",
    name: "Sport",
    category: "2",
    weight: 2,
    needleSize: { mm: "3.25-3.75", us: "3-5" },
    gauge: { sts: "24-28", rows: "32-36" },
    meteragePerGram: 300,
  },
  {
    id: "dk",
    name: "DK (Double Knitting)",
    category: "3",
    weight: 3,
    needleSize: { mm: "3.75-4.5", us: "5-7" },
    gauge: { sts: "21-24", rows: "28-32" },
    meteragePerGram: 240,
  },
  {
    id: "worsted",
    name: "Worsted",
    category: "4",
    weight: 4,
    needleSize: { mm: "4.5-5.5", us: "7-9" },
    gauge: { sts: "18-22", rows: "24-28" },
    meteragePerGram: 200,
  },
  {
    id: "aran",
    name: "Aran",
    category: "4",
    weight: 4,
    needleSize: { mm: "5-5.5", us: "8-9" },
    gauge: { sts: "16-20", rows: "22-26" },
    meteragePerGram: 180,
  },
  {
    id: "bulky",
    name: "Bulky",
    category: "5",
    weight: 5,
    needleSize: { mm: "5.5-8", us: "9-11" },
    gauge: { sts: "12-16", rows: "16-20" },
    meteragePerGram: 130,
  },
  {
    id: "super-bulky",
    name: "Super Bulky",
    category: "6",
    weight: 6,
    needleSize: { mm: "8-12", us: "11-15" },
    gauge: { sts: "6-12", rows: "8-12" },
    meteragePerGram: 90,
  },
];

export const popularYarns: {
  id: string;
  name: string;
  brand: string;
  weightId: string;
  fiber: string;
  meteragePerBall: number;
  ballWeight: number;
}[] = [
  { id: "malabrigo-rios", name: "Rios", brand: "Malabrigo", weightId: "worsted", fiber: "100% Superwash Merino", meteragePerBall: 192, ballWeight: 100 },
  { id: "malabrigo-sock", name: "Sock", brand: "Malabrigo", weightId: "fingering", fiber: "100% Superwash Merino", meteragePerBall: 402, ballWeight: 100 },
  { id: "cascade-220", name: "220", brand: "Cascade", weightId: "worsted", fiber: "100% Peruvian Wool", meteragePerBall: 200, ballWeight: 100 },
  { id: "cascade-128", name: "128 Superwash", brand: "Cascade", weightId: "worsted", fiber: "100% Superwash Merino", meteragePerBall: 200, ballWeight: 100 },
  { id: "isager-tokyo", name: "Tokyo", brand: "Isager", weightId: "fingering", fiber: "100% Silk", meteragePerBall: 350, ballWeight: 50 },
  { id: "isager-spd", name: "Spinning Wool", brand: "Isager", weightId: "dk", fiber: "100% Wool", meteragePerBall: 300, ballWeight: 100 },
  { id: "rowan-kidsilk", name: "Kidsilk Haze", brand: "Rowan", weightId: "lace", fiber: "70% Mohair, 30% Silk", meteragePerBall: 230, ballWeight: 25 },
  { id: "rowan-felted-tweed", name: "Felted Tweed", brand: "Rowan", weightId: "dk", fiber: "50% Merino, 50% Lambswool", meteragePerBall: 175, ballWeight: 50 },
  { id: "lang-ajoura", name: "Ajour", brand: "Lang", weightId: "dk", fiber: "100% Cotton", meteragePerBall: 230, ballWeight: 50 },
  { id: "sandnes-garn-smand", name: "Smart Mandarin", brand: "Sandnes Garn", weightId: "dk", fiber: "100% Cotton", meteragePerBall: 150, ballWeight: 50 },
  { id: "drops-baby-merino", name: "Baby Merino", brand: "Drops", weightId: "dk", fiber: "100% Merino Wool", meteragePerBall: 195, ballWeight: 50 },
  { id: "drops-fabel", name: "Fabel", brand: "Drops", weightId: "fingering", fiber: "75% Wool, 25% Polyamide", meteragePerBall: 205, ballWeight: 50 },
  { id: "habu-n-65", name: "N-65 Cotton/Kimura", brand: "Habu", weightId: "lace", fiber: "Cotton Blend", meteragePerBall: 1200, ballWeight: 40 },
  { id: "habu-a-20", name: "A-20 Linen", brand: "Habu", weightId: "lace", fiber: "100% Linen", meteragePerBall: 600, ballWeight: 40 },
  { id: "garnstudio-safran", name: "Safran", brand: "Garnstudio/Drops", weightId: "fingering", fiber: "100% Cotton", meteragePerBall: 280, ballWeight: 50 },
  { id: "manos-del-uruguay-frag", name: "Fragile", brand: "Manos del Uruguay", weightId: "worsted", fiber: "100% Wool", meteragePerBall: 135, ballWeight: 50 },
  { id: "tosh-pilling", name: "Pilling", brand: "Tosh", weightId: "worsted", fiber: "100% Superwash Merino", meteragePerBall: 192, ballWeight: 100 },
  { id: "madelinetosh-tosh-merino", name: "Tosh Merino Light", brand: "Madelinetosh", weightId: "dk", fiber: "100% Superwash Merino", meteragePerBall: 405, ballWeight: 100 },
  { id: "knitpicks-woll", name: "Wool of the Andes", brand: "Knit Picks", weightId: "worsted", fiber: "100% Peruvian Wool", meteragePerBall: 183, ballWeight: 100 },
  { id: "knitpicks-comfort", name: "Comfort", brand: "Knit Picks", weightId: "dk", fiber: "50% Alpaca, 50% Wool", meteragePerBall: 249, ballWeight: 100 },
];

export function getYarnWeightById(id: string): YarnWeight | undefined {
  return yarnWeights.find((y) => y.id === id);
}

export function getYarnById(id: string) {
  return popularYarns.find((y) => y.id === id);
}

export function getYarnsByWeight(weightId: string) {
  return popularYarns.filter((y) => y.weightId === weightId);
}

export function calculateMeterage(
  yarnId: string,
  grams: number
): number {
  const yarn = getYarnById(yarnId);
  if (!yarn) return 0;
  return (yarn.meteragePerBall / yarn.ballWeight) * grams;
}

export function calculateBallsNeeded(
  yarnId: string,
  meterageRequired: number
): number {
  const yarn = getYarnById(yarnId);
  if (!yarn) return 0;
  return Math.ceil(meterageRequired / yarn.meteragePerBall);
}
