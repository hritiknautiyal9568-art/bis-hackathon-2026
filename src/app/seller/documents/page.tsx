"use client";

import { useState } from "react";
import {
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

const documentTypes = [
  { id: "bis-application", label: "BIS License Application" },
  { id: "test-report", label: "Test Report" },
  { id: "factory-inspection", label: "Factory Inspection Report" },
  { id: "quality-manual", label: "Quality Control Manual" },
  { id: "declaration", label: "Declaration of Conformity" },
  { id: "renewal", label: "License Renewal Application" },
  { id: "other", label: "Other Document" },
];

export default function SellerDocumentsPage() {
  const [documentType, setDocumentType] = useState("bis-application");
  const [documentText, setDocumentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!documentText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText, documentType }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Document Analyzer</h1>
        <p className="text-sm text-gray-500 mt-1">
          Submit application documents for AI review — catch errors and missing information before submission
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580]"
            >
              {documentTypes.map((dt) => (
                <option key={dt.id} value={dt.id}>
                  {dt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Document Content *
            </label>
            <textarea
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="Paste your document content here... Include all form fields, details, and data that you want reviewed."
              rows={12}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580] resize-none font-mono"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !documentText.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Reviewing Document...
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                Analyze Document
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
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-4 text-white flex items-center justify-between">
                <h2 className="font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Document Review
                </h2>
                {result.readyForSubmission !== undefined && (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    result.readyForSubmission ? "bg-green-400/30 text-white" : "bg-red-400/30 text-white"
                  }`}>
                    {result.readyForSubmission ? "Ready ✓" : "Needs Work ✗"}
                  </span>
                )}
              </div>
              <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto">
                {/* Completeness Score */}
                {result.completeness !== undefined && (
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl font-black ${
                      result.completeness >= 80 ? "text-[#138808]" : result.completeness >= 50 ? "text-[#FF9933]" : "text-red-600"
                    }`}>
                      {result.completeness}%
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Document Completeness</p>
                      <p className="text-xs text-gray-500">
                        {result.estimatedProcessingTime && `Est. Processing: ${result.estimatedProcessingTime}`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Missing Fields */}
                {result.missingFields?.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                    <p className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-1">
                      <XCircle className="h-3 w-3" /> Missing Fields ({result.missingFields.length})
                    </p>
                    <ul className="text-xs text-red-600 space-y-1">
                      {result.missingFields.map((f: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <XCircle className="h-3 w-3 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Present Fields */}
                {result.presentFields?.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                    <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Present Fields ({result.presentFields.length})
                    </p>
                    <ul className="text-xs text-green-600 space-y-0.5">
                      {result.presentFields.map((f: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Errors */}
                {result.errors?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Errors Found</p>
                    <div className="space-y-2">
                      {result.errors.map((err: any, i: number) => (
                        <div key={i} className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
                          <p className="text-sm font-medium text-yellow-800">{err.field}</p>
                          <p className="text-xs text-yellow-700 mt-0.5">{err.issue}</p>
                          {err.suggestion && (
                            <p className="text-xs text-green-700 mt-0.5 flex items-center gap-1">
                              <ArrowRight className="h-3 w-3" /> Fix: {err.suggestion}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Required Attachments */}
                {result.requiredAttachments?.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                    <p className="text-xs font-semibold text-[#003580] mb-1">Required Attachments</p>
                    <ul className="text-xs text-gray-700 space-y-0.5">
                      {result.requiredAttachments.map((a: string, i: number) => (
                        <li key={i}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Steps */}
                {result.nextSteps?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Next Steps</p>
                    <div className="space-y-1.5">
                      {result.nextSteps.map((step: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="bg-teal-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.rawAnalysis && (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.rawAnalysis}</p>
                )}

                <button
                  onClick={() => setResult(null)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-teal-600 font-semibold hover:bg-teal-50 rounded-xl transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Review Another Document
                </button>
              </div>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">Paste document content to review</p>
              <p className="text-xs text-gray-400 mt-1">AI will check completeness, find errors, and suggest fixes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
