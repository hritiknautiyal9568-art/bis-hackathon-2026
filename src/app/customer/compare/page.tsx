"use client";

import { useState, useRef, useCallback } from "react";
import {
  Sparkles,
  ArrowLeftRight,
  Camera,
  Upload,
  Loader2,
  Trophy,
  Shield,
  Star,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Image as ImageIcon,
  X,
} from "lucide-react";

export default function ComparePage() {
  const [image1, setImage1] = useState<{ base64: string; preview: string; mimeType: string } | null>(null);
  const [image2, setImage2] = useState<{ base64: string; preview: string; mimeType: string } | null>(null);
  const [comparing, setComparing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);

  const handleImage = (file: File, slot: 1 | 2) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      const data = { base64, preview: dataUrl, mimeType: file.type || "image/jpeg" };
      if (slot === 1) setImage1(data);
      else setImage2(data);
    };
    reader.readAsDataURL(file);
  };

  const compareProducts = useCallback(async () => {
    if (!image1 || !image2) return;
    setComparing(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image1Base64: image1.base64,
          image1MimeType: image1.mimeType,
          image2Base64: image2.base64,
          image2MimeType: image2.mimeType,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "Comparison failed");
    } finally {
      setComparing(false);
    }
  }, [image1, image2]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const ImageSlot = ({ slot, image, fileRef }: { slot: 1 | 2; image: any; fileRef: any }) => (
    <div className="flex-1">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImage(file, slot);
        }}
      />
      {image ? (
        <div className="relative group">
          <img src={image.preview} alt={`Product ${slot === 1 ? "A" : "B"}`} className="w-full h-48 object-cover rounded-xl" />
          <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Product {slot === 1 ? "A" : "B"}
          </div>
          <button
            onClick={() => { if (slot === 1) setImage1(null); else setImage2(null); setResult(null); }}
            className="absolute top-2 right-2 bg-red-500/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#003580] hover:text-[#003580] hover:bg-blue-50/30 transition-all"
        >
          <div className="bg-gray-100 p-3 rounded-full">
            <Camera className="h-6 w-6" />
          </div>
          <span className="text-xs font-semibold">Upload Product {slot === 1 ? "A" : "B"}</span>
          <span className="text-[10px]">Click or tap to select</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-gradient-to-r from-[#003580] to-[#0052cc] p-2 rounded-xl">
            <ArrowLeftRight className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AI Product Comparison</h1>
        </div>
        <p className="text-sm text-gray-500">
          Upload two product images and AI will analyze which one is better in quality, safety, and BIS compliance
        </p>
      </div>

      {/* Image Upload Area */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
        <div className="flex gap-4 items-stretch">
          <ImageSlot slot={1} image={image1} fileRef={fileRef1} />
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-full p-2">
              <ArrowLeftRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <ImageSlot slot={2} image={image2} fileRef={fileRef2} />
        </div>

        <button
          onClick={compareProducts}
          disabled={!image1 || !image2 || comparing}
          className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#003580] to-[#0052cc] text-white rounded-xl font-bold text-sm disabled:opacity-40 hover:shadow-lg transition-all active:scale-[0.98]"
        >
          {comparing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              AI Comparing Products...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Compare with AI
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 rounded-2xl p-5 border border-red-200 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="h-5 w-5 text-red-500" />
            <p className="font-semibold text-red-800">Comparison Failed</p>
          </div>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && !comparing && (
        <div className="space-y-5">
          {/* Winner Banner */}
          {result.overallWinner && (
            <div className="bg-gradient-to-r from-[#FF9933] to-[#e88a2a] rounded-2xl p-6 text-white text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2" />
              <p className="text-xs font-medium uppercase tracking-wider mb-1 text-orange-100">AI Verdict</p>
              <h2 className="text-xl font-bold">
                Product {result.overallWinner} Wins!
              </h2>
              <p className="text-sm text-orange-100 mt-1 max-w-md mx-auto">{result.winnerReason}</p>
            </div>
          )}

          {/* Score Comparison */}
          {result.comparison && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Score Comparison</h3>
              <div className="space-y-4">
                {[
                  { label: "Quality", keyA: result.comparison.qualityScore?.productA, keyB: result.comparison.qualityScore?.productB, icon: Star },
                  { label: "Compliance", keyA: result.comparison.complianceScore?.productA, keyB: result.comparison.complianceScore?.productB, icon: Shield },
                  { label: "Safety", keyA: result.comparison.safetyScore?.productA, keyB: result.comparison.safetyScore?.productB, icon: AlertTriangle },
                  { label: "Value", keyA: result.comparison.valueScore?.productA, keyB: result.comparison.valueScore?.productB, icon: Trophy },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <metric.icon className="h-3.5 w-3.5 text-[#003580]" />
                        <span className="font-semibold">{metric.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold w-8 text-right ${getScoreColor(metric.keyA || 0)}`}>{metric.keyA ?? "—"}</span>
                      <div className="flex-1 flex gap-1 h-4">
                        <div className="flex-1 bg-gray-100 rounded-l-full overflow-hidden flex justify-end">
                          <div className={`h-full rounded-l-full ${getScoreBg(metric.keyA || 0)}`} style={{ width: `${metric.keyA || 0}%` }} />
                        </div>
                        <div className="flex-1 bg-gray-100 rounded-r-full overflow-hidden">
                          <div className={`h-full rounded-r-full ${getScoreBg(metric.keyB || 0)}`} style={{ width: `${metric.keyB || 0}%` }} />
                        </div>
                      </div>
                      <span className={`text-sm font-bold w-8 ${getScoreColor(metric.keyB || 0)}`}>{metric.keyB ?? "—"}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                      <span>Product A</span>
                      <span>Product B</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Comparison */}
          {result.detailedComparison && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Detailed Analysis</h3>
              <div className="space-y-3">
                {result.detailedComparison.map((item: any, i: number) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-900">{item.aspect}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        item.winner === "A" ? "bg-blue-100 text-blue-700" :
                        item.winner === "B" ? "bg-purple-100 text-purple-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {item.winner === "Tie" ? "Tie" : `Product ${item.winner} wins`}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`text-xs p-2 rounded-lg ${item.winner === "A" ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}>
                        <p className="text-[10px] text-gray-400 mb-0.5 font-semibold">Product A</p>
                        <p className="text-gray-700">{item.productA}</p>
                      </div>
                      <div className={`text-xs p-2 rounded-lg ${item.winner === "B" ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}>
                        <p className="text-[10px] text-gray-400 mb-0.5 font-semibold">Product B</p>
                        <p className="text-gray-700">{item.productB}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certification Comparison */}
          {result.certificationComparison && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#003580]" /> Certification Marks
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">Product A</p>
                  {result.certificationComparison.productA_marks?.map((m: string, i: number) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-green-700 mb-1">
                      <CheckCircle2 className="h-3 w-3" /> {m}
                    </div>
                  ))}
                  {result.certificationComparison.productA_missing?.map((m: string, i: number) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-red-600 mb-1">
                      <XCircle className="h-3 w-3" /> {m}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">Product B</p>
                  {result.certificationComparison.productB_marks?.map((m: string, i: number) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-green-700 mb-1">
                      <CheckCircle2 className="h-3 w-3" /> {m}
                    </div>
                  ))}
                  {result.certificationComparison.productB_missing?.map((m: string, i: number) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-red-600 mb-1">
                      <XCircle className="h-3 w-3" /> {m}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recommendation */}
          {result.recommendation && (
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
              <p className="text-xs font-bold text-[#003580] mb-1">AI Recommendation</p>
              <p className="text-sm text-gray-700">{result.recommendation}</p>
            </div>
          )}

          {/* Warnings */}
          {result.warnings?.length > 0 && (
            <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-200">
              <p className="text-xs font-bold text-yellow-800 mb-2 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Warnings
              </p>
              {result.warnings.map((w: string, i: number) => (
                <p key={i} className="text-xs text-yellow-700 mb-1">• {w}</p>
              ))}
            </div>
          )}

          {/* Raw fallback */}
          {result.rawAnalysis && (
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.rawAnalysis}</p>
            </div>
          )}

          {/* Reset */}
          <button
            onClick={() => { setResult(null); setImage1(null); setImage2(null); }}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm text-[#003580] font-semibold hover:bg-blue-50 rounded-xl transition-colors border border-gray-200"
          >
            <RotateCcw className="h-4 w-4" /> Compare Different Products
          </button>
        </div>
      )}

      {/* Empty state */}
      {!result && !comparing && !error && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-2xl">
              <ImageIcon className="h-8 w-8 text-[#003580]" />
            </div>
            <ArrowLeftRight className="h-6 w-6 text-gray-300" />
            <div className="bg-purple-50 p-4 rounded-2xl">
              <ImageIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Compare Two Products</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Upload images of two products to get an AI-powered side-by-side comparison of quality, safety, BIS compliance, and value for money.
          </p>
        </div>
      )}
    </div>
  );
}
