import { Shield, ExternalLink, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#003580] rounded-full p-2">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-white font-bold">BIS Smart Portal</div>
                <div className="text-xs text-gray-400">AI Compliance Platform</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              An AI-powered smart compliance platform that simplifies and accelerates 
              product certification under the Bureau of Indian Standards.
            </p>
            <div className="flex gap-2 mt-4">
              <span className="inline-block w-8 h-1 bg-[#FF9933] rounded" />
              <span className="inline-block w-8 h-1 bg-white rounded" />
              <span className="inline-block w-8 h-1 bg-[#138808] rounded" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/analyze", label: "Product Analysis" },
                { href: "/simulate", label: "Approval Simulation" },
                { href: "/verify", label: "ISI Mark Verification" },
                { href: "/standards", label: "Standards Explorer" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* BIS Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              BIS Resources
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "https://www.bis.gov.in", label: "BIS Official Website" },
                { href: "https://www.services.bis.gov.in", label: "BIS Manak Portal" },
                { href: "https://www.bis.gov.in/product-certification/", label: "Product Certification" },
                { href: "https://www.bis.gov.in/lab-recognition/", label: "Lab Recognition" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact BIS
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi - 110002</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>011-2323 0131</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@bis.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} BIS Smart Compliance Portal. Built for BIS Hackathon under Digital India Initiative.
            </p>
            <div className="flex gap-6">
              <span className="text-xs text-gray-500">Government of India Initiative</span>
              <span className="text-xs text-gray-500">|</span>
              <span className="text-xs text-gray-500">Make in India</span>
              <span className="text-xs text-gray-500">|</span>
              <span className="text-xs text-gray-500">Digital India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
