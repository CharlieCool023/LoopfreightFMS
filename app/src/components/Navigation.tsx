import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Truck } from 'lucide-react';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Platform', href: '#platform' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  const isLandingPage = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0C0F]/90 backdrop-blur-lg border-b border-[#C8FF2E]/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#C8FF2E]/10 border border-[#C8FF2E]/30 flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#C8FF2E]" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#F2F4F8]">LoopFreight</span>
              <span className="text-xs text-[#C8FF2E] font-mono">FMS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {isLandingPage && navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-[#A6AEB8] hover:text-[#F2F4F8] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-primary text-sm"
            >
              Request a demo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[#F2F4F8]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0C0F]/95 backdrop-blur-lg border-b border-[#C8FF2E]/10">
          <div className="px-4 py-4 space-y-4">
            {isLandingPage && navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-[#A6AEB8] hover:text-[#F2F4F8] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-[#C8FF2E]/10 space-y-3">
              <Link
                to="/login"
                className="block text-center py-2 text-[#A6AEB8] hover:text-[#F2F4F8]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block btn-primary text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Request a demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
