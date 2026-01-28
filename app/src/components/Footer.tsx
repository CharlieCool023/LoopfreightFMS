import { Link } from 'react-router-dom';
import { Truck, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'API', href: '#api' },
      { label: 'Integrations', href: '#integrations' },
    ],
    company: [
      { label: 'About', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
      { label: 'Contact', href: '#contact' },
    ],
    resources: [
      { label: 'Documentation', href: '#docs' },
      { label: 'Help Center', href: '#help' },
      { label: 'Community', href: '#community' },
      { label: 'Status', href: '#status' },
    ],
    legal: [
      { label: 'Privacy', href: '#privacy' },
      { label: 'Terms', href: '#terms' },
      { label: 'Security', href: '#security' },
    ],
  };

  return (
    <footer className="bg-[#12151C] border-t border-[#C8FF2E]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#C8FF2E]" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#F2F4F8]">LoopFreight</span>
                <span className="text-xs text-[#C8FF2E] font-mono">FMS</span>
              </div>
            </Link>
            <p className="text-[#A6AEB8] text-sm mb-6 max-w-xs">
              Real-time fleet tracking and management platform for land, air, and sea assets.
            </p>
            <div className="space-y-3">
              <a href="mailto:hello@loopfreight.io" className="flex items-center gap-2 text-sm text-[#A6AEB8] hover:text-[#C8FF2E] transition-colors">
                <Mail className="w-4 h-4" />
                hello@loopfreight.io
              </a>
              <a href="tel:+2348012345678" className="flex items-center gap-2 text-sm text-[#A6AEB8] hover:text-[#C8FF2E] transition-colors">
                <Phone className="w-4 h-4" />
                +234 801 234 5678
              </a>
              <div className="flex items-center gap-2 text-sm text-[#A6AEB8]">
                <MapPin className="w-4 h-4" />
                Lagos, Nigeria
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-[#F2F4F8] font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[#A6AEB8] hover:text-[#C8FF2E] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[#F2F4F8] font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[#A6AEB8] hover:text-[#C8FF2E] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[#F2F4F8] font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[#A6AEB8] hover:text-[#C8FF2E] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[#F2F4F8] font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[#A6AEB8] hover:text-[#C8FF2E] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#C8FF2E]/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#A6AEB8]">
            © {currentYear} LoopFreight-FMS. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[#A6AEB8] hover:text-[#C8FF2E] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="text-[#A6AEB8] hover:text-[#C8FF2E] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
