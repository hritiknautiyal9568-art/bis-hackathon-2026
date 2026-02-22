"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Tag,
  Filter,
  XCircle,
  Megaphone,
  Shield,
  Package,
  ChevronDown,
} from "lucide-react";

type NotifType = "recall" | "warning" | "update" | "new_standard" | "enforcement";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  summary: string;
  details: string;
  date: string;
  category: string;
  affectedProducts?: string[];
  action?: string;
  source: string;
  isNew: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: 1, type: "recall", title: "BIS Recalls Uncertified LED Bulbs", isNew: true,
    summary: "BIS has issued recall notice for 15 brands of LED bulbs found selling without valid CRS registration.",
    details: "Following surveillance operations in Delhi-NCR, BIS identified 15 brands of self-ballasted LED lamps being sold without valid CRS registration under IS 16102. Consumers are advised to check for valid R-number on all LED products. Return uncertified products to point of purchase for refund.",
    date: "2026-01-15", category: "Electrical",
    affectedProducts: ["Generic LED 9W (Brand: LuxBright)", "EcoLamp 12W", "StarLite LED 7W", "BrightMax 15W"],
    action: "Return to seller for refund. Report at consumerhelpline.gov.in or call 14100.",
    source: "BIS Notification No. CRS/LED/2026/001",
  },
  {
    id: 2, type: "warning", title: "Counterfeit ISI Marks on Helmets", isNew: true,
    summary: "BIS warns consumers about fake ISI marks detected on two-wheeler helmets sold online.",
    details: "BIS enforcement teams have identified multiple online sellers offering helmets with counterfeit ISI marks (IS 4151:2015). These helmets failed impact resistance tests and pose serious safety risks. Always verify the ISI mark license number on bis.gov.in before purchasing helmets online.",
    date: "2026-01-12", category: "Automotive",
    affectedProducts: ["Various online-only helmet brands without verifiable CM/L numbers"],
    action: "Verify helmet ISI mark at bis.gov.in. Report fake products to BIS helpline 14100.",
    source: "BIS Consumer Alert CA/2026/003",
  },
  {
    id: 3, type: "new_standard", title: "New Standard for Electric Vehicles Chargers", isNew: true,
    summary: "BIS publishes IS 17017:2026 for EV charging equipment safety and performance requirements.",
    details: "BIS has published the updated Indian Standard IS 17017:2026 covering safety and performance requirements for electric vehicle supply equipment (EVSE). The standard covers conductive charging systems, connector types (CCS2, CHAdeMO, Type2 AC), and safety requirements. Manufacturers have 12 months to comply.",
    date: "2026-01-10", category: "Automotive",
    action: "Manufacturers: Apply for BIS certification within 12 months.",
    source: "BIS Gazette Notification dt. 10 Jan 2026",
  },
  {
    id: 4, type: "enforcement", title: "BIS Seizes Fake Water Purifiers in Delhi", isNew: false,
    summary: "BIS enforcement raids in Delhi result in seizure of 500+ uncertified water purifiers bearing fake ISI marks.",
    details: "BIS Delhi branch, in coordination with Delhi Police, conducted raids across Lajpat Nagar and Nehru Place markets and seized over 500 water purifiers bearing counterfeit ISI marks. The purifiers, tested at NABL labs, failed to meet IS 16240:2023 requirements for UV and UF purification. FIR filed under BIS Act 2016.",
    date: "2026-01-08", category: "Kitchen Appliances",
    affectedProducts: ["AquaPure RO (fake)", "WaterKing UV+UF (fake)", "PureLife RO (unregistered)"],
    action: "Check your purifier's BIS registration at bis.gov.in. Call 14100 if suspicious.",
    source: "BIS Enforcement Report ENF/DL/2026/012",
  },
  {
    id: 5, type: "update", title: "Hallmarking Now Mandatory for Silver Jewellery", isNew: false,
    summary: "BIS extends mandatory hallmarking to silver jewellery (IS 2112) effective 1 April 2026.",
    details: "The Government of India has mandated BIS hallmarking for silver jewellery and artefacts with effect from 1 April 2026. Silver items must carry the BIS hallmark with HUID for 999 (fine silver), 970, 925 (sterling silver), and 900 purity grades. Jewellers must register on bis.gov.in for hallmarking.",
    date: "2026-01-05", category: "Jewellery",
    action: "Jewellers: Register for silver hallmarking at manakonline.bis.gov.in by 31 March 2026.",
    source: "Ministry of Consumer Affairs Notification S.O. 123(E)",
  },
  {
    id: 6, type: "recall", title: "Pressure Cooker Recall - Gasket Defect", isNew: false,
    summary: "Voluntary recall of specific batch of 3L pressure cookers due to defective gasket seal that may cause steam leakage.",
    details: "A leading pressure cooker manufacturer has voluntarily recalled batch BT-2025-Q4-0089 of 3L stainless steel pressure cookers (IS 2347:2017) due to a defective silicone gasket that may not seal properly under high pressure. Affected consumers can get free replacement gaskets or full refund.",
    date: "2025-12-28", category: "Kitchen Appliances",
    affectedProducts: ["Model PC-3000SS, Batch BT-2025-Q4-0089, manufactured Oct-Nov 2025"],
    action: "Check batch number on cooker body. Contact manufacturer's toll-free number for replacement.",
    source: "Voluntary Recall Notice VR/2025/045",
  },
  {
    id: 7, type: "new_standard", title: "Updated Standard for Packaged Atta", isNew: false,
    summary: "BIS revises IS 1797 for whole wheat flour (atta) with enhanced testing for aflatoxin and pesticide residues.",
    details: "BIS has published revised IS 1797:2026 for whole wheat flour (atta) incorporating enhanced requirements for aflatoxin B1 limits (reduced to 5 µg/kg from 10 µg/kg), pesticide residue testing per FSSAI schedule, and fortification requirements with iron, folic acid, and Vitamin B12 as per FSSAI mandate.",
    date: "2025-12-20", category: "Food & Beverages",
    action: "Atta manufacturers: Contact BIS for updated testing requirements.",
    source: "BIS Standard IS 1797:2026 published 20 Dec 2025",
  },
  {
    id: 8, type: "warning", title: "BIS Advisory: Verify Cement ISI Mark", isNew: false,
    summary: "BIS issues advisory after detecting substandard cement with fake ISI marks in UP and Bihar construction projects.",
    details: "BIS has detected cement bags with counterfeit ISI marks (IS 269, IS 8112, IS 12269) in multiple districts of UP and Bihar. The fake cement failed compressive strength tests. Builders and consumers should verify cement ISI mark license numbers on bis.gov.in and purchase from authorized dealers only.",
    date: "2025-12-15", category: "Construction",
    affectedProducts: ["Multiple local brands with unverifiable CM/L numbers"],
    action: "Verify cement ISI mark at bis.gov.in/isi-marked-item. Report to BIS helpline 14100.",
    source: "BIS Advisory ADV/2025/089",
  },
];

const TYPE_CONFIG: Record<NotifType, { color: string; bg: string; icon: any; label: string }> = {
  recall: { color: "text-red-700", bg: "bg-red-50 border-red-100", icon: AlertTriangle, label: "Recall" },
  warning: { color: "text-amber-700", bg: "bg-amber-50 border-amber-100", icon: ShieldAlert, label: "Warning" },
  update: { color: "text-blue-700", bg: "bg-blue-50 border-blue-100", icon: Info, label: "Update" },
  new_standard: { color: "text-green-700", bg: "bg-green-50 border-green-100", icon: CheckCircle2, label: "New Standard" },
  enforcement: { color: "text-purple-700", bg: "bg-purple-50 border-purple-100", icon: Shield, label: "Enforcement" },
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<NotifType | "all">("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = filter === "all" ? NOTIFICATIONS : NOTIFICATIONS.filter(n => n.type === filter);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/customer" className="p-2 hover:bg-blue-50 rounded-xl transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-[#003580]" />
            BIS Notifications & Recalls
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Product recalls, safety warnings & BIS updates</p>
        </div>
        <div className="bg-red-50 px-3 py-1 rounded-full border border-red-100">
          <span className="text-xs font-bold text-red-600">{NOTIFICATIONS.filter(n => n.isNew).length} New</span>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === "all" ? "bg-[#003580] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          All ({NOTIFICATIONS.length})
        </button>
        {(Object.entries(TYPE_CONFIG) as [NotifType, typeof TYPE_CONFIG[NotifType]][]).map(([type, cfg]) => (
          <button key={type} onClick={() => setFilter(type)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${filter === type ? "bg-[#003580] text-white" : `${cfg.bg} ${cfg.color} hover:opacity-80`}`}>
            <cfg.icon className="h-3 w-3" />
            {cfg.label} ({NOTIFICATIONS.filter(n => n.type === type).length})
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.map((notif) => {
          const cfg = TYPE_CONFIG[notif.type];
          const isExpanded = expanded === notif.id;
          return (
            <div
              key={notif.id}
              onClick={() => setExpanded(isExpanded ? null : notif.id)}
              className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${isExpanded ? "border-[#003580]/30 shadow-lg" : "border-gray-100 hover:border-gray-200 hover:shadow-sm"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`${cfg.bg} p-2 rounded-xl border shrink-0`}>
                  <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label.toUpperCase()}</span>
                    {notif.isNew && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF9933]/10 text-[#FF9933] animate-pulse">NEW</span>}
                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><Calendar className="h-3 w-3" />{notif.date}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{notif.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.summary}</p>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-in fade-in duration-200">
                  <p className="text-sm text-gray-700 leading-relaxed">{notif.details}</p>

                  {notif.affectedProducts && (
                    <div className="bg-red-50/50 rounded-xl p-3">
                      <p className="text-xs font-bold text-red-700 mb-1.5 flex items-center gap-1"><Package className="h-3.5 w-3.5" /> Affected Products</p>
                      <ul className="space-y-1">
                        {notif.affectedProducts.map((p, i) => (
                          <li key={i} className="text-xs text-red-600 flex items-center gap-1.5">
                            <XCircle className="h-3 w-3 shrink-0" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {notif.action && (
                    <div className="bg-blue-50/50 rounded-xl p-3">
                      <p className="text-xs font-bold text-[#003580] mb-1 flex items-center gap-1"><Megaphone className="h-3.5 w-3.5" /> Action Required</p>
                      <p className="text-xs text-blue-700">{notif.action}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] text-gray-400"><Tag className="h-3 w-3 inline mr-1" />{notif.source}</span>
                    <a href="https://www.bis.gov.in" target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#003580] flex items-center gap-1 hover:underline">
                      View on BIS <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Emergency Contacts */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-5 border border-red-100">
        <h3 className="font-bold text-red-800 text-sm mb-2 flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4" /> Report Unsafe Products
        </h3>
        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/70 rounded-xl p-3">
            <p className="font-bold text-gray-900">BIS Helpline</p>
            <p className="text-red-700 font-mono text-lg font-bold">14100</p>
          </div>
          <div className="bg-white/70 rounded-xl p-3">
            <p className="font-bold text-gray-900">Consumer Helpline</p>
            <p className="text-red-700 font-mono text-lg font-bold">1800-11-4000</p>
          </div>
          <div className="bg-white/70 rounded-xl p-3">
            <p className="font-bold text-gray-900">BIS Email</p>
            <p className="text-[#003580] font-medium">cmd@bis.gov.in</p>
          </div>
        </div>
      </div>
    </div>
  );
}
