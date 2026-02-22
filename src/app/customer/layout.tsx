"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Scan,
  Search,
  Award,
  AlertTriangle,
  Home,
  Menu,
  X,
  User,
  ArrowLeft,
  Sparkles,
  ArrowLeftRight,
  ShieldAlert,
  FlaskConical,
  Settings,
  LogOut,
  Gem,
} from "lucide-react";
import AIChat from "@/components/AIChat";
import { useAuth } from "@/context/AuthContext";

const customerNav = [
  { href: "/customer", label: "Dashboard", icon: Home },
  { href: "/customer/scan", label: "Live Scanner", icon: Scan },
  { href: "/customer/describe", label: "Product Describer", icon: Sparkles },
  { href: "/customer/compare", label: "Compare Products", icon: ArrowLeftRight },
  { href: "/customer/safety", label: "Safety Analyzer", icon: ShieldAlert },
  { href: "/customer/ingredients", label: "Ingredient Check", icon: FlaskConical },
  { href: "/customer/verify", label: "Verify Product", icon: Search },
  { href: "/customer/hallmarks", label: "Hallmark Database", icon: Award },
  { href: "/customer/hallmark-verify", label: "Verify HUID", icon: Gem },
  { href: "/customer/report", label: "Report Fake", icon: AlertTriangle },
  { href: "/customer/settings", label: "Settings", icon: Settings },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-orange-50/20">
      {/* Top Bar */}
      <header className="bg-gradient-to-r from-[#003580] to-blue-700 text-white sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/customer" className="flex items-center gap-2">
              <div className="bg-white rounded-lg p-1">
                <ShieldCheck className="h-6 w-6 text-[#003580]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">BIS Consumer Shield</h1>
                <p className="text-[10px] text-blue-200 -mt-0.5">Product Safety & Verification</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-blue-200 hidden sm:inline">
                Welcome, <span className="font-semibold text-white">{user.name.split(' ')[0]}</span>
              </span>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-blue-200 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <div className="bg-white/20 p-2 rounded-full">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-[60px] lg:top-[57px] left-0 z-30 h-[calc(100vh-60px)] lg:h-[calc(100vh-57px)] w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <nav className="p-3 space-y-1">
            {customerNav.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#003580] text-white shadow-md"
                      : "text-gray-600 hover:bg-blue-50 hover:text-[#003580]"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-3 right-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs font-semibold text-[#003580]">Need Help?</p>
              <p className="text-[10px] text-gray-500 mt-1">Call BIS helpline</p>
              <p className="text-lg font-bold text-[#003580] mt-1">📞 14100</p>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-57px)]">
          {children}
        </main>
      </div>

      {/* AI Chat */}
      <AIChat userRole="customer" />
    </div>
  );
}
