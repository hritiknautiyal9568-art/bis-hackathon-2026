import { NextRequest, NextResponse } from "next/server";
import { describeProduct } from "@/lib/gemini";
import { getDemoData } from "@/lib/demo-data";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, imageMimeType } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const rawText = await describeProduct(imageBase64, imageMimeType || "image/jpeg");

    // Parse JSON from response
    let result;
    try {
      const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      result = { rawAnalysis: rawText };
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Describe API error:", error);
    if (error.message?.includes("RATE_LIMITED")) {
      return NextResponse.json({ result: getDemoData("describe"), isDemo: true, demoMessage: "AI quota exceeded — showing sample description" });
    }
    return NextResponse.json(
      { error: error.message || "Product description failed" },
      { status: 500 }
    );
  }
}
