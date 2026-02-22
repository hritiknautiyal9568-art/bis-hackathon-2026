// BIS Standards Database - Common Indian Standards
export interface BISStandard {
  id: string;
  isCode: string;
  title: string;
  category: string;
  description: string;
  keyRequirements: string[];
  applicableProducts: string[];
  mandatoryCertification: boolean;
  lastRevised: string;
  testingLabs: string[];
}

export const BIS_STANDARDS: BISStandard[] = [
  {
    id: "1",
    isCode: "IS 1077",
    title: "Common Burnt Clay Building Bricks",
    category: "Construction Materials",
    description: "Specification for common burnt clay building bricks including dimensions, compressive strength, water absorption, and efflorescence requirements.",
    keyRequirements: [
      "Minimum compressive strength of 3.5 N/mm²",
      "Water absorption not more than 20%",
      "Dimensional tolerance ±3%",
      "No efflorescence (moderate acceptable)",
      "Uniform color and shape"
    ],
    applicableProducts: ["Bricks", "Building Blocks", "Clay Products", "Construction Materials"],
    mandatoryCertification: true,
    lastRevised: "2022",
    testingLabs: ["NABL Accredited Labs", "BIS Recognized Labs"]
  },
  {
    id: "2",
    isCode: "IS 2062",
    title: "Hot Rolled Low, Medium and High Tensile Structural Steel",
    category: "Steel & Metals",
    description: "Specification for hot rolled low, medium and high tensile structural steel plates, strips, shapes and sections.",
    keyRequirements: [
      "Yield stress minimum 250 MPa (Grade E250)",
      "Tensile strength 410 MPa minimum",
      "Elongation minimum 23%",
      "Chemical composition limits for C, Mn, S, P",
      "Bend test compliance"
    ],
    applicableProducts: ["Steel Plates", "Steel Strips", "Steel Sections", "Structural Steel", "TMT Bars"],
    mandatoryCertification: true,
    lastRevised: "2011",
    testingLabs: ["NABL Labs", "RDSO Labs", "Steel Authority Labs"]
  },
  {
    id: "3",
    isCode: "IS 10500",
    title: "Drinking Water Specification",
    category: "Food & Water",
    description: "Indian Standard for drinking water quality parameters including physical, chemical, and bacteriological requirements.",
    keyRequirements: [
      "pH value 6.5 to 8.5",
      "Total dissolved solids max 500 mg/l",
      "Turbidity max 1 NTU",
      "Total hardness max 200 mg/l",
      "E. coli and coliform absent",
      "Residual chlorine 0.2 mg/l minimum"
    ],
    applicableProducts: ["Drinking Water", "Packaged Water", "Mineral Water", "Water Purifiers"],
    mandatoryCertification: true,
    lastRevised: "2012",
    testingLabs: ["FSSAI Labs", "NABL Water Testing Labs"]
  },
  {
    id: "4",
    isCode: "IS 616",
    title: "Safety Requirements for Household Electrical Appliances",
    category: "Electronics & Electrical",
    description: "Specification covering safety requirements for household and similar electrical appliances including insulation, grounding, and leakage current.",
    keyRequirements: [
      "Leakage current < 0.75 mA",
      "Insulation resistance > 2 MΩ",
      "Earthing continuity resistance < 0.1 Ω",
      "Temperature rise limits compliance",
      "Mechanical strength of enclosure",
      "IP rating as per application"
    ],
    applicableProducts: ["Electric Iron", "Mixer Grinder", "Water Heater", "Electric Kettle", "Room Heater", "Toaster"],
    mandatoryCertification: true,
    lastRevised: "2017",
    testingLabs: ["ERTL", "STQC", "BIS Licensed Labs"]
  },
  {
    id: "5",
    isCode: "IS 9000",
    title: "Basic Environmental Testing Procedures for Electronics",
    category: "Electronics & Electrical",
    description: "Environmental testing procedures for electronic and electrical products covering temperature, humidity, vibration, and shock tests.",
    keyRequirements: [
      "Temperature cycling -10°C to +55°C",
      "Humidity test at 93% RH",
      "Vibration test 10-500 Hz",
      "Shock test 30g for 11ms",
      "Salt spray test for 48 hours",
      "Dust protection test"
    ],
    applicableProducts: ["Electronic Components", "PCBs", "Mobile Phones", "Laptops", "LED Lights", "Power Supplies"],
    mandatoryCertification: false,
    lastRevised: "2020",
    testingLabs: ["ERTL", "NABL Electronics Labs"]
  },
  {
    id: "6",
    isCode: "IS 15778",
    title: "Helmet for Two-Wheeler Riders",
    category: "Automotive & Safety",
    description: "Requirements for protective helmets for riders of two-wheeled motor vehicles covering impact absorption, penetration resistance, and retention system.",
    keyRequirements: [
      "Impact absorption: Peak deceleration < 300g",
      "Penetration resistance: No contact with headform",
      "Retention system strength > 300 N",
      "Peripheral vision minimum 105°",
      "Shell material: ABS/Polycarbonate/Fiberglass",
      "Weight not more than 1.5 kg"
    ],
    applicableProducts: ["Two-Wheeler Helmets", "Motorcycle Helmets", "Scooter Helmets"],
    mandatoryCertification: true,
    lastRevised: "2020",
    testingLabs: ["ARAI", "ICAT", "BIS Recognized Labs"]
  },
  {
    id: "7",
    isCode: "IS 7328",
    title: "Packaged Natural Mineral Water",
    category: "Food & Water",
    description: "Specification for packaged natural mineral water covering source requirements, treatment, composition, and packaging.",
    keyRequirements: [
      "TDS between 150-500 mg/l",
      "pH 6.5-8.5",
      "No treatment except permitted ones",
      "Microbiological safety parameters",
      "Source protection requirements",
      "Packaging material compliance"
    ],
    applicableProducts: ["Mineral Water", "Packaged Water", "Spring Water"],
    mandatoryCertification: true,
    lastRevised: "2019",
    testingLabs: ["FSSAI Labs", "NABL Labs"]
  },
  {
    id: "8",
    isCode: "IS 13252",
    title: "Unplasticized PVC Pipes for Potable Water",
    category: "Plastics & Polymers",
    description: "Specification for unplasticized PVC pipes for potable water supply covering dimensions, mechanical properties, and chemical resistance.",
    keyRequirements: [
      "Minimum burst pressure 42 bar",
      "Vicat softening temperature > 76°C",
      "Opacity test compliance",
      "Dimensional tolerance as per table",
      "Impact resistance at 0°C",
      "Lead content < 1 ppm",
      "Cadmium content < 0.1 ppm"
    ],
    applicableProducts: ["PVC Pipes", "Water Supply Pipes", "Plumbing Pipes"],
    mandatoryCertification: true,
    lastRevised: "2020",
    testingLabs: ["CIPET", "NABL Polymer Labs"]
  },
  {
    id: "9",
    isCode: "IS 1498",
    title: "Classification and Identification of Soils",
    category: "Civil Engineering",
    description: "Classification and identification of soils for general engineering purposes using grain size and plasticity characteristics.",
    keyRequirements: [
      "Grain size distribution analysis",
      "Atterberg limits determination",
      "Soil classification as per IS system",
      "Field identification procedures",
      "Organic content assessment"
    ],
    applicableProducts: ["Soil Testing", "Construction Sites", "Foundation Design", "Earth Works"],
    mandatoryCertification: false,
    lastRevised: "2017",
    testingLabs: ["Geotechnical Labs", "NABL Soil Testing Labs"]
  },
  {
    id: "10",
    isCode: "IS 5831",
    title: "PVC Insulated Cables for Working Voltages up to 1100V",
    category: "Electronics & Electrical",
    description: "Specification for PVC insulated cables for working voltages up to and including 1100V covering construction, testing, and marking requirements.",
    keyRequirements: [
      "Conductor resistance as per table",
      "Insulation resistance > 50 MΩ·km",
      "Voltage test at 2500V for 5 min",
      "Hot set test compliance",
      "Aging test at 100°C for 168 hours",
      "Flame retardant properties"
    ],
    applicableProducts: ["Electrical Cables", "Wiring Cables", "Power Cables", "House Wiring"],
    mandatoryCertification: true,
    lastRevised: "2020",
    testingLabs: ["ERDA", "CPRI", "NABL Cable Labs"]
  },
  {
    id: "11",
    isCode: "IS 4984",
    title: "High Density Polyethylene Pipes for Water Supply",
    category: "Plastics & Polymers",
    description: "Specification for high density polyethylene pipes for water supply covering material, dimensions, and performance requirements.",
    keyRequirements: [
      "MFI value 0.2-1.4 g/10min",
      "Density 940-965 kg/m³",
      "Tensile strength > 19 MPa",
      "Elongation at break > 600%",
      "Hydrostatic pressure test",
      "Thermal stability > 20 min"
    ],
    applicableProducts: ["HDPE Pipes", "Water Pipes", "Irrigation Pipes", "Drainage Pipes"],
    mandatoryCertification: true,
    lastRevised: "2017",
    testingLabs: ["CIPET", "NABL Polymer Labs"]
  },
  {
    id: "12",
    isCode: "IS 9283",
    title: "Specification for Packaged Drinking Water",
    category: "Food & Water",
    description: "Specification covering requirements for packaged drinking water (excluding mineral water) for direct consumption.",
    keyRequirements: [
      "TDS max 500 mg/l",
      "pH 6.5-8.5",
      "Arsenic max 0.01 mg/l",
      "Fluoride max 1.0 mg/l",
      "Total plate count < 50/ml",
      "Coliform organisms absent in 100ml",
      "Ozone/UV treatment permitted"
    ],
    applicableProducts: ["Packaged Drinking Water", "Bottled Water", "Water Pouches"],
    mandatoryCertification: true,
    lastRevised: "2023",
    testingLabs: ["FSSAI Labs", "NABL Water Labs"]
  },
  {
    id: "13",
    isCode: "IS 8112",
    title: "Ordinary Portland Cement, 43 Grade",
    category: "Construction Materials",
    description: "Specification for 43 grade ordinary Portland cement covering chemical composition, physical requirements, and testing methods.",
    keyRequirements: [
      "Compressive strength: 43 MPa at 28 days",
      "Initial setting time > 30 minutes",
      "Final setting time < 600 minutes",
      "Soundness < 10mm (Le Chatelier)",
      "Loss on ignition < 5%",
      "MgO content < 6%"
    ],
    applicableProducts: ["Cement", "OPC Cement", "Portland Cement", "Construction Cement"],
    mandatoryCertification: true,
    lastRevised: "2013",
    testingLabs: ["NCB Labs", "NABL Construction Labs"]
  },
  {
    id: "14",
    isCode: "IS 16046",
    title: "LED Luminaires for General Lighting",
    category: "Electronics & Electrical",
    description: "Performance requirements for LED luminaires used in general lighting applications including efficacy, life, and safety.",
    keyRequirements: [
      "Luminous efficacy > 90 lm/W",
      "Lumen maintenance > 70% at 50,000 hrs",
      "Power factor > 0.9",
      "THD < 15%",
      "Color rendering index > 80",
      "Surge protection 2.5 kV",
      "Operating temperature -10°C to +40°C"
    ],
    applicableProducts: ["LED Bulbs", "LED Tubes", "LED Panel Lights", "LED Street Lights", "LED Downlights"],
    mandatoryCertification: true,
    lastRevised: "2021",
    testingLabs: ["ERTL", "BIS Recognized Labs", "NABL Lighting Labs"]
  },
  {
    id: "15",
    isCode: "IS 1239",
    title: "Mild Steel Tubes, Tubulars and Other Wrought Steel Fittings",
    category: "Steel & Metals",
    description: "Specification for mild steel tubes, tubulars and other wrought steel fittings covering dimensions, weight, and mechanical properties.",
    keyRequirements: [
      "Tensile strength > 320 MPa",
      "Elongation > 20%",
      "Hydraulic test pressure as per table",
      "Bend test without crack",
      "Flattening test compliance",
      "Galvanization coating weight > 400 g/m²"
    ],
    applicableProducts: ["Steel Pipes", "Steel Tubes", "GI Pipes", "Plumbing Fittings", "MS Pipes"],
    mandatoryCertification: true,
    lastRevised: "2018",
    testingLabs: ["NABL Metal Labs", "RDSO Labs"]
  },
  {
    id: "16",
    isCode: "IS 14543",
    title: "Information Technology Equipment - Safety",
    category: "Electronics & Electrical",
    description: "Safety requirements for information technology equipment including computers, monitors, printers, and networking equipment.",
    keyRequirements: [
      "Electric strength test 1500VAC",
      "Leakage current < 3.5mA",
      "Protection against electric shock",
      "Fire enclosure requirements V-1 rating",
      "Thermal requirements compliance",
      "EMC requirements as per IS 13252"
    ],
    applicableProducts: ["Computers", "Laptops", "Monitors", "Printers", "Routers", "Switches", "Power Adapters"],
    mandatoryCertification: true,
    lastRevised: "2021",
    testingLabs: ["STQC", "ERTL", "NABL IT Labs"]
  },
  {
    id: "17",
    isCode: "IS 456",
    title: "Plain and Reinforced Concrete Code of Practice",
    category: "Construction Materials",
    description: "Code of practice for plain and reinforced concrete covering materials, workmanship, inspection, and testing requirements.",
    keyRequirements: [
      "Minimum cement content as per exposure",
      "Maximum water-cement ratio 0.55",
      "Minimum grade M20 for RCC",
      "Cover to reinforcement as per table",
      "Curing period minimum 7 days",
      "Compressive strength test at 28 days"
    ],
    applicableProducts: ["Concrete", "RCC Structures", "Cement Concrete", "Ready Mix Concrete"],
    mandatoryCertification: false,
    lastRevised: "2016",
    testingLabs: ["NABL Construction Labs", "Government Testing Labs"]
  },
  {
    id: "18",
    isCode: "IS 15885",
    title: "Flat Transparent Glass for General Purposes",
    category: "Construction Materials",
    description: "Specification for flat transparent glass for general building purposes including float glass, sheet glass and patterned glass.",
    keyRequirements: [
      "Thickness tolerance ±0.2mm",
      "Light transmittance > 87%",
      "No visible bubbles/inclusions",
      "Fragmentation pattern compliance",
      "Edge quality requirements",
      "Flatness tolerance requirements"
    ],
    applicableProducts: ["Float Glass", "Window Glass", "Sheet Glass", "Building Glass", "Tempered Glass"],
    mandatoryCertification: true,
    lastRevised: "2018",
    testingLabs: ["CGCRI", "NABL Glass Labs"]
  },
  {
    id: "19",
    isCode: "IS 397",
    title: "Rubber Products - Footwear",
    category: "Rubber & Textiles",
    description: "Specification for rubber footwear covering material requirements, physical properties, and testing methods.",
    keyRequirements: [
      "Tensile strength > 8 MPa",
      "Elongation at break > 400%",
      "Abrasion resistance < 200 mm³",
      "Flexing resistance (no crack at 100k cycles)",
      "Hardness 55-75 Shore A",
      "No harmful chemicals (Cr VI, Lead)"
    ],
    applicableProducts: ["Rubber Shoes", "Rubber Slippers", "Gumboots", "Safety Footwear"],
    mandatoryCertification: false,
    lastRevised: "2015",
    testingLabs: ["RRII", "NABL Rubber Labs"]
  },
  {
    id: "20",
    isCode: "IS 4226",
    title: "Specification for Skin Care Products",
    category: "Cosmetics & Personal Care",
    description: "Specification for skin care products covering ingredients, safety, labeling, and testing requirements.",
    keyRequirements: [
      "pH value 4.0-7.5",
      "Heavy metals: Lead < 20 ppm, Arsenic < 5 ppm",
      "Microbial limits compliance",
      "Stability testing for 12 months",
      "Patch test for skin irritation",
      "Complete ingredient declaration",
      "Shelf life declaration"
    ],
    applicableProducts: ["Face Cream", "Moisturizer", "Sunscreen", "Body Lotion", "Skin Care Products"],
    mandatoryCertification: false,
    lastRevised: "2019",
    testingLabs: ["CFTRI", "NABL Cosmetic Labs"]
  }
];

export const STANDARD_CATEGORIES = [
  "Construction Materials",
  "Steel & Metals",
  "Food & Water",
  "Electronics & Electrical",
  "Automotive & Safety",
  "Plastics & Polymers",
  "Civil Engineering",
  "Rubber & Textiles",
  "Cosmetics & Personal Care",
  "Chemicals & Fertilizers",
  "Textiles & Garments",
  "Medical Devices"
];

export function searchStandards(query: string): BISStandard[] {
  const q = query.toLowerCase();
  return BIS_STANDARDS.filter(
    (s) =>
      s.isCode.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.applicableProducts.some((p) => p.toLowerCase().includes(q))
  );
}

export function getStandardsByCategory(category: string): BISStandard[] {
  return BIS_STANDARDS.filter((s) => s.category === category);
}

export function getStandardByCode(isCode: string): BISStandard | undefined {
  return BIS_STANDARDS.find((s) => s.isCode === isCode);
}
