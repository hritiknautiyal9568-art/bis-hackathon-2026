// ─── Demo / Fallback data when Gemini API is rate-limited ────────────
// Returns realistic mock responses so the app works for hackathon demos

export const DEMO_SCAN_HALLMARK = {
  marksFound: [
    {
      markName: "ISI Mark",
      confidence: 94,
      details: {
        licenseNumber: "CM/L-2340567",
        standardCode: "IS 1293:2019",
        organization: "Bureau of Indian Standards",
        validity: "Valid until 2027-03-31",
      },
      isAuthentic: true,
      authenticityNotes: "The ISI mark appears genuine — correct proportions, clear print quality, and valid license number format (CM/L- prefix).",
      location: "Upper-right corner of product label",
    },
  ],
  productIdentified: "Packaged Drinking Water (1L Bottle)",
  overallAssessment: "Product carries a valid ISI mark (IS 1293:2019) for packaged drinking water. The mark appears authentic based on print quality and format.",
  recommendations: [
    "Verify the license number CM/L-2340567 on the BIS website at bis.gov.in",
    "Check the manufacturing date and expiry on the label",
    "Ensure the seal is intact before consumption",
  ],
  warnings: [],
};

export const DEMO_SCAN_PRODUCT = {
  productName: "Stainless Steel Water Bottle",
  productCategory: "Kitchen & Dining",
  visibleMarks: ["ISI Mark"],
  requiredMarks: ["ISI Mark (IS 14543)", "BIS Standard Mark"],
  missingMarks: ["FSSAI License Number (for food contact)"],
  applicableStandards: [
    { isCode: "IS 14543:2016", title: "Stainless Steel Utensils — Specification", mandatory: true },
    { isCode: "IS 9845:1998", title: "Determination of Overall Migration - Food Contact Materials", mandatory: true },
  ],
  complianceIssues: ["FSSAI license number not visible on the product"],
  qualityObservations: ["Good surface finish", "No visible dents or scratches", "Proper seam welding"],
  recommendations: ["Check for FSSAI food safety license", "Verify grade of stainless steel (304 recommended)"],
  safetyWarnings: ["Ensure the bottle is food-grade stainless steel (SS 304 or SS 316)"],
};

export const DEMO_SCAN_LABEL = {
  productName: "Amul Butter (500g)",
  manufacturer: "Gujarat Cooperative Milk Marketing Federation Ltd",
  manufacturerAddress: "Amul Dairy Road, Anand, Gujarat 388001",
  certificationMarks: [
    { mark: "FSSAI", number: "10012011000123" },
    { mark: "AGMARK", number: "AG-GJ-2024-001" },
    { mark: "ISI Mark", number: "CM/L-0401234" },
  ],
  ingredients: ["Pasteurized Butter (from cow and buffalo milk)", "Common Salt", "Permitted Natural Colour (Annatto)"],
  nutritionalInfo: "Per 100g: Energy 729 kcal, Fat 81g, Protein 0.6g, Carbohydrate 0.9g",
  batchNumber: "BT-2026-0134",
  mfgDate: "2026-01-15",
  expiryDate: "2026-07-15",
  mrp: "₹290",
  netWeight: "500g",
  barcode: "8901262150545",
  countryOfOrigin: "India",
  warnings: ["Store in refrigerator", "Contains milk"],
  missingInfo: [],
  complianceScore: 95,
  analysis: "Excellent label compliance. All mandatory information is present including FSSAI license, nutritional information, manufacturing details, and allergen declaration.",
};

export const DEMO_SCAN_BARCODE = {
  codesFound: [
    {
      type: "barcode",
      value: "8901262150545",
      format: "EAN-13",
    },
  ],
  productInfo: "EAN-13 barcode prefix 890 indicates product registered in India. Manufacturer code points to a registered FSSAI food product.",
  recommendations: ["Cross-verify the barcode on BIS product registry", "Check FSSAI license validity at foscos.fssai.gov.in"],
};

export const DEMO_DESCRIBE = {
  productName: "Ceramic Coffee Mug — Blue Floral Design",
  brand: "Not clearly visible",
  category: "Kitchen & Dining",
  subcategory: "Drinkware — Ceramic Mugs",
  description: "A medium-sized ceramic coffee mug with a blue floral pattern on white glaze. The mug features a C-shaped handle with smooth finish. Appears to be machine-manufactured with uniform thickness and consistent glaze application.",
  materialAnalysis: {
    primaryMaterial: "Ceramic (likely stoneware)",
    secondaryMaterials: ["Ceramic glaze", "Underglaze blue pigment"],
    materialQualityAssessment: "Good quality ceramic with even thickness and no visible air bubbles or cracks in the glaze.",
    potentialConcerns: ["Verify lead-free glaze certification", "Ensure food-safe ceramic materials used"],
  },
  dimensions: "Approximately 9cm height × 8cm diameter × 11cm with handle",
  colorAndFinish: "White base with blue floral motif, glossy glaze finish",
  manufacturingQuality: {
    score: 78,
    observations: ["Uniform wall thickness", "Clean handle attachment", "Even glaze application", "Minor glaze pooling at base"],
    defectsFound: ["Slight glaze unevenness at bottom rim"],
    craftmanshipLevel: "good",
  },
  certificationMarks: {
    found: [],
    missing: ["ISI Mark (IS 15885:2010 — Ceramic tableware)", "Food-safe certification"],
    complianceStatus: "non-compliant",
  },
  bisRelevance: {
    applicableStandards: [
      { code: "IS 15885:2010", title: "Ceramic Tableware — Specification", mandatory: false },
      { code: "IS 4853:2000", title: "Determination of Lead and Cadmium — Ceramic Articles", mandatory: true },
    ],
    certificationRequired: false,
    certificationScheme: "ISI (voluntary)",
    estimatedComplianceCost: "₹15,000 - ₹40,000",
    riskCategory: "medium",
  },
  safetyAssessment: {
    overallSafety: "caution",
    safetyScore: 70,
    concerns: ["Lead/cadmium testing status unknown for glaze", "Microwave safety not confirmed"],
    childSafety: "Handle may be difficult for small children; verify chip resistance",
    environmentalImpact: "Ceramic is recyclable; glaze chemicals depend on manufacturer",
  },
  consumerAdvice: {
    buyRecommendation: "caution",
    priceRange: "₹150 - ₹400",
    alternatives: ["Look for ISI-marked ceramic mugs", "Borosil or similar branded mugs with food-safe certification"],
    tips: ["Ask seller for lead-free certification", "Avoid using for very hot liquids without thermal shock testing"],
  },
  marketInfo: {
    targetAudience: "General consumers, office use",
    commonUses: ["Hot beverages", "Tea/Coffee", "Soup"],
    marketSegment: "mid-range",
    madeIn: "India (likely)",
  },
};

export const DEMO_COMPARE = {
  productA: { name: "Prestige Induction Cooktop", brand: "Prestige", category: "Kitchen Appliances" },
  productB: { name: "Bajaj Induction Cooktop", brand: "Bajaj", category: "Kitchen Appliances" },
  comparison: {
    qualityScore: { productA: 85, productB: 78 },
    complianceScore: { productA: 92, productB: 88 },
    safetyScore: { productA: 90, productB: 85 },
    valueScore: { productA: 82, productB: 86 },
  },
  detailedComparison: [
    { aspect: "Build Quality", productA: "Sturdy glass top, metal body", productB: "Glass top, plastic body", winner: "A", importance: "high" },
    { aspect: "Certification", productA: "ISI marked, BIS CRS certified", productB: "ISI marked", winner: "A", importance: "high" },
    { aspect: "Safety Features", productA: "Auto-cut, overheat protection, child lock", productB: "Auto-cut, overheat protection", winner: "A", importance: "high" },
    { aspect: "Value for Money", productA: "₹2,500 — premium segment", productB: "₹1,800 — budget-friendly", winner: "B", importance: "medium" },
    { aspect: "Labeling", productA: "Complete BIS labeling", productB: "Adequate labeling", winner: "A", importance: "medium" },
  ],
  certificationComparison: {
    productA_marks: ["ISI Mark (IS 302-2-6)", "BIS CRS R-41025678"],
    productB_marks: ["ISI Mark (IS 302-2-6)"],
    productA_missing: [],
    productB_missing: ["BIS CRS Registration"],
  },
  overallWinner: "A",
  winnerReason: "Product A (Prestige) scores higher on build quality, safety features, and has complete BIS certification including CRS registration.",
  recommendation: "For safety-critical appliances like induction cooktops, choose the product with complete BIS certification. Product A is worth the premium for the additional safety features and CRS registration.",
  warnings: ["Always verify ISI mark authenticity", "Check for BIS CRS R-number for electrical appliances"],
};

export const DEMO_SAFETY = {
  productIdentified: "Portable Electric Room Heater",
  overallRiskLevel: "medium",
  overallRiskScore: 55,
  riskBreakdown: {
    physicalHazards: {
      score: 40,
      risks: [
        { hazard: "Hot surface — burn risk on contact", severity: "high", likelihood: "likely", affectedGroup: "children" },
        { hazard: "Tip-over risk if placed on uneven surface", severity: "medium", likelihood: "possible", affectedGroup: "general" },
      ],
    },
    chemicalHazards: { score: 10, risks: [] },
    electricalHazards: {
      score: 60,
      risks: [
        { hazard: "Exposed heating element without adequate guard", severity: "high", likelihood: "possible", affectedGroup: "general" },
        { hazard: "Power cord rating adequacy uncertain", severity: "medium", likelihood: "possible", affectedGroup: "general" },
      ],
    },
    fireHazards: {
      score: 50,
      risks: [
        { hazard: "Proximity to curtains/fabric could ignite", severity: "critical", likelihood: "possible", affectedGroup: "general" },
      ],
    },
    biologicalHazards: { score: 0, risks: [] },
  },
  certificationGaps: [
    { standard: "IS 302-2-30", requirement: "Safety of household electrical appliances — Room heaters", status: "unclear", riskImpact: "Without ISI certification, safety of electrical components is unverified" },
  ],
  recallCheck: { similarRecalls: ["2023: Several uncertified Chinese room heaters recalled by BIS"], recallRisk: "medium" },
  ageRestrictions: { suitableForChildren: false, minimumAge: "14 years", reason: "Hot surfaces and electrical hazard" },
  environmentalRisk: { score: 40, concerns: ["High energy consumption", "No BEE star rating visible"], disposalAdvice: "Dispose at authorized e-waste collection center" },
  recommendations: {
    forConsumers: ["Keep 1m away from curtains/furniture", "Never leave unattended", "Use with circuit breaker"],
    forManufacturers: ["Obtain ISI certification (IS 302-2-30)", "Add tip-over safety switch", "Include adequate safety guards"],
    reportTo: ["BIS Helpline: 14100", "Consumer Forum: consumerhelpline.gov.in"],
  },
  urgentWarnings: ["Verify ISI mark before purchase", "Do not use near flammable materials"],
};

export const DEMO_INGREDIENTS = {
  productIdentified: "Packaged Instant Noodles",
  productType: "food",
  ingredientsFound: [
    { name: "Wheat Flour (Maida)", category: "base", safetyRating: "safe", bisStatus: "approved", details: "Refined wheat flour, commonly used in instant noodles", dailyLimit: "N/A" },
    { name: "Palm Oil", category: "fat", safetyRating: "caution", bisStatus: "approved", details: "Contains saturated fat; FSSAI regulated", dailyLimit: "Less than 20g/day recommended" },
    { name: "Monosodium Glutamate (MSG) E621", category: "flavoring", safetyRating: "caution", bisStatus: "approved", details: "Flavor enhancer; some people may be sensitive", dailyLimit: "Up to 30mg/kg body weight (FSSAI)" },
    { name: "Tartrazine (E102)", category: "colorant", safetyRating: "caution", bisStatus: "restricted", details: "Synthetic yellow color, can cause hyperactivity in children", dailyLimit: "7.5 mg/kg body weight (FSSAI)" },
    { name: "TBHQ (E319)", category: "preservative", safetyRating: "caution", bisStatus: "approved", details: "Tertiary butylhydroquinone — antioxidant preservative", dailyLimit: "0.7 mg/kg body weight" },
    { name: "Common Salt", category: "flavoring", safetyRating: "caution", bisStatus: "approved", details: "High sodium content per serving (~1000mg)", dailyLimit: "Less than 2000mg/day (WHO)" },
  ],
  harmfulIngredients: [
    { name: "Tartrazine (E102)", concern: "Linked to hyperactivity in children, allergic reactions in sensitive individuals", bannedIn: ["Norway", "Austria (partially)"], alternative: "Turmeric (natural yellow colorant)" },
  ],
  allergens: ["Wheat (Gluten)", "May contain traces of Soy"],
  fssaiCompliance: {
    compliant: true,
    issues: ["Sodium content per serving should be prominently displayed"],
    missingDeclarations: ["Front-of-pack nutrition labeling (recommended by FSSAI)"],
  },
  nutritionalConcerns: ["High sodium content (~1000mg per serving)", "Low fiber content", "High in refined carbohydrates", "Contains trans-fat precursors from palm oil"],
  overallSafetyScore: 65,
  certificationNeeded: ["FSSAI License", "ISI Mark (IS 11536 — Instant Noodles)"],
  recommendations: [
    "Limit consumption to 2-3 servings per week",
    "Add fresh vegetables to improve nutritional value",
    "Choose brands with lower sodium variants",
    "Check for FSSAI license number on the pack",
  ],
  healthAdvisory: "This product is safe for occasional consumption but is high in sodium and refined carbohydrates. Not recommended for daily consumption, especially for children and individuals with hypertension.",
};

export const DEMO_COMPLIANCE = {
  productName: "LED Bulb — 9W",
  productCategory: "Lighting Equipment",
  applicableStandards: [
    { isCode: "IS 16102 (Part 1):2012", title: "Self-ballasted LED Lamps for General Lighting — Safety Requirements", relevanceScore: 0.98, mandatory: true },
    { isCode: "IS 16102 (Part 2):2018", title: "Self-ballasted LED Lamps — Performance Requirements", relevanceScore: 0.95, mandatory: true },
    { isCode: "IS 10322 (Part 5/Sec 1)", title: "Limits for Harmonic Current Emissions", relevanceScore: 0.75, mandatory: false },
  ],
  overallScore: 72,
  status: "partially-compliant",
  gaps: [
    { id: "gap1", standard: "IS 16102 (Part 1)", requirement: "Insulation resistance test", currentStatus: "missing", severity: "critical", description: "No test report for insulation resistance between live parts and accessible parts" },
    { id: "gap2", standard: "IS 16102 (Part 2)", requirement: "Lumen maintenance at 6000hrs", currentStatus: "missing", severity: "major", description: "Lumen maintenance data over rated life not provided" },
    { id: "gap3", standard: "IS 16102 (Part 1)", requirement: "BIS Standard Mark on product", currentStatus: "missing", severity: "major", description: "ISI mark not visible on the product body" },
  ],
  recommendations: [
    { id: "rec1", type: "testing", title: "Get Insulation Resistance Testing", description: "Submit samples to NABL-accredited lab for IS 16102 Part 1 insulation tests", priority: "high", estimatedCost: "₹15,000 - ₹25,000", estimatedTime: "2-3 weeks" },
    { id: "rec2", type: "testing", title: "Lumen Maintenance Testing", description: "Submit for 6000-hour lumen maintenance test at ERTL or equivalent lab", priority: "high", estimatedCost: "₹30,000 - ₹50,000", estimatedTime: "6-8 months (accelerated)" },
    { id: "rec3", type: "labeling", title: "Apply for BIS Standard Mark", description: "Apply for ISI mark through BIS Manak portal (manakonline.bis.gov.in)", priority: "high", estimatedCost: "₹1,000 (application) + ₹10,000/year (marking fee)", estimatedTime: "3-6 months" },
  ],
};

export const DEMO_SIMULATE = {
  approvalProbability: 68,
  estimatedTimeline: "4-6 months",
  riskFactors: [
    { factor: "Missing safety test reports", impact: "high", mitigation: "Submit samples to NABL lab for complete IS testing" },
    { factor: "No prior BIS certification history", impact: "medium", mitigation: "First-time applicants may face additional scrutiny — ensure all documentation is thorough" },
    { factor: "Factory inspection scheduling delay", impact: "medium", mitigation: "Prepare factory quality systems in advance; maintain ISO 9001 or equivalent" },
  ],
  requiredTests: [
    { testName: "Safety & Performance Testing", standard: "IS 16102", estimatedCost: "₹50,000", duration: "3-4 weeks", labs: ["ERTL, Delhi", "NABL Lab, Mumbai", "STQC, Bangalore"] },
    { testName: "EMI/EMC Testing", standard: "IS 10322", estimatedCost: "₹25,000", duration: "1-2 weeks", labs: ["SAMEER, Chennai", "STQC, Kolkata"] },
    { testName: "Photometric Testing", standard: "IS 16102 Part 2", estimatedCost: "₹20,000", duration: "2 weeks", labs: ["ERTL, Delhi", "CPRI, Bangalore"] },
  ],
  overallAssessment: "The product has a moderate probability of BIS certification approval. Key gaps include missing safety test reports and lumen maintenance data. With proper testing and documentation, the application can be strengthened significantly. Recommend starting with safety testing at NABL-accredited labs.",
  nextSteps: [
    "Register on BIS Manak Online Portal (manakonline.bis.gov.in)",
    "Submit product samples to NABL-accredited testing lab",
    "Prepare factory quality documentation (ISO 9001 preferred)",
    "Fill Form V application with complete product specifications",
    "Pay application fee (₹1,000 online) and marking fee",
    "Prepare factory for BIS inspection visit",
  ],
  estimatedTotalCost: "₹1,50,000 - ₹3,00,000",
};

export const DEMO_QUALITY = {
  productIdentified: "Cotton T-Shirt",
  qualityScore: 72,
  qualityGrade: "B",
  visualDefects: [
    { defect: "Minor stitching irregularity at collar", severity: "minor", location: "Neckline seam" },
    { defect: "Slight color variation in dye", severity: "minor", location: "Lower hem area" },
  ],
  packagingQuality: { score: 80, observations: ["Properly folded", "Clean packaging", "Size label clearly visible"] },
  labelCompliance: { score: 70, missingItems: ["Care symbols (IS 1270)", "Fiber composition percentage"], presentItems: ["Brand name", "Size", "MRP", "Country of origin"] },
  materialAssessment: "Appears to be 100% cotton with medium thread count. Fabric feels consistent but dye application shows minor variation.",
  safetyObservations: ["No loose buttons or choking hazards", "Fabric appears non-flammable"],
  comparisonWithStandard: "Meets most requirements of IS 15370:2013 (Ready-made garments) but missing fiber composition declaration required under Textile (Consumer Protection) Rules.",
  recommendations: ["Add fiber composition label (IS 11612:1986)", "Include laundering care symbols (IS 1270:1993)", "Improve dye consistency in production"],
  overallVerdict: "Acceptable quality with minor improvements needed in labeling compliance and dye consistency.",
};

export const DEMO_DOCUMENT = {
  documentType: "BIS Application — Form V",
  completeness: 65,
  missingFields: ["Test report reference numbers", "Factory layout diagram", "Quality control plan", "List of raw material suppliers"],
  presentFields: ["Applicant details", "Product specifications", "Manufacturing process", "Fee payment proof"],
  errors: [
    { field: "Product Standard", issue: "Incorrect IS code cited — IS 16102:2012 vs latest IS 16102:2018", suggestion: "Update to latest standard revision IS 16102 (Part 1):2018" },
    { field: "Factory Address", issue: "PIN code does not match the district mentioned", suggestion: "Verify and correct PIN code — Noida, UP should be 201301-201310" },
  ],
  standards: ["IS 16102 (Part 1):2018", "IS 16102 (Part 2):2018"],
  readyForSubmission: false,
  estimatedProcessingTime: "8-12 weeks after corrections",
  suggestions: [
    "Attach NABL test reports with application",
    "Include factory quality management system certificate",
    "Add photographs of the production line",
    "Provide undertaking on raw material quality",
  ],
  requiredAttachments: ["NABL test reports", "Factory layout", "ISO 9001 certificate (if available)", "Raw material test certificates"],
  nextSteps: ["Correct the errors identified above", "Gather missing documents", "Re-submit through BIS Manak Online portal"],
};

export const DEMO_CHECKLIST = {
  productType: "LED Bulb",
  standards: ["IS 16102 (Part 1):2018", "IS 16102 (Part 2):2018"],
  checklist: [
    {
      category: "Documentation",
      items: [
        { item: "Form V Application", mandatory: true, description: "Complete BIS application form with all fields", estimatedCost: "₹1,000", timeline: "1 day" },
        { item: "Factory license copy", mandatory: true, description: "Valid factory license / Udyam registration", estimatedCost: "Free", timeline: "1 day" },
        { item: "ISO 9001 Certificate", mandatory: false, description: "Quality management system certification (recommended)", estimatedCost: "₹50,000 - ₹1,00,000", timeline: "3-6 months" },
      ],
    },
    {
      category: "Testing",
      items: [
        { item: "Safety testing (IS 16102 Part 1)", mandatory: true, description: "Complete safety testing at NABL lab", estimatedCost: "₹40,000 - ₹60,000", timeline: "3-4 weeks" },
        { item: "Performance testing (IS 16102 Part 2)", mandatory: true, description: "Photometric and electrical performance tests", estimatedCost: "₹25,000 - ₹40,000", timeline: "2-3 weeks" },
        { item: "EMC testing", mandatory: true, description: "Electromagnetic compatibility testing", estimatedCost: "₹20,000 - ₹30,000", timeline: "1-2 weeks" },
      ],
    },
    {
      category: "Labeling",
      items: [
        { item: "ISI mark on product", mandatory: true, description: "Standard mark with license number on product body and packaging", estimatedCost: "₹5,000 (tooling)", timeline: "1 week" },
        { item: "Product specifications on label", mandatory: true, description: "Wattage, voltage, lumen, color temp, CRI on label", estimatedCost: "₹2,000", timeline: "1 day" },
      ],
    },
  ],
  totalEstimatedCost: "₹1,50,000 - ₹3,00,000",
  totalTimeline: "4-8 months",
  certificationPath: ["Register on BIS Manak Portal", "Submit Form V & fees", "Get lab testing done", "Factory inspection by BIS", "Receive BIS License & begin marking"],
  requiredLabs: [
    { name: "ERTL (East)", location: "Kolkata", tests: ["Safety", "Performance"] },
    { name: "CPRI", location: "Bangalore", tests: ["Performance", "EMC"] },
    { name: "STQC", location: "Delhi", tests: ["Safety", "EMC"] },
  ],
  tips: ["Begin testing early — it's the longest step", "Keep raw material certificates ready for BIS inspection", "Maintain production records from day one"],
  commonRejectionReasons: ["Incomplete test reports", "Factory non-compliance during inspection", "Wrong IS code referenced in application"],
};

export const DEMO_VERIFY = {
  isAuthentic: true,
  confidence: 88,
  licenseNumber: "CM/L-8501234",
  manufacturer: "Hindustan Electric Ltd",
  validUntil: "2027-06-30",
  standardMark: "ISI Standard Mark",
  productIdentified: "Electric Iron (Dry)",
  standardCode: "IS 302-2-3",
  warnings: [],
  details: "The ISI mark appears authentic. The triangle shape proportions match the official BIS design. License number format (CM/L- prefix) is correct. Print quality is consistent with genuine marks — sharp lines, proper font. No obvious signs of counterfeiting.",
  verificationChecks: [
    { check: "Mark clarity and print quality", passed: true, note: "Sharp, clear printing consistent with genuine marks" },
    { check: "License number format (CM/L-)", passed: true, note: "Correct format — CM/L-8501234" },
    { check: "Standard mark design compliance", passed: true, note: "Triangle proportions and text placement match official BIS specification" },
    { check: "IS code reference visible", passed: true, note: "IS 302-2-3 clearly mentioned" },
  ],
};

export const DEMO_STANDARD_EXPLAIN = {
  simpleSummary: "This standard covers the safety and quality requirements for packaged drinking water in India. It ensures the water you buy is clean, safe to drink, and free from harmful chemicals or bacteria.",
  whyItMatters: "Every year, lakhs of Indians fall sick due to contaminated water. IS 10500 ensures that water sold in bottles or pouches meets strict safety benchmarks — protecting consumers from waterborne diseases.",
  keyPointsSimple: [
    "Water must pass 50+ tests for chemicals, bacteria, and minerals",
    "pH level must be between 6.5-8.5 (not too acidic, not too alkaline)",
    "No E. coli or coliform bacteria allowed (zero tolerance)",
    "Heavy metals like lead and arsenic must be below safe limits",
    "Packaging must have ISI mark, FSSAI license, and manufacturing details",
  ],
  commonMistakes: [
    "Not testing source water regularly",
    "Ignoring packaging and labeling requirements",
    "Missing FSSAI registration (even with ISI mark)",
    "Using non-food-grade packaging materials",
  ],
  costEstimate: "₹50,000 - ₹2,00,000 (including lab testing, application fees, and packaging changes)",
  timeEstimate: "3-6 months for full certification",
  helpfulTips: [
    "Start with NABL-accredited lab testing — BIS will accept these reports",
    "Apply for FSSAI registration simultaneously — saves time",
    "Join BIS MSME concession scheme for reduced fees",
    "Use BIS Manak Online portal for faster processing",
  ],
  relatedStandards: ["IS 14543 — Packaged Natural Mineral Water", "IS 10500 — Drinking Water Specification"],
};

export const DEMO_CHAT_CONSUMER = `Great question! Here are some key tips to check if a product is BIS certified:

**For ISI Mark products:**
1. Look for the triangular ISI mark on the product
2. Note the license number (starts with CM/L-)
3. Verify it at **bis.gov.in** → "Know Your Standards Mark" section

**For BIS Hallmarked jewellery:**
1. Look for the 6-digit HUID code on the jewellery
2. Verify on the **BIS Care app** (Android/iOS)
3. Or call the BIS helpline: **14100**

**For electronic products (CRS):**
1. Look for the BIS registration number (R-XXXXXXXX)
2. Check on bis.gov.in under "CRS Registration" section

**Tip:** If a product doesn't have the required BIS certification mark but claims to be ISI-marked, you can report it via:
- BIS helpline: **14100**  
- Consumer helpline: **1800-11-4000**
- Email: cmd@bis.gov.in

Stay safe! 🛡️`;

export const DEMO_CHAT_SELLER = `Here's a step-by-step guide for obtaining BIS certification for your product:

**Step 1: Identify Applicable Standard**
- Find the correct IS code for your product at bis.gov.in
- Check if your product falls under Compulsory Registration Scheme (CRS) or ISI Scheme

**Step 2: Pre-Testing**
- Get your product tested at a NABL-accredited laboratory
- Common labs: ERTL (Delhi, Mumbai, Kolkata), CPRI (Bangalore), STQC

**Step 3: Application**
- Register on **manakonline.bis.gov.in** (BIS Manak Online)
- Fill Form V (for ISI) or Form VI (for CRS)  
- Pay application fee: ₹1,000 (online)

**Step 4: Factory Inspection**
- BIS will schedule a factory inspection
- Keep quality records, raw material certificates, and testing equipment ready

**Step 5: Grant of License**
- Upon successful inspection and test reports, BIS grants the license
- Validity: 1-5 years depending on scheme

**MSME Benefits:**
- 50% concession on application and marking fees
- Fast-track processing available
- Udyam registration accepted

**Estimated Cost:** ₹1-3 lakhs (testing + fees)
**Timeline:** 3-6 months typically`;

// Helper to get demo data by feature type
export function getDemoData(feature: string, subType?: string): any {
  switch (feature) {
    case "scan":
      if (subType === "product") return DEMO_SCAN_PRODUCT;
      if (subType === "label") return DEMO_SCAN_LABEL;
      if (subType === "barcode") return DEMO_SCAN_BARCODE;
      return DEMO_SCAN_HALLMARK;
    case "describe":
      return DEMO_DESCRIBE;
    case "compare":
      return DEMO_COMPARE;
    case "safety":
    case "risk":
      return DEMO_SAFETY;
    case "ingredients":
      return DEMO_INGREDIENTS;
    case "compliance":
    case "analyze":
      return DEMO_COMPLIANCE;
    case "simulate":
      return DEMO_SIMULATE;
    case "quality":
      return DEMO_QUALITY;
    case "documents":
      return DEMO_DOCUMENT;
    case "checklist":
      return DEMO_CHECKLIST;
    case "verify":
      return DEMO_VERIFY;
    case "standards":
      return DEMO_STANDARD_EXPLAIN;
    case "chat":
      return subType === "seller" ? DEMO_CHAT_SELLER : DEMO_CHAT_CONSUMER;
    default:
      return null;
  }
}
