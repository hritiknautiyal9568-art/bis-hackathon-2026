"use client";

import { useState } from "react";
import {
  FileCheck,
  Loader2,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Info,
  ShieldCheck,
  BookOpen,
  Lightbulb,
  Clock,
  IndianRupee,
} from "lucide-react";

export default function SellerCompliancePage() {
  const [productDescription, setProductDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!productDescription.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: productDescription,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.data || data.result);
    } catch (err: any) {
      setError(err.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  // Normalize field names from AI response
  const getScore = (r: any) => r.complianceScore ?? r.overallScore ?? r.score;
  const getStandards = (r: any) => r.applicableStandards || r.standards || [];
  const getGaps = (r: any) => r.complianceGaps || r.gaps || [];
  const getRecs = (r: any) => r.recommendations || r.actions || [];
  const getScoreColor = (s: number) => s >= 70 ? "text-[#138808]" : s >= 40 ? "text-[#FF9933]" : "text-red-600";
  const getScoreBg = (s: number) => s >= 70 ? "bg-green-500" : s >= 40 ? "bg-yellow-500" : "bg-red-500";
  const getScoreBgLight = (s: number) => s >= 70 ? "from-green-50 to-emerald-50" : s >= 40 ? "from-yellow-50 to-amber-50" : "from-red-50 to-rose-50";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Compliance Analysis</h1>
        <p className="text-sm text-gray-500 mt-1">
          Describe your product to get instant AI-powered compliance analysis against applicable BIS standards
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Product Description
            </label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Describe your product in detail: what it is, materials used, intended use, target market, manufacturing process..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580] resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["Steel TMT Bars for construction", "LED Bulb for household use", "Gold Jewellery 22K", "Packaged Drinking Water", "Electric Iron for domestic use"].map((example) => (
              <button
                key={example}
                onClick={() => setProductDescription(example)}
                className="text-[11px] px-2.5 py-1.5 bg-blue-50 text-[#003580] rounded-full hover:bg-blue-100 transition-colors border border-blue-100"
              >
                {example}
              </button>
            ))}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !productDescription.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#003580] text-white rounded-xl font-semibold hover:bg-[#002a66] transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing with Gemini AI...
              </>
            ) : (
              <>
                <FileCheck className="h-5 w-5" />
                Analyze Compliance
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <p className="font-semibold text-red-800">Error</p>
              </div>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header with score */}
              <div className={`bg-gradient-to-r ${getScoreBgLight(getScore(result) ?? 50)} px-6 py-5 border-b`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-[#003580]" />
                      Compliance Analysis
                    </h2>
                    {(result.productName || result.productCategory) && (
                      <p className="text-sm text-gray-600 mt-1">
                        {result.productName}{result.productCategory ? ` · ${result.productCategory}` : ""}
                      </p>
                    )}
                  </div>
                  {getScore(result) !== undefined && (
                    <div className="text-right">
                      <div className={`text-4xl font-black ${getScoreColor(getScore(result))}`}>
                        {getScore(result)}%
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Compliance Score</p>
                    </div>
                  )}
                </div>

                {/* Score bar */}
                {getScore(result) !== undefined && (
                  <div className="mt-3">
                    <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${getScoreBg(getScore(result))}`}
                        style={{ width: `${getScore(result)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-gray-500">Non-Compliant</span>
                      <span className="text-[10px] text-gray-500">Fully Compliant</span>
                    </div>
                  </div>
                )}

                {/* Status badge */}
                {result.status && (
                  <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                    (getScore(result) ?? 50) >= 70 ? "bg-green-100 text-green-700" :
                    (getScore(result) ?? 50) >= 40 ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {(getScore(result) ?? 50) >= 70 ? <CheckCircle2 className="h-4 w-4" /> :
                     (getScore(result) ?? 50) >= 40 ? <AlertTriangle className="h-4 w-4" /> :
                     <XCircle className="h-4 w-4" />}
                    {result.status.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  </div>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Applicable Standards */}
                {getStandards(result).length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#003580]" />
                      Applicable Standards ({getStandards(result).length})
                    </h3>
                    <div className="space-y-2.5">
                      {getStandards(result).map((s: any, i: number) => (
                        <div key={i} className="bg-blue-50/60 rounded-xl p-4 border border-blue-100">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <CheckCircle2 className="h-5 w-5 text-[#003580] shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold text-[#003580] text-sm">
                                  {s.isCode || s.standardCode || s.code || "Standard"}
                                </p>
                                <p className="text-sm text-gray-700 mt-0.5">
                                  {s.title || s.name || s.description}
                                </p>
                              </div>
                            </div>
                            {(s.mandatory !== undefined) && (
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${
                                s.mandatory ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                              }`}>
                                {s.mandatory ? "Mandatory" : "Voluntary"}
                              </span>
                            )}
                          </div>
                          {s.relevanceScore && (
                            <div className="mt-2 ml-7">
                              <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#003580] rounded-full" style={{ width: `${Math.round(s.relevanceScore * 100)}%` }} />
                              </div>
                              <p className="text-[10px] text-gray-400 mt-0.5">{Math.round(s.relevanceScore * 100)}% relevance</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compliance Gaps */}
                {getGaps(result).length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Compliance Gaps ({getGaps(result).length})
                    </h3>
                    <div className="space-y-2.5">
                      {getGaps(result).map((gap: any, i: number) => {
                        const severity = gap.severity || "major";
                        return (
                          <div key={i} className={`rounded-xl p-4 border-l-4 ${
                            severity === "critical" ? "border-red-500 bg-red-50" :
                            severity === "major" ? "border-yellow-500 bg-yellow-50" :
                            "border-blue-500 bg-blue-50"
                          }`}>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-bold text-gray-900">
                                  {gap.requirement || gap.area || gap.gap || gap.title}
                                </p>
                                {(gap.standard || gap.isCode) && (
                                  <p className="text-xs text-gray-500 font-medium mt-0.5">{gap.standard || gap.isCode}</p>
                                )}
                                <p className="text-sm text-gray-600 mt-1">
                                  {gap.description || gap.detail || gap.currentStatus}
                                </p>
                              </div>
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase shrink-0 ${
                                severity === "critical" ? "bg-red-200 text-red-700" :
                                severity === "major" ? "bg-yellow-200 text-yellow-700" :
                                "bg-blue-200 text-blue-700"
                              }`}>
                                {severity}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {getRecs(result).length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-[#FF9933]" />
                      Recommendations ({getRecs(result).length})
                    </h3>
                    <div className="space-y-2.5">
                      {getRecs(result).map((r: any, i: number) => {
                        const title = typeof r === "string" ? r : (r.title || r.action || r.recommendation || r.description || "");
                        const desc = typeof r === "string" ? null : (r.title ? r.description : null);
                        const priority = typeof r === "string" ? null : r.priority;
                        const cost = typeof r === "string" ? null : r.estimatedCost;
                        const time = typeof r === "string" ? null : r.estimatedTime;

                        return (
                          <div key={i} className="bg-green-50/60 rounded-xl p-4 border border-green-100">
                            <div className="flex items-start gap-3">
                              <div className="bg-[#138808] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                {i + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">{title}</p>
                                {desc && (
                                  <p className="text-sm text-gray-600 mt-1">{desc}</p>
                                )}
                                {(priority || cost || time) && (
                                  <div className="flex flex-wrap gap-3 mt-2">
                                    {priority && (
                                      <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                        priority === "high" ? "bg-red-100 text-red-600" :
                                        priority === "medium" ? "bg-yellow-100 text-yellow-600" :
                                        "bg-blue-100 text-blue-600"
                                      }`}>
                                        {priority} priority
                                      </span>
                                    )}
                                    {cost && (
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <IndianRupee className="h-3 w-3" /> {cost}
                                      </span>
                                    )}
                                    {time && (
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {time}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Generic fallback for any other fields */}
                {!getStandards(result).length && !getGaps(result).length && !getRecs(result).length && !result.rawAnalysis && (
                  <div className="space-y-3">
                    {Object.entries(result)
                      .filter(([k, v]) => !["productName", "productCategory", "complianceScore", "overallScore", "score", "status", "timestamp"].includes(k))
                      .map(([key, val], i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, (s: string) => s.toUpperCase())}
                          </p>
                          <p className="text-sm text-gray-800">
                            {typeof val === "string" ? val : JSON.stringify(val, null, 2)}
                          </p>
                        </div>
                      ))}
                  </div>
                )}

                {/* Raw */}
                {result.rawAnalysis && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.rawAnalysis}</p>
                  </div>
                )}

                <button
                  onClick={() => setResult(null)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm text-[#003580] font-semibold hover:bg-blue-50 rounded-xl transition-colors border border-gray-200"
                >
                  <RotateCcw className="h-4 w-4" />
                  Analyze Another Product
                </button>
              </div>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
              <FileCheck className="h-14 w-14 text-gray-300 mx-auto mb-4" />
              <p className="font-bold text-gray-700 text-lg">Describe your product to begin</p>
              <p className="text-sm text-gray-400 mt-2">
                AI will identify applicable standards, compliance gaps, and give actionable recommendations
              </p>
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-blue-50 rounded-xl p-3">
                  <BookOpen className="h-5 w-5 text-[#003580] mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-[#003580]">Standards</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-3">
                  <AlertTriangle className="h-5 w-5 text-[#FF9933] mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-[#FF9933]">Gap Analysis</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <Lightbulb className="h-5 w-5 text-[#138808] mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-[#138808]">Advice</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
