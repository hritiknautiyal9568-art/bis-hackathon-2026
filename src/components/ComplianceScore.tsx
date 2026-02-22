"use client";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ComplianceScoreProps {
  score: number;
  status: "compliant" | "partially-compliant" | "non-compliant";
  productName?: string;
}

export default function ComplianceScore({ score, status, productName }: ComplianceScoreProps) {
  const getColor = () => {
    if (score >= 80) return { main: "#138808", trail: "#e8f5e9", bg: "bg-green-50", border: "border-green-200" };
    if (score >= 40) return { main: "#FF9933", trail: "#fff3e0", bg: "bg-orange-50", border: "border-orange-200" };
    return { main: "#d32f2f", trail: "#ffebee", bg: "bg-red-50", border: "border-red-200" };
  };

  const getStatusInfo = () => {
    switch (status) {
      case "compliant":
        return { label: "Compliant", icon: CheckCircle, color: "text-green-700", bgBadge: "bg-green-100" };
      case "partially-compliant":
        return { label: "Partially Compliant", icon: AlertTriangle, color: "text-orange-700", bgBadge: "bg-orange-100" };
      case "non-compliant":
        return { label: "Non-Compliant", icon: XCircle, color: "text-red-700", bgBadge: "bg-red-100" };
    }
  };

  const colors = getColor();
  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className={`rounded-2xl p-6 ${colors.bg} border ${colors.border}`}>
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
        Compliance Score
      </h3>

      <div className="flex items-center gap-6">
        <div className="w-28 h-28 flex-shrink-0">
          <CircularProgressbar
            value={score}
            text={`${score}%`}
            styles={buildStyles({
              textSize: "22px",
              textColor: colors.main,
              pathColor: colors.main,
              trailColor: colors.trail,
              pathTransitionDuration: 1.5,
            })}
          />
        </div>

        <div className="flex-1">
          {productName && (
            <p className="text-lg font-bold text-gray-900 mb-1">{productName}</p>
          )}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.bgBadge} ${statusInfo.color}`}
          >
            <StatusIcon className="h-4 w-4" />
            {statusInfo.label}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {score >= 80
              ? "Your product meets most BIS requirements. Minor adjustments may be needed."
              : score >= 40
              ? "Several requirements need attention before BIS certification."
              : "Significant gaps found. Major improvements required for compliance."}
          </p>
        </div>
      </div>
    </div>
  );
}
