"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FileCheck,
  BarChart3,
  ScanLine,
  BookOpen,
  Shield,
  Zap,
  Building2,
  ArrowRight,
  TrendingUp,
  Users,
  Globe,
  Lightbulb,
  Award,
  Sparkles,
  Camera,
  ShieldAlert,
  FlaskConical,
  ArrowLeftRight,
  Eye,
  Brain,
  CheckCircle2,
  Lock,
  LogIn,
  Gem,
  Package,
  Rocket,
  Star,
  Target,
  Clock,
} from "lucide-react";

const consumerFeatures = [
  {
    icon: Camera,
    title: "Live Camera Scanner",
    description:
      "One-tap scan — point your camera at any product to instantly identify ISI marks, BIS hallmarks, FSSAI logos via AI vision.",
    href: "/customer/scan",
    iconBg: "bg-gradient-to-br from-orange-400 to-red-500",
    badge: "AI Vision",
    authRequired: true,
    role: "customer" as const,
  },
  {
    icon: Sparkles,
    title: "AI Product Describer",
    description:
      "Get comprehensive AI analysis — materials, safety assessment, BIS compliance, quality scoring, consumer advice, all from a single image.",
    href: "/customer/describe",
    iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
    badge: "Popular",
    authRequired: true,
    role: "customer" as const,
  },
  {
    icon: ArrowLeftRight,
    title: "Product Comparison",
    description:
      "Upload two product images for AI-powered side-by-side comparison of quality, safety, compliance, and value scores.",
    href: "/customer/compare",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    badge: "AI",
    authRequired: true,
    role: "customer" as const,
  },
  {
    icon: ShieldAlert,
    title: "Safety Risk Analyzer",
    description:
      "Comprehensive hazard analysis — physical, chemical, electrical, fire & biological risks with safety scores.",
    href: "/customer/safety",
    iconBg: "bg-gradient-to-br from-red-500 to-pink-600",
    badge: "Safety",
    authRequired: true,
    role: "customer" as const,
  },
  {
    icon: FlaskConical,
    title: "Ingredient Checker",
    description:
      "Scan ingredient lists to identify harmful substances, allergens, banned chemicals & FSSAI compliance status.",
    href: "/customer/ingredients",
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-600",
    badge: "Health",
    authRequired: true,
    role: "customer" as const,
  },
  {
    icon: Gem,
    title: "Hallmark HUID Verify",
    description:
      "Scan jewellery hallmark or enter HUID to instantly verify if gold/silver is BIS registered — like the official BIS Care app.",
    href: "/customer/hallmark-verify",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
    badge: "BIS App",
    authRequired: true,
    role: "customer" as const,
  },
];

const sellerFeatures = [
  {
    icon: FileCheck,
    title: "AI Compliance Analysis",
    description:
      "Upload product specs or datasheets. AI identifies applicable BIS standards (IS codes) and generates real-time compliance score.",
    href: "/seller/compliance",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    badge: "Core",
    authRequired: true,
    role: "seller" as const,
  },
  {
    icon: BarChart3,
    title: "Approval Simulation",
    description:
      "Predict BIS approval probability. Get estimated timelines, required tests, costs, and risk assessments before submission.",
    href: "/seller/simulate",
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-600",
    badge: "Prediction",
    authRequired: true,
    role: "seller" as const,
  },
  {
    icon: Package,
    title: "Product Scanner",
    description:
      "Scan your products with AI to get instant compliance scores, gap analysis, and actionable recommendations.",
    href: "/seller/scan",
    iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
    badge: "Scanner",
    authRequired: true,
    role: "seller" as const,
  },
  {
    icon: Eye,
    title: "Quality Inspector",
    description:
      "Upload product images for AI-powered visual quality assessment and defect detection.",
    href: "/seller/quality",
    iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
    badge: "AI Vision",
    authRequired: true,
    role: "seller" as const,
  },
];

const publicFeatures = [
  {
    icon: BookOpen,
    title: "Standards Explorer",
    description:
      "Browse and search BIS standards in plain, simple language. Perfect for MSMEs and startups to understand requirements.",
    href: "/standards",
    iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
    badge: "Open",
    authRequired: false,
    role: null,
  },
  {
    icon: FileCheck,
    title: "Quick Analysis",
    description:
      "Upload product specs for instant AI compliance check — available to everyone, no login required.",
    href: "/analyze",
    iconBg: "bg-gradient-to-br from-teal-500 to-cyan-600",
    badge: "Open",
    authRequired: false,
    role: null,
  },
];

const stats = [
  { value: "22,000+", label: "Indian Standards", icon: Award },
  { value: "50,000+", label: "BIS Licenses", icon: Shield },
  { value: "15", label: "AI Functions", icon: Brain },
  { value: "24/7", label: "AI Availability", icon: Globe },
];

const aiCapabilities = [
  "Live camera scanning with auto-capture",
  "Multi-modal product analysis (text + images)",
  "Certification mark identification & verification",
  "Side-by-side product comparison",
  "Safety risk scoring across 5 hazard categories",
  "Ingredient & material analysis with FSSAI check",
  "HUID hallmark verification like BIS Care app",
  "BIS approval probability prediction",
  "Product compliance scanner for manufacturers",
  "Document pre-review before submission",
  "Compliance gap analysis with remediation steps",
  "Plain-language standard explanations",
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Reduce Rejection Rates",
    description: "AI pre-screening identifies gaps before official submission, dramatically reducing costly rejections.",
  },
  {
    icon: Users,
    title: "MSME Empowerment",
    description: "Simplified interface and plain-language explanations make BIS standards accessible to all businesses.",
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    description: "Get specific suggestions on material changes, safety upgrades, and required lab tests for compliance.",
  },
  {
    icon: Building2,
    title: "Ease of Doing Business",
    description: "Streamlined certification supporting Digital India and Make in India initiatives.",
  },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleFeatureClick = (e: React.MouseEvent, feature: { href: string; authRequired: boolean; role: string | null }) => {
    if (feature.authRequired && !user) {
      e.preventDefault();
      router.push("/login");
    }
    // If logged in but wrong role, redirect to login to switch
    if (feature.authRequired && user && feature.role && user.role !== feature.role) {
      e.preventDefault();
      router.push("/login");
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#003580] via-[#002a66] to-[#001a40]">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(255,153,51,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(19,136,8,0.3) 0%, transparent 50%)',
          }} />
        </div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF9933]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#138808]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-blue-200 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
              <Sparkles className="h-4 w-4 text-[#FF9933]" />
              Bureau of Indian Standards — AI Initiative
              <span className="bg-[#FF9933] text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">HACKATHON 2026</span>
            </div>

            {/* Official BIS Logo */}
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-full p-2 shadow-xl shadow-white/10">
                <Image
                  src="/bis-logo.svg"
                  alt="Bureau of Indian Standards Official Logo"
                  width={80}
                  height={80}
                  className="h-20 w-20 object-contain"
                  priority
                />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Smart Compliance.{" "}
              <span className="text-[#FF9933]">Faster Certification.</span>
              <br />
              <span className="text-[#138808]">Safer India.</span>
            </h1>

            <p className="max-w-3xl mx-auto text-lg text-blue-200 mb-4 leading-relaxed">
              India&apos;s first AI-powered BIS compliance platform. Scan products with your camera, verify hallmarks via HUID, analyze ingredients, compare products, assess safety risks — all powered by <strong className="text-white">Google Gemini AI (multi-model)</strong>.
            </p>

            {/* Tech Stack Badges */}
            <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
              <span className="px-3 py-1 bg-white/10 text-blue-200 text-[11px] font-semibold rounded-full border border-white/10">Next.js 16</span>
              <span className="px-3 py-1 bg-white/10 text-blue-200 text-[11px] font-semibold rounded-full border border-white/10">Gemini 2.5 Flash</span>
              <span className="px-3 py-1 bg-white/10 text-blue-200 text-[11px] font-semibold rounded-full border border-white/10">SQLite + JWT Auth</span>
              <span className="px-3 py-1 bg-white/10 text-blue-200 text-[11px] font-semibold rounded-full border border-white/10">TypeScript</span>
              <span className="px-3 py-1 bg-white/10 text-blue-200 text-[11px] font-semibold rounded-full border border-white/10">Tailwind CSS v4</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              {user ? (
                <>
                  <Link
                    href={user.role === "customer" ? "/customer" : "/seller"}
                    className="flex items-center gap-2 px-8 py-4 bg-[#FF9933] text-white rounded-xl font-bold text-lg hover:bg-[#e88a2a] transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    <Rocket className="h-5 w-5" />
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href={user.role === "customer" ? "/customer/scan" : "/seller/scan"}
                    className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
                  >
                    <Camera className="h-5 w-5" />
                    Scan Product Now
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-8 py-4 bg-[#FF9933] text-white rounded-xl font-bold text-lg hover:bg-[#e88a2a] transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    <Zap className="h-5 w-5" />
                    Get Started
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/analyze"
                    className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
                  >
                    <FileCheck className="h-5 w-5" />
                    Try Quick Analysis
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors"
                >
                  <stat.icon className="h-5 w-5 text-[#FF9933] mx-auto mb-2" />
                  <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 720,0 1440,40 L1440,80 L0,80 Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* AI Capabilities Marquee */}
      <section className="py-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-5 w-5 text-[#003580]" />
            <h3 className="font-bold text-gray-900">Powered by Google Gemini AI (Multi-Model)</h3>
            <span className="text-[10px] font-bold bg-[#003580] text-white px-2 py-0.5 rounded-full">15 AI Functions</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {aiCapabilities.map((cap) => (
              <div key={cap} className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 className="h-3 w-3 text-[#138808] shrink-0" />
                <span>{cap}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three simple steps to verify any product&apos;s compliance using AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Scan or Upload",
                description: "One tap to open camera and auto-scan, or upload product images, specs, or descriptions.",
                icon: "📸",
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Gemini AI analyzes against 22,000+ BIS standards — identifies marks, scores safety, checks compliance.",
                icon: "🤖",
              },
              {
                step: "03",
                title: "Instant Results",
                description: "Get compliance scores, safety ratings, gap analysis, consumer advice, and recommendations — instantly.",
                icon: "✅",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow h-full">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-xs font-bold text-[#003580] mb-2">STEP {item.step}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consumer Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1.5 bg-[#FF9933] rounded-full" />
            <h2 className="text-2xl font-extrabold text-gray-900">
              Consumer Features
            </h2>
          </div>
          <p className="text-gray-500 text-sm mb-8 ml-5">
            Protect yourself from counterfeit products with AI-powered verification
            {!user && <span className="text-[#FF9933] font-semibold ml-2">• Login required</span>}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consumerFeatures.map((feature) => (
              <Link
                key={feature.href}
                href={feature.authRequired && !user ? "/login" : feature.href}
                onClick={(e) => handleFeatureClick(e, feature)}
                className="group rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:border-[#FF9933]/30 hover:-translate-y-1 relative"
              >
                {feature.authRequired && !user && (
                  <div className="absolute top-3 right-3 bg-gray-100 p-1.5 rounded-lg">
                    <Lock className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                )}
                <div className={`inline-flex p-3 rounded-xl ${feature.iconBg} mb-4 text-white shadow-lg`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#FF9933] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed mb-3">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold bg-[#FF9933]/10 text-[#FF9933] px-2 py-1 rounded-full">
                    {feature.badge}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#003580] group-hover:gap-2 transition-all">
                    {feature.authRequired && !user ? "Login to Access" : "Try Now"} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturer Features */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1.5 bg-[#138808] rounded-full" />
            <h2 className="text-2xl font-extrabold text-gray-900">
              Manufacturer Features
            </h2>
          </div>
          <p className="text-gray-500 text-sm mb-8 ml-5">
            Streamline your BIS certification process with AI-powered tools
            {!user && <span className="text-[#138808] font-semibold ml-2">• Login required</span>}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sellerFeatures.map((feature) => (
              <Link
                key={feature.href}
                href={feature.authRequired && !user ? "/login" : feature.href}
                onClick={(e) => handleFeatureClick(e, feature)}
                className="group rounded-2xl border border-green-200 bg-white p-6 hover:shadow-xl transition-all duration-300 hover:border-[#138808]/30 hover:-translate-y-1 relative"
              >
                {feature.authRequired && !user && (
                  <div className="absolute top-3 right-3 bg-gray-100 p-1.5 rounded-lg">
                    <Lock className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                )}
                <div className={`inline-flex p-3 rounded-xl ${feature.iconBg} mb-4 text-white shadow-lg`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#138808] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed mb-3">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold bg-[#138808]/10 text-[#138808] px-2 py-1 rounded-full">
                    {feature.badge}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#138808] group-hover:gap-2 transition-all">
                    {feature.authRequired && !user ? "Login to Access" : "Try Now"} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Public/Open Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1.5 bg-[#003580] rounded-full" />
            <h2 className="text-2xl font-extrabold text-gray-900">
              Open Access
            </h2>
          </div>
          <p className="text-gray-500 text-sm mb-8 ml-5">
            Available to everyone — no login required
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
            {publicFeatures.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:border-[#003580]/30 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.iconBg} mb-4 text-white shadow-lg`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#003580] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed mb-3">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold bg-blue-50 text-[#003580] px-2 py-1 rounded-full">
                    {feature.badge} — No Login
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#003580] group-hover:gap-2 transition-all">
                    Try Now <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Why BIS Smart Portal?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transforming the BIS portal from a static website into an interactive AI compliance advisor
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="bg-[#003580]/5 p-3 rounded-xl w-fit mb-4">
                  <benefit.icon className="h-6 w-6 text-[#003580]" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture / Tech Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Technical Architecture
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">
              Built with modern tech stack for the BIS Hackathon 2026
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Next.js 16", desc: "App Router + RSC", icon: "⚡" },
              { name: "Gemini 2.5 Flash", desc: "Multimodal AI", icon: "🧠" },
              { name: "SQLite", desc: "Persistent Database", icon: "🗄️" },
              { name: "JWT + bcrypt", desc: "Secure Auth", icon: "🔐" },
              { name: "TypeScript", desc: "Type-Safe Code", icon: "📘" },
              { name: "Tailwind v4", desc: "Utility-First CSS", icon: "🎨" },
            ].map((tech) => (
              <div key={tech.name} className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">{tech.icon}</div>
                <p className="text-sm font-bold text-gray-900">{tech.name}</p>
                <p className="text-[10px] text-gray-500">{tech.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {[
              { value: "46+", label: "Total Routes" },
              { value: "15", label: "AI Functions" },
              { value: "20", label: "API Endpoints" },
              { value: "2", label: "User Roles" },
              { value: "4", label: "DB Tables" },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 bg-[#003580]/5 rounded-xl">
                <p className="text-xl font-extrabold text-[#003580]">{s.value}</p>
                <p className="text-[10px] text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#003580] to-[#002a66] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#FF9933]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#138808]/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="flex justify-center gap-2 mb-6">
            <span className="inline-block w-10 h-1.5 bg-[#FF9933] rounded-full" />
            <span className="inline-block w-10 h-1.5 bg-white rounded-full" />
            <span className="inline-block w-10 h-1.5 bg-[#138808] rounded-full" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to Simplify BIS Certification?
          </h2>
          <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a consumer verifying products or a manufacturer seeking certification — our AI platform makes it effortless.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                href={user.role === "customer" ? "/customer" : "/seller"}
                className="flex items-center gap-2 px-8 py-4 bg-[#FF9933] text-white rounded-xl font-bold hover:bg-[#e88a2a] transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <Rocket className="h-5 w-5" />
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-8 py-4 bg-[#FF9933] text-white rounded-xl font-bold hover:bg-[#e88a2a] transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  <LogIn className="h-5 w-5" />
                  Login / Register
                </Link>
                <Link
                  href="/analyze"
                  className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
                >
                  <FileCheck className="h-5 w-5" />
                  Try Without Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Government Initiatives Banner */}
      <section className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <span className="text-sm font-medium">Digital India</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-medium">Make in India</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/bis-logo.svg" alt="BIS" width={20} height={20} className="h-5 w-5 object-contain" />
              <span className="text-sm font-medium">Bureau of Indian Standards</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Ease of Doing Business</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


