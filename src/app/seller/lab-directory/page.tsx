"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Microscope,
  Search,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle2,
  Building2,
  Filter,
  Star,
  Globe,
  Award,
  ChevronDown,
} from "lucide-react";

const LABS = [
  {
    id: 1, name: "Electronic Regional Test Laboratory (ERTL) — East", city: "Kolkata", state: "West Bengal",
    address: "DN-35, Sector V, Salt Lake City, Kolkata 700091",
    phone: "+91-33-2367-1020", email: "ertleast@bis.gov.in",
    accreditation: "NABL Accredited (ISO/IEC 17025:2017)",
    tests: ["LED Safety & Performance", "Electrical Appliances", "Electronics EMC/EMI", "Cables & Wires", "Switches & Sockets"],
    category: "BIS Lab", rating: 4.5, website: "https://bis.gov.in",
  },
  {
    id: 2, name: "Central Power Research Institute (CPRI)", city: "Bangalore", state: "Karnataka",
    address: "Professor Sir C.V. Raman Road, Sadashivanagar, Bangalore 560080",
    phone: "+91-80-2360-4447", email: "cpri@cpri.in",
    accreditation: "NABL Accredited (ISO/IEC 17025:2017)",
    tests: ["Power Equipment Testing", "High Voltage Testing", "Transformer Testing", "Circuit Breaker Testing", "Energy Meter Calibration"],
    category: "Government Lab", rating: 4.8, website: "https://cpri.in",
  },
  {
    id: 3, name: "STQC Directorate — Electronics Test Centre", city: "Delhi", state: "Delhi",
    address: "Department of IT, Electronics Niketan, CGO Complex, Lodhi Road, New Delhi 110003",
    phone: "+91-11-2436-3083", email: "stqc@gov.in",
    accreditation: "NABL Accredited (ISO/IEC 17025:2017)",
    tests: ["IT Equipment Safety", "Mobile Phone Testing", "Adapter/Charger Testing", "EMC Testing", "Software Quality Testing"],
    category: "Government Lab", rating: 4.6, website: "https://stqc.gov.in",
  },
  {
    id: 4, name: "ERTL — South", city: "Bangalore", state: "Karnataka",
    address: "CSA-4, Peenya Industrial Area, Bangalore 560058",
    phone: "+91-80-2839-6321", email: "ertlsouth@bis.gov.in",
    accreditation: "NABL Accredited (ISO/IEC 17025:2017)",
    tests: ["Cement & Steel Testing", "Plywood & Timber", "Solar PV Modules", "Water Testing", "Pressure Vessels"],
    category: "BIS Lab", rating: 4.4, website: "https://bis.gov.in",
  },
  {
    id: 5, name: "ERTL — North", city: "Delhi", state: "Delhi",
    address: "Okhla Industrial Area Phase-III, New Delhi 110020",
    phone: "+91-11-2691-8378", email: "ertlnorth@bis.gov.in",
    accreditation: "NABL Accredited (ISO/IEC 17025:2017)",
    tests: ["Food Products Testing", "Packaged Water Testing", "Helmet Testing", "LPG Equipment", "Electrical Safety"],
    category: "BIS Lab", rating: 4.5, website: "https://bis.gov.in",
  },
  {
    id: 6, name: "SAMEER — Centre for Electromagnetics", city: "Chennai", state: "Tamil Nadu",
    address: "IIT Campus, CIT Road, Taramani, Chennai 600113",
    phone: "+91-44-2254-2598", email: "sameer.chennai@gov.in",
    accreditation: "NABL Accredited (ISO/IEC 17025:2017)",
    tests: ["EMC/EMI Testing", "RF Testing", "Antenna Testing", "SAR Testing for Mobile Phones", "Wireless Equipment Testing"],
    category: "Government Lab", rating: 4.7, website: "https://sameer.gov.in",
  },
  {
    id: 7, name: "National Test House — Kolkata", city: "Kolkata", state: "West Bengal",
    address: "Alipore, Kolkata 700027",
    phone: "+91-33-2479-8378", email: "nthk@nic.in",
    accreditation: "NABL Accredited",
    tests: ["Mechanical Testing", "Chemical Analysis", "Metallurgical Testing", "Building Material Testing", "Textile Testing"],
    category: "Government Lab", rating: 4.3, website: "https://nth.gov.in",
  },
  {
    id: 8, name: "TUV Rheinland India", city: "Bangalore", state: "Karnataka",
    address: "Whitefield Main Road, Bangalore 560066",
    phone: "+91-80-6766-7500", email: "india@tuv.com",
    accreditation: "NABL Accredited, BIS Recognized",
    tests: ["Product Safety Testing", "Solar Testing", "EV Component Testing", "Medical Device Testing", "Toy Safety Testing"],
    category: "Private Lab", rating: 4.6, website: "https://www.tuv.com/india",
  },
  {
    id: 9, name: "UL India Pvt Ltd", city: "Bangalore", state: "Karnataka",
    address: "Manyata Tech Park, Nagavara, Bangalore 560045",
    phone: "+91-80-4138-4400", email: "india@ul.com",
    accreditation: "NABL Accredited, BIS Recognized",
    tests: ["Fire Safety Testing", "Wire & Cable Testing", "Consumer Electronics", "Appliance Testing", "Photovoltaic Testing"],
    category: "Private Lab", rating: 4.5, website: "https://www.ul.com",
  },
  {
    id: 10, name: "FSSAI — National Food Laboratory", city: "Ghaziabad", state: "Uttar Pradesh",
    address: "Central Food Lab, 3 Kyd Street, Kolkata (HQ); Branches across India",
    phone: "+91-120-276-2098", email: "cfl@fssai.gov.in",
    accreditation: "NABL Accredited, FSSAI Notified",
    tests: ["Food Adulteration Testing", "Pesticide Residue", "Heavy Metal Analysis", "Microbiological Testing", "Nutritional Analysis"],
    category: "Government Lab", rating: 4.4, website: "https://fssai.gov.in",
  },
];

const CATEGORIES = ["All", "BIS Lab", "Government Lab", "Private Lab"];
const STATES = ["All", ...Array.from(new Set(LABS.map(l => l.state)))];

export default function LabDirectoryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [state, setState] = useState("All");
  const [expandedLab, setExpandedLab] = useState<number | null>(null);

  const filtered = LABS.filter(l => {
    const q = search.toLowerCase();
    const matchesSearch = !q || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || l.tests.some(t => t.toLowerCase().includes(q));
    const matchesCat = category === "All" || l.category === category;
    const matchesState = state === "All" || l.state === state;
    return matchesSearch && matchesCat && matchesState;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/seller" className="p-2 hover:bg-green-50 rounded-xl transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Microscope className="h-6 w-6 text-[#138808]" />
            NABL Lab Directory
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Find BIS-recognized testing laboratories near you</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by lab name, city, or test type..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#138808]/20 focus:border-[#138808] shadow-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${category === c ? "bg-[#138808] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {c} {c !== "All" ? `(${LABS.filter(l => l.category === c).length})` : ""}
          </button>
        ))}
        <select value={state} onChange={(e) => setState(e.target.value)} className="border border-gray-200 rounded-full px-3 py-1.5 text-xs bg-gray-50 focus:outline-none">
          <option value="All">All States</option>
          {STATES.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Results */}
      <p className="text-sm text-gray-500">
        Showing <span className="font-bold text-gray-900">{filtered.length}</span> labs
      </p>

      {/* Lab Cards */}
      <div className="space-y-3">
        {filtered.map((lab) => {
          const isExpanded = expandedLab === lab.id;
          return (
            <div
              key={lab.id}
              className={`bg-white rounded-2xl border transition-all duration-200 ${isExpanded ? "border-[#138808]/30 shadow-lg" : "border-gray-100 hover:border-green-200 hover:shadow-sm"}`}
            >
              <button
                onClick={() => setExpandedLab(isExpanded ? null : lab.id)}
                className="w-full p-4 flex items-start gap-3 text-left"
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  lab.category === "BIS Lab" ? "bg-blue-50" : lab.category === "Government Lab" ? "bg-green-50" : "bg-purple-50"
                }`}>
                  <Building2 className={`h-5 w-5 ${
                    lab.category === "BIS Lab" ? "text-blue-600" : lab.category === "Government Lab" ? "text-green-600" : "text-purple-600"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 text-sm">{lab.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      lab.category === "BIS Lab" ? "bg-blue-50 text-blue-700" : lab.category === "Government Lab" ? "bg-green-50 text-green-700" : "bg-purple-50 text-purple-700"
                    }`}>
                      {lab.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{lab.city}, {lab.state}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-[#FF9933]" />{lab.rating}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {lab.tests.slice(0, 3).map(t => (
                      <span key={t} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                    {lab.tests.length > 3 && <span className="text-[10px] text-gray-400">+{lab.tests.length - 3} more</span>}
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 shrink-0 transition-transform mt-1 ${isExpanded ? "rotate-180" : ""}`} />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 animate-in fade-in duration-200">
                  <div className="border-t border-gray-100 pt-3 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-start gap-2"><MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" /><span className="text-gray-700">{lab.address}</span></div>
                      <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" /><span className="text-gray-700">{lab.phone}</span></div>
                      <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" /><a href={`mailto:${lab.email}`} className="text-[#138808] hover:underline">{lab.email}</a></div>
                      <div className="flex items-center gap-2"><Award className="h-3.5 w-3.5 text-gray-400 shrink-0" /><span className="text-gray-700">{lab.accreditation}</span></div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-700 mb-1.5">Testing Capabilities</p>
                      <div className="flex flex-wrap gap-1.5">
                        {lab.tests.map(t => (
                          <span key={t} className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <a href={lab.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-[#138808] bg-green-50 px-3 py-2 rounded-xl hover:bg-green-100 transition-colors">
                        <Globe className="h-3 w-3" /> Visit Website
                      </a>
                      <a href={`tel:${lab.phone}`} className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                        <Phone className="h-3 w-3" /> Call Lab
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
