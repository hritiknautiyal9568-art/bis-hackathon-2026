export interface ComplianceResult {
  productName: string;
  productCategory: string;
  applicableStandards: ApplicableStandard[];
  overallScore: number;
  status: "compliant" | "partially-compliant" | "non-compliant";
  gaps: ComplianceGap[];
  recommendations: Recommendation[];
  simulationResult?: SimulationResult;
  timestamp: string;
}

export interface ApplicableStandard {
  isCode: string;
  title: string;
  relevanceScore: number;
  mandatory: boolean;
}

export interface ComplianceGap {
  id: string;
  standard: string;
  requirement: string;
  currentStatus: "missing" | "partial" | "failed";
  severity: "critical" | "major" | "minor";
  description: string;
}

export interface Recommendation {
  id: string;
  type: "material" | "safety" | "testing" | "documentation" | "design" | "labeling";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  estimatedCost?: string;
  estimatedTime?: string;
}

export interface SimulationResult {
  approvalProbability: number;
  estimatedTimeline: string;
  riskFactors: RiskFactor[];
  requiredTests: RequiredTest[];
}

export interface RiskFactor {
  factor: string;
  impact: "high" | "medium" | "low";
  mitigation: string;
}

export interface RequiredTest {
  testName: string;
  standard: string;
  estimatedCost: string;
  duration: string;
  labs: string[];
}

export interface VerificationResult {
  isAuthentic: boolean;
  confidence: number;
  licenseNumber?: string;
  manufacturer?: string;
  validUntil?: string;
  standardMark?: string;
  warnings: string[];
  details: string;
}

export interface AnalysisRequest {
  text?: string;
  imageBase64?: string;
  imageMimeType?: string;
  analysisType: "compliance" | "verification" | "simulation" | "standards-search";
}
