import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, phone, company, gstNumber } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Name, email, password, and role are required" }, { status: 400 });
    }

    if (!["customer", "seller"].includes(role)) {
      return NextResponse.json({ error: "Role must be customer or seller" }, { status: 400 });
    }

    const db = getDb();

    // Check if user exists
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = hashPassword(password);

    const result = db.prepare(
      "INSERT INTO users (name, email, password, role, phone, company, gst_number) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(name, email, hashedPassword, role, phone || null, company || null, gstNumber || null);

    const userId = result.lastInsertRowid as number;

    // Create default settings
    db.prepare("INSERT INTO user_settings (user_id) VALUES (?)").run(userId);

    const user = { id: userId, name, email, role };
    const token = generateToken(user);

    const response = NextResponse.json({ user, message: "Registration successful" });
    response.cookies.set("bis_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
