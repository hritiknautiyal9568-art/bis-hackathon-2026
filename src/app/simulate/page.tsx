"use client";

import { useState } from "react";
import {
  BarChart3,
  Loader2,
  AlertCircle,
  TrendingUp,
  Clock,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  FlaskConical,
  Shield,
  Target,
} from "lucide-react";

export default function SimulatePage() {
  const [productDescription, setProductDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = async () => {
    if (!productDescription.trim()) return;
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: productDescription }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data.data);
    } catch (err: any) {
      setError(err.message || "Simulation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getApprovalColor = (prob: number) => {
    if (prob >= 70) return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", bar: "bg-green-500" };
    if (prob >= 40) return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", bar: "bg-orange-500" };
    return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", bar: "bg-red-500" };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003580] to-[#002a66] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/10 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">BIS Approval Simulation</h1>
          </div>
          <p className="text-blue-200 max-w-2xl">
            Predict your product&apos;s BIS certification approval probability. Get estimated timelines,
            required tests, costs, and risk factors before official submission.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Describe Your Product
              </h3>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Describe your product in detail...&#10;&#10;Example: We manufacture 1500W electric water heaters with a 25L capacity stainless steel tank. The product has ISI marking pending, BEE 5-star rating applied. Currently using copper heating elements and ABS plastic body. Target market: domestic households."
                className="w-full h-48 px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent resize-none"
              />

              <button
                onClick={handleSimulate}
                disabled={loading || !productDescription.trim()}
                className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-[#003580] text-white rounded-xl font-semibold hover:bg-[#002a66] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Running Simulation...
                  </>
                ) : (
                  <>
                    <Target className="h-5 w-5" />
                    Run Approval Simulation
                  </>
                )}
              </button>

              {/* Quick Examples */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                  Try an example
                </p>
                <div className="space-y-2">
                  {[
                    "LED bulb 9W, 900 lumens, SMD technology, aluminum heat sink, E27 base, driver with surge protection",
                    "Steel TMT bar Fe 500D grade, 8mm diameter, for construction use, manufactured via QST process",
                    "Packaged drinking water, RO treated, TDS 120mg/L, sourced from borewell, packed in PET bottles",
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setProductDescription(example)}
                      disabled={loading}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-[#003580] transition-colors disabled:opacity-50"
                    >
                      &quot;{example}&quot;
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3">
            {loading && (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                <Loader2 className="h-12 w-12 text-[#003580] animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Running Simulation...
                </h3>
                <p className="text-sm text-gray-500">
                  Analyzing product against BIS certification requirements
                </p>
              </div>
            )}

            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800">Simulation Error</h3>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Approval Probability */}
                <div className={`rounded-2xl p-6 ${getApprovalColor(result.approvalProbability).bg} border ${getApprovalColor(result.approvalProbability).border}`}>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
                    Approval Probability
                  </h3>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-end gap-2 mb-2">
                        <span className={`text-5xl font-extrabold ${getApprovalColor(result.approvalProbability).text}`}>
                          {result.approvalProbability}%
                        </span>
                        <span className="text-sm text-gray-500 mb-2">probability</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`${getApprovalColor(result.approvalProbability).bar} h-3 rounded-full transition-all duration-1000`}
                          style={{ width: `${result.approvalProbability}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-[#003580]" />
                      <span className="text-xs font-semibold text-gray-500 uppercase">Timeline</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{result.estimatedTimeline}</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <IndianRupee className="h-5 w-5 text-[#FF9933]" />
                      <span className="text-xs font-semibold text-gray-500 uppercase">Est. Cost</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{result.estimatedTotalCost || "Contact BIS"}</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <FlaskConical className="h-5 w-5 text-[#138808]" />
                      <span className="text-xs font-semibold text-gray-500 uppercase">Tests Required</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{result.requiredTests?.length || 0} Tests</p>
                  </div>
                </div>

                {/* Overall Assessment */}
                {result.overallAssessment && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Overall Assessment</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{result.overallAssessment}</p>
                  </div>
                )}

                {/* Risk Factors */}
                {result.riskFactors && result.riskFactors.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Factors</h3>
                    <div className="space-y-3">
                      {result.riskFactors.map((risk: any, i: number) => (
                        <div key={i} className={`rounded-xl p-4 ${
                          risk.impact === "high" ? "bg-red-50 border border-red-200" :
                          risk.impact === "medium" ? "bg-orange-50 border border-orange-200" :
                          "bg-blue-50 border border-blue-200"
                        }`}>
                          <div className="flex items-start gap-3">
                            <AlertTriangle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                              risk.impact === "high" ? "text-red-500" :
                              risk.impact === "medium" ? "text-orange-500" :
                              "text-blue-500"
                            }`} />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">{risk.factor}</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  risk.impact === "high" ? "bg-red-100 text-red-700" :
                                  risk.impact === "medium" ? "bg-orange-100 text-orange-700" :
                                  "bg-blue-100 text-blue-700"
                                }`}>
                                  {risk.impact} impact
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{risk.mitigation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Required Tests */}
                {result.requiredTests && result.requiredTests.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Required Tests</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 font-semibold text-gray-600">Test</th>
                            <th className="text-left py-3 px-2 font-semibold text-gray-600">Standard</th>
                            <th className="text-left py-3 px-2 font-semibold text-gray-600">Cost</th>
                            <th className="text-left py-3 px-2 font-semibold text-gray-600">Duration</th>
                            <th className="text-left py-3 px-2 font-semibold text-gray-600">Labs</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.requiredTests.map((test: any, i: number) => (
                            <tr key={i} className="border-b border-gray-100">
                              <td className="py-3 px-2 font-medium text-gray-900">{test.testName}</td>
                              <td className="py-3 px-2 font-mono text-[#003580]">{test.standard}</td>
                              <td className="py-3 px-2 text-gray-600">{test.estimatedCost}</td>
                              <td className="py-3 px-2 text-gray-600">{test.duration}</td>
                              <td className="py-3 px-2">
                                <div className="flex flex-wrap gap-1">
                                  {test.labs?.map((lab: string, j: number) => (
                                    <span key={j} className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                      {lab}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {result.nextSteps && result.nextSteps.length > 0 && (
                  <div className="bg-gradient-to-br from-[#003580] to-[#002a66] rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <ArrowRight className="h-5 w-5" /> Recommended Next Steps
                    </h3>
                    <div className="space-y-3">
                      {result.nextSteps.map((step: string, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                            {i + 1}
                          </div>
                          <p className="text-blue-100 text-sm pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!result && !loading && !error && (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="bg-blue-50 p-4 rounded-full w-fit mx-auto mb-4">
                  <Target className="h-10 w-10 text-[#003580]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Simulate BIS Approval
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  Describe your product and our AI will predict approval probability,
                  estimate costs and timelines, and identify potential risks.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                  {[
                    { icon: "📊", label: "Approval Probability" },
                    { icon: "⏱️", label: "Timeline Estimate" },
                    { icon: "🧪", label: "Required Tests" },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-xs font-medium text-gray-600">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
