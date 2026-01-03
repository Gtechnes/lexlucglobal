'use client';

import Link from 'next/link';
import { FOOTER_LINKS, SOCIAL_LINKS, CONTACT_INFO, SITE_CONFIG } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">{SITE_CONFIG.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{SITE_CONFIG.description}</p>
            <p className="text-gray-400 text-sm mb-1">📧 {CONTACT_INFO.email}</p>
            <p className="text-gray-400 text-sm mb-1">📱 {CONTACT_INFO.phone}</p>
            <p className="text-gray-400 text-sm">📍 {CONTACT_INFO.address}</p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                Facebook
              </a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
