import { NextRequest, NextResponse } from "next/server";
import { analyzeSafetyRisk } from "@/lib/gemini";
import { getDemoData } from "@/lib/demo-data";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, imageMimeType, productDescription } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "Product image is required" }, { status: 400 });
    }

    const rawText = await analyzeSafetyRisk(
      imageBase64,
      imageMimeType || "image/jpeg",
      productDescription
    );

    let result;
    try {
      const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      result = { rawAnalysis: rawText };
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Risk API error:", error);
    if (error.message?.includes("RATE_LIMITED")) {
      return NextResponse.json({ result: getDemoData("risk"), isDemo: true, demoMessage: "AI quota exceeded — showing sample safety analysis" });
    }
    return NextResponse.json(
      { error: error.message || "Safety risk analysis failed" },
      { status: 500 }
    );
  }
}
