"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  ShieldCheck,
  BookOpen,
  ChevronDown,
  ExternalLink,
  Gavel,
  Phone,
  Mail,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Award,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

const RIGHTS = [
  {
    title: "Right to Safety",
    icon: ShieldCheck,
    color: "from-blue-500 to-indigo-500",
    summary: "Protection against hazardous goods. Products must meet BIS safety standards.",
    details: [
      "All products under compulsory certification (ISI/CRS) must meet Indian Standards before sale",
      "Manufacturers cannot sell products without mandatory BIS certification marks",
      "Consumers can demand proof of certification from sellers",
      "Report unsafe products to BIS helpline 14100 or the National Consumer Helpline 1800-11-4000",
    ],
    laws: ["BIS Act 2016, Section 14 & 16", "Consumer Protection Act 2019, Section 2(9)(i)"],
  },
  {
    title: "Right to Information",
    icon: BookOpen,
    color: "from-green-500 to-emerald-500",
    summary: "Right to know about product quality, quantity, purity, standard, and price.",
    details: [
      "All products must display: manufacturer name & address, MRP, manufacturing date, expiry date (if applicable)",
      "ISI marked products must show the IS code and license number clearly",
      "Hallmarked jewellery must carry the 6-digit HUID code",
      "Packaged goods must comply with Legal Metrology Act labeling requirements",
      "You can verify any BIS certification at bis.gov.in or through BIS Care app",
    ],
    laws: ["Legal Metrology Act 2009", "BIS Act 2016, Section 11", "Consumer Protection Act 2019, Section 2(9)(ii)"],
  },
  {
    title: "Right to Choose",
    icon: Users,
    color: "from-purple-500 to-violet-500",
    summary: "Right to choose from a variety of products at competitive prices.",
    details: [
      "No seller can force you to buy only BIS-certified products if certification is voluntary for that product",
      "For mandatory BIS products, only certified versions should be available",
      "You can compare products on BIS portal to make informed choices",
      "BIS CRS registration list is publicly available — check which electronics brands are registered",
    ],
    laws: ["Consumer Protection Act 2019, Section 2(9)(iii)", "Competition Act 2002"],
  },
  {
    title: "Right to Seek Redressal",
    icon: Gavel,
    color: "from-red-500 to-pink-500",
    summary: "Right to fair settlement of grievances including compensation for substandard products.",
    details: [
      "File consumer complaints at the National Consumer Disputes Redressal Commission (NCDRC)",
      "Use the E-Daakhil portal (edaakhil.nic.in) for online complaint filing",
      "BIS can cancel manufacturer's license if product quality complaints are verified",
      "Seek compensation up to ₹2 Crore at District Forum, up to ₹10 Crore at State Commission",
      "BIS Act 2016 provides for imprisonment up to 2 years for misusing BIS marks",
    ],
    laws: ["Consumer Protection Act 2019, Section 35-73", "BIS Act 2016, Section 29 (Penalties)"],
  },
  {
    title: "Right Against Counterfeit Products",
    icon: AlertTriangle,
    color: "from-amber-500 to-orange-500",
    summary: "Protection against counterfeit ISI marks, BIS hallmarks, and fake certifications.",
    details: [
      "Using BIS Standard Mark without license is punishable with imprisonment up to 2 years and fine up to ₹5 lakhs",
      "Counterfeiting BIS Hallmark is punishable with imprisonment up to 1 year",
      "Report counterfeit products: BIS helpline 14100, email cmd@bis.gov.in",
      "BIS conducts regular market surveillance to detect and seize counterfeit products",
      "Consumers can verify ISI marks, CRS registration, and hallmarks on bis.gov.in",
    ],
    laws: ["BIS Act 2016, Section 29", "Indian Penal Code, Section 482 (Using false trade marks)"],
  },
];

const FAQS = [
  {
    q: "What is the ISI mark and when is it mandatory?",
    a: "ISI (Indian Standards Institution) mark is BIS's certification mark for products meeting Indian Standards. It is mandatory for around 350 products covering safety-critical items like pressure cookers, cement, electrical wires, helmets, LPG regulators, and packaged drinking water. The full list is in Schedule II of BIS (Conformity Assessment) Regulations 2018.",
  },
  {
    q: "How do I verify if a product's ISI mark is genuine?",
    a: "Visit bis.gov.in → 'Know Your Standards Mark' → Enter the CM/L number from the product. If the number is valid, it will show manufacturer details, product type, and license validity. You can also call BIS helpline 14100 or use the BIS Care app.",
  },
  {
    q: "What is HUID and why is it important?",
    a: "HUID (Hallmark Unique Identification) is a unique 6-character alphanumeric code given to each hallmarked jewellery piece. It links to: jeweller details, purity (14K/18K/22K/24K), weight, assaying centre, and hallmarking date. Since 1 July 2021, gold jewellery hallmarking is mandatory in India. Verify HUID on BIS Care app or bis.gov.in.",
  },
  {
    q: "What is CRS (Compulsory Registration Scheme)?",
    a: "CRS covers electronics and IT products. Manufacturers must register products with BIS before selling in India. Currently 56+ product categories are under CRS including laptops, mobile phones, LED bulbs, power adapters, set-top boxes, and smart speakers. Look for 'R-XXXXXXXX' number on the product.",
  },
  {
    q: "How do I file a complaint about substandard products?",
    a: "1) Call BIS helpline 14100, 2) Email cmd@bis.gov.in with product photos and details, 3) File on National Consumer Helpline at consumerhelpline.gov.in or call 1800-11-4000, 4) For legal action, use E-Daakhil portal (edaakhil.nic.in) to file at Consumer Forum.",
  },
  {
    q: "What penalty does a manufacturer face for using a fake ISI mark?",
    a: "Under BIS Act 2016, Section 29: First offence — imprisonment up to 2 years and/or fine up to ₹5 lakhs. Subsequent offence — imprisonment up to 5 years and fine up to ₹10 lakhs. BIS can also cancel the license, seize products, and blacklist the manufacturer.",
  },
];

export default function KnowYourRightsPage() {
  const [expandedRight, setExpandedRight] = useState<number | null>(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/customer" className="p-2 hover:bg-blue-50 rounded-xl transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Scale className="h-6 w-6 text-[#003580]" />
            Know Your Rights
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Consumer rights under BIS Act & Consumer Protection Act</p>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#003580] via-[#0046a8] to-[#138808] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Consumer Protection Act 2019 + BIS Act 2016</p>
          <h2 className="text-2xl font-extrabold mb-2">Your Rights as an Indian Consumer</h2>
          <p className="text-sm text-blue-100 max-w-xl">
            Every Indian consumer has legally protected rights to safety, information, choice, and redressal. BIS certification marks (ISI, Hallmark, CRS) are your shield against substandard products.
          </p>
          <div className="flex gap-3 mt-4 flex-wrap">
            <a href="tel:14100" className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 border border-white/20 px-3 py-2 rounded-xl hover:bg-white/20 transition-colors">
              <Phone className="h-3 w-3" /> BIS Helpline: 14100
            </a>
            <a href="tel:18001140000" className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 border border-white/20 px-3 py-2 rounded-xl hover:bg-white/20 transition-colors">
              <Phone className="h-3 w-3" /> Consumer: 1800-11-4000
            </a>
          </div>
        </div>
      </div>

      {/* Rights Cards */}
      <div className="space-y-3">
        {RIGHTS.map((right, idx) => {
          const isExpanded = expandedRight === idx;
          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl border transition-all duration-200 ${isExpanded ? "border-[#003580]/30 shadow-lg" : "border-gray-100 hover:border-gray-200"}`}
            >
              <button
                onClick={() => setExpandedRight(isExpanded ? null : idx)}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                <div className={`bg-gradient-to-br ${right.color} p-2.5 rounded-xl text-white shadow-md shrink-0`}>
                  <right.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900">{right.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{right.summary}</p>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 animate-in fade-in duration-200">
                  <div className="border-t border-gray-100 pt-3 space-y-3">
                    <ul className="space-y-2">
                      {right.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                    <div className="bg-blue-50/50 rounded-xl p-3">
                      <p className="text-xs font-bold text-[#003580] mb-1 flex items-center gap-1"><Gavel className="h-3.5 w-3.5" /> Legal Basis</p>
                      {right.laws.map((law, i) => (
                        <p key={i} className="text-xs text-blue-700">{law}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQs */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-[#003580]" /> Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {FAQS.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div key={idx} className="bg-white rounded-xl border border-gray-100">
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full py-3 px-4 flex items-center gap-3 text-left"
                >
                  <Lightbulb className="h-4 w-4 text-[#FF9933] shrink-0" />
                  <span className="text-sm font-semibold text-gray-900 flex-1">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>
                {isExpanded && (
                  <div className="px-4 pb-3 animate-in fade-in duration-200">
                    <p className="text-sm text-gray-600 leading-relaxed pl-7">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Important Contacts */}
      <div className="bg-gradient-to-r from-[#003580]/5 to-[#0052cc]/5 rounded-2xl p-5 border border-blue-100">
        <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-1.5">
          <Phone className="h-4 w-4 text-[#003580]" /> Important Contact Numbers
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-white rounded-xl p-3 space-y-1">
            <p className="font-bold text-gray-900">Bureau of Indian Standards (BIS)</p>
            <p className="text-gray-500"><Phone className="h-3 w-3 inline mr-1" />14100 (Toll Free)</p>
            <p className="text-gray-500"><Mail className="h-3 w-3 inline mr-1" />cmd@bis.gov.in</p>
            <p className="text-gray-500"><MapPin className="h-3 w-3 inline mr-1" />Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi</p>
          </div>
          <div className="bg-white rounded-xl p-3 space-y-1">
            <p className="font-bold text-gray-900">National Consumer Helpline</p>
            <p className="text-gray-500"><Phone className="h-3 w-3 inline mr-1" />1800-11-4000 (Toll Free)</p>
            <p className="text-gray-500"><ExternalLink className="h-3 w-3 inline mr-1" />consumerhelpline.gov.in</p>
            <p className="text-gray-500"><FileText className="h-3 w-3 inline mr-1" />E-Daakhil: edaakhil.nic.in</p>
          </div>
        </div>
      </div>
    </div>
  );
}
