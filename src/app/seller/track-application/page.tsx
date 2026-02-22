"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Calendar,
  ChevronRight,
  Package,
  Loader2,
  ArrowRight,
  ClipboardCheck,
  Microscope,
  Factory,
  Award,
  Timer,
  IndianRupee,
  Eye,
} from "lucide-react";

// Simulated BIS application tracking data
const DEMO_APPLICATIONS = [
  {
    id: "BIS/ISI/2026/MH/001234",
    product: "LED Bulb 9W (IS 16102:2018)",
    scheme: "ISI",
    applicant: "BrightLite Electronics Pvt Ltd",
    filedDate: "2025-10-15",
    currentStatus: "factory_inspection",
    timeline: [
      { step: "Application Filed", date: "2025-10-15", status: "completed", icon: FileText, detail: "Form V submitted online via Manak portal" },
      { step: "Fee Payment", date: "2025-10-16", status: "completed", icon: IndianRupee, detail: "₹1,000 application fee + ₹10,000 marking fee paid" },
      { step: "Document Review", date: "2025-10-25", status: "completed", icon: ClipboardCheck, detail: "Documents verified and accepted" },
      { step: "Lab Testing", date: "2025-11-10", status: "completed", icon: Microscope, detail: "Samples tested at ERTL Delhi — all tests passed" },
      { step: "Factory Inspection", date: "2026-01-20", status: "in_progress", icon: Factory, detail: "BIS officer visit scheduled for 20 Jan 2026" },
      { step: "Grant of License", date: "", status: "pending", icon: Award, detail: "Awaiting factory inspection report" },
    ],
  },
  {
    id: "BIS/CRS/2026/KA/005678",
    product: "Mobile Phone Charger (IS 16046:2018)",
    scheme: "CRS",
    applicant: "TechPower India Ltd",
    filedDate: "2025-11-20",
    currentStatus: "lab_testing",
    timeline: [
      { step: "Application Filed", date: "2025-11-20", status: "completed", icon: FileText, detail: "CRS Form VI submitted" },
      { step: "Fee Payment", date: "2025-11-21", status: "completed", icon: IndianRupee, detail: "₹1,000 registration fee paid online" },
      { step: "Document Review", date: "2025-12-05", status: "completed", icon: ClipboardCheck, detail: "Product specs and test reports under review" },
      { step: "Lab Testing", date: "2026-01-05", status: "in_progress", icon: Microscope, detail: "Samples submitted to STQC, Bangalore for EMC & Safety testing" },
      { step: "Registration Grant", date: "", status: "pending", icon: Award, detail: "Awaiting test completion" },
    ],
  },
  {
    id: "BIS/HM/2026/RJ/009012",
    product: "Gold Jewellery — Assaying Centre Registration",
    scheme: "Hallmark",
    applicant: "Rajasthan Gold AHC",
    filedDate: "2025-09-01",
    currentStatus: "granted",
    timeline: [
      { step: "Application Filed", date: "2025-09-01", status: "completed", icon: FileText, detail: "AHC recognition application submitted" },
      { step: "Fee Payment", date: "2025-09-02", status: "completed", icon: IndianRupee, detail: "Recognition fee paid" },
      { step: "Lab Inspection", date: "2025-09-20", status: "completed", icon: Microscope, detail: "Lab equipment and procedures verified by BIS" },
      { step: "Proficiency Testing", date: "2025-10-15", status: "completed", icon: ClipboardCheck, detail: "Passed proficiency testing for gold assaying" },
      { step: "Recognition Granted", date: "2025-11-01", status: "completed", icon: Award, detail: "AHC Code: AHC-RJ-045 granted for 3 years" },
    ],
  },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  completed: { label: "Completed", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  in_progress: { label: "In Progress", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  pending: { label: "Pending", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
};

export default function TrackApplicationPage() {
  const [trackingId, setTrackingId] = useState("");
  const [searchResult, setSearchResult] = useState<typeof DEMO_APPLICATIONS[0] | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => {
      const found = DEMO_APPLICATIONS.find(a =>
        a.id.toLowerCase().includes(trackingId.toLowerCase()) ||
        a.product.toLowerCase().includes(trackingId.toLowerCase())
      );
      setSearchResult(found || null);
      if (!found && trackingId) {
        setShowDemo(true);
      }
      setSearching(false);
    }, 800);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/seller" className="p-2 hover:bg-green-50 rounded-xl transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Clock className="h-6 w-6 text-[#138808]" />
            Track BIS Application
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Track your ISI, CRS, or Hallmark certification application status</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-gradient-to-br from-[#138808]/5 to-[#138808]/10 rounded-2xl p-5 border border-green-100">
        <label className="text-sm font-bold text-gray-900 mb-2 block">Enter Application / Tracking Number</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. BIS/ISI/2026/MH/001234 or product name"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#138808]/20 focus:border-[#138808]"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching || !trackingId}
            className="px-5 py-3 bg-[#138808] text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Track
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Try: <button onClick={() => { setTrackingId("BIS/ISI/2026/MH/001234"); }} className="text-[#138808] font-semibold hover:underline">BIS/ISI/2026/MH/001234</button>
          {" "}or <button onClick={() => { setTrackingId("LED"); }} className="text-[#138808] font-semibold hover:underline">LED</button>
          {" "}or <button onClick={() => { setTrackingId("CRS"); }} className="text-[#138808] font-semibold hover:underline">CRS</button>
        </p>
      </div>

      {/* Search Result */}
      {searchResult && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-gradient-to-r from-[#138808] to-[#1baa10] p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-green-200 uppercase tracking-wider">Application ID</p>
                <p className="font-mono font-bold text-lg">{searchResult.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                searchResult.currentStatus === "granted"
                  ? "bg-white/20 text-white"
                  : "bg-yellow-400 text-yellow-900"
              }`}>
                {searchResult.currentStatus === "granted" ? "GRANTED ✓" : "IN PROGRESS"}
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* App Details */}
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2"><Package className="h-3.5 w-3.5 text-gray-400" /><span className="text-gray-500 w-16 shrink-0">Product</span><span className="font-medium text-gray-900">{searchResult.product}</span></div>
              <div className="flex items-center gap-2"><Award className="h-3.5 w-3.5 text-gray-400" /><span className="text-gray-500 w-16 shrink-0">Scheme</span><span className="font-medium text-gray-900">{searchResult.scheme}</span></div>
              <div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-gray-400" /><span className="text-gray-500 w-16 shrink-0">Applicant</span><span className="font-medium text-gray-900">{searchResult.applicant}</span></div>
              <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-gray-400" /><span className="text-gray-500 w-16 shrink-0">Filed</span><span className="font-medium text-gray-900">{searchResult.filedDate}</span></div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                <Timer className="h-4 w-4 text-[#138808]" /> Application Timeline
              </h3>
              <div className="space-y-0">
                {searchResult.timeline.map((step, idx) => {
                  const statusCfg = STATUS_MAP[step.status];
                  const isLast = idx === searchResult.timeline.length - 1;
                  return (
                    <div key={idx} className="flex gap-3">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${
                          step.status === "completed" ? "bg-green-50 border-green-400" :
                          step.status === "in_progress" ? "bg-blue-50 border-blue-400 animate-pulse" :
                          "bg-gray-50 border-gray-200"
                        }`}>
                          {step.status === "completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : step.status === "in_progress" ? (
                            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                          ) : (
                            <step.icon className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        {!isLast && <div className={`w-0.5 h-full min-h-[2rem] ${step.status === "completed" ? "bg-green-300" : "bg-gray-200"}`} />}
                      </div>
                      {/* Content */}
                      <div className={`pb-4 flex-1 ${isLast ? "" : ""}`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-sm text-gray-900">{step.step}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
                            {statusCfg.label}
                          </span>
                          {step.date && <span className="text-[10px] text-gray-400">{step.date}</span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{step.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Not Found */}
      {showDemo && !searchResult && (
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 text-center animate-in fade-in duration-200">
          <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
          <p className="font-bold text-gray-900">Application Not Found</p>
          <p className="text-sm text-gray-500 mt-1">No application matches &quot;{trackingId}&quot;. This is a demo database — try one of the sample IDs above.</p>
        </div>
      )}

      {/* Demo Applications */}
      {!searchResult && (
        <div>
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4 text-[#138808]" /> Sample Applications (Demo)
          </h2>
          <div className="space-y-2">
            {DEMO_APPLICATIONS.map((app) => (
              <button
                key={app.id}
                onClick={() => { setTrackingId(app.id); setSearchResult(app); setShowDemo(false); }}
                className="w-full bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 hover:border-green-200 hover:shadow-sm transition-all text-left"
              >
                <div className={`p-2 rounded-lg shrink-0 ${
                  app.currentStatus === "granted" ? "bg-green-50" : "bg-blue-50"
                }`}>
                  {app.currentStatus === "granted" ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Clock className="h-4 w-4 text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{app.product}</p>
                  <p className="text-xs text-gray-500 font-mono">{app.id}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  app.currentStatus === "granted" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                }`}>
                  {app.scheme}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
