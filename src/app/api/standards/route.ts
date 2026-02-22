import { NextRequest, NextResponse } from "next/server";
import { explainStandardSimply } from "@/lib/gemini";
import { searchStandards, getStandardsByCategory, BIS_STANDARDS } from "@/data/bis-standards";
import { getDemoData } from "@/lib/demo-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const category = searchParams.get("category");

  if (query) {
    const results = searchStandards(query);
    return NextResponse.json({ success: true, data: results });
  }

  if (category) {
    const results = getStandardsByCategory(category);
    return NextResponse.json({ success: true, data: results });
  }

  return NextResponse.json({ success: true, data: BIS_STANDARDS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { isCode, title, requirements } = body;

    if (!isCode || !title) {
      return NextResponse.json(
        { error: "Please provide standard code and title" },
        { status: 400 }
      );
    }

    const rawResponse = await explainStandardSimply(isCode, title, 
      Array.isArray(requirements) ? requirements : requirements ? [requirements] : []
    );

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

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Standards explain error:", error);
    if (error.message?.includes("RATE_LIMITED")) {
      return NextResponse.json({ success: true, data: getDemoData("standards"), isDemo: true, demoMessage: "AI quota exceeded — showing sample explanation" });
    }
    return NextResponse.json(
      { error: error.message || "Failed to explain standard" },
      { status: 500 }
    );
  }
}
