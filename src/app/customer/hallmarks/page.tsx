"use client";

import { useState } from "react";
import { CERTIFICATION_MARKS, MARK_CATEGORIES, searchMarks, getMarksByCategory } from "@/data/certification-marks";
import type { CertificationMark } from "@/data/certification-marks";
import {
  Search,
  Award,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";

export default function HallmarksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedMark, setExpandedMark] = useState<string | null>(null);

  const filteredMarks = searchQuery
    ? searchMarks(searchQuery)
    : selectedCategory
    ? getMarksByCategory(selectedCategory)
    : CERTIFICATION_MARKS;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Indian Certification Marks</h1>
        <p className="text-sm text-gray-500 mt-1">
          Comprehensive database of all Indian product certification marks and hallmarks
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSelectedCategory(null); }}
            placeholder="Search marks... (e.g., ISI, Hallmark, FSSAI, BEE)"
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580]"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              !selectedCategory && !searchQuery
                ? "bg-[#003580] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-[#003580]"
            }`}
          >
            All ({CERTIFICATION_MARKS.length})
          </button>
          {MARK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setSearchQuery(""); }}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-[#003580] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-[#003580]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-gray-500">
        Showing {filteredMarks.length} of {CERTIFICATION_MARKS.length} certification marks
      </p>

      {/* Marks Grid */}
      <div className="space-y-3">
        {filteredMarks.map((mark) => {
          const isExpanded = expandedMark === mark.id;

          return (
            <div
              key={mark.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedMark(isExpanded ? null : mark.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="text-4xl shrink-0">{mark.logo}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{mark.shortName}</h3>
                    {mark.mandatoryFor.length > 0 && (
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                        Mandatory
                      </span>
                    )}
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      {mark.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{mark.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Issued by: {mark.organization}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                )}
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                  <p className="text-sm text-gray-700">{mark.description}</p>

                  {/* Products Covered */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Applicable To</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mark.applicableTo.map((p) => (
                        <span
                          key={p}
                          className="text-[11px] bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* How to Identify */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <Search className="h-3 w-3" /> How to Identify
                    </p>
                    <ul className="space-y-1.5">
                      {mark.howToIdentify.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#138808] shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Verification Steps */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Verification Steps
                    </p>
                    <ul className="space-y-1.5">
                      {mark.verificationSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="bg-[#003580] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mandatory For */}
                  {mark.mandatoryFor.length > 0 && (
                    <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                      <p className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Mandatory For
                      </p>
                      <ul className="space-y-1">
                        {mark.mandatoryFor.map((item, i) => (
                          <li key={i} className="text-xs text-red-600">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Counterfeiting Warnings */}
                  {mark.commonCounterfeitSigns.length > 0 && (
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                      <p className="text-xs font-semibold text-yellow-800 mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Common Counterfeit Signs
                      </p>
                      <ul className="space-y-1">
                        {mark.commonCounterfeitSigns.map((w, i) => (
                          <li key={i} className="text-xs text-yellow-700">• {w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Penalty */}
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Penalty for Misuse</p>
                    <p className="text-xs text-gray-600">{mark.penaltyForMisuse}</p>
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap gap-3">
                    {mark.officialWebsite && (
                      <a
                        href={mark.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-[#003580] font-medium hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" /> Official Website
                      </a>
                    )}
                    <p className="text-xs text-gray-500">{mark.contactInfo}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredMarks.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-600">No marks found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
