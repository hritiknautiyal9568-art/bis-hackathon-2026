import { NextRequest, NextResponse } from "next/server";
import { simulateApproval } from "@/lib/gemini";
import { getDemoData } from "@/lib/demo-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, complianceData } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Please provide product description" },
        { status: 400 }
      );
    }

    const rawResponse = await simulateApproval(text, complianceData);

    let cleanResponse = rawResponse.trim();
    if (cleanResponse.startsWith("```json")) {
      cleanResponse = cleanResponse.slice(7);
    } else if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse.slice(3);
    }
    if (cleanResponse.endsWith("```")) {
      cleanResponse = cleanResponse.slice(0, -3);
    }
    cleanResponse = cleanResponse.trim();

    const result = JSON.parse(cleanResponse);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Simulation error:", error);
    if (error.message?.includes("RATE_LIMITED")) {
      return NextResponse.json({ success: true, data: getDemoData("simulate"), isDemo: true, demoMessage: "AI quota exceeded — showing sample simulation" });
    }
    return NextResponse.json(
      { error: error.message || "Failed to run simulation. Please try again." },
      { status: 500 }
    );
  }
}
