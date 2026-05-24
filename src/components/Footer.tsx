import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, X, GripVertical, Map as MapIcon } from 'lucide-react';

/* ── Social SVG icons ── */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

/* ── Constants ── */
const COMPANY_EMAIL = 'info@claritasverify.com';
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${COMPANY_EMAIL}&su=Enquiry%20-%20Background%20Verification&body=Hi%20Claritas%20Verify%20Team%2C%0A%0A`;

const quickLinks = [
  { label: 'Home', section: 'home' },
  { label: 'Services', section: 'services' },
  { label: 'About', section: 'about' },
  { label: 'Contact', section: 'contact' },
];

const servicesList = [
  'Identity Verification',
  'Employment Verification',
  'Education Verification',
  'Address Verification',
  'India Verification Support',
];

/* ═══════════════════════════════════════
   Draggable Map Widget
   ═══════════════════════════════════════ */
function DraggableMap({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const [visible, setVisible] = useState(true);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  // Place in top-right on first paint
  useEffect(() => {
    if (!containerRef.current || initialized) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos({ x: Math.max(0, rect.width - 340), y: 20 });
    setInitialized(true);
  }, [containerRef, initialized]);

  const clamp = useCallback(
    (x: number, y: number) => {
      if (!containerRef.current || !dragRef.current) return { x, y };
      const c = containerRef.current.getBoundingClientRect();
      const d = dragRef.current.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(x, c.width - d.width)),
        y: Math.max(0, Math.min(y, c.height - d.height)),
      };
    },
    [containerRef],
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only the drag handle starts a drag — NOT the X button
    const target = e.target as HTMLElement;
    if (target.closest('[data-close-btn]')) return;
    if (!target.closest('[data-drag-handle]')) return;
    e.preventDefault();
    isDragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = ev.clientX - lastPointer.current.x;
      const dy = ev.clientY - lastPointer.current.y;
      lastPointer.current = { x: ev.clientX, y: ev.clientY };
      setPos((prev) => clamp(prev.x + dx, prev.y + dy));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [clamp]);

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-close-btn]')) return;
    if (!target.closest('[data-drag-handle]')) return;
    const touch = e.touches[0];
    isDragging.current = true;
    lastPointer.current = { x: touch.clientX, y: touch.clientY };

    const onTouchMove = (ev: TouchEvent) => {
      if (!isDragging.current) return;
      const t = ev.touches[0];
      const dx = t.clientX - lastPointer.current.x;
      const dy = t.clientY - lastPointer.current.y;
      lastPointer.current = { x: t.clientX, y: t.clientY };
      setPos((prev) => clamp(prev.x + dx, prev.y + dy));
      ev.preventDefault();
    };

    const onTouchEnd = () => {
      isDragging.current = false;
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  }, [clamp]);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  /* ── Hidden state: show restore button ── */
  if (!visible) {
    return (
      <div className="absolute bottom-4 right-4 z-20">
        <button
          onClick={() => setVisible(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
        >
          <MapIcon className="w-4 h-4" />
          Show Map
        </button>
      </div>
    );
  }

  /* ── Visible: draggable map card ── */
  return (
    <div
      ref={dragRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      className="absolute top-0 left-0 z-20 w-72 sm:w-80 select-none"
    >
      <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-navy-900">
        {/* Drag handle bar */}
        <div
          data-drag-handle
          className="flex items-center justify-between px-3 py-2 bg-white/[0.06] border-b border-white/10 cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center gap-2 text-white/50 text-xs font-medium pointer-events-none">
            <GripVertical className="w-4 h-4" />
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            Our Location
          </div>
          <button
            data-close-btn
            type="button"
            onClick={handleClose}
            className="relative z-30 w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/15 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Google Map */}
        <div className="h-44">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0159!2d77.6089!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Claritas Verify Office Location"
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Helper: scroll to section on the home page
   ═══════════════════════════════════════ */
function useScrollToSection() {
  const navigate = useNavigate();

  return useCallback(
    (sectionId: string) => {
      const el = document.getElementById(sectionId);
      if (el) {
        // Already on home page — just scroll
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Navigate to home first, then scroll after a tick
        navigate('/');
        setTimeout(() => {
          const target = document.getElementById(sectionId);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    },
    [navigate],
  );
}

/* ═══════════════════════════════════════
   Footer Component
   ═══════════════════════════════════════ */
export default function Footer() {
  const footerBodyRef = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollToSection();

  return (
    <footer id="contact" className="bg-navy-950 text-white">
      {/* CTA Banner */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
                }}
              />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-[Poppins] mb-4">
                Ready to Verify with Confidence?
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                Join 50+ companies that trust Claritas Verify for fast, accurate, and compliant background verification.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => scrollTo('about')}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-700 font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 shadow-lg shadow-black/10 cursor-pointer"
                >
                  Get Started Today
                </button>
                <a
                  href={GMAIL_COMPOSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <Mail className="w-4 h-4" />
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer — drag boundary for the map */}
      <div ref={footerBodyRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[420px]">
        {/* Draggable map floating on top */}
        <DraggableMap containerRef={footerBodyRef} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          {/* ── Brand ── */}
          <div className="lg:col-span-1">
            <button onClick={() => scrollTo('home')} className="flex items-center gap-2.5 mb-6 cursor-pointer">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img src="https://res.cloudinary.com/dpjcqlwrw/image/upload/v1779600702/ChatGPT_Image_May_24_2026_11_00_47_AM_vddmpe.png" alt="Claritas Verify logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-bold tracking-tight leading-none font-[Poppins]">CLARITAS VERIFY</span>
                <span className="text-[9px] font-medium tracking-[0.12em] uppercase leading-none mt-0.5 text-teal-400">
                  Your Global Screening Partner
                </span>
              </div>
            </button>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Your global screening partner. Fast, accurate, and
              compliant background verification for modern businesses.
            </p>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
                <LinkedInIcon className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
                <TwitterXIcon className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
                <InstagramIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-white/60 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.section}>
                  <button
                    onClick={() => scrollTo(link.section)}
                    className="text-white/40 hover:text-teal-400 transition-colors duration-300 text-sm cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services ── */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-white/60 mb-6">
              Services
            </h4>
            <ul className="space-y-4">
              {servicesList.map((service) => (
                <li key={service}>
                  <button
                    onClick={() => scrollTo('services')}
                    className="text-white/40 hover:text-teal-400 transition-colors duration-300 text-sm cursor-pointer text-left"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-white/60 mb-6">
              Contact Us
            </h4>
            <div className="space-y-4">
              {/* Email → opens Gmail compose */}
              <a
                href={GMAIL_COMPOSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-white/40 hover:text-teal-400 transition-colors duration-300 text-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-teal-500/20 group-hover:border-teal-500/30 transition-all shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block">{COMPANY_EMAIL}</span>
                  <span className="text-[11px] text-white/20 group-hover:text-teal-400/50 transition-colors">
                    Opens in Gmail
                  </span>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+919266089223"
                className="group flex items-center gap-3 text-white/40 hover:text-teal-400 transition-colors duration-300 text-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-teal-500/20 group-hover:border-teal-500/30 transition-all shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                +91 92660 89223
              </a>

              {/* Address */}
              <div className="group flex items-start gap-3 text-white/40 text-sm">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Noida Sector 44, Chhalera, Chhalera Bangar, Sector 44, Noida, Uttar Pradesh 201303, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">
              © {new Date().getFullYear()} Claritas Verify Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <button className="text-white/30 hover:text-white/60 text-sm transition-colors cursor-pointer">Privacy Policy</button>
              <button className="text-white/30 hover:text-white/60 text-sm transition-colors cursor-pointer">Terms of Service</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
