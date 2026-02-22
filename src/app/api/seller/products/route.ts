import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

// GET - fetch seller's scanned products
export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const db = getDb();
    const products = db
      .prepare(
        "SELECT * FROM seller_products WHERE seller_id = ? ORDER BY scanned_at DESC"
      )
      .all(authUser.id);
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - save a scanned product compliance result
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const db = getDb();

    const result = db
      .prepare(
        `INSERT INTO seller_products (
          seller_id, product_name, product_category, image_url,
          compliance_score, compliance_status, applicable_standards,
          missing_marks, compliance_details, ai_analysis
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        authUser.id,
        body.product_name || "Unknown Product",
        body.product_category || "General",
        body.image_url || null,
        body.compliance_score || 0,
        body.compliance_status || "pending",
        body.applicable_standards || null,
        body.missing_marks || null,
        body.compliance_details || null,
        body.ai_analysis || null
      );

    const product = db
      .prepare("SELECT * FROM seller_products WHERE id = ?")
      .get(result.lastInsertRowid);

    return NextResponse.json({ product, message: "Product compliance saved" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to save product" },
      { status: 500 }
    );
  }
}
