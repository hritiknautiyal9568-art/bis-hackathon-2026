"use client";

import { useState, useCallback } from "react";
import LiveScanner from "@/components/LiveScanner";
import { DemoBanner } from "@/components/DemoBanner";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  Download,
  Info,
} from "lucide-react";

export default function CustomerScanPage() {
  const [scanMode, setScanMode] = useState<"hallmark" | "product" | "label" | "barcode">("hallmark");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const handleCapture = useCallback(
    async (imageBase64: string, imageMimeType: string) => {
      setScanning(true);
      setError(null);
      setResult(null);
      setIsDemo(false);

      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64, imageMimeType, scanMode }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setResult(data.result);
        if (data.isDemo) setIsDemo(true);
      } catch (err: any) {
        setError(err.message || "Scan failed. Please try again.");
      } finally {
        setScanning(false);
      }
    },
    [scanMode]
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      setScanning(true);
      setError(null);
      setResult(null);
      setIsDemo(false);

      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const dataUrl = reader.result as string;
          const base64 = dataUrl.split(",")[1];
          const mimeType = file.type || "image/jpeg";

          const res = await fetch("/api/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageBase64: base64,
              imageMimeType: mimeType,
              scanMode,
            }),
          });

          const data = await res.json();
          if (data.error) throw new Error(data.error);
          setResult(data.result);
          if (data.isDemo) setIsDemo(true);
          setScanning(false);
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        setError(err.message || "Upload failed.");
        setScanning(false);
      }
    },
    [scanMode]
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Live Camera Scanner</h1>
        <p className="text-sm text-gray-500 mt-1">
          Point your camera at product marks, labels, or barcodes for instant AI analysis
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scanner */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <LiveScanner
            onCapture={handleCapture}
            onFileUpload={handleFileUpload}
            scanning={scanning}
            scanMode={scanMode}
            onModeChange={setScanMode}
            lastResult={result}
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          {isDemo && <DemoBanner />}

          {scanning && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
              <Loader2 className="h-10 w-10 text-[#003580] animate-spin mb-3" />
              <p className="font-semibold text-gray-900">Analyzing with Gemini AI...</p>
              <p className="text-xs text-gray-500 mt-1">
                {scanMode === "hallmark" && "Identifying certification marks..."}
                {scanMode === "product" && "Analyzing product compliance..."}
                {scanMode === "label" && "Reading label information..."}
                {scanMode === "barcode" && "Decoding barcodes & codes..."}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <p className="font-semibold text-red-800">Analysis Failed</p>
              </div>
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={() => { setError(null); setResult(null); }}
                className="mt-3 flex items-center gap-1 text-sm text-red-700 font-medium hover:underline"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Try Again
              </button>
            </div>
          )}

          {result && !scanning && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#003580] to-[#0052cc] px-5 py-4 text-white">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  <h2 className="font-bold">Scan Results</h2>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Hallmark mode results */}
                {scanMode === "hallmark" && result.marksFound && (
                  <>
                    {result.marksFound.map((mark: any, i: number) => (
                      <div key={i} className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{mark.markName}</h3>
                          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                            mark.isAuthentic
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}>
                            {mark.isAuthentic ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <AlertTriangle className="h-3 w-3" />
                            )}
                            {mark.confidence}% confidence
                          </div>
                        </div>
                        {mark.details && (
                          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                            {mark.details.licenseNumber && (
                              <div>
                                <span className="text-gray-400">License:</span>{" "}
                                <span className="text-gray-700 font-medium">{mark.details.licenseNumber}</span>
                              </div>
                            )}
                            {mark.details.standardCode && (
                              <div>
                                <span className="text-gray-400">Standard:</span>{" "}
                                <span className="text-gray-700 font-medium">{mark.details.standardCode}</span>
                              </div>
                            )}
                            {mark.details.organization && (
                              <div>
                                <span className="text-gray-400">Org:</span>{" "}
                                <span className="text-gray-700 font-medium">{mark.details.organization}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {mark.authenticityNotes && (
                          <p className="text-xs text-gray-500">{mark.authenticityNotes}</p>
                        )}
                      </div>
                    ))}
                    {result.overallAssessment && (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Info className="h-4 w-4 text-[#003580]" />
                          <p className="text-sm font-semibold text-[#003580]">Assessment</p>
                        </div>
                        <p className="text-sm text-gray-700">{result.overallAssessment}</p>
                      </div>
                    )}
                  </>
                )}

                {/* Product mode results */}
                {scanMode === "product" && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{result.productName}</p>
                        <p className="text-xs text-gray-500">{result.productCategory}</p>
                      </div>
                    </div>
                    {result.missingMarks?.length > 0 && (
                      <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                        <p className="text-xs font-semibold text-red-700 mb-1">Missing Required Marks</p>
                        <div className="flex flex-wrap gap-1">
                          {result.missingMarks.map((m: string, i: number) => (
                            <span key={i} className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{m}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.applicableStandards && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">Applicable Standards</p>
                        {result.applicableStandards.map((s: any, i: number) => (
                          <div key={i} className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-[#003580]" />
                            <span className="font-medium">{s.isCode}</span> — {s.title}
                            {s.mandatory && <span className="text-red-500 font-bold ml-1">(Mandatory)</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Label mode results */}
                {scanMode === "label" && (
                  <>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {result.productName && (
                        <div><span className="text-gray-400 text-xs">Product:</span><br/><span className="font-medium">{result.productName}</span></div>
                      )}
                      {result.manufacturer && (
                        <div><span className="text-gray-400 text-xs">Manufacturer:</span><br/><span className="font-medium">{result.manufacturer}</span></div>
                      )}
                      {result.mrp && (
                        <div><span className="text-gray-400 text-xs">MRP:</span><br/><span className="font-medium">{result.mrp}</span></div>
                      )}
                      {result.expiryDate && (
                        <div><span className="text-gray-400 text-xs">Expiry:</span><br/><span className="font-medium">{result.expiryDate}</span></div>
                      )}
                    </div>
                    {result.complianceScore !== undefined && (
                      <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                        <p className="text-xs text-gray-500 mb-1">Label Compliance Score</p>
                        <p className="text-2xl font-bold text-[#003580]">{result.complianceScore}%</p>
                      </div>
                    )}
                    {result.missingInfo?.length > 0 && (
                      <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
                        <p className="text-xs font-semibold text-yellow-800 mb-1">Missing Information</p>
                        <ul className="text-xs text-yellow-700 space-y-0.5">
                          {result.missingInfo.map((m: string, i: number) => (
                            <li key={i}>• {m}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {/* Barcode mode results */}
                {scanMode === "barcode" && result.codesFound && (
                  <>
                    {result.codesFound.map((code: any, i: number) => (
                      <div key={i} className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900">{code.type}</p>
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{code.format}</span>
                        </div>
                        <p className="text-sm text-[#003580] font-mono">{code.value}</p>
                      </div>
                    ))}
                  </>
                )}

                {/* Warnings */}
                {result.warnings?.length > 0 && (
                  <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
                    <p className="text-xs font-semibold text-yellow-800 mb-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Warnings
                    </p>
                    <ul className="text-xs text-yellow-700 space-y-0.5">
                      {result.warnings.map((w: string, i: number) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations?.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                    <p className="text-xs font-semibold text-green-800 mb-1">Recommendations</p>
                    <ul className="text-xs text-green-700 space-y-0.5">
                      {result.recommendations.map((r: string, i: number) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Raw Analysis Fallback */}
                {result.rawAnalysis && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.rawAnalysis}</p>
                  </div>
                )}

                {/* Reset */}
                <button
                  onClick={() => setResult(null)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-[#003580] font-semibold hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Scan Again
                </button>
              </div>
            </div>
          )}

          {/* Tips when no result */}
          {!result && !scanning && !error && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Tips for Best Results</h3>
              <div className="space-y-3">
                {[
                  "Hold the camera steady and close to the mark",
                  "Ensure good lighting — avoid shadows on the mark",
                  "For ISI marks, capture the complete triangle logo",
                  "For hallmarks, include the HUID number",
                  "Barcodes should be flat and fully visible",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-[#138808] shrink-0 mt-0.5" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
