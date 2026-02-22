"use client";

import { useState } from "react";
import {
  ClipboardList,
  Loader2,
  CheckCircle2,
  Circle,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Download,
} from "lucide-react";

export default function SellerChecklistPage() {
  const [productType, setProductType] = useState("");
  const [targetStandards, setTargetStandards] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!productType.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const standards = targetStandards
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType, targetStandards: standards }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "Failed to generate checklist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Checklist Generator</h1>
        <p className="text-sm text-gray-500 mt-1">
          Generate a personalized compliance checklist for your product type with testing requirements
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Product Type *
            </label>
            <input
              type="text"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              placeholder="e.g., LED Bulb, Steel Rod, Gold Jewellery, Cement..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Target Standards (optional)
            </label>
            <input
              type="text"
              value={targetStandards}
              onChange={(e) => setTargetStandards(e.target.value)}
              placeholder="e.g., IS 16102, IS 2062 (comma separated)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580]"
            />
            <p className="text-[10px] text-gray-400 mt-1">Leave blank for AI-recommended standards</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["LED Bulb", "Steel TMT Bars", "Gold Jewellery 22K", "Cement OPC 43 Grade", "Electric Switch", "Packaged Water", "Helmet ISI"].map((example) => (
              <button
                key={example}
                onClick={() => setProductType(example)}
                className="text-[11px] px-2.5 py-1.5 bg-green-50 text-[#138808] rounded-full hover:bg-green-100 transition-colors border border-green-100"
              >
                {example}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !productType.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#138808] text-white rounded-xl font-semibold hover:bg-[#0f6b06] transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating Checklist...
              </>
            ) : (
              <>
                <ClipboardList className="h-5 w-5" />
                Generate Checklist
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
              <div className="bg-gradient-to-r from-[#138808] to-[#0f6b06] px-5 py-4 text-white flex items-center justify-between">
                <h2 className="font-bold flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" /> Compliance Checklist
                </h2>
                {result.productType && (
                  <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">
                    {result.productType}
                  </span>
                )}
              </div>
              <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto">
                {/* Applicable Standards */}
                {result.applicableStandards?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Applicable Standards</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.applicableStandards.map((s: any, i: number) => (
                        <span key={i} className="text-[11px] bg-blue-100 text-[#003580] px-2.5 py-1 rounded-full font-medium">
                          {typeof s === "string" ? s : s.code || s.standard}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Checklist Items */}
                {result.checklist?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Checklist ({result.checklist.length} items)
                    </p>
                    <div className="space-y-2">
                      {result.checklist.map((item: any, i: number) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg hover:bg-gray-50">
                          <Circle className="h-4 w-4 text-gray-300 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {typeof item === "string" ? item : item.item || item.requirement}
                            </p>
                            {item.details && (
                              <p className="text-xs text-gray-500 mt-0.5">{item.details}</p>
                            )}
                            {item.priority && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full mt-1 inline-block ${
                                item.priority === "high" ? "bg-red-100 text-red-700" :
                                item.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                                "bg-green-100 text-green-700"
                              }`}>
                                {item.priority} priority
                              </span>
                            )}
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
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#003580] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-gray-800 font-medium">
                              {typeof test === "string" ? test : test.name || test.test}
                            </p>
                            {test.lab && <p className="text-xs text-gray-500">Lab: {test.lab}</p>}
                            {test.estimatedCost && <p className="text-xs text-gray-500">Cost: {test.estimatedCost}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents Required */}
                {result.requiredDocuments?.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                    <p className="text-xs font-semibold text-[#003580] mb-1">Required Documents</p>
                    <ul className="text-xs text-gray-700 space-y-0.5">
                      {result.requiredDocuments.map((doc: any, i: number) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Circle className="h-2 w-2 text-[#003580]" />
                          {typeof doc === "string" ? doc : doc.document || doc.name}
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
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-[#138808] font-semibold hover:bg-green-50 rounded-xl transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Generate Another
                </button>
              </div>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">Enter product type to generate</p>
              <p className="text-xs text-gray-400 mt-1">AI will create a complete compliance checklist</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
