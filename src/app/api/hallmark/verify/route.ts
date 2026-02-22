import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { extractHUIDFromImage } from "@/lib/gemini";

// Simulated BIS hallmark database — in real life this would call BIS Care API
const SIMULATED_HUID_DATABASE: Record<string, {
  huid: string;
  articleType: string;
  purity: string;
  purityKarat: string;
  jeweller: string;
  jewellerAddress: string;
  ahcName: string;
  ahcCode: string;
  weight: string;
  hallmarkDate: string;
  isValid: boolean;
}> = {
  "AB1234": {
    huid: "AB1234",
    articleType: "Ring",
    purity: "916",
    purityKarat: "22K",
    jeweller: "Tanishq Jewellers",
    jewellerAddress: "MG Road, Bangalore, Karnataka",
    ahcName: "India Govt. Mint, Mumbai",
    ahcCode: "AHC-MH-001",
    weight: "4.5g",
    hallmarkDate: "2024-03-15",
    isValid: true,
  },
  "CD5678": {
    huid: "CD5678",
    articleType: "Necklace",
    purity: "750",
    purityKarat: "18K",
    jeweller: "Kalyan Jewellers",
    jewellerAddress: "Thrissur, Kerala",
    ahcName: "Kerala State Hallmarking Centre",
    ahcCode: "AHC-KL-003",
    weight: "18.2g",
    hallmarkDate: "2024-06-20",
    isValid: true,
  },
  "EF9012": {
    huid: "EF9012",
    articleType: "Bangle",
    purity: "916",
    purityKarat: "22K",
    jeweller: "Malabar Gold & Diamonds",
    jewellerAddress: "Calicut, Kerala",
    ahcName: "Malabar AHC Centre",
    ahcCode: "AHC-KL-007",
    weight: "12.8g",
    hallmarkDate: "2024-01-10",
    isValid: true,
  },
  "GH3456": {
    huid: "GH3456",
    articleType: "Chain",
    purity: "999",
    purityKarat: "24K",
    jeweller: "PC Jewellers",
    jewellerAddress: "Chandni Chowk, Delhi",
    ahcName: "Delhi Assay Office",
    ahcCode: "AHC-DL-002",
    weight: "10.0g",
    hallmarkDate: "2024-08-05",
    isValid: true,
  },
  "IJ7890": {
    huid: "IJ7890",
    articleType: "Earring",
    purity: "916",
    purityKarat: "22K",
    jeweller: "Joyalukkas",
    jewellerAddress: "T. Nagar, Chennai, Tamil Nadu",
    ahcName: "Chennai Hallmarking Centre",
    ahcCode: "AHC-TN-004",
    weight: "3.2g",
    hallmarkDate: "2024-05-18",
    isValid: true,
  },
  "XX0000": {
    huid: "XX0000",
    articleType: "Ring",
    purity: "916",
    purityKarat: "22K",
    jeweller: "Unknown",
    jewellerAddress: "Unknown",
    ahcName: "Unknown",
    ahcCode: "N/A",
    weight: "Unknown",
    hallmarkDate: "N/A",
    isValid: false,
  },
};

// POST - verify hallmark by image (extract HUID via AI) or by HUID text
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { huidNumber, image, mimeType } = body;

    let extractedData: any = null;
    let huidToCheck = huidNumber?.toUpperCase()?.trim();

    // If image provided, extract HUID using Gemini AI
    if (image && mimeType) {
      try {
        const aiResult = await extractHUIDFromImage(image, mimeType);
        try {
          const clean = aiResult.replace(/```json\n?|\n?```/g, "").trim();
          extractedData = JSON.parse(clean);
          if (extractedData.huidFound && extractedData.huidNumber) {
            huidToCheck = extractedData.huidNumber.toUpperCase().trim();
          }
        } catch {
          extractedData = { huidFound: false, notes: "Failed to parse AI response" };
        }
      } catch (aiError: any) {
        // On rate limit, still allow manual HUID lookup
        if (aiError.message?.includes("RATE_LIMITED")) {
          extractedData = { huidFound: false, notes: "AI quota exceeded — please enter HUID manually", isDemo: true };
        } else {
          extractedData = { huidFound: false, notes: "AI extraction failed — please enter HUID manually" };
        }
      }
    }

    if (!huidToCheck) {
      return NextResponse.json({
        verified: false,
        message: "No HUID number found. Please enter a valid HUID or scan a clearer image.",
        extractedData,
      });
    }

    // Look up HUID in simulated database
    const record = SIMULATED_HUID_DATABASE[huidToCheck];

    // Save verification to database if user is logged in
    try {
      const db = getDb();
      const cookieHeader = req.headers.get("cookie") || "";
      // Simple check — don't fail if auth not available
      db.prepare(
        `INSERT INTO hallmark_verifications (
          user_id, huid_number, article_type, purity, jeweller_name,
          jeweller_address, weight, is_valid, verification_result
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        null, // user_id — can be null for public
        huidToCheck,
        record?.articleType || null,
        record?.purity || null,
        record?.jeweller || null,
        record?.jewellerAddress || null,
        record?.weight || null,
        record ? (record.isValid ? 1 : 0) : 0,
        JSON.stringify({
          found: !!record,
          isValid: record?.isValid || false,
          source: "simulated_bis_database",
        })
      );
    } catch {
      // Non-critical — continue even if DB save fails
    }

    if (record) {
      return NextResponse.json({
        verified: true,
        isValid: record.isValid,
        huid: record.huid,
        details: {
          articleType: record.articleType,
          purity: record.purity,
          purityKarat: record.purityKarat,
          jeweller: record.jeweller,
          jewellerAddress: record.jewellerAddress,
          ahcName: record.ahcName,
          ahcCode: record.ahcCode,
          weight: record.weight,
          hallmarkDate: record.hallmarkDate,
        },
        extractedData,
        message: record.isValid
          ? `✅ HUID ${record.huid} is VALID and registered with BIS`
          : `❌ HUID ${record.huid} is INVALID — this hallmark may be counterfeit`,
      });
    } else {
      return NextResponse.json({
        verified: true,
        isValid: false,
        huid: huidToCheck,
        details: null,
        extractedData,
        message: `⚠️ HUID ${huidToCheck} not found in BIS database. This product may not be hallmarked by an authorized centre.`,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}
