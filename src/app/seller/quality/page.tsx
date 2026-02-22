"use client";

import { useState, useCallback } from "react";
import LiveScanner from "@/components/LiveScanner";
import {
  Scan,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Star,
} from "lucide-react";

export default function SellerQualityPage() {
  const [scanMode, setScanMode] = useState<"hallmark" | "product" | "label" | "barcode">("product");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = useCallback(
    async (imageBase64: string, imageMimeType: string) => {
      setScanning(true);
      setError(null);
      setResult(null);

      try {
        const res = await fetch("/api/quality", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64, imageMimeType }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setResult(data.result);
      } catch (err: any) {
        setError(err.message || "Analysis failed.");
      } finally {
        setScanning(false);
      }
    },
    []
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      setScanning(true);
      setError(null);
      setResult(null);

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        await analyzeImage(base64, file.type || "image/jpeg");
      };
      reader.readAsDataURL(file);
    },
    [analyzeImage]
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Quality Inspector</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload or capture product images for AI-powered visual quality assessment and defect detection
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scanner */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <LiveScanner
            onCapture={analyzeImage}
            onFileUpload={handleFileUpload}
            scanning={scanning}
            scanMode={scanMode}
            onModeChange={setScanMode}
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          {scanning && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <Loader2 className="h-10 w-10 text-[#003580] animate-spin mb-3" />
              <p className="font-semibold text-gray-900">Inspecting Quality...</p>
              <p className="text-xs text-gray-500 mt-1">AI is analyzing your product image</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <p className="font-semibold text-red-800">Error</p>
              </div>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}

          {result && !scanning && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-4 text-white flex items-center gap-2">
                <Scan className="h-5 w-5" />
                <h2 className="font-bold">Quality Assessment</h2>
              </div>
              <div className="p-5 space-y-4">
                {/* Score */}
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-black ${
                    (result.qualityScore || 0) >= 70 ? "text-[#138808]" : (result.qualityScore || 0) >= 40 ? "text-[#FF9933]" : "text-red-600"
                  }`}>
                    {result.qualityScore || "N/A"}
                    {result.qualityScore && <span className="text-lg">/100</span>}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {result.productIdentified || "Product"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Grade: <span className="font-bold">{result.qualityGrade || "N/A"}</span>
                    </p>
                  </div>
                </div>

                {/* Defects */}
                {result.visualDefects?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Visual Defects Found</p>
                    <div className="space-y-2">
                      {result.visualDefects.map((d: any, i: number) => (
                        <div key={i} className={`rounded-xl p-3 border ${
                          d.severity === "critical" ? "bg-red-50 border-red-200" :
                          d.severity === "major" ? "bg-yellow-50 border-yellow-200" :
                          "bg-blue-50 border-blue-200"
                        }`}>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-800">{d.defect}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              d.severity === "critical" ? "bg-red-100 text-red-700" :
                              d.severity === "major" ? "bg-yellow-100 text-yellow-700" :
                              "bg-blue-100 text-blue-700"
                            }`}>
                              {d.severity}
                            </span>
                          </div>
                          {d.location && <p className="text-xs text-gray-500 mt-0.5">Location: {d.location}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Packaging Quality */}
                {result.packagingQuality && (
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-gray-700">Packaging Quality</p>
                      <span className="font-bold text-sm">{result.packagingQuality.score}/100</span>
                    </div>
                    {result.packagingQuality.observations?.map((o: string, i: number) => (
                      <p key={i} className="text-xs text-gray-600">• {o}</p>
                    ))}
                  </div>
                )}

                {/* Safety */}
                {result.safetyObservations?.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                    <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Safety Observations
                    </p>
                    {result.safetyObservations.map((s: string, i: number) => (
                      <p key={i} className="text-xs text-red-600">• {s}</p>
                    ))}
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations?.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                    <p className="text-xs font-semibold text-green-700 mb-1">Recommendations</p>
                    {result.recommendations.map((r: string, i: number) => (
                      <p key={i} className="text-xs text-green-600">• {r}</p>
                    ))}
                  </div>
                )}

                {/* Overall Verdict */}
                {result.overallVerdict && (
                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                    <p className="text-sm text-gray-700">{result.overallVerdict}</p>
                  </div>
                )}

                {result.rawAnalysis && (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.rawAnalysis}</p>
                )}

                <button
                  onClick={() => setResult(null)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-orange-600 font-semibold hover:bg-orange-50 rounded-xl transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Inspect Another Product
                </button>
              </div>
            </div>
          )}

          {!result && !scanning && !error && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <Scan className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">Upload product image</p>
              <p className="text-xs text-gray-400 mt-1">AI will detect defects, assess quality, and provide a score</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
