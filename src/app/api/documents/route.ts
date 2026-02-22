import { NextRequest, NextResponse } from "next/server";
import { analyzeSellerDocument } from "@/lib/gemini";
import { getDemoData } from "@/lib/demo-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentText, documentType } = body;

    if (!documentText) {
      return NextResponse.json(
        { error: "Document text is required" },
        { status: 400 }
      );
    }

    const resultText = await analyzeSellerDocument(
      documentText,
      documentType || "general"
    );

    let result;
    try {
      const cleaned = resultText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      result = { rawAnalysis: resultText };
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Documents API error:", error);
    if (error.message?.includes("RATE_LIMITED")) {
      return NextResponse.json({ result: getDemoData("documents"), isDemo: true, demoMessage: "AI quota exceeded — showing sample document analysis" });
    }
    return NextResponse.json(
      { error: error.message || "Failed to analyze document" },
      { status: 500 }
    );
  }
}
