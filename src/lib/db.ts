import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

const DB_PATH = path.join(process.cwd(), "bis-portal.db");

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeTables();
  }
  return db;
}

function initializeTables() {
  const d = getDbRaw();

  // Users table — supports both customer and seller roles
  d.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('customer', 'seller')),
      phone TEXT,
      company TEXT,
      gst_number TEXT,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seller product compliance records
  d.exec(`
    CREATE TABLE IF NOT EXISTS seller_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seller_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      product_category TEXT,
      image_url TEXT,
      compliance_score INTEGER DEFAULT 0,
      compliance_status TEXT DEFAULT 'pending' CHECK (compliance_status IN ('pending', 'compliant', 'non_compliant', 'needs_review')),
      applicable_standards TEXT,
      missing_marks TEXT,
      compliance_details TEXT,
      ai_analysis TEXT,
      scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Hallmark verification records
  d.exec(`
    CREATE TABLE IF NOT EXISTS hallmark_verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      huid_number TEXT NOT NULL,
      article_type TEXT,
      purity TEXT,
      jeweller_name TEXT,
      jeweller_address TEXT,
      weight TEXT,
      is_valid INTEGER DEFAULT 0,
      verification_result TEXT,
      verified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // User settings
  d.exec(`
    CREATE TABLE IF NOT EXISTS user_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      notifications_enabled INTEGER DEFAULT 1,
      email_alerts INTEGER DEFAULT 1,
      dark_mode INTEGER DEFAULT 0,
      language TEXT DEFAULT 'en',
      auto_scan INTEGER DEFAULT 1,
      scan_quality TEXT DEFAULT 'high',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Seed demo users if they don't exist
  seedDemoUsers(d);
}

function seedDemoUsers(d: Database.Database) {
  const demoCustomer = d.prepare("SELECT id FROM users WHERE email = ?").get("demo@customer.com");
  if (!demoCustomer) {
    const hash = bcrypt.hashSync("demo123", 10);
    const result = d.prepare(
      `INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)`
    ).run("Demo Consumer", "demo@customer.com", hash, "customer", "+91 98765 43210");
    d.prepare(
      `INSERT INTO user_settings (user_id) VALUES (?)`
    ).run(result.lastInsertRowid);
  }

  const demoSeller = d.prepare("SELECT id FROM users WHERE email = ?").get("demo@seller.com");
  if (!demoSeller) {
    const hash = bcrypt.hashSync("demo123", 10);
    const result = d.prepare(
      `INSERT INTO users (name, email, password, role, phone, company, gst_number) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run("Demo Manufacturer", "demo@seller.com", hash, "seller", "+91 98765 43211", "Demo Industries Pvt. Ltd.", "22AAAAA0000A1Z5");
    d.prepare(
      `INSERT INTO user_settings (user_id) VALUES (?)`
    ).run(result.lastInsertRowid);
  }
}

function getDbRaw(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }
  return db;
}

export { getDb };
export default getDb;
