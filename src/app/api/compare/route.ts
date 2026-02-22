import { NextRequest, NextResponse } from "next/server";
import { compareProducts } from "@/lib/gemini";
import { getDemoData } from "@/lib/demo-data";

export async function POST(req: NextRequest) {
  try {
    const { image1Base64, image1MimeType, image2Base64, image2MimeType } = await req.json();

    if (!image1Base64 || !image2Base64) {
      return NextResponse.json(
        { error: "Two product images are required for comparison" },
        { status: 400 }
      );
    }

    const rawText = await compareProducts(
      image1Base64,
      image1MimeType || "image/jpeg",
      image2Base64,
      image2MimeType || "image/jpeg"
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
    console.error("Compare API error:", error);
    if (error.message?.includes("RATE_LIMITED")) {
      return NextResponse.json({ result: getDemoData("compare"), isDemo: true, demoMessage: "AI quota exceeded — showing sample comparison" });
    }
    return NextResponse.json(
      { error: error.message || "Product comparison failed" },
      { status: 500 }
    );
  }
}
