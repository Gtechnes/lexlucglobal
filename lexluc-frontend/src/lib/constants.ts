export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Lexluc Global Services',
  description: 'Lexluc Global Services and Tours Limited - Tourism, Agriculture, Mining, Oil & Gas, Recreation, Transportation & Logistics',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  locale: 'en-NG',
};

export const NAVIGATION = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/tours', label: 'Tours & Destinations' },
  { href: '/blog', label: 'Blog' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export const SECTORS = [
  'Tourism',
  'Agriculture',
  'Mining',
  'Oil & Gas',
  'Recreation',
  'Transportation & Logistics',
];

export const FOOTER_LINKS = {
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/careers', label: 'Careers' },
    { href: '/blog', label: 'Blog' },
  ],
  services: [
    { href: '/services', label: 'All Services' },
    { href: '/tours', label: 'Tours' },
    { href: '/contact', label: 'Get Quote' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms & Conditions' },
  ],
};

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/lexlucglobal',
  twitter: 'https://twitter.com/lexlucglobal',
  linkedin: 'https://linkedin.com/company/lexluc-global',
  instagram: 'https://instagram.com/lexlucglobal',
};

export const CONTACT_INFO = {
  email: 'info@lexlucglobal.ng',
  phone: '+234 (0) XXX XXX XXXX',
  address: 'Lagos, Nigeria',
  hours: 'Mon-Fri: 9:00 AM - 6:00 PM WAT',
};
