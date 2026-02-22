"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Filter,
  ChevronDown,
  Award,
  Package,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Tag,
  Clock,
  FileText,
} from "lucide-react";

// Simulated BIS certified product database
const CERTIFIED_PRODUCTS = [
  { id: 1, name: "Packaged Drinking Water", isCode: "IS 14543:2016", license: "CM/L-2340567", manufacturer: "Bisleri International Pvt Ltd", location: "Mumbai, Maharashtra", category: "Food & Beverages", status: "active", validUntil: "2027-03-31", scheme: "ISI", sector: "Food" },
  { id: 2, name: "Electrical Cables (PVC Insulated)", isCode: "IS 694:2010", license: "CM/L-1104589", manufacturer: "Havells India Ltd", location: "Noida, Uttar Pradesh", category: "Electrical", status: "active", validUntil: "2026-12-31", scheme: "ISI", sector: "Electronics" },
  { id: 3, name: "Portland Cement (OPC 53 Grade)", isCode: "IS 12269:2013", license: "CM/L-0902345", manufacturer: "UltraTech Cement Ltd", location: "Mumbai, Maharashtra", category: "Construction", status: "active", validUntil: "2027-06-30", scheme: "ISI", sector: "Construction" },
  { id: 4, name: "Self-Ballasted LED Lamp 9W", isCode: "IS 16102:2018", license: "CM/L-3301234", manufacturer: "Wipro Lighting", location: "Bangalore, Karnataka", category: "Electrical", status: "active", validUntil: "2026-09-15", scheme: "CRS", sector: "Electronics" },
  { id: 5, name: "Steel TMT Bars (Fe 550D)", isCode: "IS 1786:2008", license: "CM/L-0501234", manufacturer: "Tata Steel Ltd", location: "Jamshedpur, Jharkhand", category: "Construction", status: "active", validUntil: "2028-01-15", scheme: "ISI", sector: "Construction" },
  { id: 6, name: "Gas Stove (2 Burner)", isCode: "IS 4246:2002", license: "CM/L-4402345", manufacturer: "Prestige Appliances", location: "Bangalore, Karnataka", category: "Kitchen Appliances", status: "active", validUntil: "2026-08-20", scheme: "ISI", sector: "Consumer Goods" },
  { id: 7, name: "Mixer Grinder 750W", isCode: "IS 4250:1980", license: "CM/L-4401234", manufacturer: "Bajaj Electricals Ltd", location: "Mumbai, Maharashtra", category: "Kitchen Appliances", status: "active", validUntil: "2027-04-10", scheme: "ISI", sector: "Consumer Goods" },
  { id: 8, name: "Helmet (Two Wheeler)", isCode: "IS 4151:2015", license: "CM/L-6601111", manufacturer: "Studds Accessories Ltd", location: "Faridabad, Haryana", category: "Automotive", status: "active", validUntil: "2026-11-25", scheme: "ISI", sector: "Automotive" },
  { id: 9, name: "Room Heater (Fan Forced)", isCode: "IS 302-2-30", license: "CM/L-3305678", manufacturer: "Usha International Ltd", location: "Noida, Uttar Pradesh", category: "Electrical", status: "suspended", validUntil: "2024-06-30", scheme: "ISI", sector: "Electronics" },
  { id: 10, name: "Stainless Steel Pressure Cooker 5L", isCode: "IS 2347:2017", license: "CM/L-4403456", manufacturer: "Hawkins Cookers Ltd", location: "Mumbai, Maharashtra", category: "Kitchen Appliances", status: "active", validUntil: "2027-09-01", scheme: "ISI", sector: "Consumer Goods" },
  { id: 11, name: "Ceiling Fan (1200mm)", isCode: "IS 374:2019", license: "CM/L-3301567", manufacturer: "Crompton Greaves", location: "Mumbai, Maharashtra", category: "Electrical", status: "active", validUntil: "2027-02-28", scheme: "ISI", sector: "Electronics" },
  { id: 12, name: "Packaged Natural Mineral Water", isCode: "IS 13428:2005", license: "CM/L-2340890", manufacturer: "Himalayan Pvt Ltd", location: "Dehradun, Uttarakhand", category: "Food & Beverages", status: "active", validUntil: "2026-07-15", scheme: "ISI", sector: "Food" },
  { id: 13, name: "Water Purifier (UV+UF)", isCode: "IS 16240:2023", license: "CM/L-3309012", manufacturer: "Kent RO Systems", location: "Noida, Uttar Pradesh", category: "Kitchen Appliances", status: "active", validUntil: "2028-03-10", scheme: "CRS", sector: "Consumer Goods" },
  { id: 14, name: "Solar PV Module", isCode: "IS 14286:2010", license: "R-41099123", manufacturer: "Adani Solar", location: "Mundra, Gujarat", category: "Renewable Energy", status: "active", validUntil: "2027-11-30", scheme: "CRS", sector: "Electronics" },
  { id: 15, name: "Toys (Safety)", isCode: "IS 9873:2019", license: "CM/L-5501234", manufacturer: "Funskool India Ltd", location: "Goa", category: "Toys", status: "active", validUntil: "2026-05-20", scheme: "ISI", sector: "Consumer Goods" },
  { id: 16, name: "Gold Jewellery (22K Ring)", isCode: "IS 1417:2016", license: "HM/L-0012345", manufacturer: "Tanishq (Titan Company)", location: "Bangalore, Karnataka", category: "Jewellery", status: "active", validUntil: "2027-08-31", scheme: "Hallmark", sector: "Precious Metals" },
];

const CATEGORIES = ["All", "Electrical", "Kitchen Appliances", "Food & Beverages", "Construction", "Automotive", "Toys", "Jewellery", "Renewable Energy"];
const SCHEMES = ["All", "ISI", "CRS", "Hallmark"];
const STATUSES = ["All", "Active", "Suspended"];

export default function CertifiedProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [scheme, setScheme] = useState("All");
  const [status, setStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof CERTIFIED_PRODUCTS[0] | null>(null);

  const filtered = CERTIFIED_PRODUCTS.filter((p) => {
    const matchesSearch = search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.isCode.toLowerCase().includes(search.toLowerCase()) ||
      p.license.toLowerCase().includes(search.toLowerCase()) ||
      p.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    const matchesScheme = scheme === "All" || p.scheme === scheme;
    const matchesStatus = status === "All" || p.status === status.toLowerCase();
    return matchesSearch && matchesCategory && matchesScheme && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/customer" className="p-2 hover:bg-blue-50 rounded-xl transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#003580]" />
            BIS Certified Products
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Search ISI, CRS & Hallmark certified products database</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product name, IS code, license number, or manufacturer..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580] shadow-sm"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors ${showFilters ? "bg-[#003580] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm grid sm:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#003580]/20">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Certification Scheme</label>
            <select value={scheme} onChange={(e) => setScheme(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#003580]/20">
              {SCHEMES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#003580]/20">
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-bold text-gray-900">{filtered.length}</span> of {CERTIFIED_PRODUCTS.length} products
        </p>
        <div className="flex gap-2">
          {category !== "All" && (
            <span className="text-xs bg-blue-50 text-[#003580] px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              {category} <button onClick={() => setCategory("All")} className="hover:text-red-500"><XCircle className="h-3 w-3" /></button>
            </span>
          )}
          {scheme !== "All" && (
            <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              {scheme} <button onClick={() => setScheme("All")} className="hover:text-red-500"><XCircle className="h-3 w-3" /></button>
            </span>
          )}
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filtered.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(selectedProduct?.id === product.id ? null : product)}
            className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
              selectedProduct?.id === product.id ? "border-[#003580] shadow-lg ring-2 ring-[#003580]/10" : "border-gray-100 hover:border-blue-200 hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900 text-sm">{product.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    product.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                  }`}>
                    {product.status === "active" ? "ACTIVE" : "SUSPENDED"}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#003580]">
                    {product.scheme}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {product.isCode}</span>
                  <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {product.license}</span>
                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {product.manufacturer}</span>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-400 shrink-0 transition-transform ${selectedProduct?.id === product.id ? "rotate-180" : ""}`} />
            </div>

            {/* Expanded Details */}
            {selectedProduct?.id === product.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 grid sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                <div className="space-y-2.5">
                  <DetailRow icon={Building2} label="Manufacturer" value={product.manufacturer} />
                  <DetailRow icon={MapPin} label="Location" value={product.location} />
                  <DetailRow icon={FileText} label="Standard" value={product.isCode} />
                  <DetailRow icon={Tag} label="License No." value={product.license} />
                </div>
                <div className="space-y-2.5">
                  <DetailRow icon={Award} label="Scheme" value={product.scheme} />
                  <DetailRow icon={Package} label="Category" value={product.category} />
                  <DetailRow icon={Calendar} label="Valid Until" value={product.validUntil} />
                  <DetailRow icon={Clock} label="Status" value={product.status === "active" ? "Active ✓" : "Suspended ✗"} />
                </div>
                <div className="sm:col-span-2 flex gap-2 mt-2">
                  <a href="https://www.bis.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-[#003580] bg-blue-50 px-3 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                    <ExternalLink className="h-3 w-3" /> Verify on BIS Website
                  </a>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-xl hover:bg-green-100 transition-colors">
                    <CheckCircle2 className="h-3 w-3" /> Certificate Valid
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-600">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* BIS Info */}
      <div className="bg-gradient-to-r from-[#003580]/5 to-[#0052cc]/5 rounded-2xl p-5 border border-blue-100">
        <h3 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-1.5">
          <Award className="h-4 w-4 text-[#003580]" /> About BIS Certification
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          The Bureau of Indian Standards (BIS) is the national standards body of India. Products certified by BIS carry the ISI mark (for standards), BIS Hallmark (for gold/silver jewellery), or CRS registration (for electronics). Always look for these marks to ensure product quality and safety. Verify any certification at <a href="https://www.bis.gov.in" target="_blank" rel="noreferrer" className="text-[#003580] underline">bis.gov.in</a> or call the BIS helpline at <strong>14100</strong>.
        </p>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
      <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
      <span className="text-xs font-medium text-gray-900">{value}</span>
    </div>
  );
}
