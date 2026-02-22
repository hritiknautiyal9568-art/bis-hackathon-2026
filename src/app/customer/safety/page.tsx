"use client";

import { useState, useCallback } from "react";
import LiveScanner from "@/components/LiveScanner";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  Flame,
  Zap as ElecIcon,
  Bug,
  Baby,
  Leaf,
  Phone,
  Shield,
  Activity,
} from "lucide-react";

export default function SafetyPage() {
  const [scanMode, setScanMode] = useState<"hallmark" | "product" | "label" | "barcode">("product");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeRisk = useCallback(
    async (imageBase64: string, imageMimeType: string) => {
      setScanning(true);
      setError(null);
      setResult(null);

      try {
        const res = await fetch("/api/risk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64, imageMimeType }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setResult(data.result);
      } catch (err: any) {
        setError(err.message || "Analysis failed");
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
        await analyzeRisk(base64, file.type || "image/jpeg");
      };
      reader.readAsDataURL(file);
    },
    [analyzeRisk]
  );

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "minimal": return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", bar: "bg-green-500" };
      case "low": return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", bar: "bg-blue-500" };
      case "medium": return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", bar: "bg-yellow-500" };
      case "high": return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", bar: "bg-orange-500" };
      case "critical": return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", bar: "bg-red-500" };
      default: return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", bar: "bg-gray-500" };
    }
  };

  const hazardIcons: Record<string, any> = {
    physicalHazards: Shield,
    chemicalHazards: Activity,
    electricalHazards: ElecIcon,
    fireHazards: Flame,
    biologicalHazards: Bug,
  };

  const hazardLabels: Record<string, string> = {
    physicalHazards: "Physical Hazards",
    chemicalHazards: "Chemical Hazards",
    electricalHazards: "Electrical Hazards",
    fireHazards: "Fire Hazards",
    biologicalHazards: "Biological Hazards",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-xl">
            <ShieldAlert className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Safety Analyzer</h1>
        </div>
        <p className="text-sm text-gray-500">
          Scan any product for comprehensive safety risk analysis — physical, chemical, electrical, fire &amp; biological hazards
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Scanner */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm sticky top-24">
            <LiveScanner
              onCapture={analyzeRisk}
              onFileUpload={handleFileUpload}
              scanning={scanning}
              scanMode={scanMode}
              onModeChange={setScanMode}
              lastResult={result}
              compact
            />
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {scanning && (
            <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="relative mb-4">
                <ShieldAlert className="h-12 w-12 text-red-500 animate-pulse" />
              </div>
              <p className="font-bold text-gray-900 text-lg">Analyzing Safety Risks...</p>
              <p className="text-xs text-gray-500 mt-1">Checking physical, chemical, electrical, fire &amp; biological hazards</p>
            </div>
          )}

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

          {result && !scanning && (
            <>
              {/* Risk Overview */}
              <div className={`rounded-2xl p-6 border shadow-sm ${getRiskColor(result.overallRiskLevel).bg} ${getRiskColor(result.overallRiskLevel).border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Product</p>
                    <h2 className="text-xl font-bold text-gray-900">{result.productIdentified || "Unknown"}</h2>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-black ${getRiskColor(result.overallRiskLevel).text}`}>
                      {result.overallRiskScore ?? "—"}
                    </div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider ${getRiskColor(result.overallRiskLevel).text}`}>
                      {result.overallRiskLevel} Risk
                    </div>
                  </div>
                </div>

                {/* Risk bar */}
                <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${getRiskColor(result.overallRiskLevel).bar}`}
                    style={{ width: `${result.overallRiskScore || 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                  <span>Safe</span>
                  <span>Critical</span>
                </div>
              </div>

              {/* Urgent Warnings */}
              {result.urgentWarnings?.length > 0 && (
                <div className="bg-red-600 rounded-2xl p-5 text-white">
                  <p className="font-bold flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5" /> Urgent Warnings
                  </p>
                  {result.urgentWarnings.map((w: string, i: number) => (
                    <p key={i} className="text-sm text-red-100 mb-1">⚠️ {w}</p>
                  ))}
                </div>
              )}

              {/* Risk Breakdown */}
              {result.riskBreakdown && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Risk Breakdown</h3>
                  <div className="space-y-4">
                    {Object.entries(result.riskBreakdown).map(([key, data]: [string, any]) => {
                      const Icon = hazardIcons[key] || Shield;
                      return (
                        <div key={key} className="border border-gray-100 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-[#003580]" />
                              <span className="text-sm font-bold text-gray-900">{hazardLabels[key] || key}</span>
                            </div>
                            <span className={`text-sm font-bold ${data.score > 60 ? "text-red-600" : data.score > 30 ? "text-yellow-600" : "text-green-600"}`}>
                              {data.score}/100
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                            <div
                              className={`h-full rounded-full ${data.score > 60 ? "bg-red-500" : data.score > 30 ? "bg-yellow-500" : "bg-green-500"}`}
                              style={{ width: `${data.score}%` }}
                            />
                          </div>
                          {data.risks?.length > 0 && (
                            <div className="space-y-1.5 mt-2">
                              {data.risks.map((risk: any, i: number) => (
                                <div key={i} className={`text-xs rounded-lg px-3 py-2 ${
                                  risk.severity === "critical" ? "bg-red-50 text-red-700" :
                                  risk.severity === "high" ? "bg-orange-50 text-orange-700" :
                                  risk.severity === "medium" ? "bg-yellow-50 text-yellow-700" :
                                  "bg-green-50 text-green-700"
                                }`}>
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="font-semibold">{risk.hazard}</span>
                                    <span className="text-[9px] uppercase font-bold">{risk.severity}</span>
                                  </div>
                                  {risk.affectedGroup && <p className="text-[10px] opacity-80">Affects: {risk.affectedGroup}</p>}
                                </div>
                              ))}
                            </div>
                          )}
                          {(!data.risks || data.risks.length === 0) && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> No risks detected
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Age Restrictions */}
              {result.ageRestrictions && (
                <div className={`rounded-2xl p-5 border shadow-sm ${result.ageRestrictions.suitableForChildren === false ? "bg-orange-50 border-orange-200" : "bg-green-50 border-green-200"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Baby className="h-4 w-4" />
                    <h3 className="font-bold text-gray-900">Child Safety</h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    {result.ageRestrictions.suitableForChildren ? "✅ Suitable for children" : `⚠️ Not suitable for children under ${result.ageRestrictions.minimumAge}`}
                  </p>
                  {result.ageRestrictions.reason && <p className="text-xs text-gray-500 mt-1">{result.ageRestrictions.reason}</p>}
                </div>
              )}

              {/* Environmental Risk */}
              {result.environmentalRisk && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" /> Environmental Impact
                    </h3>
                    <span className={`text-sm font-bold ${result.environmentalRisk.score > 60 ? "text-red-600" : result.environmentalRisk.score > 30 ? "text-yellow-600" : "text-green-600"}`}>
                      {result.environmentalRisk.score}/100
                    </span>
                  </div>
                  {result.environmentalRisk.concerns?.map((c: string, i: number) => (
                    <p key={i} className="text-xs text-gray-600 mb-1">• {c}</p>
                  ))}
                  {result.environmentalRisk.disposalAdvice && (
                    <div className="bg-green-50 rounded-lg px-3 py-2 mt-2 text-xs text-green-700">
                      <span className="font-semibold">Disposal:</span> {result.environmentalRisk.disposalAdvice}
                    </div>
                  )}
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-3">Recommendations</h3>
                  {result.recommendations.forConsumers?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">For Consumers</p>
                      {result.recommendations.forConsumers.map((r: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-600 mb-1">
                          <CheckCircle2 className="h-3 w-3 text-[#003580] shrink-0 mt-0.5" /> {r}
                        </div>
                      ))}
                    </div>
                  )}
                  {result.recommendations.reportTo?.length > 0 && (
                    <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs text-[#003580]">
                      <div className="flex items-center gap-1 font-semibold mb-1">
                        <Phone className="h-3 w-3" /> Report To
                      </div>
                      {result.recommendations.reportTo.map((r: string, i: number) => (
                        <p key={i}>• {r}</p>
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

              <button onClick={() => setResult(null)} className="w-full flex items-center justify-center gap-2 py-3 text-sm text-[#003580] font-semibold hover:bg-blue-50 rounded-xl transition-colors border border-gray-200">
                <RotateCcw className="h-4 w-4" /> Analyze Another Product
              </button>
            </>
          )}

          {!result && !scanning && !error && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
              <div className="bg-red-50 p-6 rounded-2xl inline-block mb-4">
                <ShieldAlert className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Product Safety Analysis</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Scan any product to get a comprehensive safety risk analysis with hazard identification and compliance checking.
              </p>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { icon: Shield, label: "Physical" },
                  { icon: Activity, label: "Chemical" },
                  { icon: ElecIcon, label: "Electrical" },
                  { icon: Flame, label: "Fire" },
                  { icon: Bug, label: "Biological" },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <item.icon className="h-4 w-4 text-[#003580] mx-auto mb-1" />
                    <p className="text-[9px] font-medium text-gray-600">{item.label}</p>
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
