export type PatternStep = {
     id: number;
     section: string;
     instruction: string;
};

export type Pattern = {
     slug: string;         // used in the URL: /patterns/[slug]
     title: string;
     description: string;
     difficulty: "Beginner" | "Intermediate" | "Advanced";
     materials: string[];
     steps: PatternStep[];
};

export const patterns: Pattern[] = [
     {
          slug: "simple-garter-scarf",
          title: "Simple Garter Scarf",
          description: "A beginner-friendly garter stitch scarf. Great for practicing row tracking.",
          difficulty: "Beginner",
          materials: [
               "100g DK weight yarn",
               "4.5mm knitting needles",
               "Scissors + yarn needle",
          ],
          steps: [
               { id: 1, section: "Cast On", instruction: "Make a slip knot and cast on 40 stitches using the long-tail cast on method." },
               { id: 2, section: "Cast On", instruction: "Check your stitch count: you should have 40 stitches on your needle." },
               { id: 3, section: "Body", instruction: "Row 1 (RS): Knit all 40 stitches to end of row." },
               { id: 4, section: "Body", instruction: "Row 2 (WS): Knit all 40 stitches to end of row." },
               { id: 5, section: "Body", instruction: "Row 3: Knit all 40 stitches." },
               { id: 6, section: "Body", instruction: "Row 4: Knit all 40 stitches." },
               { id: 7, section: "Body", instruction: "Continue in garter stitch (knit every row) until piece measures 140 cm from cast on edge." },
               { id: 8, section: "Body", instruction: "Check length: lay flat and measure. Adjust by knitting more rows if needed." },
               { id: 9, section: "Finishing", instruction: "Cast off loosely: knit 2 sts, pass first stitch over second. Repeat to end." },
               { id: 10, section: "Finishing", instruction: "Cut yarn leaving a 15 cm tail. Pull tail through last stitch and tighten." },
               { id: 11, section: "Finishing", instruction: "Weave in ends using a yarn needle. Block if desired." },
          ],
     },
     {
          slug: "ribbed-beanie",
          title: "Ribbed Beanie",
          description: "A stretchy 2x2 ribbed hat worked flat and seamed. Good for learning ribbing.",
          difficulty: "Beginner",
          materials: [
               "100g Aran weight yarn",
               "5mm knitting needles",
               "Yarn needle for seaming",
          ],
          steps: [
               { id: 1, section: "Cast On", instruction: "Cast on 88 stitches loosely." },
               { id: 2, section: "Cast On", instruction: "Check count: 88 sts. Join to work flat (do not join in the round for this version)." },
               { id: 3, section: "Ribbing", instruction: "Row 1: *K2, P2; repeat from * to end of row." },
               { id: 4, section: "Ribbing", instruction: "Row 2: *K2, P2; repeat from * to end of row." },
               { id: 5, section: "Ribbing", instruction: "Repeat rows 1–2 until piece measures 22 cm from cast on edge." },
               { id: 6, section: "Crown", instruction: "Decrease row: *K2tog, P2tog; repeat from * to end. (44 sts remain)" },
               { id: 7, section: "Crown", instruction: "Next row: *K1, P1; repeat from * to end." },
               { id: 8, section: "Crown", instruction: "Final decrease: *K2tog; repeat from * to end. (22 sts remain)" },
               { id: 9, section: "Finishing", instruction: "Cut yarn leaving a 30 cm tail. Thread through remaining 22 sts and pull tight." },
               { id: 10, section: "Finishing", instruction: "Seam the side edge using mattress stitch. Weave in all ends." },
          ],
     },
];

export function getPatternBySlug(slug: string): Pattern | undefined {
     return patterns.find((p) => p.slug === slug);
}
