import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const db = getDb();
    const settings = db
      .prepare("SELECT * FROM user_settings WHERE user_id = ?")
      .get(authUser.id);
    const user = db
      .prepare(
        "SELECT id, name, email, role, phone, company, gst_number, avatar_url, created_at FROM users WHERE id = ?"
      )
      .get(authUser.id);
    return NextResponse.json({ settings, user });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const db = getDb();

    // Update user profile fields
    if (body.name || body.phone || body.company || body.gst_number) {
      db.prepare(
        `UPDATE users SET 
          name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          company = COALESCE(?, company),
          gst_number = COALESCE(?, gst_number),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`
      ).run(
        body.name || null,
        body.phone || null,
        body.company || null,
        body.gst_number || null,
        authUser.id
      );
    }

    // Update settings
    if (body.settings) {
      const s = body.settings;
      db.prepare(
        `UPDATE user_settings SET
          notifications_enabled = COALESCE(?, notifications_enabled),
          email_alerts = COALESCE(?, email_alerts),
          dark_mode = COALESCE(?, dark_mode),
          language = COALESCE(?, language),
          auto_scan = COALESCE(?, auto_scan),
          scan_quality = COALESCE(?, scan_quality),
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?`
      ).run(
        s.notifications_enabled !== undefined ? (s.notifications_enabled ? 1 : 0) : null,
        s.email_alerts !== undefined ? (s.email_alerts ? 1 : 0) : null,
        s.dark_mode !== undefined ? (s.dark_mode ? 1 : 0) : null,
        s.language || null,
        s.auto_scan !== undefined ? (s.auto_scan ? 1 : 0) : null,
        s.scan_quality || null,
        authUser.id
      );
    }

    // Return updated data
    const settings = db
      .prepare("SELECT * FROM user_settings WHERE user_id = ?")
      .get(authUser.id);
    const user = db
      .prepare(
        "SELECT id, name, email, role, phone, company, gst_number, avatar_url, created_at FROM users WHERE id = ?"
      )
      .get(authUser.id);

    return NextResponse.json({ settings, user, message: "Settings updated successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
