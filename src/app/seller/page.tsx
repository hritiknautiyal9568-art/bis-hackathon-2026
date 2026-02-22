"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  FileCheck,
  BarChart3,
  Scan,
  ClipboardList,
  FileText,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  IndianRupee,
  Building2,
  Zap,
  Target,
  Eye,
  Rocket,
  CheckCircle2,
  Package,
  Shield,
  Brain,
  Star,
  Microscope,
  Timer,
} from "lucide-react";

const features = [
  {
    href: "/seller/compliance",
    icon: FileCheck,
    title: "AI Compliance Analysis",
    desc: "Upload product details and get instant AI-powered compliance analysis against applicable BIS standards.",
    color: "from-blue-500 to-indigo-500",
    badge: "Core",
    hot: true,
  },
  {
    href: "/seller/simulate",
    icon: BarChart3,
    title: "Approval Simulation",
    desc: "Simulate the BIS certification approval process — get probability, timeline, costs, and risk analysis.",
    color: "from-purple-500 to-violet-500",
    badge: "Prediction",
    hot: true,
  },
  {
    href: "/seller/scan",
    icon: Package,
    title: "Product Scanner",
    desc: "Scan your products with AI to get instant compliance scores, gap analysis, and actionable recommendations.",
    color: "from-green-500 to-emerald-500",
    badge: "Scanner",
    hot: true,
  },
  {
    href: "/seller/quality",
    icon: Scan,
    title: "Vision Quality Inspector",
    desc: "Upload product images for AI-powered visual quality assessment and defect detection.",
    color: "from-orange-500 to-red-500",
    badge: "AI Vision",
    hot: false,
  },
  {
    href: "/seller/checklist",
    icon: ClipboardList,
    title: "Compliance Checklist",
    desc: "Generate personalized compliance checklists for your product type with testing requirements.",
    color: "from-teal-500 to-cyan-500",
    badge: "Generator",
    hot: false,
  },
  {
    href: "/seller/documents",
    icon: FileText,
    title: "Document Analyzer",
    desc: "Submit application documents for AI review — catch errors and missing information before submission.",
    color: "from-amber-500 to-orange-500",
    badge: "AI Review",
    hot: false,
  },
  {
    href: "/seller/track-application",
    icon: Timer,
    title: "Track Application",
    desc: "Track your BIS certification application status — ISI, CRS & Hallmark with real-time timeline.",
    color: "from-indigo-500 to-blue-600",
    badge: "BIS App",
    hot: true,
  },
  {
    href: "/seller/lab-directory",
    icon: Microscope,
    title: "NABL Lab Directory",
    desc: "Find BIS-recognized NABL-accredited testing laboratories near you with contact details & test capabilities.",
    color: "from-cyan-500 to-teal-500",
    badge: "Directory",
    hot: false,
  },
];

const processSteps = [
  { icon: FileCheck, label: "Apply", desc: "Submit BIS application with product details" },
  { icon: Scan, label: "Test", desc: "Product testing at BIS-approved lab" },
  { icon: Building2, label: "Inspect", desc: "Factory inspection by BIS officer" },
  { icon: Award, label: "Certify", desc: "Receive BIS license & mark" },
];

export default function SellerDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-br from-[#138808] via-[#0f9d06] to-[#0f6b06] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute right-8 bottom-8 opacity-5">
          <Building2 className="h-48 w-48" />
        </div>
        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
          <span className="text-[10px] font-semibold text-green-200 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#FF9933]" /> Gemini 2.5 Flash
          </span>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-[#FF9933]" />
            <span className="text-xs font-semibold text-green-200 uppercase tracking-wider">
              AI-Powered Compliance Platform
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            {user ? `Welcome back, ${user.name.split(' ')[0]}!` : 'BIS Manufacturer Hub'}
          </h1>
          <p className="text-green-100 text-sm max-w-lg">
            Streamline BIS certification with AI — compliance analysis, approval simulation, product scanning, quality inspection. Get certified faster with Google Gemini AI.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link
              href="/seller/compliance"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#138808] rounded-xl font-semibold text-sm hover:bg-green-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <FileCheck className="h-4 w-4" />
              Start Compliance Check
            </Link>
            <Link
              href="/seller/scan"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors border border-white/20"
            >
              <Package className="h-4 w-4" />
              Scan Product
            </Link>
            <Link
              href="/seller/simulate"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors border border-white/20"
            >
              <BarChart3 className="h-4 w-4" />
              Simulate Approval
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Clock, label: "Avg. Certification Time", value: "45-90 days" },
          { icon: IndianRupee, label: "Application Fee", value: "₹1,000" },
          { icon: Award, label: "Active BIS Licenses", value: "50,000+" },
          { icon: TrendingUp, label: "Products Under CRS", value: "468" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-green-100 shadow-sm hover:shadow-md transition-shadow group hover:border-[#138808]/30">
            <Icon className="h-5 w-5 text-[#138808] mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xl font-extrabold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Star className="h-4 w-4 text-[#FF9933]" />
            Quick Actions
          </h2>
          <span className="text-[10px] font-semibold text-[#138808] bg-white px-2.5 py-1 rounded-full border border-green-100">
            {features.length} AI Tools
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {features.map(({ href, icon: Icon, title, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-white hover:shadow-md transition-all text-center border border-transparent hover:border-green-200"
            >
              <div className={`bg-gradient-to-br ${color} p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform shadow-sm`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-semibold text-gray-700 leading-tight">{title.split(" ").slice(0, 2).join(" ")}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* BIS Certification Process */}
      <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-[#138808]" /> BIS Certification Process
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {processSteps.map(({ icon: Icon, label, desc }, i) => (
            <div key={label} className="relative text-center">
              <div className="bg-gradient-to-br from-[#138808] to-[#0f6b06] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{desc}</p>
              {i < processSteps.length - 1 && (
                <div className="hidden sm:block absolute top-6 -right-2 z-10">
                  <ArrowRight className="h-4 w-4 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-[#138808]" />
          All AI Tools
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ href, icon: Icon, title, desc, color, badge, hot }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#138808]/20 transition-all duration-300 hover:-translate-y-1 relative"
            >
              {hot && (
                <div className="absolute -top-2 -right-2 bg-[#138808] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse">
                  HOT
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div className={`bg-gradient-to-br ${color} p-2.5 rounded-xl text-white shadow-lg`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                  badge === "Scanner" || badge === "Core" ? "bg-[#138808]/10 text-[#138808]" : "bg-gray-100 text-gray-600"
                }`}>
                  {badge}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#138808] transition-colors">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{desc}</p>
              <div className="flex items-center gap-1 text-[#138808] text-sm font-semibold group-hover:gap-2 transition-all">
                <span>Open</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Capabilities */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Rocket className="h-5 w-5 text-[#138808]" /> AI Capabilities — Gemini 2.5 Flash
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { title: "Standard Detection", desc: "Auto-detect applicable IS codes from product descriptions" },
            { title: "Approval Probability", desc: "Predict certification success rate with AI analysis" },
            { title: "Product Compliance Scan", desc: "Scan products for compliance score and gap analysis" },
            { title: "Visual Quality Check", desc: "Detect defects and quality issues from product images" },
            { title: "Document Pre-Review", desc: "Catch errors in applications before BIS submission" },
            { title: "Cost & Timeline", desc: "Estimate total certification costs and timelines" },
          ].map(({ title, desc }) => (
            <div key={title} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-green-50">
              <CheckCircle2 className="h-4 w-4 text-[#138808] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


