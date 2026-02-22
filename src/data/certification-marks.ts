// Comprehensive Indian Certification Marks & Hallmarks Database

export interface CertificationMark {
  id: string;
  name: string;
  shortName: string;
  organization: string;
  logo: string; // emoji placeholder
  category: string;
  description: string;
  applicableTo: string[];
  howToIdentify: string[];
  verificationSteps: string[];
  officialWebsite: string;
  contactInfo: string;
  mandatoryFor: string[];
  penaltyForMisuse: string;
  commonCounterfeitSigns: string[];
  validityPeriod: string;
  renewalProcess: string;
}

export const CERTIFICATION_MARKS: CertificationMark[] = [
  {
    id: "isi",
    name: "ISI Mark (Indian Standards Institute Mark)",
    shortName: "ISI",
    organization: "Bureau of Indian Standards (BIS)",
    logo: "🛡️",
    category: "Product Safety & Quality",
    description:
      "The ISI mark is a certification mark for industrial products in India. It certifies that a product conforms to an Indian Standard (IS) developed by BIS. It is the most recognized quality mark in India.",
    applicableTo: [
      "Electrical appliances",
      "Cement",
      "Steel products",
      "LPG cylinders & valves",
      "Packaged drinking water",
      "Food products",
      "Automotive parts",
      "Cables and wires",
      "Kitchen appliances",
      "Water heaters",
      "Switches and sockets",
    ],
    howToIdentify: [
      "Triangular ISI logo with IS standard number",
      "License number starting with CM/L-",
      "Standard number (e.g., IS 1293)",
      "Manufacturer's name and address",
      "Clear printing without smudging",
      "Holographic sticker on some products (newer ones)",
    ],
    verificationSteps: [
      "Check the CM/L licence number on the product",
      "Visit BIS Care app or website to verify licence",
      "Call BIS helpline: 14100",
      "Verify IS standard number matches the product type",
      "Check for holographic security features",
      "Compare ISI mark proportions with official design",
    ],
    officialWebsite: "https://www.bis.gov.in",
    contactInfo: "Toll-free: 14100 | Email: cmd2@bis.gov.in",
    mandatoryFor: [
      "Cement (IS 269, IS 455, IS 8112, IS 12269)",
      "Electrical appliances (IS 302, IS 616)",
      "LPG cylinders (IS 3196)",
      "Packaged drinking water (IS 14543)",
      "Steel (IS 1786, IS 2062)",
      "Helmets (IS 4151, IS 15778)",
      "PVC pipes (IS 4985, IS 13592)",
      "Auto glass (IS 2553)",
      "Household appliances",
      "Cables and wires (IS 694, IS 5831)",
    ],
    penaltyForMisuse:
      "Imprisonment up to 2 years and/or fine up to ₹2,00,000 under BIS Act 2016. Repeat offence: up to 5 years and ₹5,00,000.",
    commonCounterfeitSigns: [
      "Blurry or low-quality printing of the ISI logo",
      "Incorrect triangle proportions in the ISI mark",
      "Missing or invalid CM/L licence number",
      "Misspelled text around the mark",
      "Mark printed on a sticker that can be peeled off easily",
      "No embossing where it should be embossed",
      "Wrong IS standard number for the product type",
      "No manufacturer details near the mark",
    ],
    validityPeriod: "1-5 years (varies by product, typically 1 year renewable)",
    renewalProcess:
      "Apply online through BIS Manak portal. Factory inspection and sample testing required for renewal.",
  },
  {
    id: "bis-hallmark",
    name: "BIS Hallmark for Gold/Silver Jewellery",
    shortName: "Hallmark",
    organization: "Bureau of Indian Standards (BIS)",
    logo: "💎",
    category: "Precious Metals",
    description:
      "BIS Hallmarking certifies the purity of gold and silver jewellery. Since June 2021, hallmarking has been made mandatory for gold jewellery sold in India. Each hallmarked piece gets a unique HUID (Hallmark Unique Identification) number.",
    applicableTo: [
      "Gold jewellery (14K, 18K, 20K, 22K, 24K)",
      "Silver jewellery and articles",
      "Gold coins and bars",
      "Silver coins and bars",
    ],
    howToIdentify: [
      "BIS logo (triangle with ISI)",
      "Purity grade (e.g., 916 for 22K gold, 999 for 24K)",
      "HUID - 6 character alphanumeric code (mandatory since July 2021)",
      "Assaying Centre's identification mark",
      "Jeweller's identification mark",
      "Laser engraved on the jewellery piece",
    ],
    verificationSteps: [
      "Look for HUID (6-character code) on the jewellery",
      "Download BIS Care app and scan/enter the HUID",
      "Verify jeweller's registration on BIS portal",
      "Check certificate provided with purchase",
      "Visit any BIS-recognized Assaying & Hallmarking Centre",
      "Call BIS helpline 14100 for verification",
    ],
    officialWebsite: "https://bis.gov.in/hallmarking/",
    contactInfo: "Toll-free: 14100 | App: BIS Care",
    mandatoryFor: [
      "Gold jewellery of 14K, 18K, 20K, 22K, 24K",
      "Gold artefacts",
      "Silver jewellery (upcoming phases)",
    ],
    penaltyForMisuse:
      "Fine of minimum ₹1,00,000 and imprisonment up to 1 year. Cancellation of BIS licence for the jeweller.",
    commonCounterfeitSigns: [
      "Missing HUID number",
      "HUID that doesn't verify on BIS Care app",
      "Manually stamped marks instead of laser engraving",
      "Purity grade not matching actual gold content",
      "Jeweller not registered with BIS",
      "No accompanying hallmark certificate",
      "Unclear or partially visible markings",
    ],
    validityPeriod: "Permanent (HUID is unique and traceable forever)",
    renewalProcess:
      "Not applicable for individual pieces. Jewellers must maintain their BIS registration annually.",
  },
  {
    id: "agmark",
    name: "AGMARK (Agricultural Produce Grading & Marking)",
    shortName: "AGMARK",
    organization: "Directorate of Marketing & Inspection (DMI), Ministry of Agriculture",
    logo: "🌾",
    category: "Agricultural Products",
    description:
      "AGMARK is a certification mark for agricultural products in India, assuring quality and purity. It covers grading standards for commodities like ghee, spices, honey, pulses, and other agricultural produce.",
    applicableTo: [
      "Ghee and butter",
      "Spices (turmeric, chilli, cumin, etc.)",
      "Honey",
      "Pulses and cereals",
      "Vegetable oils",
      "Wheat flour (atta)",
      "Vermicelli",
      "Rice",
    ],
    howToIdentify: [
      "AGMARK logo (circular with text 'AGMARK')",
      "Grade designation (Special, General, Standard)",
      "Certificate number",
      "Validity date",
      "Name and address of packer/manufacturer",
      "Net weight and batch number",
    ],
    verificationSteps: [
      "Check AGMARK logo and grade on packaging",
      "Verify certificate number on DMI website",
      "Check expiry date of AGMARK certificate",
      "Contact DMI regional office for verification",
      "Report suspect products on AGMARK portal",
    ],
    officialWebsite: "https://agmarknet.gov.in",
    contactInfo: "DMI Headquarters: 011-23382216",
    mandatoryFor: [
      "All AGMARK certified products must meet grading standards",
      "Voluntary for most products but mandatory for export of certain commodities",
    ],
    penaltyForMisuse:
      "Imprisonment up to 3 years and/or fine under Agricultural Produce (Grading and Marking) Act, 1937.",
    commonCounterfeitSigns: [
      "Faded or unclear AGMARK logo",
      "No grade designation",
      "Expired certificate number",
      "Products not matching the declared grade",
      "Missing batch number or manufacturing date",
    ],
    validityPeriod: "1 year (renewable annually)",
    renewalProcess: "Apply through DMI regional office with sample testing.",
  },
  {
    id: "fssai",
    name: "FSSAI License Mark",
    shortName: "FSSAI",
    organization: "Food Safety and Standards Authority of India",
    logo: "🍽️",
    category: "Food Safety",
    description:
      "FSSAI licence mark is mandatory for all food businesses in India. The 14-digit licence number ensures the food product meets safety and quality standards set by FSSAI.",
    applicableTo: [
      "All packaged food products",
      "Restaurants and food outlets",
      "Food manufacturers",
      "Food importers",
      "Food storage facilities",
      "Food transporters",
      "Online food delivery platforms",
      "Catering services",
    ],
    howToIdentify: [
      "FSSAI logo (green and white circular mark)",
      "14-digit FSSAI licence/registration number",
      "Text: 'License No. / Reg. No.'",
      "Displayed prominently on food packaging",
      "Displayed at food premises entrance",
    ],
    verificationSteps: [
      "Note the 14-digit FSSAI number from the product",
      "Visit foscos.fssai.gov.in and use 'Verify License' feature",
      "Call FSSAI helpline: 1800-112-100",
      "Check FSSAI Food Safety Connect app",
      "Verify manufacturer details match registration",
    ],
    officialWebsite: "https://www.fssai.gov.in",
    contactInfo: "Toll-free: 1800-112-100 | Email: info@fssai.gov.in",
    mandatoryFor: [
      "All food manufacturing businesses",
      "Food packaging and labelling",
      "Restaurants and eateries",
      "Food transport and storage",
      "Online food aggregators",
      "Food importers",
    ],
    penaltyForMisuse:
      "Fine up to ₹5,00,000 and imprisonment up to 6 months under Food Safety and Standards Act, 2006.",
    commonCounterfeitSigns: [
      "Invalid or non-existent 14-digit number",
      "Wrong FSSAI logo design or colors",
      "License number belonging to a different business",
      "Expired FSSAI licence",
      "Missing mandatory information on food labels",
    ],
    validityPeriod: "1-5 years depending on licence type",
    renewalProcess: "Apply online through FoSCoS portal before expiry.",
  },
  {
    id: "bee-star",
    name: "BEE Star Rating Label",
    shortName: "BEE Star",
    organization: "Bureau of Energy Efficiency, Ministry of Power",
    logo: "⭐",
    category: "Energy Efficiency",
    description:
      "The BEE star rating label indicates the energy efficiency of electrical appliances. Products are rated from 1 star (least efficient) to 5 stars (most efficient), helping consumers make informed purchasing decisions.",
    applicableTo: [
      "Air conditioners",
      "Refrigerators",
      "Ceiling fans",
      "LED lamps",
      "Washing machines",
      "Television sets",
      "Geysers/Water heaters",
      "Submersible pump sets",
      "Computers/Laptops",
      "Motors",
    ],
    howToIdentify: [
      "Rectangular label with star ratings (1-5 stars)",
      "BEE logo at the top",
      "Annual energy consumption in kWh",
      "Star rating clearly shown with filled stars",
      "Product-specific energy data",
      "Unique label registration number",
    ],
    verificationSteps: [
      "Check star rating label on the appliance",
      "Verify registration number on BEE website",
      "Compare energy consumption data with BEE database",
      "Visit beeindia.gov.in for label verification",
      "Check if the label validity period is current",
    ],
    officialWebsite: "https://beeindia.gov.in",
    contactInfo: "011-2617 9699 | Email: bee@nic.in",
    mandatoryFor: [
      "Air conditioners (all types)",
      "Frost-free refrigerators",
      "Tubular fluorescent lamps",
      "LED lamps",
      "Ceiling fans",
      "Direct cool refrigerators",
      "Color TVs",
      "Washing machines",
    ],
    penaltyForMisuse:
      "Fine and imprisonment under Energy Conservation Act, 2001. Products can be seized.",
    commonCounterfeitSigns: [
      "Stars not matching BEE database records",
      "Invalid registration number",
      "Wrong energy consumption figures",
      "Poor print quality label",
      "Label not matching the product model",
      "Expired label validity period",
    ],
    validityPeriod: "1-2 years (revised periodically)",
    renewalProcess: "Apply through BEE portal with updated test reports.",
  },
  {
    id: "ecomark",
    name: "Ecomark Certification",
    shortName: "Ecomark",
    organization: "Bureau of Indian Standards (BIS) & MoEFCC",
    logo: "🌿",
    category: "Environment",
    description:
      "Ecomark is an environmental certification mark awarded to products that meet specific environmental criteria and Indian quality standards. The earthen pot symbol (matka) indicates the product is environment-friendly.",
    applicableTo: [
      "Paper products",
      "Soaps and detergents",
      "Paints and coatings",
      "Plastic products",
      "Cosmetics",
      "Textiles",
      "Food items",
      "Electrical/electronic goods",
      "Packaging materials",
      "Lubricants and oils",
    ],
    howToIdentify: [
      "Earthen pot (matka/surahi) logo",
      "Text 'Ecomark' below the logo",
      "BIS licence number",
      "IS standard number for the product",
    ],
    verificationSteps: [
      "Look for the earthen pot symbol on product",
      "Verify BIS licence number",
      "Check product against IS environmental standards",
      "Contact BIS for verification",
    ],
    officialWebsite: "https://www.bis.gov.in",
    contactInfo: "BIS: 14100 | MoEFCC website",
    mandatoryFor: ["Voluntary certification - not mandatory for any product"],
    penaltyForMisuse:
      "Same as ISI mark misuse under BIS Act 2016.",
    commonCounterfeitSigns: [
      "Incorrect earthen pot design",
      "Missing BIS licence number",
      "No IS standard reference",
      "Sticker-type mark instead of printed",
    ],
    validityPeriod: "1-3 years (renewable)",
    renewalProcess: "Through BIS with environmental compliance audit.",
  },
  {
    id: "wool-mark",
    name: "Woolmark Certification",
    shortName: "Woolmark",
    organization: "The Woolmark Company (verified in India by BIS/Textile Committee)",
    logo: "🧶",
    category: "Textiles",
    description:
      "The Woolmark symbol certifies that textile products are made of 100% new wool and meet quality standards for durability, colorfastness, and shrinkage resistance.",
    applicableTo: [
      "Woolen garments",
      "Woolen blankets",
      "Woolen carpets",
      "Woolen shawls",
      "Woolen yarn",
    ],
    howToIdentify: [
      "Stylized wool skein symbol",
      "Text 'WOOLMARK' or 'WOOL BLEND'",
      "Licence number on label",
      "Care instruction compliance",
    ],
    verificationSteps: [
      "Check for Woolmark logo on garment label",
      "Verify through Woolmark Company website",
      "Contact Textile Committee of India",
    ],
    officialWebsite: "https://www.woolmark.com",
    contactInfo: "Textile Committee: 022-2659 0260",
    mandatoryFor: ["Voluntary certification"],
    penaltyForMisuse: "Legal action under trademark laws and consumer protection act.",
    commonCounterfeitSigns: [
      "Incorrect wool skein design",
      "Printed on cheap labels",
      "Blended fabrics claiming 100% wool",
      "No licence number",
    ],
    validityPeriod: "Annual licence",
    renewalProcess: "Through Woolmark Company with quality testing.",
  },
  {
    id: "epeat",
    name: "EPEAT (Electronic Product Environmental Assessment Tool)",
    shortName: "EPEAT",
    organization: "Global Electronics Council (recognized in India)",
    logo: "💻",
    category: "Electronics & Environment",
    description:
      "EPEAT is an environmental rating system for electronic products. Products are rated Bronze, Silver, or Gold based on environmental criteria including energy efficiency, recyclability, and reduced use of toxic materials.",
    applicableTo: [
      "Computers and laptops",
      "Monitors and displays",
      "Printers and copiers",
      "Televisions",
      "Mobile phones",
      "Servers",
    ],
    howToIdentify: [
      "EPEAT logo with tier (Bronze/Silver/Gold)",
      "Registration number on EPEAT registry",
      "Manufacturer declaration",
    ],
    verificationSteps: [
      "Check EPEAT registry at epeat.net",
      "Verify product model and manufacturer",
      "Check tier rating authenticity",
    ],
    officialWebsite: "https://www.epeat.net",
    contactInfo: "Via EPEAT website",
    mandatoryFor: ["Voluntary, but required for government procurement in many countries"],
    penaltyForMisuse: "De-registration from EPEAT registry and legal action.",
    commonCounterfeitSigns: [
      "Product not found in EPEAT registry",
      "Wrong tier claimed",
      "Outdated registration",
    ],
    validityPeriod: "Continuous with annual verification",
    renewalProcess: "Through EPEAT portal with updated compliance data.",
  },
  {
    id: "ce-mark",
    name: "CE Marking (for products sold/imported in India)",
    shortName: "CE Mark",
    organization: "European Conformity (relevant for imports into India)",
    logo: "🇪🇺",
    category: "International Safety",
    description:
      "CE marking indicates conformity with health, safety, and environmental protection standards for products sold within the European Economic Area. Many imported products in India carry this mark alongside ISI/BIS marks.",
    applicableTo: [
      "Imported electronics",
      "Medical devices",
      "Machinery",
      "Toys",
      "Personal protective equipment",
      "Construction products",
    ],
    howToIdentify: [
      "CE letters with specific proportions",
      "Minimum 5mm height",
      "Must be visible and legible",
      "Notified Body number (if applicable)",
      "CE and China Export (fake CE) have different spacing",
    ],
    verificationSteps: [
      "Check letter proportions (CE vs China Export)",
      "Verify with manufacturer's Declaration of Conformity",
      "Check Notified Body number in EU database (NANDO)",
      "Note: CE alone is NOT sufficient for Indian market - ISI/BIS also required",
    ],
    officialWebsite: "https://ec.europa.eu/growth/single-market/ce-marking_en",
    contactInfo: "Check through respective EU notified bodies",
    mandatoryFor: ["Products sold in EU/EEA (also seen on Indian imports)"],
    penaltyForMisuse:
      "Varies by EU member state. Not enforceable in India but affects import clearance.",
    commonCounterfeitSigns: [
      "Letters too close together (China Export fake)",
      "Inconsistent size or proportions",
      "No Declaration of Conformity available",
      "No Notified Body reference",
    ],
    validityPeriod: "Continuous (as long as product meets directives)",
    renewalProcess: "Self-declaration with periodic testing.",
  },
  {
    id: "silk-mark",
    name: "Silk Mark",
    shortName: "Silk Mark",
    organization: "Silk Mark Organisation of India (SMOI), Central Silk Board",
    logo: "🧵",
    category: "Textiles",
    description:
      "Silk Mark certifies that a textile product is made of pure natural silk. It protects consumers from being sold artificial or mixed fiber products at silk prices.",
    applicableTo: [
      "Silk sarees",
      "Silk fabrics",
      "Silk garments",
      "Silk furnishings",
    ],
    howToIdentify: [
      "Silk Mark holographic label",
      "Unique serial number on the label",
      "SMOI authorized dealer tag",
      "Tamper-evident sticker",
    ],
    verificationSteps: [
      "Check holographic Silk Mark label",
      "Verify serial number on SMOI website or app",
      "Buy from authorized Silk Mark retailers",
      "Contact Central Silk Board for verification",
    ],
    officialWebsite: "https://silkmarkindia.com",
    contactInfo: "Central Silk Board: 080-2628 2186",
    mandatoryFor: ["Voluntary but recommended for all pure silk products"],
    penaltyForMisuse: "Legal action under Consumer Protection Act and trademark laws.",
    commonCounterfeitSigns: [
      "Non-holographic label (plain printed)",
      "No serial number",
      "Label that easily peels off",
      "Retailer not authorized by SMOI",
    ],
    validityPeriod: "Per product (permanent once applied)",
    renewalProcess: "Manufacturers renew SMOI membership annually.",
  },
  {
    id: "bis-cem",
    name: "BIS Compulsory Registration (CRS) for Electronics",
    shortName: "BIS CRS",
    organization: "Bureau of Indian Standards (BIS)",
    logo: "📱",
    category: "Electronics",
    description:
      "BIS Compulsory Registration Scheme (CRS) is mandatory for electronic and IT products sold in India. Products must be tested and registered with BIS before sale. The R-number is displayed on the product.",
    applicableTo: [
      "Mobile phones and tablets",
      "Laptops and notebooks",
      "LED luminaires and lamps",
      "Power banks",
      "Smart watches",
      "Chargers and adapters",
      "Switches and sockets",
      "Set-top boxes",
      "Printers",
      "Microwave ovens",
      "Smart speakers",
    ],
    howToIdentify: [
      "R-XXXXX registration number on product",
      "BIS standard mark / self-declaration",
      "IS standard number reference",
      "Importer/manufacturer details",
      "Test report number",
    ],
    verificationSteps: [
      "Note the R-number from the product",
      "Verify on BIS CRS portal: crsbis.in",
      "Check if product model matches registration",
      "Verify testing lab accreditation",
      "Contact BIS for authenticity confirmation",
    ],
    officialWebsite: "https://crsbis.in",
    contactInfo: "BIS: 14100 | CRS Portal helpdesk",
    mandatoryFor: [
      "All electronics/IT products under CRS schedule",
      "Mobile phones (IS 16333)",
      "LED products (IS 16102)",
      "Power adapters (IS 616)",
      "Laptops (IS 13252)",
      "Microwave ovens (IS 302-2-25)",
    ],
    penaltyForMisuse:
      "Seizure of products, fine up to ₹2,00,000 and imprisonment up to 2 years under BIS Act.",
    commonCounterfeitSigns: [
      "No R-number on the product",
      "R-number not found in BIS database",
      "R-number belonging to a different product",
      "Missing test report references",
      "Product sold without any BIS marking",
    ],
    validityPeriod: "2 years from date of registration",
    renewalProcess: "Apply online on BIS CRS portal with fresh test reports.",
  },
];

export const MARK_CATEGORIES = [
  "Product Safety & Quality",
  "Precious Metals",
  "Agricultural Products",
  "Food Safety",
  "Energy Efficiency",
  "Environment",
  "Textiles",
  "Electronics",
  "Electronics & Environment",
  "International Safety",
];

export function searchMarks(query: string): CertificationMark[] {
  const q = query.toLowerCase();
  return CERTIFICATION_MARKS.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.shortName.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.applicableTo.some((a) => a.toLowerCase().includes(q))
  );
}

export function getMarkById(id: string): CertificationMark | undefined {
  return CERTIFICATION_MARKS.find((m) => m.id === id);
}

export function getMarksByCategory(category: string): CertificationMark[] {
  return CERTIFICATION_MARKS.filter((m) => m.category === category);
}
