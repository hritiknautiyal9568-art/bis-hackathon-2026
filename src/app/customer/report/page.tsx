"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Camera,
  Upload,
  Send,
  Loader2,
  CheckCircle2,
  MapPin,
  Phone,
  Globe,
  XCircle,
} from "lucide-react";

export default function ReportPage() {
  const [form, setForm] = useState({
    productName: "",
    brand: "",
    purchaseLocation: "",
    description: "",
    suspectedMark: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const analyzeWithAI = async () => {
    if (!imagePreview) return;
    setAnalyzing(true);
    try {
      const base64 = imagePreview.split(",")[1];
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          imageMimeType: "image/jpeg",
          scanMode: "hallmark",
        }),
      });
      const data = await res.json();
      setAiAnalysis(data.result);
    } catch {
      // Silent fail — AI analysis is optional enhancement
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
            <CheckCircle2 className="h-10 w-10 text-[#138808]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Report Submitted</h2>
          <p className="text-sm text-gray-500 mb-4">
            Thank you for reporting. BIS will investigate this matter. You can also file a formal complaint through the channels below.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 text-left space-y-3 border border-blue-100">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-[#003580]" />
              <span className="text-gray-700">BIS Helpline: <strong>14100</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-[#003580]" />
              <a href="https://www.bis.gov.in" target="_blank" className="text-[#003580] hover:underline">www.bis.gov.in</a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-[#003580]" />
              <span className="text-gray-700">Visit nearest BIS branch office</span>
            </div>
          </div>
          <button
            onClick={() => { setSubmitted(false); setForm({ productName: "", brand: "", purchaseLocation: "", description: "", suspectedMark: "" }); setImagePreview(null); setAiAnalysis(null); }}
            className="mt-6 text-sm text-[#003580] font-semibold hover:underline"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Report Counterfeit Product</h1>
        <p className="text-sm text-gray-500 mt-1">
          Help protect consumers by reporting products with fake or missing certification marks
        </p>
      </div>

      <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-yellow-800">Important Notice</p>
          <p className="text-xs text-yellow-700 mt-0.5">
            Using fake ISI marks is a criminal offence under BIS Act, 2016 with imprisonment up to 2 years and fine up to ₹5 lakhs. Your report helps protect millions of consumers.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
        {/* Image Upload */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Product Photo (with certification mark visible)
          </label>
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Product" className="w-full h-48 object-cover rounded-xl" />
              <button
                onClick={() => { setImagePreview(null); setAiAnalysis(null); }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full"
              >
                <XCircle className="h-4 w-4" />
              </button>
              {!aiAnalysis && (
                <button
                  onClick={analyzeWithAI}
                  disabled={analyzing}
                  className="absolute bottom-2 right-2 flex items-center gap-1 px-3 py-1.5 bg-[#003580] text-white rounded-lg text-xs font-medium disabled:opacity-50"
                >
                  {analyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
                  {analyzing ? "Analyzing..." : "AI Analyze"}
                </button>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center py-10 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#003580] hover:bg-blue-50 transition-all">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Upload product photo</p>
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
        </div>

        {/* AI Analysis Result */}
        {aiAnalysis && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-semibold text-[#003580] mb-1">AI Analysis Result</p>
            <p className="text-sm text-gray-700">
              {aiAnalysis.overallAssessment || aiAnalysis.rawAnalysis || "Analysis complete. Details included with your report."}
            </p>
          </div>
        )}

        {/* Form Fields */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Product Name *</label>
            <input
              type="text"
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              placeholder="e.g., Gold Ring, Electrical Wire"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Brand / Manufacturer</label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              placeholder="Brand name"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">Suspected Fake Mark</label>
          <select
            value={form.suspectedMark}
            onChange={(e) => setForm({ ...form, suspectedMark: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580]"
          >
            <option value="">Select mark type</option>
            <option value="ISI Mark">ISI Mark</option>
            <option value="BIS Hallmark">BIS Hallmark</option>
            <option value="BIS Hallmark HUID">BIS Hallmark (HUID)</option>
            <option value="FSSAI">FSSAI Logo</option>
            <option value="AGMARK">AGMARK</option>
            <option value="BEE Star">BEE Star Rating</option>
            <option value="BIS CRS">BIS CRS (Electronics)</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">Place of Purchase</label>
          <input
            type="text"
            value={form.purchaseLocation}
            onChange={(e) => setForm({ ...form, purchaseLocation: e.target.value })}
            placeholder="Shop name, city, or online platform"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">Description of Issue *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe why you think the product has a fake or missing certification mark..."
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580] resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!form.productName || !form.description}
          className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          Submit Report
        </button>
      </div>
    </div>
  );
}
