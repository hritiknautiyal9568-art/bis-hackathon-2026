import { NextRequest, NextResponse } from "next/server";
import { analyzeProductCompliance } from "@/lib/gemini";
import { getDemoData } from "@/lib/demo-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, imageBase64, imageMimeType } = body;

    if (!text && !imageBase64) {
      return NextResponse.json(
        { error: "Please provide product description text or an image" },
        { status: 400 }
      );
    }

    const productDescription = text || "Analyze the uploaded product image for BIS compliance.";

    const rawResponse = await analyzeProductCompliance(
      productDescription,
      imageBase64,
      imageMimeType
    );

    // Parse AI response - strip markdown code blocks if present
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
      data: {
        ...result,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Analysis error:", error);
    if (error.message?.includes("RATE_LIMITED")) {
      return NextResponse.json({ success: true, data: { ...getDemoData("analyze"), timestamp: new Date().toISOString() }, isDemo: true, demoMessage: "AI quota exceeded — showing sample compliance analysis" });
    }
    return NextResponse.json(
      {
        error: error.message || "Failed to analyze product. Please try again.",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
