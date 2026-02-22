import { NextRequest, NextResponse } from "next/server";
import { verifyISIMark } from "@/lib/gemini";
import { getDemoData } from "@/lib/demo-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, imageMimeType, additionalInfo } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Please upload an image of the ISI mark or product label" },
        { status: 400 }
      );
    }

    const rawResponse = await verifyISIMark(imageBase64, imageMimeType, additionalInfo);

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
    console.error("Verification error:", error);
    if (error.message?.includes("RATE_LIMITED")) {
      return NextResponse.json({ success: true, data: getDemoData("verify"), isDemo: true, demoMessage: "AI quota exceeded — showing sample verification" });
    }
    return NextResponse.json(
      { error: error.message || "Failed to verify mark. Please try again." },
      { status: 500 }
    );
  }
}
