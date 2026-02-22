"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  Store,
  User,
  ArrowRight,
  Sparkles,
  Brain,
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Building2,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"customer" | "seller">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || "Login failed");
          setLoading(false);
          return;
        }
        setSuccess("Login successful! Redirecting...");
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        setTimeout(() => {
          router.push(meData.user?.role === "seller" ? "/seller" : "/customer");
        }, 500);
      } else {
        if (!name.trim()) { setError("Name is required"); setLoading(false); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters"); setLoading(false); return; }
        const res = await register({ name, email, password, role, phone, company, gstNumber });
        if (!res.success) {
          setError(res.error || "Registration failed");
          setLoading(false);
          return;
        }
        setSuccess("Account created! Redirecting...");
        setTimeout(() => {
          router.push(role === "seller" ? "/seller" : "/customer");
        }, 500);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003580] via-[#0052cc] to-[#003580] flex flex-col relative overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#FF9933]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#138808]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="h-1.5 flex relative z-10">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-center pt-6 pb-2 relative z-10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-2xl border border-white/20">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">BIS Smart Compliance</h1>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <span className="bg-white/10 text-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
              <Brain className="h-3 w-3" /> Gemini AI
            </span>
            <span className="bg-[#FF9933]/20 text-[#FF9933] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#FF9933]/20 flex items-center gap-1">
              <Zap className="h-3 w-3" /> Hackathon
            </span>
          </div>
        </div>
      </div>

      {/* Auth Card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                className={`flex-1 py-3.5 text-sm font-bold transition-colors ${mode === "login" ? "text-white bg-white/10" : "text-blue-300 hover:text-white"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
                className={`flex-1 py-3.5 text-sm font-bold transition-colors ${mode === "register" ? "text-white bg-white/10" : "text-blue-300 hover:text-white"}`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {mode === "register" && (
                <div>
                  <label className="text-xs font-semibold text-blue-200 mb-2 block">I am a</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setRole("customer")}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${role === "customer" ? "bg-[#FF9933]/20 border-[#FF9933]/50 text-[#FF9933]" : "bg-white/5 border-white/10 text-blue-200 hover:bg-white/10"}`}>
                      <User className="h-4 w-4" /> Consumer
                    </button>
                    <button type="button" onClick={() => setRole("seller")}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${role === "seller" ? "bg-[#138808]/20 border-[#138808]/50 text-[#138808]" : "bg-white/5 border-white/10 text-blue-200 hover:bg-white/10"}`}>
                      <Store className="h-4 w-4" /> Manufacturer
                    </button>
                  </div>
                </div>
              )}

              {mode === "register" && (
                <div>
                  <label className="text-xs font-semibold text-blue-200 mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#FF9933]/50" required />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-blue-200 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#FF9933]/50" required />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "register" ? "Min 6 characters" : "Enter password"}
                    className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#FF9933]/50" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {mode === "register" && (
                <div>
                  <label className="text-xs font-semibold text-blue-200 mb-1.5 block">Phone (optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#FF9933]/50" />
                  </div>
                </div>
              )}

              {mode === "register" && role === "seller" && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-blue-200 mb-1.5 block">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                      <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company name"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#FF9933]/50" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-blue-200 mb-1.5 block">GST Number (optional)</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                      <input type="text" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="22AAAAA0000A1Z5"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-blue-300/50 focus:outline-none focus:ring-2 focus:ring-[#FF9933]/50" />
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-300 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-green-300 text-sm bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0" /> {success}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#FF9933] text-white rounded-xl font-bold text-sm hover:bg-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{mode === "login" ? "Sign In" : "Create Account"}<ArrowRight className="h-4 w-4" /></>}
              </button>

              <div className="text-center pt-2">
                <p className="text-[10px] text-blue-300 mb-2">Quick Demo Access</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setEmail("demo@customer.com"); setPassword("demo123"); setMode("login"); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-blue-200 hover:bg-white/10 transition-colors">
                    <User className="h-3 w-3" /> Demo Consumer
                  </button>
                  <button type="button" onClick={() => { setEmail("demo@seller.com"); setPassword("demo123"); setMode("login"); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-blue-200 hover:bg-white/10 transition-colors">
                    <Store className="h-3 w-3" /> Demo Seller
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="text-center mt-6">
            <button onClick={() => router.push("/")} className="text-blue-300 hover:text-white text-sm transition-colors underline underline-offset-4">
              Continue as Guest →
            </button>
          </div>
        </div>
      </div>

      <div className="text-center pb-4 text-blue-300 text-xs relative z-10">
        <p>Bureau of Indian Standards | Ministry of Consumer Affairs</p>
        <p className="mt-0.5">Digital India Initiative • Made in India</p>
      </div>
    </div>
  );
}
