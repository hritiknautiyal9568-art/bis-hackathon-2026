"use client";

import { AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { ComplianceGap, Recommendation } from "@/lib/types";

interface GapAnalysisProps {
  gaps: ComplianceGap[];
  recommendations: Recommendation[];
}

export default function GapAnalysis({ gaps, recommendations }: GapAnalysisProps) {
  const [expandedGap, setExpandedGap] = useState<string | null>(null);
  const [showAllRecs, setShowAllRecs] = useState(false);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: AlertTriangle,
          iconColor: "text-red-500",
          badge: "bg-red-100 text-red-700",
        };
      case "major":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          icon: AlertCircle,
          iconColor: "text-orange-500",
          badge: "bg-orange-100 text-orange-700",
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: Info,
          iconColor: "text-blue-500",
          badge: "bg-blue-100 text-blue-700",
        };
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      material: "🔧",
      safety: "🛡️",
      testing: "🧪",
      documentation: "📄",
      design: "✏️",
      labeling: "🏷️",
    };
    return icons[type] || "📋";
  };

  const criticalCount = gaps.filter((g) => g.severity === "critical").length;
  const majorCount = gaps.filter((g) => g.severity === "major").length;
  const minorCount = gaps.filter((g) => g.severity === "minor").length;

  const displayedRecs = showAllRecs ? recommendations : recommendations.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Gap Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Compliance Gaps</h3>
        
        {/* Summary badges */}
        <div className="flex gap-3 mb-4">
          {criticalCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
              {criticalCount} Critical
            </span>
          )}
          {majorCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
              {majorCount} Major
            </span>
          )}
          {minorCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              {minorCount} Minor
            </span>
          )}
        </div>

        {/* Gap list */}
        <div className="space-y-3">
          {gaps.map((gap) => {
            const style = getSeverityStyle(gap.severity);
            const Icon = style.icon;
            const isExpanded = expandedGap === gap.id;

            return (
              <div
                key={gap.id}
                className={`rounded-xl border ${style.border} ${style.bg} overflow-hidden`}
              >
                <button
                  className="w-full flex items-start gap-3 p-4 text-left"
                  onClick={() => setExpandedGap(isExpanded ? null : gap.id)}
                >
                  <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${style.iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-semibold text-gray-600">
                        {gap.standard}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${style.badge}`}>
                        {gap.severity}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        {gap.currentStatus}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {gap.requirement}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 ml-8">
                    <p className="text-sm text-gray-600">{gap.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          AI Recommendations
        </h3>

        <div className="space-y-3">
          {displayedRecs.map((rec) => (
            <div
              key={rec.id}
              className="rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getTypeIcon(rec.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {rec.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityStyle(
                        rec.priority
                      )}`}
                    >
                      {rec.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                  <div className="flex gap-4 mt-2">
                    {rec.estimatedCost && (
                      <span className="text-xs text-gray-500">
                        💰 {rec.estimatedCost}
                      </span>
                    )}
                    {rec.estimatedTime && (
                      <span className="text-xs text-gray-500">
                        ⏱️ {rec.estimatedTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recommendations.length > 3 && (
          <button
            onClick={() => setShowAllRecs(!showAllRecs)}
            className="mt-3 text-sm text-[#003580] hover:underline font-medium"
          >
            {showAllRecs
              ? "Show less"
              : `Show ${recommendations.length - 3} more recommendations`}
          </button>
        )}
      </div>
    </div>
  );
}
