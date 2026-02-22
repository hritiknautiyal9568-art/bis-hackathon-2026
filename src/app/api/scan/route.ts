import { NextRequest, NextResponse } from "next/server";
import { liveScanAnalysis } from "@/lib/gemini";
import { getDemoData } from "@/lib/demo-data";

export async function POST(request: NextRequest) {
  let mode = "hallmark";
  try {
    const body = await request.json();
    const { imageBase64, imageMimeType, scanMode } = body;

    if (!imageBase64 || !imageMimeType) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    const validModes = ["hallmark", "product", "label", "barcode"];
    mode = validModes.includes(scanMode) ? scanMode : "hallmark";

    const resultText = await liveScanAnalysis(imageBase64, imageMimeType, mode);

    // Try to parse as JSON
    let result;
    try {
      const cleaned = resultText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      result = { rawAnalysis: resultText };
    }

    return NextResponse.json({ result, scanMode: mode });
  } catch (error: any) {
    console.error("Scan API error:", error);
    // Fallback to demo data on rate limit
    if (error.message?.includes("RATE_LIMITED")) {
      const result = getDemoData("scan", mode);
      return NextResponse.json({ result, scanMode: mode, isDemo: true, demoMessage: "AI quota exceeded — showing sample analysis" });
    }
    return NextResponse.json(
      { error: error.message || "Failed to analyze image" },
      { status: 500 }
    );
  }
}
