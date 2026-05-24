import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { otpService } from '../config/api';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  X,
  User,
  RefreshCw,
} from 'lucide-react';

/* ═══════════════════════════════════
   SVG brand icons
   ═══════════════════════════════════ */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ═══════════════════════════════════
   Social Login Modal with OTP
   ═══════════════════════════════════ */
type SocialProvider = 'google' | 'linkedin';

interface SocialModalProps {
  provider: SocialProvider;
  onClose: () => void;
  onSuccess: (profile: { fullName: string; email: string }) => void;
}

function SocialLoginModal({ provider, onClose, onSuccess }: SocialModalProps) {
  const [step, setStep] = useState<'init' | 'form' | 'otp' | 'verifying' | 'error'>('init');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [expiryTimer, setExpiryTimer] = useState(300);
  const [isResending, setIsResending] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isGoogle = provider === 'google';
  const brandName = isGoogle ? 'Google' : 'LinkedIn';

  // Simulate initial "connecting" then show form
  useEffect(() => {
    const timer = setTimeout(() => setStep('form'), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Resend cooldown
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  // OTP expiry countdown
  useEffect(() => {
    if (step === 'otp' && expiryTimer > 0) {
      const t = setTimeout(() => setExpiryTimer(expiryTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, expiryTimer]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  /* ── Step 1: Submit email + name → send OTP ── */
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim()) { setFormError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setFormError('Please enter a valid email'); return; }
    if (!name.trim()) { setFormError('Name is required'); return; }

    setIsLoading(true);
    try {
      const result = await otpService.sendOtp(email.trim());
      if (result.success) {
        setStep('otp');
        setResendTimer(60);
        setExpiryTimer(result.expiresIn || 300);
        setOtpSuccess('Verification code sent!');
        setTimeout(() => setOtpSuccess(''), 3000);
      } else {
        setFormError(result.message || 'Failed to send OTP');
        if (result.cooldown) setResendTimer(result.cooldown);
      }
    } catch {
      setFormError('Could not connect to server. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── OTP input helpers ── */
  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    setOtpError('');
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };
  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const next = pasted.split('').concat(Array(6 - pasted.length).fill(''));
      setOtp(next.slice(0, 6));
      otpRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  /* ── Step 2: Verify OTP → login ── */
  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setOtpError('Enter all 6 digits'); return; }

    setStep('verifying');
    try {
      const result = await otpService.verifyOtp(email.trim(), code);
      if (result.success && result.verified) {
        await otpService.clearVerification(email.trim());
        onSuccess({ fullName: name.trim(), email: email.trim() });
      } else {
        setOtpError(result.message || 'Invalid code');
        setStep('otp');
      }
    } catch {
      setOtpError('Verification failed. Try again.');
      setStep('otp');
    }
  };

  /* ── Resend OTP ── */
  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setOtpError('');
    try {
      const result = await otpService.sendOtp(email.trim());
      if (result.success) {
        setOtp(['', '', '', '', '', '']);
        setResendTimer(60);
        setExpiryTimer(result.expiresIn || 300);
        setOtpSuccess('New code sent!');
        setTimeout(() => setOtpSuccess(''), 3000);
        otpRefs.current[0]?.focus();
      } else {
        setOtpError(result.message || 'Failed to resend');
        if (result.cooldown) setResendTimer(result.cooldown);
      }
    } catch {
      setOtpError('Could not resend. Try again.');
    } finally {
      setIsResending(false);
    }
  };

  /* ═══ RENDER ═══ */
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="px-6 pt-8 pb-5 flex flex-col items-center">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${isGoogle ? 'bg-white border border-slate-200' : 'bg-[#0A66C2]'}`}>
            {isGoogle ? <GoogleIcon className="w-7 h-7" /> : <LinkedInIcon className="w-7 h-7" />}
          </div>
          <h3 className="text-xl font-bold text-navy-900 font-[Poppins]">
            {step === 'otp' || step === 'verifying' ? 'Verify your email' : `Sign in with ${brandName}`}
          </h3>
          <p className="text-slate-500 text-sm mt-1 text-center">
            {step === 'init' && `Connecting to ${brandName}…`}
            {step === 'form' && `Enter your ${brandName} account details`}
            {step === 'otp' && (
              <>We sent a 6-digit code to <span className="font-semibold text-navy-900">{email}</span></>
            )}
            {step === 'verifying' && 'Verifying your identity…'}
            {step === 'error' && 'Something went wrong'}
          </p>
        </div>

        {/* Body */}
        <div className="px-6 pb-8">

          {/* ── INIT: connecting spinner ── */}
          {step === 'init' && (
            <div className="flex flex-col items-center py-10">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                <div className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin ${isGoogle ? 'border-blue-500' : 'border-[#0A66C2]'}`} />
              </div>
              <p className="text-slate-400 text-sm mt-4">Connecting to {brandName}…</p>
            </div>
          )}

          {/* ── FORM: email + name → send OTP ── */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-1.5">{brandName} Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFormError(''); }}
                    placeholder={isGoogle ? 'you@gmail.com' : 'you@company.com'}
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-navy-900 placeholder:text-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setFormError(''); }}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-navy-900 placeholder:text-slate-300 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                  />
                </div>
              </div>

              {formError && (
                <div className="flex items-center gap-2 text-rose-500 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {formError}
                </div>
              )}

              <p className="text-[11px] text-slate-400 leading-relaxed">
                We'll send a verification code to your email to confirm your identity.{' '}
                <span className="text-teal-600 cursor-pointer hover:underline">Privacy Policy</span>
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                  isGoogle
                    ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-slate-200/50'
                    : 'bg-[#0A66C2] text-white hover:bg-[#004182] shadow-blue-500/20'
                }`}
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending code…</>
                ) : (
                  <>{isGoogle ? <GoogleIcon className="w-5 h-5" /> : <LinkedInIcon className="w-5 h-5" />} Continue with {brandName}</>
                )}
              </button>
            </form>
          )}

          {/* ── OTP: enter 6-digit code ── */}
          {step === 'otp' && (
            <div className="space-y-5">
              {/* Success toast */}
              {otpSuccess && (
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  <p className="text-teal-700 text-sm">{otpSuccess}</p>
                </div>
              )}

              {/* Expiry warning */}
              {expiryTimer > 0 && expiryTimer <= 60 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="text-amber-700 text-sm">Code expires in {formatTime(expiryTimer)}</p>
                </div>
              )}

              {/* OTP inputs */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-navy-900">Enter verification code</label>
                  {expiryTimer > 60 && <span className="text-xs text-slate-400">{formatTime(expiryTimer)}</span>}
                </div>
                <div className="flex gap-2.5 justify-between" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-11 h-13 rounded-xl border text-center text-lg font-bold outline-none transition-all ${
                        otpError
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-rose-600'
                          : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 text-navy-900'
                      }`}
                    />
                  ))}
                </div>
                {otpError && (
                  <div className="flex items-center gap-2 mt-2 text-rose-500">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <p className="text-xs">{otpError}</p>
                  </div>
                )}
              </div>

              {/* Verify button */}
              <button
                onClick={handleVerifyOtp}
                disabled={otp.join('').length !== 6}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:bg-slate-300 text-white font-semibold text-sm transition-all shadow-lg shadow-navy-900/20 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Verify & Sign In
              </button>

              {/* Resend + back */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => { setStep('form'); setOtp(['','','','','','']); setOtpError(''); }}
                  className="text-xs text-slate-500 hover:text-navy-900 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" /> Change email
                </button>
                <div className="text-xs text-slate-500">
                  {resendTimer > 0 ? (
                    <span className="text-slate-400">Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={isResending}
                      className="text-teal-600 font-semibold hover:text-teal-700 transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {isResending ? <><RefreshCw className="w-3 h-3 animate-spin" /> Sending…</> : 'Resend OTP'}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center">💡 Check spam if you don't see the email</p>
            </div>
          )}

          {/* ── VERIFYING: spinner ── */}
          {step === 'verifying' && (
            <div className="flex flex-col items-center py-10">
              <Loader2 className={`w-10 h-10 animate-spin ${isGoogle ? 'text-blue-500' : 'text-[#0A66C2]'}`} />
              <p className="text-slate-500 text-sm mt-4 font-medium">Verifying & signing in…</p>
              <p className="text-slate-400 text-xs mt-1">{email}</p>
            </div>
          )}

          {/* ── ERROR ── */}
          {step === 'error' && (
            <div className="flex flex-col items-center py-8">
              <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                <AlertCircle className="w-7 h-7 text-rose-500" />
              </div>
              <p className="text-navy-900 font-semibold mb-1">Authentication failed</p>
              <p className="text-slate-500 text-sm text-center mb-6">
                Could not complete sign-in with {brandName}. Please try again.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => { setStep('form'); setOtp(['','','','','','']); setOtpError(''); setFormError(''); }}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl bg-navy-900 text-white font-medium text-sm hover:bg-navy-800 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
          <span className="text-[11px] text-slate-400">Secured by Claritas Verify · 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   Login Page
   ═══════════════════════════════════ */
export default function Login() {
  const navigate = useNavigate();
  const { login, socialLogin, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState('');
  const [socialModal, setSocialModal] = useState<SocialProvider | null>(null);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!/^\d{6}$/.test(formData.password)) newErrors.password = 'Password must be exactly 6 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const success = await login(formData.email, formData.password, formData.rememberMe);
      if (success) navigate('/');
      else setLoginError('Invalid email or password. Please try again.');
    } catch {
      setLoginError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSuccess = useCallback(
    async (provider: SocialProvider, profile: { fullName: string; email: string }) => {
      try {
        const success = await socialLogin(provider, profile);
        if (success) {
          setSocialModal(null);
          navigate('/');
        } else {
          setLoginError(`Could not sign in with ${provider === 'google' ? 'Google' : 'LinkedIn'}. Please try again.`);
          setSocialModal(null);
        }
      } catch {
        setLoginError('Something went wrong. Please try again.');
        setSocialModal(null);
      }
    },
    [socialLogin, navigate],
  );

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    setLoginError('');
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex">
      {/* Social Login Modal */}
      {socialModal && (
        <SocialLoginModal
          provider={socialModal}
          onClose={() => setSocialModal(null)}
          onSuccess={(profile) => handleSocialSuccess(socialModal, profile)}
        />
      )}

      {/* ─── Left Panel ─── */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
        </div>
        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none text-white font-[Poppins]">Claritas Verify</span>
              <span className="text-[9px] font-medium tracking-[0.15em] uppercase leading-none mt-0.5 text-teal-400">Your Global Screening Partner</span>
            </div>
          </Link>
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white font-[Poppins] leading-tight mb-6">
              Welcome back to <span className="text-teal-400">Claritas Verify</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Access your dashboard to manage verifications, track reports, and stay compliant.
            </p>
            <div className="grid grid-cols-3 gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-xs text-white/40 mt-1">Clients</div>
              </div>
              <div className="text-center border-x border-white/10">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-xs text-white/40 mt-1">Verifications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99%</div>
                <div className="text-xs text-white/40 mt-1">Accuracy</div>
              </div>
            </div>
          </div>
          <p className="text-white/30 text-sm">© {new Date().getFullYear()} Claritas Verify Pvt. Ltd.</p>
        </div>
      </div>

      {/* ─── Right Panel ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center shadow-lg shadow-navy-900/25">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight leading-none text-navy-900 font-[Poppins]">Claritas Verify</span>
                <span className="text-[9px] font-medium tracking-[0.15em] uppercase leading-none mt-0.5 text-teal-600">Your Global Screening Partner</span>
              </div>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 font-[Poppins]">Sign in to your account</h2>
            <p className="text-slate-500 mt-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">Create one</Link>
            </p>
          </div>

          {/* ── Social Login Buttons ── */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => { setLoginError(''); setSocialModal('google'); }}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => { setLoginError(''); setSocialModal('linkedin'); }}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-[#0A66C2] text-white font-medium text-sm hover:bg-[#004182] hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <LinkedInIcon className="w-5 h-5" />
              Continue with LinkedIn
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 text-sm text-slate-400">
                or sign in with email
              </span>
            </div>
          </div>

          {/* Login Error */}
          {loginError && (
            <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <p className="text-rose-600 text-sm">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@company.com"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white text-navy-900 placeholder:text-slate-300 text-sm transition-all duration-300 outline-none ${
                    errors.email ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                  }`}
                />
              </div>
              {errors.email && <p className="text-rose-500 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-navy-900">Password</label>
                <Link to="/forgot-password" className="text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Enter 6-digit password"
                  maxLength={6}
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl border bg-white text-navy-900 placeholder:text-slate-300 text-sm transition-all duration-300 outline-none ${
                    errors.password ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-500 text-xs mt-1.5">{errors.password}</p>}
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" checked={formData.rememberMe} onChange={(e) => handleChange('rememberMe', e.target.checked)} className="sr-only peer" />
                  <div className="w-5 h-5 rounded-md border-2 border-slate-200 bg-white transition-all duration-200 peer-checked:border-teal-500 peer-checked:bg-teal-500 flex items-center justify-center">
                    {formData.rememberMe && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-600 group-hover:text-navy-900 transition-colors">Remember me for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-navy-900 hover:bg-navy-800 disabled:bg-navy-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-navy-900/20 hover:shadow-navy-900/30 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Signing in…</>
              ) : (
                <><span>Sign In</span> <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">Enterprise-grade security with 256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
