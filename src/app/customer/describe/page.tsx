"use client";

import { useState, useCallback, useRef } from "react";
import LiveScanner from "@/components/LiveScanner";
import {
  Sparkles,
  Package,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  Star,
  Leaf,
  Heart,
  IndianRupee,
  Tag,
  Factory,
  Info,
  ChevronRight,
  Camera,
  Upload,
} from "lucide-react";

export default function ProductDescriberPage() {
  const [scanMode, setScanMode] = useState<"hallmark" | "product" | "label" | "barcode">("product");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeProduct = useCallback(
    async (imageBase64: string, imageMimeType: string) => {
      setScanning(true);
      setError(null);
      setResult(null);

      try {
        const res = await fetch("/api/describe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64, imageMimeType }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setResult(data.result);
      } catch (err: any) {
        setError(err.message || "Analysis failed. Please try again.");
      } finally {
        setScanning(false);
      }
    },
    []
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      setScanning(true);
      setError(null);
      setResult(null);

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        await analyzeProduct(base64, file.type || "image/jpeg");
      };
      reader.readAsDataURL(file);
    },
    [analyzeProduct]
  );

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "low": case "minimal": return "text-green-600 bg-green-50 border-green-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high": case "critical": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-gradient-to-r from-[#FF9933] to-[#e88a2a] p-2 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AI Product Describer</h1>
        </div>
        <p className="text-sm text-gray-500">
          Scan any product for a comprehensive AI-powered analysis — materials, safety, BIS compliance, and consumer advice
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Scanner - 2 cols */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm sticky top-24">
            <LiveScanner
              onCapture={analyzeProduct}
              onFileUpload={handleFileUpload}
              scanning={scanning}
              scanMode={scanMode}
              onModeChange={setScanMode}
              lastResult={result}
              compact
            />
          </div>
        </div>

        {/* Results - 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Loading */}
          {scanning && (
            <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Loader2 className="h-12 w-12 text-[#003580] animate-spin" />
                <div className="absolute inset-0 h-12 w-12 border-2 border-[#FF9933]/30 rounded-full animate-ping" />
              </div>
              <p className="font-bold text-gray-900 text-lg">Analyzing Product...</p>
              <p className="text-xs text-gray-500 mt-1">AI is examining materials, safety, certifications, and more</p>
              <div className="flex gap-1 mt-4">
                {["Materials", "Safety", "Certifications", "Quality"].map((s, i) => (
                  <span key={s} className="text-[10px] bg-blue-50 text-[#003580] px-2 py-0.5 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <p className="font-semibold text-red-800">Analysis Failed</p>
              </div>
              <p className="text-sm text-red-600">{error}</p>
              <button onClick={() => { setError(null); setResult(null); }} className="mt-3 flex items-center gap-1 text-sm text-red-700 font-medium hover:underline">
                <RotateCcw className="h-3.5 w-3.5" /> Try Again
              </button>
            </div>
          )}

          {/* Results */}
          {result && !scanning && (
            <>
              {/* Product Header Card */}
              <div className="bg-gradient-to-r from-[#003580] to-[#0052cc] rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-1">AI Product Analysis</p>
                    <h2 className="text-xl font-bold">{result.productName || "Product"}</h2>
                    {result.brand && <p className="text-blue-200 text-sm mt-0.5">by {result.brand}</p>}
                    <p className="text-blue-100 text-sm mt-2 max-w-md">{result.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {result.category && (
                      <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full font-medium">{result.category}</span>
                    )}
                    {result.marketInfo?.marketSegment && (
                      <span className="text-[10px] bg-[#FF9933]/30 px-2.5 py-1 rounded-full font-medium capitalize">{result.marketInfo.marketSegment}</span>
                    )}
                  </div>
                </div>

                {/* Quick Scores */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[
                    { label: "Quality", score: result.manufacturingQuality?.score, icon: Star },
                    { label: "Safety", score: result.safetyAssessment?.safetyScore, icon: Shield },
                    { label: "Compliance", score: result.certificationMarks?.complianceStatus === "compliant" ? 90 : result.certificationMarks?.complianceStatus === "partially-compliant" ? 60 : 30, icon: CheckCircle2 },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                      <item.icon className="h-4 w-4 mx-auto mb-1 text-[#FF9933]" />
                      <p className="text-2xl font-bold">{item.score ?? "—"}</p>
                      <p className="text-[10px] text-blue-200">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material Analysis */}
              {result.materialAnalysis && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-[#003580]" /> Material Analysis
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Primary Material</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">{result.materialAnalysis.primaryMaterial}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Quality Assessment</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">{result.materialAnalysis.materialQualityAssessment}</p>
                    </div>
                  </div>
                  {result.materialAnalysis.potentialConcerns?.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {result.materialAnalysis.potentialConcerns.map((c: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-yellow-700 bg-yellow-50 rounded-lg px-3 py-2">
                          <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" /> {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Manufacturing Quality */}
              {result.manufacturingQuality && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Factory className="h-4 w-4 text-[#003580]" /> Manufacturing Quality
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${getScoreBg(result.manufacturingQuality.score)}`} style={{ width: `${result.manufacturingQuality.score}%` }} />
                      </div>
                      <span className={`text-sm font-bold ${getScoreColor(result.manufacturingQuality.score)}`}>
                        {result.manufacturingQuality.score}/100
                      </span>
                    </div>
                  </div>
                  {result.manufacturingQuality.craftmanshipLevel && (
                    <p className="text-xs text-gray-500 mb-2">Craftsmanship: <span className="font-semibold text-gray-700 capitalize">{result.manufacturingQuality.craftmanshipLevel}</span></p>
                  )}
                  <div className="space-y-1.5">
                    {result.manufacturingQuality.observations?.map((obs: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <CheckCircle2 className="h-3 w-3 text-[#138808] shrink-0 mt-0.5" /> {obs}
                      </div>
                    ))}
                    {result.manufacturingQuality.defectsFound?.map((d: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-red-600">
                        <XCircle className="h-3 w-3 shrink-0 mt-0.5" /> {d}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BIS Relevance */}
              {result.bisRelevance && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-[#003580]" /> BIS Compliance & Standards
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <div className={`rounded-xl p-3 border ${result.bisRelevance.certificationRequired ? "bg-orange-50 border-orange-200" : "bg-green-50 border-green-200"}`}>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Certification Required</p>
                      <p className={`text-sm font-bold mt-0.5 ${result.bisRelevance.certificationRequired ? "text-orange-700" : "text-green-700"}`}>
                        {result.bisRelevance.certificationRequired ? "Yes — Mandatory" : "Optional"}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Certification Scheme</p>
                      <p className="text-sm font-bold text-[#003580] mt-0.5">{result.bisRelevance.certificationScheme || "N/A"}</p>
                    </div>
                  </div>
                  {result.bisRelevance.applicableStandards?.map((s: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3 text-[#003580]" />
                        <span className="font-semibold text-[#003580]">{s.code}</span>
                        <span className="text-gray-600">— {s.title}</span>
                      </div>
                      {s.mandatory && <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold">MANDATORY</span>}
                    </div>
                  ))}
                  {result.bisRelevance.estimatedComplianceCost && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                      <IndianRupee className="h-3 w-3" /> Estimated cost: <span className="font-semibold text-gray-700">{result.bisRelevance.estimatedComplianceCost}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Safety Assessment */}
              {result.safetyAssessment && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" /> Safety Assessment
                    </h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getRiskColor(result.safetyAssessment.overallSafety)}`}>
                      {result.safetyAssessment.overallSafety?.toUpperCase()}
                    </span>
                  </div>
                  {result.safetyAssessment.concerns?.map((c: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-yellow-700 bg-yellow-50 rounded-lg px-3 py-2 mb-1.5">
                      <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" /> {c}
                    </div>
                  ))}
                  {result.safetyAssessment.environmentalImpact && (
                    <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 mt-2">
                      <Leaf className="h-3 w-3 shrink-0 mt-0.5" /> {result.safetyAssessment.environmentalImpact}
                    </div>
                  )}
                </div>
              )}

              {/* Consumer Advice */}
              {result.consumerAdvice && (
                <div className={`rounded-2xl p-5 border shadow-sm ${
                  result.consumerAdvice.buyRecommendation === "recommended"
                    ? "bg-green-50 border-green-200"
                    : result.consumerAdvice.buyRecommendation === "caution"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-red-50 border-red-200"
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Tag className="h-4 w-4" /> Consumer Verdict
                    </h3>
                    <span className={`text-sm font-bold uppercase ${
                      result.consumerAdvice.buyRecommendation === "recommended" ? "text-green-700" :
                      result.consumerAdvice.buyRecommendation === "caution" ? "text-yellow-700" : "text-red-700"
                    }`}>
                      {result.consumerAdvice.buyRecommendation === "recommended" ? "✅ Recommended" :
                       result.consumerAdvice.buyRecommendation === "caution" ? "⚠️ Use Caution" : "❌ Avoid"}
                    </span>
                  </div>
                  {result.consumerAdvice.priceRange && (
                    <p className="text-xs text-gray-600 mb-2">
                      <IndianRupee className="h-3 w-3 inline" /> Expected price: <span className="font-semibold">{result.consumerAdvice.priceRange}</span>
                    </p>
                  )}
                  {result.consumerAdvice.tips?.map((t: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700 mb-1">
                      <Info className="h-3 w-3 text-[#003580] shrink-0 mt-0.5" /> {t}
                    </div>
                  ))}
                </div>
              )}

              {/* Certification Marks */}
              {result.certificationMarks && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-[#FF9933]" /> Certification Marks
                  </h3>
                  {result.certificationMarks.found?.length > 0 && (
                    <div className="space-y-2 mb-3">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Found on Product</p>
                      {result.certificationMarks.found.map((m: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-xs bg-green-50 rounded-lg px-3 py-2">
                          <span className="font-medium text-green-800">{m.mark}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            m.status === "valid" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
                          }`}>{m.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {result.certificationMarks.missing?.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Missing Marks</p>
                      {result.certificationMarks.missing.map((m: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                          <XCircle className="h-3 w-3" /> {m}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Raw fallback */}
              {result.rawAnalysis && (
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.rawAnalysis}</p>
                </div>
              )}

              {/* Scan Again */}
              <button
                onClick={() => setResult(null)}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm text-[#003580] font-semibold hover:bg-blue-50 rounded-xl transition-colors border border-gray-200"
              >
                <RotateCcw className="h-4 w-4" /> Describe Another Product
              </button>
            </>
          )}

          {/* Empty state */}
          {!result && !scanning && !error && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
              <div className="bg-gradient-to-br from-[#FF9933]/10 to-[#003580]/10 p-6 rounded-2xl inline-block mb-4">
                <Sparkles className="h-12 w-12 text-[#003580]" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Scan Any Product</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Point your camera at any product and get a comprehensive AI analysis — materials, safety, BIS standards, quality assessment, and consumer advice.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Package, label: "Materials" },
                  { icon: Shield, label: "Safety" },
                  { icon: CheckCircle2, label: "Standards" },
                  { icon: Star, label: "Quality" },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <item.icon className="h-5 w-5 text-[#003580] mx-auto mb-1" />
                    <p className="text-[10px] font-medium text-gray-600">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
