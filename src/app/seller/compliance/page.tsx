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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
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
              <div className="bg-gradient-to-r from-[#003580] to-[#0052cc] px-5 py-4 text-white">
                <h2 className="font-bold flex items-center gap-2">
                  <FileCheck className="h-5 w-5" /> Compliance Analysis
                </h2>
              </div>
              <div className="p-5 space-y-4">
                {/* Compliance Score */}
                {result.complianceScore !== undefined && (
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl font-black ${
                      result.complianceScore >= 70 ? "text-[#138808]" : result.complianceScore >= 40 ? "text-[#FF9933]" : "text-red-600"
                    }`}>
                      {result.complianceScore}%
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Compliance Score</p>
                      <p className="text-xs text-gray-500">{result.status || "Analysis complete"}</p>
                    </div>
                  </div>
                )}

                {/* Applicable Standards */}
                {result.applicableStandards?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Applicable Standards</p>
                    <div className="space-y-2">
                      {result.applicableStandards.map((s: any, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-[#003580] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-[#003580]">{s.standardCode || s.code}</span>
                            {" — "}{s.title || s.name}
                            {s.mandatory && <span className="text-red-500 text-xs ml-1">(Mandatory)</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compliance Gaps */}
                {result.complianceGaps?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Compliance Gaps</p>
                    <div className="space-y-2">
                      {result.complianceGaps.map((gap: any, i: number) => (
                        <div key={i} className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
                          <div className="flex items-center gap-1 mb-1">
                            <AlertTriangle className="h-3 w-3 text-yellow-600" />
                            <p className="text-sm font-semibold text-yellow-800">{gap.area || gap.gap}</p>
                          </div>
                          <p className="text-xs text-yellow-700">{gap.description || gap.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Recommendations</p>
                    <ul className="space-y-1.5">
                      {result.recommendations.map((r: any, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <ArrowRight className="h-3.5 w-3.5 text-[#138808] shrink-0 mt-0.5" />
                          {typeof r === "string" ? r : r.action || r.recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Raw */}
                {result.rawAnalysis && (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.rawAnalysis}</p>
                )}

                <button
                  onClick={() => setResult(null)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-[#003580] font-semibold hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Analyze Another Product
                </button>
              </div>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <FileCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">Describe your product to begin</p>
              <p className="text-xs text-gray-400 mt-1">
                AI will identify applicable standards, gaps, and recommendations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
