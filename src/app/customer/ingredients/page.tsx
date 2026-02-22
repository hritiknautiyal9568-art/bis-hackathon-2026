"use client";

import { useState, useCallback } from "react";
import LiveScanner from "@/components/LiveScanner";
import {
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  Shield,
  Heart,
  Leaf,
  Ban,
  Info,
} from "lucide-react";

export default function IngredientsPage() {
  const [scanMode, setScanMode] = useState<"hallmark" | "product" | "label" | "barcode">("label");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeIngredients = useCallback(
    async (imageBase64: string, imageMimeType: string) => {
      setScanning(true);
      setError(null);
      setResult(null);
      try {
        const res = await fetch("/api/ingredients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64, imageMimeType }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setResult(data.result);
      } catch (err: any) {
        setError(err.message || "Analysis failed");
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
        await analyzeIngredients(base64, file.type || "image/jpeg");
      };
      reader.readAsDataURL(file);
    },
    [analyzeIngredients]
  );

  const ratingColors: Record<string, string> = {
    safe: "bg-green-50 text-green-700 border-green-200",
    caution: "bg-yellow-50 text-yellow-700 border-yellow-200",
    harmful: "bg-red-50 text-red-700 border-red-200",
    banned: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-xl">
            <FlaskConical className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Ingredient Analyzer</h1>
        </div>
        <p className="text-sm text-gray-500">
          Scan product labels to identify ingredients, check safety, spot harmful substances &amp; verify FSSAI compliance
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm sticky top-24">
            <LiveScanner
              onCapture={analyzeIngredients}
              onFileUpload={handleFileUpload}
              scanning={scanning}
              scanMode={scanMode}
              onModeChange={setScanMode}
              lastResult={result}
              compact
            />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {scanning && (
            <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <FlaskConical className="h-12 w-12 text-purple-500 animate-pulse mb-4" />
              <p className="font-bold text-gray-900 text-lg">Analyzing Ingredients...</p>
              <p className="text-xs text-gray-500 mt-1">Checking safety, allergens, and compliance</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <p className="font-semibold text-red-800">Analysis Failed</p>
              </div>
              <p className="text-sm text-red-600">{error}</p>
              <button onClick={() => { setError(null); setResult(null); }} className="mt-3 flex items-center gap-1 text-sm text-red-700 font-medium hover:underline">
                <RotateCcw className="h-3.5 w-3.5" /> Try Again
              </button>
            </div>
          )}

          {result && !scanning && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white">
                <p className="text-purple-100 text-xs font-medium uppercase tracking-wider mb-1">Ingredient Analysis</p>
                <h2 className="text-xl font-bold">{result.productIdentified || "Product"}</h2>
                {result.productType && <p className="text-purple-200 text-sm mt-0.5">Type: {result.productType}</p>}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                    <p className="text-2xl font-bold">{result.overallSafetyScore ?? "—"}</p>
                    <p className="text-[10px] text-purple-200">Safety Score</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                    <p className="text-2xl font-bold">{result.ingredientsFound?.length || 0}</p>
                    <p className="text-[10px] text-purple-200">Ingredients Found</p>
                  </div>
                </div>
              </div>

              {/* Harmful Ingredients Alert */}
              {result.harmfulIngredients?.length > 0 && (
                <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
                  <p className="font-bold text-red-800 flex items-center gap-2 mb-3">
                    <Ban className="h-4 w-4" /> Harmful Ingredients Detected
                  </p>
                  {result.harmfulIngredients.map((item: any, i: number) => (
                    <div key={i} className="bg-white rounded-xl p-3 mb-2 border border-red-100">
                      <p className="font-semibold text-red-800 text-sm">{item.name}</p>
                      <p className="text-xs text-red-600 mt-0.5">{item.concern}</p>
                      {item.alternative && (
                        <p className="text-xs text-green-700 mt-1 bg-green-50 rounded-lg px-2 py-1">
                          <Leaf className="h-3 w-3 inline mr-1" />
                          Safer alternative: {item.alternative}
                        </p>
                      )}
                      {item.bannedIn?.length > 0 && (
                        <p className="text-[10px] text-gray-500 mt-1">Banned in: {item.bannedIn.join(", ")}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* All Ingredients */}
              {result.ingredientsFound?.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-3">All Ingredients</h3>
                  <div className="space-y-2">
                    {result.ingredientsFound.map((ing: any, i: number) => (
                      <div key={i} className={`rounded-xl p-3 border ${ratingColors[ing.safetyRating] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold text-sm">{ing.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-black/5">{ing.category}</span>
                            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full ${
                              ing.safetyRating === "safe" ? "bg-green-200 text-green-800" :
                              ing.safetyRating === "caution" ? "bg-yellow-200 text-yellow-800" :
                              "bg-red-200 text-red-800"
                            }`}>
                              {ing.safetyRating}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs opacity-80">{ing.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergens */}
              {result.allergens?.length > 0 && (
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-200">
                  <p className="font-bold text-orange-800 flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4" /> Allergens Detected
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.allergens.map((a: string, i: number) => (
                      <span key={i} className="text-xs bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* FSSAI Compliance */}
              {result.fssaiCompliance && (
                <div className={`rounded-2xl p-5 border shadow-sm ${result.fssaiCompliance.compliant ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Shield className="h-4 w-4" /> FSSAI Compliance
                    </h3>
                    <span className={`text-xs font-bold ${result.fssaiCompliance.compliant ? "text-green-700" : "text-red-700"}`}>
                      {result.fssaiCompliance.compliant ? "✅ Compliant" : "❌ Non-Compliant"}
                    </span>
                  </div>
                  {result.fssaiCompliance.issues?.map((issue: string, i: number) => (
                    <p key={i} className="text-xs text-gray-600 mb-1 flex items-start gap-1.5">
                      <XCircle className="h-3 w-3 text-red-500 shrink-0 mt-0.5" /> {issue}
                    </p>
                  ))}
                </div>
              )}

              {/* Health Advisory */}
              {result.healthAdvisory && (
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
                  <p className="font-bold text-[#003580] flex items-center gap-2 mb-1">
                    <Heart className="h-4 w-4" /> Health Advisory
                  </p>
                  <p className="text-sm text-gray-700">{result.healthAdvisory}</p>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations?.length > 0 && (
                <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
                  <p className="text-xs font-bold text-green-800 mb-2">Recommendations</p>
                  {result.recommendations.map((r: string, i: number) => (
                    <p key={i} className="text-xs text-green-700 mb-1 flex items-start gap-1.5">
                      <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" /> {r}
                    </p>
                  ))}
                </div>
              )}

              {result.rawAnalysis && (
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.rawAnalysis}</p>
                </div>
              )}

              <button onClick={() => setResult(null)} className="w-full flex items-center justify-center gap-2 py-3 text-sm text-[#003580] font-semibold hover:bg-blue-50 rounded-xl transition-colors border border-gray-200">
                <RotateCcw className="h-4 w-4" /> Analyze Another Product
              </button>
            </>
          )}

          {!result && !scanning && !error && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
              <div className="bg-purple-50 p-6 rounded-2xl inline-block mb-4">
                <FlaskConical className="h-12 w-12 text-purple-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Scan Product Labels</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Point your camera at any product ingredient list to identify harmful substances, allergens, and check FSSAI compliance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
