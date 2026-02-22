import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ─── Preferred model order (fallback chain) ──────────────────────────
const MODEL_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-3-flash-preview",
  "gemma-3-27b-it",
];

// ─── Retry helper with exponential backoff & model fallback ──────────
async function callGeminiWithRetry(
  parts: Part[] | string,
  maxRetries = 1
): Promise<string> {
  const partsArray: Part[] = typeof parts === "string" ? [{ text: parts }] : parts;

  for (const modelName of MODEL_CHAIN) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(partsArray);
        return result.response.text();
      } catch (error: any) {
        const status = error?.status || error?.httpStatusCode || 0;
        const msg = error?.message || "";

        // Rate limit — wait briefly and retry, then try next model
        if (status === 429 || msg.includes("429") || msg.includes("quota")) {
          const waitSec = (attempt + 1) * 1; // 1s, 2s — fast fallback to demo
          console.warn(`[Gemini] ${modelName} rate limited (attempt ${attempt + 1}/${maxRetries + 1}), waiting ${waitSec}s...`);
          if (attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, waitSec * 1000));
            continue;
          }
          // Exhausted retries for this model — try next model
          break;
        }

        // Model not found / unavailable — try next model immediately
        if (status === 404 || msg.includes("not found") || msg.includes("not available")) {
          console.warn(`[Gemini] ${modelName} not available, trying next model...`);
          break;
        }

        // Image processing error — try next model (different models handle images differently)
        if (status === 400 && (msg.includes("Unable to process") || msg.includes("image"))) {
          console.warn(`[Gemini] ${modelName} cannot process image (400), trying next model...`);
          break;
        }

        // Other errors — throw immediately
        throw error;
      }
    }
  }

  // All models and retries exhausted
  throw new Error("RATE_LIMITED: All Gemini models are currently rate limited. Please wait a minute and try again, or check your API quota at https://ai.dev/rate-limit");
}

// ─── Live Camera / Vision Scan ───────────────────────────────────────
export async function liveScanAnalysis(
  imageBase64: string,
  imageMimeType: string,
  scanMode: "hallmark" | "product" | "label" | "barcode"
): Promise<string> {
  const modePrompts: Record<string, string> = {
    hallmark: `You are an expert at identifying Indian certification marks and hallmarks. Analyze this image and identify ANY certification marks visible (ISI mark, BIS hallmark, FSSAI, AGMARK, BEE star rating, Ecomark, Silk Mark, CE mark, BIS CRS R-number, Woolmark, etc).

Provide results in JSON format (ONLY valid JSON, no markdown):
{
  "marksFound": [
    {
      "markName": "ISI Mark / BIS Hallmark / FSSAI / etc",
      "confidence": 92,
      "details": {
        "licenseNumber": "detected number if visible",
        "standardCode": "IS XXXX if visible",
        "organization": "BIS / FSSAI / etc",
        "validity": "if visible"
      },
      "isAuthentic": true,
      "authenticityNotes": "Analysis of why authentic or suspicious",
      "location": "Where on the image the mark was found"
    }
  ],
  "productIdentified": "What product this appears to be",
  "overallAssessment": "Summary of all marks found and their authenticity",
  "recommendations": ["What the consumer should do next"],
  "warnings": ["Any warnings or concerns"]
}`,
    product: `You are a BIS product compliance expert. Analyze this product image and identify:
1. What product this is
2. What BIS/Indian standards would apply
3. What certification marks should be present
4. Any visible compliance issues

Provide results in JSON (ONLY valid JSON, no markdown):
{
  "productName": "identified product",
  "productCategory": "category",
  "visibleMarks": ["marks visible on the product"],
  "requiredMarks": ["marks that SHOULD be on this product"],
  "missingMarks": ["required marks that are NOT visible"],
  "applicableStandards": [{"isCode": "IS XXXX", "title": "Standard name", "mandatory": true}],
  "complianceIssues": ["any visible issues"],
  "qualityObservations": ["visual quality observations"],
  "recommendations": ["what to do"],
  "safetyWarnings": ["any safety concerns"]
}`,
    label: `You are an expert at reading Indian product labels. Analyze this product label/packaging and extract ALL information visible.

Provide results in JSON (ONLY valid JSON, no markdown):
{
  "productName": "product name from label",
  "manufacturer": "manufacturer name",
  "manufacturerAddress": "address if visible",
  "certificationMarks": [{"mark": "ISI/FSSAI/etc", "number": "license number"}],
  "ingredients": ["if food product"],
  "nutritionalInfo": "if visible",
  "batchNumber": "batch/lot number",
  "mfgDate": "manufacturing date",
  "expiryDate": "expiry date",
  "mrp": "MRP if visible",
  "netWeight": "weight/volume",
  "barcode": "barcode number if readable",
  "countryOfOrigin": "country",
  "warnings": ["any warnings on label"],
  "missingInfo": ["mandatory info that should be but isn't on the label"],
  "complianceScore": 85,
  "analysis": "Overall analysis of label compliance"
}`,
    barcode: `Analyze this image for any barcodes, QR codes, or product identification codes. Extract all readable information.

Provide results in JSON (ONLY valid JSON, no markdown):
{
  "codesFound": [
    {
      "type": "barcode/QR/HUID/R-number",
      "value": "decoded value",
      "format": "EAN-13/UPC/QR/Code128/etc"
    }
  ],
  "productInfo": "any product information decoded",
  "recommendations": ["verification steps"]
}`
  };

  const prompt = modePrompts[scanMode];

  const parts: Part[] = [
    { text: prompt },
    { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
  ];

  return callGeminiWithRetry(parts);
}

// ─── AI Chat Assistant ───────────────────────────────────────────────
export async function chatWithAssistant(
  message: string,
  context: string,
  userRole: "customer" | "seller"
): Promise<string> {
  const roleContext = userRole === "customer"
    ? `You are a helpful BIS consumer assistant. Help consumers understand product certifications, verify hallmarks, know their rights, and identify counterfeit products. Be friendly and use simple language. You can mix Hindi words where it makes the explanation clearer for Indian consumers.`
    : `You are a BIS compliance advisor for manufacturers and sellers. Help them understand certification requirements, guide them through the application process, suggest improvements for compliance, and answer technical questions about Indian Standards. Be professional and detailed.`;

  const prompt = `${roleContext}

Context about the user's session:
${context}

User's question: ${message}

Respond helpfully and concisely. If you recommend checking specific IS codes or certification marks, mention them. If you don't know something specific, suggest contacting BIS at 14100 or visiting bis.gov.in. Always respond in plain text (not JSON).`;

  return callGeminiWithRetry(prompt);
}

// ─── Product Quality Analysis from Image ─────────────────────────────
export async function analyzeProductQuality(
  imageBase64: string,
  imageMimeType: string,
  productType?: string
): Promise<string> {
  const prompt = `You are a product quality inspector AI. Analyze this product image for quality indicators.
${productType ? `Product type: ${productType}` : ""}

Provide analysis in JSON (ONLY valid JSON, no markdown):
{
  "productIdentified": "what product this is",
  "qualityScore": 75,
  "qualityGrade": "A/B/C/D",
  "visualDefects": [
    {"defect": "description", "severity": "minor/major/critical", "location": "where on product"}
  ],
  "packagingQuality": {"score": 80, "observations": ["observation 1"]},
  "labelCompliance": {"score": 70, "missingItems": ["item 1"], "presentItems": ["item 1"]},
  "materialAssessment": "assessment of visible material quality",
  "safetyObservations": ["any safety concerns visible"],
  "comparisonWithStandard": "how it compares to BIS standard expectations",
  "recommendations": ["improvement suggestions"],
  "overallVerdict": "summary verdict"
}`;

  const parts: Part[] = [
    { text: prompt },
    { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
  ];

  return callGeminiWithRetry(parts);
}

// ─── Seller Document Analysis ────────────────────────────────────────
export async function analyzeSellerDocument(
  documentText: string,
  documentType: string
): Promise<string> {
  const prompt = `You are a BIS certification document expert. Analyze this ${documentType} document and provide detailed feedback.

Document content:
${documentText}

Provide analysis in JSON (ONLY valid JSON, no markdown):
{
  "documentType": "${documentType}",
  "completeness": 75,
  "missingFields": ["field 1", "field 2"],
  "presentFields": ["field 1", "field 2"],
  "errors": [{"field": "field name", "issue": "what's wrong", "suggestion": "how to fix"}],
  "standards": ["applicable IS standards"],
  "readyForSubmission": false,
  "estimatedProcessingTime": "X weeks",
  "suggestions": ["improvement 1", "improvement 2"],
  "requiredAttachments": ["attachment 1"],
  "nextSteps": ["step 1", "step 2"]
}`;

  return callGeminiWithRetry(prompt);
}

// ─── Generate Compliance Checklist ───────────────────────────────────
export async function generateComplianceChecklist(
  productType: string,
  targetStandards: string
): Promise<string> {
  const prompt = `You are a BIS compliance expert. Generate a comprehensive compliance checklist for this product.

Product: ${productType}
Target Standards: ${targetStandards}

Provide in JSON (ONLY valid JSON, no markdown):
{
  "productType": "${productType}",
  "standards": ["IS codes"],
  "checklist": [
    {
      "category": "Documentation / Testing / Design / Material / Safety / Labeling",
      "items": [
        {"item": "checklist item", "mandatory": true, "description": "detail", "estimatedCost": "₹X", "timeline": "X days"}
      ]
    }
  ],
  "totalEstimatedCost": "₹X - ₹Y",
  "totalTimeline": "X months",
  "certificationPath": ["step 1", "step 2", "step 3"],
  "requiredLabs": [{"name": "lab name", "location": "city", "tests": ["test 1"]}],
  "tips": ["tip 1"],
  "commonRejectionReasons": ["reason 1"]
}`;

  return callGeminiWithRetry(prompt);
}

export async function analyzeProductCompliance(
  productDescription: string,
  imageBase64?: string,
  imageMimeType?: string
): Promise<string> {
  const prompt = `You are an expert BIS (Bureau of Indian Standards) compliance analyst. Analyze the following product information and provide a detailed compliance assessment.

Product Information:
${productDescription}

Please provide your analysis in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "productName": "detected product name",
  "productCategory": "product category",
  "applicableStandards": [
    {
      "isCode": "IS XXXX",
      "title": "Standard title",
      "relevanceScore": 0.95,
      "mandatory": true
    }
  ],
  "overallScore": 72,
  "status": "partially-compliant",
  "gaps": [
    {
      "id": "gap1",
      "standard": "IS XXXX",
      "requirement": "Specific requirement",
      "currentStatus": "missing",
      "severity": "critical",
      "description": "Detailed description of the gap"
    }
  ],
  "recommendations": [
    {
      "id": "rec1",
      "type": "material",
      "title": "Recommendation title",
      "description": "Detailed recommendation",
      "priority": "high",
      "estimatedCost": "₹10,000 - ₹50,000",
      "estimatedTime": "2-4 weeks"
    }
  ]
}

Important guidelines:
- Use real BIS IS codes that are applicable
- overallScore should be 0-100
- status: "compliant" (score>=80), "partially-compliant" (score 40-79), "non-compliant" (score<40)
- severity: "critical" for safety issues, "major" for key requirements, "minor" for documentation
- type can be: "material", "safety", "testing", "documentation", "design", "labeling"
- priority: "high" for critical/mandatory, "medium" for important, "low" for nice-to-have
- Be specific about Indian standards and testing requirements
- Include estimated costs in INR
- Reference real testing labs in India (NABL, ERTL, STQC, etc.)`;

  const parts: Part[] = [{ text: prompt }];

  if (imageBase64 && imageMimeType) {
    parts.push({
      inlineData: {
        mimeType: imageMimeType,
        data: imageBase64,
      },
    });
  }

  return callGeminiWithRetry(parts);
}

export async function simulateApproval(
  productDescription: string,
  complianceData?: string
): Promise<string> {
  const prompt = `You are a BIS (Bureau of Indian Standards) certification simulation expert. Based on the following product information, predict the approval probability and provide detailed simulation results.

Product Information:
${productDescription}

${complianceData ? `Previous Compliance Data:\n${complianceData}` : ""}

Provide your simulation in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "approvalProbability": 65,
  "estimatedTimeline": "3-6 months",
  "riskFactors": [
    {
      "factor": "Risk description",
      "impact": "high",
      "mitigation": "How to mitigate this risk"
    }
  ],
  "requiredTests": [
    {
      "testName": "Test name",
      "standard": "IS XXXX",
      "estimatedCost": "₹25,000",
      "duration": "2 weeks",
      "labs": ["Lab name 1", "Lab name 2"]
    }
  ],
  "overallAssessment": "Detailed assessment paragraph",
  "nextSteps": [
    "Step 1 description",
    "Step 2 description"
  ],
  "estimatedTotalCost": "₹1,50,000 - ₹3,00,000"
}

Use realistic Indian BIS certification timelines, costs in INR, and actual testing laboratory names.`;

  return callGeminiWithRetry(prompt);
}

export async function verifyISIMark(
  imageBase64: string,
  imageMimeType: string,
  additionalInfo?: string
): Promise<string> {
  const prompt = `You are a BIS ISI mark verification expert. Analyze the provided image of a product label/ISI mark and determine its authenticity.

${additionalInfo ? `Additional Information: ${additionalInfo}` : ""}

Analyze the image and provide verification results in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "isAuthentic": true,
  "confidence": 85,
  "licenseNumber": "CM/L-XXXXXXX",
  "manufacturer": "Detected manufacturer name",
  "validUntil": "2026-12-31",
  "standardMark": "ISI / Standard Mark / Hallmark",
  "productIdentified": "Product name",
  "standardCode": "IS XXXX",
  "warnings": [
    "Any warning messages"
  ],
  "details": "Detailed analysis of the mark authenticity, font quality, placement, hologram presence etc.",
  "verificationChecks": [
    {
      "check": "Mark clarity and print quality",
      "passed": true,
      "note": "Details"
    },
    {
      "check": "License number format",
      "passed": true,
      "note": "Details"
    },
    {
      "check": "Standard mark design compliance",
      "passed": true,
      "note": "Details"
    }
  ]
}

Important: 
- Check ISI mark shape, font, and design authenticity
- Verify license number format (CM/L- prefix for ISI)
- Look for signs of counterfeiting (blurry print, wrong proportions, etc.)
- confidence should be 0-100
- Be thorough but cautious - when in doubt, flag warnings`;

  const parts: Part[] = [
    { text: prompt },
    {
      inlineData: {
        mimeType: imageMimeType,
        data: imageBase64,
      },
    },
  ];

  return callGeminiWithRetry(parts);
}

export async function explainStandardSimply(
  standardCode: string,
  standardTitle: string,
  requirements: string[] | string
): Promise<string> {
  const reqList = Array.isArray(requirements) ? requirements : requirements ? [requirements] : [];
  const prompt = `You are a BIS standards expert helping MSMEs and small businesses understand Indian Standards in plain, simple language.

Standard: ${standardCode} - ${standardTitle}
Technical Requirements: ${reqList.join(", ")}

Explain this standard in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "simpleSummary": "2-3 sentence plain language summary of what this standard means",
  "whyItMatters": "Why this standard is important for consumers and manufacturers",
  "keyPointsSimple": [
    "Simple explanation of each key requirement"
  ],
  "commonMistakes": [
    "Common mistakes manufacturers make"
  ],
  "costEstimate": "Rough cost estimate for certification",
  "timeEstimate": "Typical time for certification",
  "helpfulTips": [
    "Practical tips for MSMEs"
  ],
  "relatedStandards": ["IS XXXX - Related standard"]
}

Use simple Hindi-English mixed language where helpful. Avoid technical jargon. Think of explaining to a small shopkeeper or local manufacturer.`;

  return callGeminiWithRetry(prompt);
}

// ─── AI Product Describer (Deep Product Analysis) ────────────────────
export async function describeProduct(
  imageBase64: string,
  imageMimeType: string
): Promise<string> {
  const prompt = `You are an expert product analyst for the Bureau of Indian Standards (BIS). Analyze this product image in extreme detail and provide a comprehensive product description with BIS compliance relevance.

Provide results in JSON (ONLY valid JSON, no markdown):
{
  "productName": "detailed product name",
  "brand": "brand if visible",
  "category": "product category",
  "subcategory": "specific subcategory",
  "description": "Detailed 3-4 sentence product description",
  "materialAnalysis": {
    "primaryMaterial": "main material",
    "secondaryMaterials": ["other materials"],
    "materialQualityAssessment": "assessment of material quality from visual",
    "potentialConcerns": ["material-related concerns"]
  },
  "dimensions": "estimated dimensions if possible",
  "colorAndFinish": "color, texture, finish description",
  "manufacturingQuality": {
    "score": 75,
    "observations": ["quality observation 1", "quality observation 2"],
    "defectsFound": ["any visible defects"],
    "craftmanshipLevel": "excellent / good / average / poor"
  },
  "certificationMarks": {
    "found": [{"mark": "name", "status": "valid/suspicious/unclear"}],
    "missing": ["marks that should be present"],
    "complianceStatus": "compliant / partially-compliant / non-compliant"
  },
  "bisRelevance": {
    "applicableStandards": [{"code": "IS XXXX", "title": "standard title", "mandatory": true}],
    "certificationRequired": true,
    "certificationScheme": "ISI / CRS / Hallmarking / None",
    "estimatedComplianceCost": "₹X - ₹Y",
    "riskCategory": "high / medium / low"
  },
  "safetyAssessment": {
    "overallSafety": "safe / caution / unsafe",
    "safetyScore": 80,
    "concerns": ["safety concern 1"],
    "childSafety": "applicable safety notes for children",
    "environmentalImpact": "environmental assessment"
  },
  "consumerAdvice": {
    "buyRecommendation": "recommended / caution / avoid",
    "priceRange": "estimated market price range",
    "alternatives": ["better alternatives if quality is poor"],
    "tips": ["consumer tips"]
  },
  "marketInfo": {
    "targetAudience": "who this product is for",
    "commonUses": ["use 1", "use 2"],
    "marketSegment": "premium / mid-range / budget",
    "madeIn": "country of origin if identifiable"
  }
}`;

  const parts: Part[] = [
    { text: prompt },
    { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
  ];

  return callGeminiWithRetry(parts);
}

// ─── AI Product Comparison ───────────────────────────────────────────
export async function compareProducts(
  image1Base64: string,
  image1MimeType: string,
  image2Base64: string,
  image2MimeType: string
): Promise<string> {
  const prompt = `You are a BIS product comparison expert. Compare these TWO product images in detail. The first image is Product A, second is Product B.

Provide comparison in JSON (ONLY valid JSON, no markdown):
{
  "productA": {
    "name": "identified product A",
    "brand": "brand if visible",
    "category": "category"
  },
  "productB": {
    "name": "identified product B",
    "brand": "brand if visible",
    "category": "category"
  },
  "comparison": {
    "qualityScore": {"productA": 75, "productB": 82},
    "complianceScore": {"productA": 70, "productB": 90},
    "safetyScore": {"productA": 80, "productB": 85},
    "valueScore": {"productA": 70, "productB": 78}
  },
  "detailedComparison": [
    {
      "aspect": "Material Quality / Certification / Packaging / Labeling / Safety",
      "productA": "assessment for A",
      "productB": "assessment for B",
      "winner": "A or B or Tie",
      "importance": "high / medium / low"
    }
  ],
  "certificationComparison": {
    "productA_marks": ["marks found on A"],
    "productB_marks": ["marks found on B"],
    "productA_missing": ["missing marks on A"],
    "productB_missing": ["missing marks on B"]
  },
  "overallWinner": "A or B",
  "winnerReason": "Why this product is better",
  "recommendation": "Detailed purchase recommendation",
  "warnings": ["any warnings for either product"]
}`;

  const parts: Part[] = [
    { text: prompt },
    { inlineData: { mimeType: image1MimeType, data: image1Base64 } },
    { inlineData: { mimeType: image2MimeType, data: image2Base64 } },
  ];

  return callGeminiWithRetry(parts);
}

// ─── Smart Safety Risk Analyzer ──────────────────────────────────────
export async function analyzeSafetyRisk(
  imageBase64: string,
  imageMimeType: string,
  productDescription?: string
): Promise<string> {
  const prompt = `You are a product safety risk analyst for BIS. Analyze this product image for ALL potential safety risks, hazards, and compliance issues.
${productDescription ? `Product Context: ${productDescription}` : ""}

Provide COMPREHENSIVE safety analysis in JSON (ONLY valid JSON, no markdown):
{
  "productIdentified": "product name",
  "overallRiskLevel": "critical / high / medium / low / minimal",
  "overallRiskScore": 35,
  "riskBreakdown": {
    "physicalHazards": {
      "score": 40,
      "risks": [{"hazard": "description", "severity": "critical/high/medium/low", "likelihood": "very likely/likely/possible/unlikely", "affectedGroup": "children/elderly/general"}]
    },
    "chemicalHazards": {
      "score": 30,
      "risks": [{"hazard": "description", "severity": "high", "evidence": "visual evidence"}]
    },
    "electricalHazards": {
      "score": 0,
      "risks": []
    },
    "fireHazards": {
      "score": 0,
      "risks": []
    },
    "biologicalHazards": {
      "score": 0,
      "risks": []
    }
  },
  "certificationGaps": [
    {"standard": "IS XXXX", "requirement": "what's required", "status": "missing/present/unclear", "riskImpact": "what happens without it"}
  ],
  "recallCheck": {
    "similarRecalls": ["any known recalls of similar products in India"],
    "recallRisk": "low"
  },
  "ageRestrictions": {
    "suitableForChildren": false,
    "minimumAge": "X years",
    "reason": "why"
  },
  "environmentalRisk": {
    "score": 50,
    "concerns": ["environmental concern"],
    "disposalAdvice": "proper disposal method"
  },
  "recommendations": {
    "forConsumers": ["immediate actions for consumers"],
    "forManufacturers": ["required improvements"],
    "reportTo": ["BIS / Consumer Forum / FSSAI contact details"]
  },
  "urgentWarnings": ["any urgent warnings"]
}`;

  const parts: Part[] = [
    { text: prompt },
    { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
  ];

  return callGeminiWithRetry(parts);
}

// ─── AI Ingredient / Material Analyzer ───────────────────────────────
export async function analyzeIngredients(
  imageBase64: string,
  imageMimeType: string
): Promise<string> {
  const prompt = `You are an expert ingredient and material analyst specializing in Indian product safety standards. Analyze this product image (focus on ingredients list, materials, composition labels if visible).

Provide analysis in JSON (ONLY valid JSON, no markdown):
{
  "productIdentified": "product name",
  "productType": "food / cosmetic / chemical / electronic / textile / other",
  "ingredientsFound": [
    {
      "name": "ingredient name",
      "category": "preservative / colorant / flavoring / active / filler / etc",
      "safetyRating": "safe / caution / harmful / banned",
      "bisStatus": "approved / restricted / banned / not-regulated",
      "details": "brief info about this ingredient",
      "dailyLimit": "safe daily limit if applicable"
    }
  ],
  "harmfulIngredients": [
    {"name": "ingredient", "concern": "why it's harmful", "bannedIn": ["countries where banned"], "alternative": "safer alternative"}
  ],
  "allergens": ["common allergens found"],
  "fssaiCompliance": {
    "compliant": true,
    "issues": ["any FSSAI compliance issues"],
    "missingDeclarations": ["required declarations not found"]
  },
  "nutritionalConcerns": ["if food product - nutritional concerns"],
  "overallSafetyScore": 75,
  "certificationNeeded": ["FSSAI / BIS ISI / AGMARK / etc"],
  "recommendations": ["consumer recommendations"],
  "healthAdvisory": "overall health advisory"
}`;

  const parts: Part[] = [
    { text: prompt },
    { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
  ];

  return callGeminiWithRetry(parts);
}

// ─── Extract HUID from Hallmark Image ─────────────────────────────────
export async function extractHUIDFromImage(
  imageBase64: string,
  imageMimeType: string
): Promise<string> {
  const prompt = `You are an expert at reading BIS hallmark engravings on gold and silver jewellery in India.

Analyze this image carefully and extract the HUID (Hallmark Unique Identification Number) and any other hallmark details visible.

The BIS hallmark typically has these components:
1. BIS Logo (triangle mark)
2. Purity/Fineness (e.g., 916 for 22K gold, 750 for 18K gold, 999 for 24K gold, 925 for silver)
3. HUID - A 6-character alphanumeric code (e.g., AB1234, XY5678)
4. Jeweller's identification mark (optional in new system)
5. Assaying & Hallmarking Centre mark

Please respond ONLY with valid JSON, no markdown:
{
  "huidFound": true,
  "huidNumber": "AB1234",
  "purity": "916",
  "purityKarat": "22K",
  "metalType": "Gold",
  "bisLogoVisible": true,
  "ahcMark": "Assaying centre name if visible",
  "jewellerMark": "Jeweller mark if visible",
  "confidence": 0.85,
  "allTextDetected": ["all text/numbers visible on hallmark"],
  "notes": "any additional observations about the hallmark quality or authenticity"
}

If no HUID or hallmark is found, respond with:
{
  "huidFound": false,
  "huidNumber": null,
  "purity": null,
  "purityKarat": null,
  "metalType": null,
  "bisLogoVisible": false,
  "confidence": 0,
  "allTextDetected": [],
  "notes": "No hallmark found in the image"
}`;

  const parts: Part[] = [
    { text: prompt },
    { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
  ];

  return callGeminiWithRetry(parts);
}
