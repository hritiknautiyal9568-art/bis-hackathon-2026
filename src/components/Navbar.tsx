"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  X,
  FileCheck,
  BookOpen,
  User,
  Store,
  LogIn,
  LogOut,
  Settings,
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  const navLinks = [
    ...(user?.role === "customer" ? [{ href: "/customer", label: "Consumer Portal", icon: User }] : []),
    ...(user?.role === "seller" ? [{ href: "/seller", label: "Manufacturer Portal", icon: Store }] : []),
    { href: "/analyze", label: "Analyze", icon: FileCheck },
    { href: "/standards", label: "Standards", icon: BookOpen },
  ];

  return (
    <nav className="bg-[#003580] text-white shadow-lg sticky top-0 z-50">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="bg-white rounded-full p-1 shadow-md">
              <Image
                src="/bis-logo.svg"
                alt="BIS Logo"
                width={36}
                height={36}
                className="h-8 w-8 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold leading-tight">BIS Smart Portal</div>
              <div className="text-[10px] text-blue-200 leading-tight">
                Bureau of Indian Standards — AI Compliance Platform
              </div>
            </div>
            <div className="sm:hidden">
              <div className="text-sm font-bold">BIS Portal</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-700/50 transition-colors"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-1 ml-2 pl-2 border-l border-blue-400/30">
                    <Link href={user.role === "seller" ? "/seller/settings" : "/customer/settings"}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-700/50 transition-colors">
                      <Settings className="h-4 w-4" />
                      <span className="hidden lg:inline">Settings</span>
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${user.role === "seller" ? "bg-[#138808]" : "bg-[#FF9933]"}`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-blue-100 hidden lg:inline">{user.name.split(" ")[0]}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-blue-100 hover:text-white hover:bg-red-500/30 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden lg:inline">Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-4 py-2 ml-2 rounded-lg text-sm font-bold bg-[#FF9933] text-white hover:bg-orange-500 transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-blue-700/50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#002a66] border-t border-blue-600">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-700/50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
            {!loading && user && (
              <>
                <Link href={user.role === "seller" ? "/seller/settings" : "/customer/settings"}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-700/50 transition-colors"
                  onClick={() => setMobileOpen(false)}>
                  <Settings className="h-5 w-5" /> Settings
                </Link>
                <div className="flex items-center gap-3 px-3 py-3 text-sm text-blue-200">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${user.role === "seller" ? "bg-[#138808]" : "bg-[#FF9933]"}`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {user.name} ({user.role})
                </div>
                <button onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-300 hover:text-white hover:bg-red-500/30 transition-colors w-full text-left">
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </>
            )}
            {!loading && !user && (
              <Link href="/login"
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold text-white bg-[#FF9933]/80 hover:bg-[#FF9933] transition-colors"
                onClick={() => setMobileOpen(false)}>
                <LogIn className="h-5 w-5" /> Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
