"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Package,
  Camera,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  RefreshCw,
  History,
  Star,
  ArrowRight,
  ImagePlus,
  Trash2,
} from "lucide-react";

interface ComplianceResult {
  productName: string;
  productCategory: string;
  applicableStandards: {
    isCode: string;
    title: string;
    relevanceScore: number;
    mandatory: boolean;
  }[];
  overallScore: number;
  status: string;
  gaps: {
    id: string;
    standard: string;
    requirement: string;
    currentStatus: string;
    severity: string;
    description: string;
  }[];
  recommendations: {
    id: string;
    type: string;
    title: string;
    description: string;
    priority: string;
    estimatedCost: string;
    estimatedTime: string;
  }[];
}

interface SavedProduct {
  id: number;
  product_name: string;
  product_category: string;
  compliance_score: number;
  compliance_status: string;
  applicable_standards: string;
  missing_marks: string;
  scanned_at: string;
}

export default function SellerScanPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");
  const [description, setDescription] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/seller/products");
      if (res.ok) {
        const data = await res.json();
        setSavedProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageMimeType(file.type);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      setImageBase64(dataUrl.split(",")[1]);
    };
    reader.readAsDataURL(file);
    setResult(null);
    setError("");
  }, []);

  const handleScan = async () => {
    if (!imageBase64 && !description.trim()) {
      setError("Please upload an image or provide a product description");
      return;
    }
    setScanning(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: description || "Analyze this product for BIS compliance",
          imageBase64: imageBase64 || undefined,
          imageMimeType: imageMimeType,
        }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      // Parse the AI response
      let parsed: ComplianceResult;
      try {
        const source = data.data || data;
        parsed = {
          productName: source.productName || description.slice(0, 50) || "Scanned Product",
          productCategory: source.productCategory || "General",
          overallScore: source.overallScore ?? source.complianceScore ?? 65,
          status: source.status || source.complianceStatus || "partially-compliant",
          applicableStandards: source.applicableStandards || [],
          gaps: source.gaps || source.complianceGaps || [],
          recommendations: source.recommendations || [],
        };
      } catch {
        parsed = {
          productName: description.slice(0, 50) || "Scanned Product",
          productCategory: "General",
          overallScore: 65,
          status: "partially-compliant",
          applicableStandards: [],
          gaps: [],
          recommendations: [],
        };
      }
      setResult(parsed);
    } catch (err: any) {
      setError(err.message || "Failed to analyze product");
    } finally {
      setScanning(false);
    }
  };

  const handleSaveResult = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: result.productName,
          product_category: result.productCategory,
          compliance_score: result.overallScore,
          compliance_status:
            result.overallScore >= 80
              ? "compliant"
              : result.overallScore >= 40
              ? "needs_review"
              : "non_compliant",
          applicable_standards: JSON.stringify(result.applicableStandards),
          missing_marks: JSON.stringify(result.gaps),
          compliance_details: JSON.stringify(result.recommendations),
          ai_analysis: JSON.stringify(result),
        }),
      });
      if (res.ok) {
        fetchHistory();
        // Show brief success
      }
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusIcon = (status: string) => {
    if (status === "compliant") return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (status === "non_compliant") return <XCircle className="h-5 w-5 text-red-500" />;
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };

  const resetScan = () => {
    setImagePreview(null);
    setImageBase64(null);
    setDescription("");
    setResult(null);
    setError("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-7 w-7 text-[#138808]" />
            Product Compliance Scanner
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Scan your products to check BIS compliance instantly with AI
          </p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <History className="h-4 w-4" />
          History ({savedProducts.length})
        </button>
      </div>

      {/* History Panel */}
      {showHistory && savedProducts.length > 0 && (
        <div className="mb-6 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <History className="h-5 w-5 text-[#138808]" />
              Previous Scans
            </h2>
          </div>
          <div className="divide-y">
            {savedProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  {getStatusIcon(product.compliance_status)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.product_name}</p>
                    <p className="text-xs text-gray-500">{product.product_category} · {new Date(product.scanned_at).toLocaleDateString("en-IN")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getScoreColor(product.compliance_score)}`}>
                      {product.compliance_score}%
                    </p>
                  </div>
                  <div className={`w-2 h-8 rounded-full ${getScoreBg(product.compliance_score)}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-[#138808]/5 to-green-50 border-b">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Camera className="h-5 w-5 text-[#138808]" />
                Scan Product
              </h2>
            </div>
            <div className="p-6">
              {/* Image upload area */}
              {imagePreview ? (
                <div className="relative mb-4">
                  <img
                    src={imagePreview}
                    alt="Product"
                    className="w-full h-64 object-contain bg-gray-50 rounded-xl"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setImageBase64(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#138808] hover:bg-green-50/30 transition-colors mb-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-600">
                    Click to upload product image
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Or take a photo with camera below
                  </p>
                </div>
              )}

              <div className="flex gap-3 mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload File
                </button>
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#138808]/10 text-[#138808] rounded-xl text-sm font-medium hover:bg-[#138808]/20 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  Take Photo
                </button>
              </div>

              {/* Product description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g., Stainless steel pressure cooker, 5L capacity, manufactured in Rajkot, Gujarat..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#138808]/30 focus:border-[#138808] outline-none resize-none"
                />
              </div>

              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
                  <XCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleScan}
                  disabled={scanning || (!imageBase64 && !description.trim())}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#138808] text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {scanning ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyzing Compliance...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-5 w-5" />
                      Check Compliance
                    </>
                  )}
                </button>
                {(imagePreview || description || result) && (
                  <button
                    onClick={resetScan}
                    className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {scanning && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#138808]/10 mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#138808]" />
              </div>
              <h3 className="font-semibold text-gray-900">Analyzing Product Compliance</h3>
              <p className="text-sm text-gray-500 mt-1">
                AI is checking against BIS standards...
              </p>
              <div className="mt-4 space-y-2">
                {["Detecting product type...", "Matching applicable IS codes...", "Evaluating compliance gaps...", "Generating recommendations..."].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#138808] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && !scanning && (
            <>
              {/* Score Card */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className={`px-6 py-4 ${
                  result.overallScore >= 80
                    ? "bg-gradient-to-r from-green-50 to-emerald-50"
                    : result.overallScore >= 40
                    ? "bg-gradient-to-r from-yellow-50 to-amber-50"
                    : "bg-gradient-to-r from-red-50 to-rose-50"
                } border-b`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-lg text-gray-900">{result.productName}</h2>
                      <p className="text-sm text-gray-500">{result.productCategory}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-4xl font-black ${getScoreColor(result.overallScore)}`}>
                        {result.overallScore}
                      </div>
                      <p className="text-xs text-gray-500">Compliance Score</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${getScoreBg(result.overallScore)}`}
                        style={{ width: `${result.overallScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-400">Non-Compliant</span>
                      <span className="text-xs text-gray-400">Fully Compliant</span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                    result.overallScore >= 80
                      ? "bg-green-100 text-green-700"
                      : result.overallScore >= 40
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {result.overallScore >= 80 ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : result.overallScore >= 40 ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    {result.status?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </div>

                  {/* Save button */}
                  <button
                    onClick={handleSaveResult}
                    disabled={saving}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-[#003580] text-white rounded-xl font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    {saving ? "Saving..." : "Save to Products"}
                  </button>
                </div>
              </div>

              {/* Applicable Standards */}
              {result.applicableStandards?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-3 bg-blue-50 border-b">
                    <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#003580]" />
                      Applicable BIS Standards ({result.applicableStandards.length})
                    </h3>
                  </div>
                  <div className="divide-y">
                    {result.applicableStandards.map((std, i) => (
                      <div key={i} className="px-6 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{std.isCode}</p>
                          <p className="text-xs text-gray-500">{std.title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {std.mandatory && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">
                              MANDATORY
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {Math.round(std.relevanceScore * 100)}% match
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compliance Gaps */}
              {result.gaps?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-3 bg-red-50 border-b">
                    <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Compliance Gaps ({result.gaps.length})
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {result.gaps.map((gap, i) => (
                      <div key={i} className={`p-3 rounded-xl border-l-4 ${
                        gap.severity === "critical"
                          ? "border-red-500 bg-red-50"
                          : gap.severity === "major"
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-blue-500 bg-blue-50"
                      }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{gap.requirement}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{gap.standard} — {gap.description}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            gap.severity === "critical"
                              ? "bg-red-200 text-red-700"
                              : gap.severity === "major"
                              ? "bg-yellow-200 text-yellow-700"
                              : "bg-blue-200 text-blue-700"
                          }`}>
                            {gap.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-3 bg-green-50 border-b">
                    <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#138808]" />
                      Recommendations ({result.recommendations.length})
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="p-3 rounded-xl bg-green-50/50 border border-green-100">
                        <div className="flex items-start gap-3">
                          <ArrowRight className="h-4 w-4 text-[#138808] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{rec.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{rec.description}</p>
                            <div className="flex gap-3 mt-2">
                              {rec.estimatedCost && (
                                <span className="text-[10px] text-gray-400">💰 {rec.estimatedCost}</span>
                              )}
                              {rec.estimatedTime && (
                                <span className="text-[10px] text-gray-400">⏱ {rec.estimatedTime}</span>
                              )}
                              <span className={`text-[10px] font-bold uppercase ${
                                rec.priority === "high" ? "text-red-500" : rec.priority === "medium" ? "text-yellow-500" : "text-blue-500"
                              }`}>
                                {rec.priority} priority
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!scanning && !result && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900">No Scan Results Yet</h3>
              <p className="text-sm text-gray-500 mt-1">
                Upload a product image or enter a description and click
                &quot;Check Compliance&quot; to get started.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="p-3 bg-red-50 rounded-xl">
                  <XCircle className="h-5 w-5 text-red-400 mx-auto mb-1" />
                  <p className="text-[10px] text-red-600 font-medium">Non-Compliant</p>
                  <p className="text-[10px] text-red-400">&lt;40 score</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-[10px] text-yellow-600 font-medium">Needs Review</p>
                  <p className="text-[10px] text-yellow-400">40-79 score</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mx-auto mb-1" />
                  <p className="text-[10px] text-green-600 font-medium">Compliant</p>
                  <p className="text-[10px] text-green-400">80+ score</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
