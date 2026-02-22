import { NextRequest, NextResponse } from "next/server";
import { chatWithAssistant } from "@/lib/gemini";
import { getDemoData } from "@/lib/demo-data";

export async function POST(request: NextRequest) {
  let role = "customer";
  try {
    const body = await request.json();
    const { message, context, userRole } = body;
    role = userRole === "seller" ? "seller" : "customer";

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await chatWithAssistant(message, context || "", role);

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Chat API error:", error);
    if (error.message?.includes("RATE_LIMITED")) {
      return NextResponse.json({ response: getDemoData("chat", role), isDemo: true, demoMessage: "AI quota exceeded — showing pre-written response" });
    }
    return NextResponse.json(
      { error: error.message || "Failed to get response" },
      { status: 500 }
    );
  }
}
