'use client';

import Link from 'next/link';
import { NAVIGATION, CONTACT_INFO } from '@/lib/constants';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">Lexluc Global</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6">
            {NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
}
