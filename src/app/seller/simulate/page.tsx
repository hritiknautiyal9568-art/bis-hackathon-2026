"use client";

import { useState } from "react";
import {
  BarChart3,
  Loader2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  IndianRupee,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";

export default function SellerSimulatePage() {
  const [productDescription, setProductDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    if (!productDescription.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: productDescription }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.data || data.result);
    } catch (err: any) {
      setError(err.message || "Simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Approval Simulation</h1>
        <p className="text-sm text-gray-500 mt-1">
          Simulate the BIS certification approval process — get probability, timeline, costs, and risk analysis
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Describe your product & current status
            </label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Describe your product, manufacturing capabilities, current testing status, quality control processes, target standards..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580] resize-none"
            />
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading || !productDescription.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                Run Simulation
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
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4 text-white">
                <h2 className="font-bold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" /> Simulation Results
                </h2>
              </div>
              <div className="p-5 space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  {result.approvalProbability !== undefined && (
                    <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                      <TrendingUp className="h-5 w-5 text-[#003580] mx-auto mb-1" />
                      <p className="text-2xl font-black text-[#003580]">{result.approvalProbability}%</p>
                      <p className="text-[10px] text-gray-500">Approval Probability</p>
                    </div>
                  )}
                  {result.estimatedTimeline && (
                    <div className="bg-orange-50 rounded-xl p-3 text-center border border-orange-100">
                      <Clock className="h-5 w-5 text-[#FF9933] mx-auto mb-1" />
                      <p className="text-lg font-bold text-gray-900">{result.estimatedTimeline}</p>
                      <p className="text-[10px] text-gray-500">Est. Timeline</p>
                    </div>
                  )}
                  {result.estimatedCost && (
                    <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                      <IndianRupee className="h-5 w-5 text-[#138808] mx-auto mb-1" />
                      <p className="text-lg font-bold text-gray-900">{result.estimatedCost}</p>
                      <p className="text-[10px] text-gray-500">Est. Cost</p>
                    </div>
                  )}
                </div>

                {/* Risk Factors */}
                {result.riskFactors?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Risk Factors</p>
                    <div className="space-y-2">
                      {result.riskFactors.map((risk: any, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${
                            risk.severity === "high" ? "text-red-500" : risk.severity === "medium" ? "text-yellow-500" : "text-blue-500"
                          }`} />
                          <div>
                            <p className="font-medium text-gray-900">{risk.factor || risk.risk}</p>
                            <p className="text-xs text-gray-500">{risk.mitigation || risk.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Required Tests */}
                {result.requiredTests?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Required Tests</p>
                    <div className="space-y-1.5">
                      {result.requiredTests.map((test: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#003580]" />
                          {typeof test === "string" ? test : test.name || test.test}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {result.nextSteps?.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <p className="text-xs font-semibold text-green-800 mb-2">Next Steps</p>
                    <ul className="space-y-1.5">
                      {result.nextSteps.map((step: any, i: number) => (
                        <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                          <span className="bg-green-200 text-green-800 text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                          {typeof step === "string" ? step : step.action || step.step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.rawAnalysis && (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.rawAnalysis}</p>
                )}

                <button
                  onClick={() => setResult(null)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-purple-600 font-semibold hover:bg-purple-50 rounded-xl transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Run Another Simulation
                </button>
              </div>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">Describe your product to simulate</p>
              <p className="text-xs text-gray-400 mt-1">AI will predict approval probability, timeline & costs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
