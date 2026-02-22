"use client";

import { useState } from "react";
import {
  BookOpen,
  Search,
  Shield,
  ChevronRight,
  ExternalLink,
  Loader2,
  Info,
  CheckCircle,
  Lightbulb,
  AlertTriangle,
  X,
} from "lucide-react";
import { BIS_STANDARDS, STANDARD_CATEGORIES, searchStandards, getStandardsByCategory, type BISStandard } from "@/data/bis-standards";

export default function StandardsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<BISStandard | null>(null);
  const [explanation, setExplanation] = useState<any>(null);
  const [explainLoading, setExplainLoading] = useState(false);

  const filteredStandards = searchQuery
    ? searchStandards(searchQuery)
    : selectedCategory
    ? getStandardsByCategory(selectedCategory)
    : BIS_STANDARDS;

  const handleExplain = async (standard: BISStandard) => {
    setSelectedStandard(standard);
    setExplainLoading(true);
    setExplanation(null);

    try {
      const response = await fetch("/api/standards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isCode: standard.isCode,
          title: standard.title,
          requirements: standard.keyRequirements,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setExplanation(data.data);
      }
    } catch (error) {
      console.error("Failed to explain standard:", error);
    } finally {
      setExplainLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003580] to-[#002a66] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/10 p-2 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">BIS Standards Explorer</h1>
          </div>
          <p className="text-blue-200 max-w-2xl">
            Browse and search Indian Standards in plain, simple language. Click &quot;Explain Simply&quot;
            for AI-powered explanations designed for MSMEs and small businesses.
          </p>

          {/* Search bar */}
          <div className="mt-6 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedCategory(null);
                }}
                placeholder="Search by IS code, product name, or category..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm sticky top-24">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 px-2">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    !selectedCategory && !searchQuery
                      ? "bg-[#003580] text-white font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Standards ({BIS_STANDARDS.length})
                </button>
                {STANDARD_CATEGORIES.map((cat) => {
                  const count = getStandardsByCategory(cat).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSearchQuery("");
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
                        selectedCategory === cat
                          ? "bg-[#003580] text-white font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-xs ${selectedCategory === cat ? "text-blue-200" : "text-gray-400"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Standards List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing {filteredStandards.length} standard{filteredStandards.length !== 1 ? "s" : ""}
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory && ` in ${selectedCategory}`}
              </p>
            </div>

            {filteredStandards.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900">No standards found</h3>
                <p className="text-sm text-gray-500 mt-1">Try a different search term or category</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStandards.map((standard) => (
                  <div
                    key={standard.id}
                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-mono font-bold text-[#003580]">
                            {standard.isCode}
                          </span>
                          {standard.mandatoryCertification && (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">
                              Mandatory
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            {standard.category}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-2">
                          {standard.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{standard.description}</p>

                        {/* Key Requirements */}
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-500 mb-1.5">Key Requirements:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {standard.keyRequirements.slice(0, 3).map((req, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 rounded-lg text-xs bg-blue-50 text-blue-700"
                              >
                                {req}
                              </span>
                            ))}
                            {standard.keyRequirements.length > 3 && (
                              <span className="px-2 py-1 rounded-lg text-xs bg-gray-50 text-gray-500">
                                +{standard.keyRequirements.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Applicable Products */}
                        <div className="flex flex-wrap gap-1.5">
                          {standard.applicableProducts.map((product, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                            >
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleExplain(standard)}
                        className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#003580] text-white hover:bg-[#002a66] transition-colors"
                      >
                        <Lightbulb className="h-4 w-4" />
                        Explain Simply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simple Explanation Modal */}
      {selectedStandard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl flex items-start justify-between">
              <div>
                <span className="text-sm font-mono font-bold text-[#003580]">
                  {selectedStandard.isCode}
                </span>
                <h2 className="text-lg font-bold text-gray-900">{selectedStandard.title}</h2>
              </div>
              <button
                onClick={() => {
                  setSelectedStandard(null);
                  setExplanation(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {explainLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 text-[#003580] animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    AI is preparing a simple explanation...
                  </p>
                </div>
              ) : explanation ? (
                <div className="space-y-6">
                  {/* Simple Summary */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-[#003580] mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" /> Simple Summary
                    </h3>
                    <p className="text-sm text-gray-700">{explanation.simpleSummary}</p>
                  </div>

                  {/* Why It Matters */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Why It Matters</h3>
                    <p className="text-sm text-gray-600">{explanation.whyItMatters}</p>
                  </div>

                  {/* Key Points */}
                  {explanation.keyPointsSimple && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" /> Key Points
                      </h3>
                      <ul className="space-y-2">
                        {explanation.keyPointsSimple.map((point: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-[#003580] font-bold mt-0.5">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Common Mistakes */}
                  {explanation.commonMistakes && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" /> Common Mistakes
                      </h3>
                      <ul className="space-y-2">
                        {explanation.commonMistakes.map((mistake: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-orange-500 font-bold mt-0.5">⚠</span>
                            {mistake}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cost & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    {explanation.costEstimate && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs font-semibold text-gray-500">Estimated Cost</p>
                        <p className="text-sm font-bold text-gray-900">{explanation.costEstimate}</p>
                      </div>
                    )}
                    {explanation.timeEstimate && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs font-semibold text-gray-500">Estimated Time</p>
                        <p className="text-sm font-bold text-gray-900">{explanation.timeEstimate}</p>
                      </div>
                    )}
                  </div>

                  {/* Tips */}
                  {explanation.helpfulTips && (
                    <div className="bg-green-50 rounded-xl p-4">
                      <h3 className="text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" /> Tips for MSMEs
                      </h3>
                      <ul className="space-y-1.5">
                        {explanation.helpfulTips.map((tip: string, i: number) => (
                          <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                            <span>💡</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">
                    Failed to load explanation. Please try again.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
