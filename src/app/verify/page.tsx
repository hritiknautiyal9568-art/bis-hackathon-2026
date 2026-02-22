"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  ScanLine,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
  Upload,
  AlertTriangle,
  Camera,
  X,
} from "lucide-react";

export default function VerifyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setResult(null);
    setError(null);

    setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const imageBase64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          imageMimeType: file.type,
          additionalInfo: additionalInfo || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data.data);
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [additionalInfo]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: loading,
  });

  const clearAll = () => {
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003580] to-[#002a66] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/10 p-2 rounded-lg">
              <ScanLine className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">ISI Mark & Counterfeit Verification</h1>
          </div>
          <p className="text-blue-200 max-w-2xl">
            Upload a photo of the ISI mark or product label. Our AI will analyze it for authenticity,
            verify license numbers, and detect potential counterfeiting signs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Upload Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Upload ISI Mark / Product Label
              </h3>

              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? "border-[#003580] bg-blue-50"
                    : previewUrl
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-[#003580] hover:bg-blue-50/50"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input {...getInputProps()} />
                {loading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 text-[#003580] animate-spin" />
                    <p className="text-sm text-gray-600">Verifying mark...</p>
                  </div>
                ) : previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Uploaded mark"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAll();
                      }}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full shadow hover:bg-red-50"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Camera className="h-8 w-8 text-[#003580]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Take a photo or upload image of ISI mark
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP (Max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional info */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Additional Information (optional)
                </label>
                <input
                  type="text"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Product name, brand, purchase location..."
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003580]"
                />
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="text-xs font-bold text-[#003580] mb-2">What to photograph:</h4>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li className="flex gap-2">📸 ISI mark on the product</li>
                  <li className="flex gap-2">📸 License number (CM/L-XXXXX)</li>
                  <li className="flex gap-2">📸 BIS Standard Mark/Hallmark</li>
                  <li className="flex gap-2">📸 Product label with certifications</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3">
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800">Verification Error</h3>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Authenticity Result */}
                <div className={`rounded-2xl p-6 border-2 ${
                  result.isAuthentic
                    ? "bg-green-50 border-green-300"
                    : "bg-red-50 border-red-300"
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      result.isAuthentic ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {result.isAuthentic ? (
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      ) : (
                        <XCircle className="h-10 w-10 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h2 className={`text-2xl font-extrabold ${
                        result.isAuthentic ? "text-green-800" : "text-red-800"
                      }`}>
                        {result.isAuthentic ? "Likely Authentic" : "Potentially Counterfeit"}
                      </h2>
                      <p className={`text-sm ${
                        result.isAuthentic ? "text-green-600" : "text-red-600"
                      }`}>
                        Confidence: {result.confidence}%
                      </p>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-1000 ${
                          result.isAuthentic ? "bg-green-500" : "bg-red-500"
                        }`}
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Detected Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Product", value: result.productIdentified },
                      { label: "Standard Mark", value: result.standardMark },
                      { label: "License No.", value: result.licenseNumber },
                      { label: "Standard Code", value: result.standardCode },
                      { label: "Manufacturer", value: result.manufacturer },
                      { label: "Valid Until", value: result.validUntil },
                    ].map((item) => (
                      item.value && (
                        <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs font-semibold text-gray-500">{item.label}</p>
                          <p className="text-sm font-bold text-gray-900 mt-0.5">{item.value}</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                {/* Verification Checks */}
                {result.verificationChecks && result.verificationChecks.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Verification Checks</h3>
                    <div className="space-y-3">
                      {result.verificationChecks.map((check: any, i: number) => (
                        <div
                          key={i}
                          className={`flex items-start gap-3 p-3 rounded-xl ${
                            check.passed ? "bg-green-50" : "bg-red-50"
                          }`}
                        >
                          {check.passed ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div>
                            <p className={`text-sm font-semibold ${
                              check.passed ? "text-green-800" : "text-red-800"
                            }`}>
                              {check.check}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">{check.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Analysis */}
                {result.details && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Detailed Analysis</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{result.details}</p>
                  </div>
                )}

                {/* Warnings */}
                {result.warnings && result.warnings.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                    <h3 className="text-base font-bold text-orange-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" /> Warnings
                    </h3>
                    <ul className="space-y-2">
                      {result.warnings.map((warning: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-orange-700">
                          <span className="font-bold mt-0.5">⚠</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">
                    <strong>Disclaimer:</strong> This AI-based verification is for preliminary screening only.
                    For official verification, please contact BIS at 011-2323 0131 or visit{" "}
                    <a href="https://www.bis.gov.in" className="text-[#003580] underline" target="_blank" rel="noopener noreferrer">
                      www.bis.gov.in
                    </a>
                  </p>
                </div>
              </div>
            )}

            {!result && !loading && !error && (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="bg-blue-50 p-4 rounded-full w-fit mx-auto mb-4">
                  <Shield className="h-10 w-10 text-[#003580]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Verify Product Authenticity
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  Upload a clear photo of the ISI mark or product label. Our AI will check
                  for authenticity markers and potential signs of counterfeiting.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                  {[
                    { icon: "🔍", label: "Mark Analysis" },
                    { icon: "✅", label: "License Check" },
                    { icon: "🛡️", label: "Anti-Counterfeit" },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-xs font-medium text-gray-600">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
