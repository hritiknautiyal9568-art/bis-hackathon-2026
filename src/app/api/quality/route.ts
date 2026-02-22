import { NextRequest, NextResponse } from "next/server";
import { analyzeProductQuality } from "@/lib/gemini";
import { getDemoData } from "@/lib/demo-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, imageMimeType, productType } = body;

    if (!imageBase64 || !imageMimeType) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    const resultText = await analyzeProductQuality(imageBase64, imageMimeType, productType);

    let result;
    try {
      const cleaned = resultText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      result = { rawAnalysis: resultText };
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Quality API error:", error);
    if (error.message?.includes("RATE_LIMITED")) {
      return NextResponse.json({ result: getDemoData("quality"), isDemo: true, demoMessage: "AI quota exceeded — showing sample quality analysis" });
    }
    return NextResponse.json(
      { error: error.message || "Failed to analyze quality" },
      { status: 500 }
    );
  }
}
