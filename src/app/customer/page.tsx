"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  Scan,
  Search,
  Award,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Camera,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  ArrowLeftRight,
  ShieldAlert,
  FlaskConical,
  Zap,
  Eye,
  Gem,
  Brain,
  Star,
  Bell,
  Scale,
  Database,
} from "lucide-react";

const features = [
  {
    href: "/customer/scan",
    icon: Camera,
    title: "Live Camera Scanner",
    desc: "One-tap scan — point camera at any product for instant AI identification of ISI marks, BIS hallmarks, and more.",
    color: "from-orange-500 to-red-500",
    badge: "AI Vision",
    hot: true,
  },
  {
    href: "/customer/describe",
    icon: Sparkles,
    title: "AI Product Describer",
    desc: "Get comprehensive AI-powered product analysis — materials, safety, BIS compliance, quality assessment, and consumer advice.",
    color: "from-blue-500 to-indigo-500",
    badge: "Popular",
    hot: true,
  },
  {
    href: "/customer/compare",
    icon: ArrowLeftRight,
    title: "Compare Products",
    desc: "Upload two product images for AI-powered side-by-side comparison of quality, safety, and compliance.",
    color: "from-violet-500 to-purple-500",
    badge: "AI",
    hot: false,
  },
  {
    href: "/customer/safety",
    icon: ShieldAlert,
    title: "Safety Risk Analyzer",
    desc: "Comprehensive safety analysis covering physical, chemical, electrical, fire & biological hazards.",
    color: "from-red-500 to-pink-500",
    badge: "Safety",
    hot: false,
  },
  {
    href: "/customer/ingredients",
    icon: FlaskConical,
    title: "Ingredient Checker",
    desc: "Scan ingredient lists to identify harmful substances, allergens, banned chemicals & FSSAI compliance.",
    color: "from-purple-500 to-pink-500",
    badge: "Health",
    hot: false,
  },
  {
    href: "/customer/hallmark-verify",
    icon: Gem,
    title: "HUID Hallmark Verify",
    desc: "Scan jewellery hallmark or enter HUID to verify if gold/silver is BIS registered — like BIS Care app.",
    color: "from-amber-500 to-yellow-500",
    badge: "BIS App",
    hot: true,
  },
  {
    href: "/customer/verify",
    icon: Search,
    title: "Verify Product",
    desc: "Upload product images to verify certification marks and check BIS standards compliance.",
    color: "from-teal-500 to-cyan-500",
    badge: "Upload",
    hot: false,
  },
  {
    href: "/customer/hallmarks",
    icon: Award,
    title: "Hallmark Database",
    desc: "Browse comprehensive database of all Indian certification marks — ISI, BIS Hallmark, FSSAI, AGMARK, BEE, and more.",
    color: "from-green-500 to-emerald-500",
    badge: "Database",
    hot: false,
  },
  {
    href: "/customer/report",
    icon: AlertTriangle,
    title: "Report Counterfeit",
    desc: "Found a fake product? Report it with AI-assisted documentation to help BIS take action.",
    color: "from-amber-500 to-orange-500",
    badge: "Report",
    hot: false,
  },
  {
    href: "/customer/certified-products",
    icon: Database,
    title: "Certified Products DB",
    desc: "Search the BIS certified products database — find ISI, CRS & Hallmark certified brands & manufacturers.",
    color: "from-cyan-500 to-blue-500",
    badge: "BIS App",
    hot: true,
  },
  {
    href: "/customer/notifications",
    icon: Bell,
    title: "Recalls & Alerts",
    desc: "Product recalls, safety warnings, new BIS standards & enforcement actions — stay informed.",
    color: "from-rose-500 to-red-500",
    badge: "Live",
    hot: true,
  },
  {
    href: "/customer/know-your-rights",
    icon: Scale,
    title: "Know Your Rights",
    desc: "Consumer rights under BIS Act & Consumer Protection Act — FAQs, helplines, and how to file complaints.",
    color: "from-indigo-500 to-blue-600",
    badge: "Education",
    hot: false,
  },
];

const stats = [
  { label: "ISI Certified Products", value: "40,000+", icon: CheckCircle2 },
  { label: "BIS Hallmarked Items", value: "2L+ HUID", icon: ShieldCheck },
  { label: "Indian Standards", value: "22,000+", icon: BookOpen },
  { label: "Products Under CRS", value: "468", icon: TrendingUp },
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-br from-[#003580] via-[#0046a8] to-[#0052cc] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute right-8 bottom-8 opacity-10">
          <Image src="/bis-logo.svg" alt="BIS" width={192} height={192} className="h-48 w-48 object-contain" />
        </div>
        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
          <span className="text-[10px] font-semibold text-blue-200 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#FF9933]" /> Gemini 2.5 Flash
          </span>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-[#FF9933]" />
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
              AI-Powered Consumer Protection
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            {user ? `Welcome back, ${user.name.split(' ')[0]}!` : 'BIS Consumer Shield'}
          </h1>
          <p className="text-blue-100 text-sm max-w-lg">
            Verify products, scan certification marks, analyze ingredients, compare products — all powered by Google Gemini AI with smart model fallback. Protect yourself from counterfeit products.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link
              href="/customer/scan"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FF9933] text-white rounded-xl font-semibold text-sm hover:bg-orange-500 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <Camera className="h-4 w-4" />
              Instant Scan
            </Link>
            <Link
              href="/customer/describe"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors border border-white/20"
            >
              <Sparkles className="h-4 w-4" />
              Describe Product
            </Link>
            <Link
              href="/customer/hallmark-verify"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors border border-white/20"
            >
              <Gem className="h-4 w-4" />
              Verify HUID
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-shadow group hover:border-[#003580]/30">
            <Icon className="h-5 w-5 text-[#003580] mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xl font-extrabold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Star className="h-4 w-4 text-[#FF9933]" />
            Quick Actions
          </h2>
          <span className="text-[10px] font-semibold text-[#003580] bg-white px-2.5 py-1 rounded-full border border-blue-100">
            {features.length} AI Tools
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {features.slice(0, 6).map(({ href, icon: Icon, title, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-white hover:shadow-md transition-all text-center border border-transparent hover:border-blue-200"
            >
              <div className={`bg-gradient-to-br ${color} p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform shadow-sm`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-semibold text-gray-700 leading-tight">{title.split(" ").slice(0, 2).join(" ")}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-[#003580]" />
          All AI Tools
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ href, icon: Icon, title, desc, color, badge, hot }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#003580]/20 transition-all duration-300 hover:-translate-y-1 relative"
            >
              {hot && (
                <div className="absolute -top-2 -right-2 bg-[#FF9933] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse">
                  HOT
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div className={`bg-gradient-to-br ${color} p-2.5 rounded-xl text-white shadow-lg`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                  badge === "Popular" || badge === "BIS App" ? "bg-[#FF9933]/10 text-[#FF9933]" : "bg-blue-50 text-[#003580]"
                }`}>
                  {badge}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#003580] transition-colors">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">{desc}</p>
              <div className="flex items-center gap-1 text-[#003580] text-sm font-semibold group-hover:gap-2 transition-all">
                <span>Open</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-[#003580]/5 to-[#0052cc]/5 rounded-2xl p-6 border border-blue-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5 text-[#003580]" /> How It Works
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Tap Scan", desc: "One tap to open camera — AI starts analyzing immediately", emoji: "📸" },
            { step: "2", title: "AI Analysis", desc: "Gemini AI identifies marks, materials, safety risks & compliance instantly", emoji: "🤖" },
            { step: "3", title: "Get Results", desc: "Instant results with scores, recommendations & consumer advice", emoji: "✅" },
          ].map(({ step, title, desc, emoji }) => (
            <div key={step} className="flex gap-3 bg-white p-4 rounded-xl border border-blue-50">
              <div className="w-10 h-10 bg-gradient-to-br from-[#003580] to-[#0052cc] text-white rounded-xl flex items-center justify-center text-lg shrink-0 shadow-md">
                {emoji}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Step {step}: {title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


