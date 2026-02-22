"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Camera,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";

export default function CustomerSettingsPage() {
  const { user, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [settings, setSettings] = useState({
    notifications_enabled: true,
    email_alerts: true,
    dark_mode: false,
    language: "en",
    auto_scan: true,
    scan_quality: "high",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setProfile({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
          });
        }
        if (data.settings) {
          setSettings({
            notifications_enabled: !!data.settings.notifications_enabled,
            email_alerts: !!data.settings.email_alerts,
            dark_mode: !!data.settings.dark_mode,
            language: data.settings.language || "en",
            auto_scan: !!data.settings.auto_scan,
            scan_quality: data.settings.scan_quality || "high",
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          settings,
        }),
      });
      if (res.ok) {
        setSaved(true);
        refreshUser();
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#003580]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-7 w-7 text-[#FF9933]" />
            Consumer Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your profile and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#003580] text-white rounded-xl font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {saved && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-sm text-green-700">Settings saved successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-[#FF9933]/5 to-orange-50 border-b">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-[#FF9933]" />
              Profile Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF9933] to-orange-400 flex items-center justify-center text-white text-2xl font-bold">
                {profile.name.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{profile.name || "User"}</p>
                <p className="text-sm text-gray-500">{profile.email}</p>
                <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-[#FF9933]/10 text-[#FF9933]">
                  Consumer Account
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933]/30 focus:border-[#FF9933] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9933]/30 focus:border-[#FF9933] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#003580]" />
              Notifications
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <ToggleSetting
              label="Push Notifications"
              description="Get alerts for product safety recalls and updates"
              checked={settings.notifications_enabled}
              onChange={(v) => setSettings({ ...settings, notifications_enabled: v })}
              color="#003580"
            />
            <ToggleSetting
              label="Email Alerts"
              description="Receive compliance reports and scan results via email"
              checked={settings.email_alerts}
              onChange={(v) => setSettings({ ...settings, email_alerts: v })}
              color="#003580"
            />
          </div>
        </section>

        {/* Scanner Settings */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Camera className="h-5 w-5 text-[#138808]" />
              Scanner Preferences
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <ToggleSetting
              label="Auto-Scan Mode"
              description="Automatically analyze products when camera detects them"
              checked={settings.auto_scan}
              onChange={(v) => setSettings({ ...settings, auto_scan: v })}
              color="#138808"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scan Quality</label>
              <div className="flex gap-3">
                {["low", "medium", "high"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setSettings({ ...settings, scan_quality: q })}
                    className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                      settings.scan_quality === q
                        ? "bg-[#138808] text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Higher quality produces more detailed results but uses more data
              </p>
            </div>
          </div>
        </section>

        {/* Language & Appearance */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-violet-50 border-b">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              Language & Appearance
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-rose-50 border-b">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Security
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Account Created</p>
                <p className="text-xs text-gray-500">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown"}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
  color,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? "" : "bg-gray-300"
        }`}
        style={checked ? { backgroundColor: color } : {}}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}
