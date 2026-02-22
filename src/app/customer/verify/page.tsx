"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  Search,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Camera,
  Info,
} from "lucide-react";

export default function CustomerVerifyPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [licenseInput, setLicenseInput] = useState("");

  const handleImageUpload = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleVerify = async () => {
    if (!imagePreview) return;
    setScanning(true);
    setError(null);
    setResult(null);

    try {
      const base64 = imagePreview.split(",")[1];
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          imageMimeType: "image/jpeg",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.data || data.result);
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    } finally {
      setScanning(false);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verify Product Certification</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload a product image to verify ISI marks, BIS hallmarks, and other certifications
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Upload Product Image</h3>

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Product"
                  className="w-full h-56 object-cover rounded-xl"
                />
                <button
                  onClick={reset}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#003580] hover:bg-blue-50 transition-all">
                <Camera className="h-10 w-10 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-600">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageUpload(f);
                  }}
                />
              </label>
            )}

            {imagePreview && (
              <button
                onClick={handleVerify}
                disabled={scanning}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-[#003580] text-white rounded-xl font-semibold hover:bg-[#002a66] transition-colors disabled:opacity-50"
              >
                {scanning ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Verify with AI
                  </>
                )}
              </button>
            )}
          </div>

          {/* License Number Lookup */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Verify by License Number</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={licenseInput}
                onChange={(e) => setLicenseInput(e.target.value)}
                placeholder="Enter ISI/CM/L number..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580]"
              />
              <button
                onClick={() => {
                  if (licenseInput.trim()) {
                    window.open(
                      `https://www.bis.gov.in/verify-isi-mark/?license_no=${encodeURIComponent(licenseInput)}`,
                      "_blank"
                    );
                  }
                }}
                className="px-4 py-2.5 bg-[#003580] text-white rounded-xl font-medium text-sm hover:bg-[#002a66] transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              Redirects to official BIS portal for verification
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <p className="font-semibold text-red-800">Verification Failed</p>
              </div>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`px-5 py-4 text-white flex items-center gap-2 ${
                result.isAuthentic ? "bg-gradient-to-r from-[#138808] to-emerald-600" : result.confidence === 0 ? "bg-gradient-to-r from-gray-600 to-gray-700" : "bg-gradient-to-r from-red-600 to-red-700"
              }`}>
                {result.isAuthentic ? <CheckCircle2 className="h-5 w-5" /> : result.confidence === 0 ? <Info className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                <h2 className="font-bold">
                  {result.isAuthentic ? "Mark Verified — Authentic" : result.confidence === 0 ? "No Mark Detected" : "Verification Failed — Suspicious"}
                </h2>
              </div>
              <div className="p-5 space-y-4">
                {/* Confidence Score */}
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-gray-900">{result.confidence ?? 0}%</div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-500 mb-1">Confidence Score</div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${result.confidence > 70 ? "bg-green-500" : result.confidence > 40 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${result.confidence ?? 0}%` }} />
                    </div>
                  </div>
                </div>

                {/* Key Info Grid */}
                {(result.standardMark || result.licenseNumber || result.manufacturer || result.productIdentified) && (
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Standard Mark", value: result.standardMark },
                      { label: "License Number", value: result.licenseNumber },
                      { label: "Manufacturer", value: result.manufacturer },
                      { label: "Product", value: result.productIdentified },
                      { label: "Standard Code", value: result.standardCode },
                      { label: "Valid Until", value: result.validUntil },
                    ].filter(x => x.value && !x.value.startsWith("N/A")).map((item, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-[10px] text-gray-400 font-medium uppercase">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Verification Checks */}
                {result.verificationChecks?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Verification Checks</p>
                    <div className="space-y-1.5">
                      {result.verificationChecks.map((check: any, i: number) => (
                        <div key={i} className={`flex items-start gap-2 text-sm p-2.5 rounded-lg ${check.passed ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}>
                          {check.passed ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />}
                          <div>
                            <p className={`font-medium ${check.passed ? "text-green-800" : "text-red-800"}`}>{check.check}</p>
                            {check.note && <p className="text-xs text-gray-500 mt-0.5">{check.note}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details */}
                {result.details && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="h-4 w-4 text-[#003580]" />
                      <p className="text-sm font-semibold text-[#003580]">Analysis Details</p>
                    </div>
                    <p className="text-sm text-gray-700">{result.details}</p>
                  </div>
                )}

                {/* Warnings */}
                {result.warnings?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-amber-700 mb-1">Warnings</p>
                    <ul className="text-xs text-amber-600 space-y-1">
                      {result.warnings.map((w: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fallback: marksFound format (legacy) */}
                {result.marksFound?.map((mark: any, i: number) => (
                  <div key={i} className={`rounded-xl p-4 border ${
                    mark.isAuthentic ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{mark.markName}</h3>
                      <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        mark.isAuthentic ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {mark.isAuthentic ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                        {mark.isAuthentic ? "Verified" : "Suspicious"}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{mark.authenticityNotes}</p>
                  </div>
                ))}

                {result.overallAssessment && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-sm text-gray-700">{result.overallAssessment}</p>
                  </div>
                )}

                {result.recommendations?.length > 0 && (
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    {result.recommendations.map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-[#138808] shrink-0 mt-0.5" />{r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {!result && !scanning && !error && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <ShieldCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">Upload an image to start verification</p>
              <p className="text-xs text-gray-400 mt-1">
                AI will detect and verify all certification marks on the product
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
