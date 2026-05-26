import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setActiveLink(href);
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-navy-900/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            className="flex items-center gap-2.5 group cursor-pointer"
            onClick={() => {
              setActiveLink('#home');
              const el = document.getElementById('home');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className={`w-10 h-10 rounded-xl overflow-hidden transition-all duration-300 ${
              isScrolled
                ? 'bg-navy-900 shadow-lg shadow-navy-900/25'
                : 'bg-white/10 backdrop-blur-sm border border-white/20'
            }`}>
              <img src="https://res.cloudinary.com/dpjcqlwrw/image/upload/v1779600702/ChatGPT_Image_May_24_2026_11_00_47_AM_vddmpe.png" alt="Claritas Verify logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-bold tracking-tight leading-none transition-colors duration-300 font-[Poppins] ${
                isScrolled ? 'text-navy-900' : 'text-white'
              }`}>
                C L A R I T A S 
              </span>
              <span className={`text-[9px] font-medium tracking-[0.15em] uppercase leading-none mt-0.5 transition-colors duration-300 ${
                isScrolled ? 'text-teal-600' : 'text-teal-400'
              }`}>
                V E R I F Y
              </span>
             </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 group ${
                  isScrolled
                    ? activeLink === link.href
                      ? 'text-navy-900'
                      : 'text-slate-500 hover:text-navy-900'
                    : activeLink === link.href
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                {/* Underline slider */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ease-out ${
                    activeLink === link.href
                      ? 'w-6 bg-teal-400'
                      : 'w-0 group-hover:w-6 bg-teal-400'
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
<div className="hidden lg:flex items-center gap-3">

  {/* Login */}
  <a
    href="/#/login"
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300 ${
      isScrolled
        ? 'border-slate-200 bg-white text-navy-900 hover:bg-slate-50'
        : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
    }`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12H3m0 0l4-4m-4 4l4 4m13-9v10a2 2 0 01-2 2h-6"
      />
    </svg>

    <span className="font-medium text-sm">
      Login
    </span>
  </a>

  {/* Register */}
  <a
    href="/#/register"
    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-cyan-500/20 transition-all duration-300"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 9v6m3-3h-6m-2 5H6a2 2 0 01-2-2V7a2 2 0 012-2h5"
      />
    </svg>

    <span className="text-sm">
      Register
    </span>
  </a>

</div>
          {/* Desktop nav only */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-navy-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md border-t border-slate-100 mt-3 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeLink === link.href
                  ? 'bg-navy-50 text-navy-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
              }`}
            >
              {link.label}
              <div className="pt-3 mt-3 border-t border-slate-200 flex gap-2">

  <a
  href="/#/login"
  className="flex-1 text-center px-3 py-2 rounded-lg border border-slate-200 text-navy-900 text-sm font-medium hover:bg-slate-50 transition-all"
>
  Login
</a>

  <a
  href="/#/register"
  className="flex-1 text-center px-3 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-500 text-white text-sm font-semibold shadow-md shadow-cyan-500/20 transition-all"
>
  Register
</a>

</div>
            </button>
          ))}
          
        </div>
      </div>
    </header>
  );
}
