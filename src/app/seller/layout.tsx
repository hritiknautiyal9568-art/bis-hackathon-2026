"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  BarChart3,
  FileCheck,
  Scan,
  ClipboardList,
  FileText,
  Home,
  Menu,
  X,
  Store,
  ArrowLeft,
  Settings,
  LogOut,
  Package,
} from "lucide-react";
import AIChat from "@/components/AIChat";
import { useAuth } from "@/context/AuthContext";

const sellerNav = [
  { href: "/seller", label: "Dashboard", icon: Home },
  { href: "/seller/compliance", label: "Compliance Check", icon: FileCheck },
  { href: "/seller/simulate", label: "Approval Simulation", icon: BarChart3 },
  { href: "/seller/quality", label: "Quality Inspector", icon: Scan },
  { href: "/seller/checklist", label: "Compliance Checklist", icon: ClipboardList },
  { href: "/seller/documents", label: "Document Analyzer", icon: FileText },
  { href: "/seller/scan", label: "Product Scanner", icon: Package },
  { href: "/seller/settings", label: "Settings", icon: Settings },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-emerald-50/30">
      {/* Top Bar */}
      <header className="bg-gradient-to-r from-[#138808] to-green-700 text-white sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/seller" className="flex items-center gap-2">
              <div className="bg-white rounded-lg p-1">
                <ShieldCheck className="h-6 w-6 text-[#138808]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">BIS Manufacturer Hub</h1>
                <p className="text-[10px] text-green-200 -mt-0.5">Product Compliance & Certification</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-green-100 hidden sm:inline">
                Welcome, <span className="font-semibold text-white">{user.name.split(' ')[0]}</span>
              </span>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-green-200 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <div className="bg-white/20 p-2 rounded-full">
              <Store className="h-5 w-5 text-white" />
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
            {sellerNav.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#138808] text-white shadow-md"
                      : "text-gray-600 hover:bg-green-50 hover:text-[#138808]"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-3 right-3">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <p className="text-xs font-semibold text-[#138808]">BIS Helpdesk</p>
              <p className="text-[10px] text-gray-500 mt-1">For certification queries</p>
              <p className="text-lg font-bold text-[#138808] mt-1">📞 14100</p>
              <a
                href="https://www.bis.gov.in"
                target="_blank"
                className="text-[10px] text-[#003580] hover:underline mt-1 block"
              >
                www.bis.gov.in
              </a>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-h-[calc(100vh-57px)]">
          {children}
        </main>
      </div>

      <AIChat userRole="seller" />
    </div>
  );
}
