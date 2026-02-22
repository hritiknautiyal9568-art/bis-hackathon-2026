import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import getDb from "@/lib/db";

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const db = getDb();
    const user = db.prepare(
      "SELECT id, name, email, role, phone, company, gst_number, created_at FROM users WHERE id = ?"
    ).get(authUser.id) as any;

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const settings = db.prepare(
      "SELECT * FROM user_settings WHERE user_id = ?"
    ).get(authUser.id);

    return NextResponse.json({ user: { ...user, settings } });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
