import { NextRequest, NextResponse } from "next/server";
import { generateComplianceChecklist } from "@/lib/gemini";
import { getDemoData } from "@/lib/demo-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productType, targetStandards } = body;

    if (!productType) {
      return NextResponse.json(
        { error: "Product type is required" },
        { status: 400 }
      );
    }

    const resultText = await generateComplianceChecklist(
      productType,
      targetStandards || []
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
    console.error("Checklist API error:", error);
    if (error.message?.includes("RATE_LIMITED")) {
      return NextResponse.json({ result: getDemoData("checklist"), isDemo: true, demoMessage: "AI quota exceeded — showing sample checklist" });
    }
    return NextResponse.json(
      { error: error.message || "Failed to generate checklist" },
      { status: 500 }
    );
  }
}
