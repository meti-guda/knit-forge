export type PatternType = "motif" | "scarf" | "beanie" | "mittens" | "cowls";

export type PatternRequest = {
  type: PatternType;
  description: string;
  colors?: string[];
  difficulty?: "easy" | "medium" | "advanced";
};

export const SYSTEM_PROMPT = `You are an expert knitting pattern designer with deep knowledge of:
- All knitting techniques (cast on, knit, purl, increase, decrease, etc.)
- Pattern construction and shaping
- Yarn types and gauge calculations
- Colorwork techniques (stranded, intarsia, modular)
- Reading and writing knitting patterns

You help users design custom knitting patterns. Be clear, concise, and practical in your suggestions.`;

export function buildMotifPrompt(description: string, width?: number, height?: number): string {
  return `Design a knitting chart pattern based on this description: "${description}"

${width && height ? `Create a ${width}×${height} stitch grid.` : ""}

Provide a JSON response with this exact structure:
{
  "name": "Pattern Name",
  "description": "Brief description of the motif",
  "width": number,
  "height": number,
  "grid": array of ${width || "[width]"} rows, each row an array of color codes (e.g., "#B85C38" for sienna),
  "colors": array of hex color codes used,
  "notes": "Any special instructions"
}

Make the pattern visually interesting and knit-worthy. Focus on recognizable shapes or geometric designs.`;
}

export function buildScarfPrompt(
  description: string,
  gauge: { sts: number; rows: number },
  dimensions: { width: number; length: number }
): string {
  return `Design a scarf knitting pattern based on: "${description}"

Gauge: ${gauge.sts} stitches × ${gauge.rows} rows per 10cm
Target dimensions: ${dimensions.width}cm wide × ${dimensions.length}cm long

Calculate the stitch count and row count needed, then describe the complete pattern.

Provide a JSON response:
{
  "name": "Scarf Name",
  "castOn": number,
  "totalRows": number,
  "pattern": "Step-by-step pattern description",
  "stitches": ["list of techniques used"],
  "tips": "Helpful tips for this pattern"
}`;
}

export function buildBeaniePrompt(
  description: string,
  gauge: { sts: number; rows: number },
  headCircumference: number
): string {
  return `Design a beanie knitting pattern based on: "${description}"

Gauge: ${gauge.sts} stitches × ${gauge.rows} rows per 10cm
Head circumference: ${headCircumference}cm

Calculate stitches for the brim and crown decreases.

Provide a JSON response:
{
  "name": "Beanie Name",
  "brim": {
    "castOn": number,
    "height": number,
    "pattern": "brim stitch description"
  },
  "body": {
    "height": number,
    "pattern": "body stitch description"
  },
  "crown": {
    "decreases": "decrease pattern",
    "finalRows": number
  },
  "techniques": ["list of techniques"]
}`;
}

export function buildMittensPrompt(
  description: string,
  gauge: { sts: number; rows: number },
  palmCircumference: number
): string {
  return `Design a pair of mittens knitting pattern based on: "${description}"

Gauge: ${gauge.sts} stitches × ${gauge.rows} rows per 10cm
Palm circumference: ${palmCircumference}cm

Include cuff, hand, and thumb sections.

Provide a JSON response:
{
  "name": "Mittens Name",
  "cuff": {
    "castOn": number,
    "height": number,
    "pattern": "cuff description"
  },
  "hand": {
    "stitches": number,
    "length": number,
    "pattern": "hand description"
  },
  "thumb": {
    "stitches": number,
    "length": number
  },
  "techniques": ["techniques used"]
}`;
}

export function buildPlacementReasoningPrompt(
  garmentType: string,
  motifSize: { width: number; height: number },
  garmentSize: { width: number; height: number },
  placementMode: string
): string {
  return `Given a ${motifSize.width}×${motifSize.height} stitch motif and a ${garmentType} that is ${garmentSize.width} stitches wide × ${garmentSize.height} rows tall:

Placement mode: ${placementMode}

Calculate:
1. How many motif repeats fit
2. What to do with remaining space
3. Suggested border width (if applicable)
4. Row-by-row instruction summary

Provide a practical, actionable knitting guide.`;
}

export const EXAMPLE_PROMPTS = {
  motifs: [
    "Geometric heart in pink and white",
    "Simple cat face outline",
    "Star pattern with 5 points",
    "Chevron stripes",
    "Tree of life motif",
  ],
  scarves: [
    "Simple garter stitch scarf with fringe",
    "Seed stitch infinity scarf",
    "Colorwork diagonal stripe scarf",
  ],
  beanies: [
    "Ribbed beanie with pom pom",
    "Cable knit beanie",
    "Slouchy beanie with textured pattern",
  ],
};
