"use client";

import { useState, useRef, useCallback } from "react";
import {
  Shield,
  Camera,
  Upload,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Award,
  MapPin,
  Building2,
  Scale,
  Calendar,
  Hash,
  ImagePlus,
  Trash2,
  RefreshCw,
  Gem,
} from "lucide-react";

interface VerificationResult {
  verified: boolean;
  isValid: boolean;
  huid: string;
  message: string;
  details?: {
    articleType: string;
    purity: string;
    purityKarat: string;
    jeweller: string;
    jewellerAddress: string;
    ahcName: string;
    ahcCode: string;
    weight: string;
    hallmarkDate: string;
  };
  extractedData?: {
    huidFound: boolean;
    huidNumber: string | null;
    purity: string | null;
    purityKarat: string | null;
    metalType: string | null;
    bisLogoVisible: boolean;
    confidence: number;
    allTextDetected: string[];
    notes: string;
  };
}

export default function HallmarkVerifyPage() {
  const [mode, setMode] = useState<"scan" | "manual">("scan");
  const [huidInput, setHuidInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  const handleVerify = async () => {
    if (mode === "manual" && !huidInput.trim()) {
      setError("Please enter a valid HUID number");
      return;
    }
    if (mode === "scan" && !imageBase64) {
      setError("Please upload or capture a hallmark image");
      return;
    }

    setVerifying(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/hallmark/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          huidNumber: mode === "manual" ? huidInput.trim() : undefined,
          image: mode === "scan" ? imageBase64 : undefined,
          mimeType: mode === "scan" ? imageMimeType : undefined,
        }),
      });

      if (!res.ok) throw new Error("Verification failed");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setImageBase64(null);
    setHuidInput("");
    setResult(null);
    setError("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FF9933] to-orange-400 mb-4">
          <Gem className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">BIS Hallmark Verification</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
          Verify if your gold/silver jewellery is BIS hallmarked by scanning the HUID or entering it manually — just like the official BIS Care app
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6 max-w-sm mx-auto">
        <button
          onClick={() => { setMode("scan"); handleReset(); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === "scan"
              ? "bg-white text-[#003580] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Camera className="h-4 w-4" />
          Scan Hallmark
        </button>
        <button
          onClick={() => { setMode("manual"); handleReset(); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === "manual"
              ? "bg-white text-[#003580] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Hash className="h-4 w-4" />
          Enter HUID
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-[#FF9933]/10 to-orange-50 border-b">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                {mode === "scan" ? (
                  <>
                    <Camera className="h-5 w-5 text-[#FF9933]" />
                    Scan HUID from Jewellery
                  </>
                ) : (
                  <>
                    <Hash className="h-5 w-5 text-[#FF9933]" />
                    Enter HUID Number
                  </>
                )}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {mode === "scan"
                  ? "Take a close-up photo of the hallmark engraving on your jewellery"
                  : "Type the 6-character HUID found on your hallmarked jewellery"}
              </p>
            </div>

            <div className="p-6">
              {mode === "scan" ? (
                <>
                  {imagePreview ? (
                    <div className="relative mb-4">
                      <img
                        src={imagePreview}
                        alt="Hallmark"
                        className="w-full h-56 object-contain bg-gray-50 rounded-xl border border-gray-200"
                      />
                      <button
                        onClick={() => {
                          setImagePreview(null);
                          setImageBase64(null);
                          setResult(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-[#FF9933]/30 rounded-xl p-8 text-center cursor-pointer hover:border-[#FF9933] hover:bg-orange-50/30 transition-colors mb-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus className="h-12 w-12 mx-auto text-[#FF9933]/50 mb-3" />
                      <p className="text-sm font-medium text-gray-600">
                        Click to upload hallmark image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Take a close-up photo of the hallmark engraving
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
                      Upload
                    </button>
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#FF9933]/10 text-[#FF9933] rounded-xl text-sm font-medium hover:bg-[#FF9933]/20 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                      Camera
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HUID Number
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={huidInput}
                      onChange={(e) => {
                        setHuidInput(e.target.value.toUpperCase());
                        setResult(null);
                        setError("");
                      }}
                      placeholder="e.g. AB1234"
                      maxLength={6}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-lg font-mono tracking-widest text-center focus:ring-2 focus:ring-[#FF9933]/30 focus:border-[#FF9933] outline-none uppercase"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    The HUID is a 6-character alphanumeric code engraved on BIS hallmarked jewellery
                  </p>

                  {/* Sample HUIDs for testing */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs font-semibold text-blue-700 mb-2">Try sample HUIDs:</p>
                    <div className="flex flex-wrap gap-2">
                      {["AB1234", "CD5678", "EF9012", "GH3456", "IJ7890"].map((huid) => (
                        <button
                          key={huid}
                          onClick={() => {
                            setHuidInput(huid);
                            setResult(null);
                          }}
                          className="px-2.5 py-1 bg-white border border-blue-200 rounded-lg text-xs font-mono text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          {huid}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
                  <XCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleVerify}
                  disabled={verifying || (mode === "manual" ? !huidInput.trim() : !imageBase64)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#003580] text-white rounded-xl font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      Verify HUID
                    </>
                  )}
                </button>
                {(imagePreview || huidInput || result) && (
                  <button
                    onClick={handleReset}
                    className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
            <h3 className="text-sm font-semibold text-[#003580] mb-3">How BIS Hallmark Works</h3>
            <div className="space-y-3">
              {[
                { icon: Award, text: "BIS hallmarking is mandatory for gold jewellery sold in India since June 2021" },
                { icon: Hash, text: "Each hallmarked article gets a unique 6-character HUID (Hallmark Unique ID)" },
                { icon: Search, text: "You can verify any HUID on the BIS Care app or portal to check authenticity" },
                { icon: Shield, text: "Our AI can automatically read the HUID from your jewellery photo" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <item.icon className="h-4 w-4 text-[#003580] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {verifying && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF9933]/10 mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF9933]" />
              </div>
              <h3 className="font-semibold text-gray-900">
                {mode === "scan" ? "AI Reading Hallmark..." : "Verifying HUID..."}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {mode === "scan"
                  ? "Extracting HUID from image using AI vision..."
                  : "Checking HUID against BIS database..."}
              </p>
              <div className="mt-4 space-y-2">
                {(mode === "scan"
                  ? ["Analyzing hallmark image...", "Detecting HUID number...", "Checking BIS database...", "Fetching jeweller details..."]
                  : ["Connecting to BIS database...", "Validating HUID format...", "Retrieving product info..."]
                ).map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && !verifying && (
            <>
              {/* Main Result Card */}
              <div className={`bg-white rounded-2xl border-2 overflow-hidden ${
                result.isValid
                  ? "border-green-300"
                  : "border-red-300"
              }`}>
                <div className={`px-6 py-5 text-center ${
                  result.isValid
                    ? "bg-gradient-to-r from-green-50 to-emerald-50"
                    : "bg-gradient-to-r from-red-50 to-rose-50"
                }`}>
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 ${
                    result.isValid ? "bg-green-100" : "bg-red-100"
                  }`}>
                    {result.isValid ? (
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600" />
                    )}
                  </div>
                  <h3 className={`text-lg font-bold ${
                    result.isValid ? "text-green-800" : "text-red-800"
                  }`}>
                    {result.isValid ? "VALID Hallmark" : "Invalid / Not Found"}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    result.isValid ? "text-green-600" : "text-red-600"
                  }`}>
                    {result.message}
                  </p>
                  <div className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-xl text-lg font-mono font-bold tracking-widest ${
                    result.isValid
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    <Hash className="h-5 w-5" />
                    {result.huid}
                  </div>
                </div>

                {/* Details */}
                {result.details && (
                  <div className="p-6 space-y-3">
                    <DetailRow icon={Gem} label="Article Type" value={result.details.articleType} />
                    <DetailRow icon={Award} label="Purity" value={`${result.details.purity} (${result.details.purityKarat})`} />
                    <DetailRow icon={Building2} label="Jeweller" value={result.details.jeweller} />
                    <DetailRow icon={MapPin} label="Address" value={result.details.jewellerAddress} />
                    <DetailRow icon={Shield} label="AHC Centre" value={`${result.details.ahcName} (${result.details.ahcCode})`} />
                    <DetailRow icon={Scale} label="Weight" value={result.details.weight} />
                    <DetailRow icon={Calendar} label="Hallmark Date" value={result.details.hallmarkDate} />
                  </div>
                )}
              </div>

              {/* AI Extraction Details */}
              {result.extractedData && result.extractedData.huidFound && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-3 bg-purple-50 border-b">
                    <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      AI Vision Analysis
                    </h3>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Detected HUID</span>
                      <span className="font-mono font-bold text-gray-900">{result.extractedData.huidNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Metal Type</span>
                      <span className="text-gray-900">{result.extractedData.metalType || "Unknown"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">AI Confidence</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${(result.extractedData.confidence || 0) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round((result.extractedData.confidence || 0) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">BIS Logo</span>
                      <span className={result.extractedData.bisLogoVisible ? "text-green-600" : "text-red-600"}>
                        {result.extractedData.bisLogoVisible ? "✅ Detected" : "❌ Not Found"}
                      </span>
                    </div>
                    {result.extractedData.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">{result.extractedData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Warning for invalid */}
              {!result.isValid && (
                <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
                  <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    What To Do
                  </h3>
                  <ul className="space-y-2 text-xs text-red-700">
                    <li>• Do not purchase the jewellery if the hallmark is invalid</li>
                    <li>• Report to BIS helpline: <strong>14100</strong></li>
                    <li>• File a complaint at <strong>bis.gov.in</strong></li>
                    <li>• Take photos of the product and shop as evidence</li>
                    <li>• You can also file an FIR under BIS Act 2016</li>
                  </ul>
                </div>
              )}
            </>
          )}

          {!verifying && !result && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF9933]/10 mb-4">
                <Gem className="h-8 w-8 text-[#FF9933]" />
              </div>
              <h3 className="font-semibold text-gray-900">Verify Your Jewellery</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                {mode === "scan"
                  ? "Upload or capture a close-up photo of the hallmark on your jewellery"
                  : "Enter the 6-character HUID number from your hallmarked jewellery"}
              </p>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-semibold text-gray-700 mb-2">Hallmark Components</p>
                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="p-2 bg-white rounded-lg border border-gray-100">
                    <p className="text-[10px] text-gray-400">BIS Logo</p>
                    <p className="text-xs font-medium">△ Triangle Mark</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-gray-100">
                    <p className="text-[10px] text-gray-400">Purity</p>
                    <p className="text-xs font-medium">916 / 750 / 999</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-gray-100">
                    <p className="text-[10px] text-gray-400">HUID</p>
                    <p className="text-xs font-medium font-mono">AB1234</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-gray-100">
                    <p className="text-[10px] text-gray-400">AHC Mark</p>
                    <p className="text-xs font-medium">Centre Code</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-[#003580]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}
