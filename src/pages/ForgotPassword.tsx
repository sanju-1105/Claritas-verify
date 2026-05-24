import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  KeyRound,
} from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email');

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // New password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  // Countdown timer
  useEffect(() => {
    if (step === 'otp' && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((p) => p - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, resendTimer]);

  /* ──────────────── Step 1: Submit Email ──────────────── */
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    setResendTimer(30);
    setStep('otp');
  };

  /* ──────────────── Step 2: OTP helpers ──────────────── */
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setOtpError('');
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length) {
      const next = pasted.split('').concat(Array(6 - pasted.length).fill(''));
      setOtp(next.slice(0, 6));
      otpRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const value = otp.join('');
    if (value.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP');
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    setStep('reset');
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setOtp(['', '', '', '', '', '']);
    setResendTimer(30);
    otpRefs.current[0]?.focus();
  };

  /* ──────────────── Step 3: Reset Password ──────────────── */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!newPassword) {
      errs.newPassword = 'Password is required';
    } else if (!/^\d{6}$/.test(newPassword)) {
      errs.newPassword = 'Password must be exactly 6 digits';
    }
    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errs);
    if (Object.keys(errs).length) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    setStep('success');
  };

  /* ──────────────── Render ──────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex">
      {/* ─── Left Panel ─── */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
        </div>

        <div className="relative flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none text-white font-[Poppins]">
                Claritas Verify
              </span>
              <span className="text-[9px] font-medium tracking-[0.15em] uppercase leading-none mt-0.5 text-teal-400">
                Your Global Screening Partner
              </span>
            </div>
          </Link>

          {/* Content */}
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white font-[Poppins] leading-tight mb-6">
              Secure account{' '}
              <span className="text-teal-400">recovery</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              We take your security seriously. Follow the steps to verify
              your identity and set a new password.
            </p>

            {/* Progress steps */}
            <div className="space-y-4">
              {[
                { num: '1', label: 'Enter your registered email', done: step !== 'email' },
                { num: '2', label: 'Verify the OTP sent to your inbox', done: step === 'reset' || step === 'success' },
                { num: '3', label: 'Create a new 6-digit password', done: step === 'success' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      s.done
                        ? 'bg-teal-500 text-white'
                        : 'bg-white/10 text-white/40 border border-white/10'
                    }`}
                  >
                    {s.done ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s.num
                    )}
                  </div>
                  <span className={`text-sm ${s.done ? 'text-teal-400 font-medium' : 'text-white/50'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Claritas Verify Pvt. Ltd.
          </p>
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
                <span className="text-lg font-bold tracking-tight leading-none text-navy-900 font-[Poppins]">
                  Claritas Verify
                </span>
                <span className="text-[9px] font-medium tracking-[0.15em] uppercase leading-none mt-0.5 text-teal-600">
                  Your Global Screening Partner
                </span>
              </div>
            </Link>
          </div>

          {/* ────── STEP 1 : EMAIL ────── */}
          {step === 'email' && (
            <>
              <div className="mb-8">
                <div className="w-16 h-16 rounded-2xl bg-navy-900/5 flex items-center justify-center mb-6">
                  <KeyRound className="w-8 h-8 text-navy-900" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 font-[Poppins]">
                  Forgot password?
                </h2>
                <p className="text-slate-500 mt-2">
                  No worries. Enter the email linked to your account and we'll
                  send a 6-digit verification code.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                      placeholder="you@company.com"
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white text-navy-900 placeholder:text-slate-300 text-sm outline-none transition-all duration-300 ${
                        emailError
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                          : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                      }`}
                    />
                  </div>
                  {emailError && <p className="text-rose-500 text-xs mt-1.5">{emailError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-navy-900 hover:bg-navy-800 disabled:bg-navy-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-navy-900/20 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending OTP…
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center mt-8 text-sm text-slate-500">
                Remember your password?{' '}
                <Link to="/" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">
                  Back to Home
                </Link>
              </p>
            </>
          )}

          {/* ────── STEP 2 : OTP ────── */}
          {step === 'otp' && (
            <>
              <button
                onClick={() => setStep('email')}
                className="flex items-center gap-2 text-slate-500 hover:text-navy-900 transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="mb-8">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8 text-teal-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 font-[Poppins]">
                  Check your email
                </h2>
                <p className="text-slate-500 mt-2">
                  We sent a 6-digit code to{' '}
                  <span className="font-semibold text-navy-900">{email}</span>
                </p>
              </div>

              <div className="space-y-6">
                {/* OTP inputs */}
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-4">
                    Enter OTP
                  </label>
                  <div className="flex gap-3 justify-between" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`w-12 h-14 rounded-xl border text-center text-xl font-bold outline-none transition-all duration-300 ${
                          otpError
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-rose-600'
                            : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 text-navy-900'
                        }`}
                      />
                    ))}
                  </div>
                  {otpError && <p className="text-rose-500 text-xs mt-2">{otpError}</p>}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-navy-900 hover:bg-navy-800 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-navy-900/20 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      Verify OTP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-slate-500">
                  Didn't receive the code?{' '}
                  {resendTimer > 0 ? (
                    <span className="text-slate-400">Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </p>

                <p className="text-xs text-slate-400 text-center">
                  For demo, enter any 6 digits to verify.
                </p>
              </div>
            </>
          )}

          {/* ────── STEP 3 : NEW PASSWORD ────── */}
          {step === 'reset' && (
            <>
              <button
                onClick={() => setStep('otp')}
                className="flex items-center gap-2 text-slate-500 hover:text-navy-900 transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="mb-8">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8 text-teal-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 font-[Poppins]">
                  Set new password
                </h2>
                <p className="text-slate-500 mt-2">
                  Your identity has been verified. Create a new 6-digit password
                  for your account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">
                    New Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setPasswordErrors({}); }}
                      placeholder="Enter 6-digit password"
                      maxLength={6}
                      className={`w-full pl-12 pr-12 py-3.5 rounded-xl border bg-white text-navy-900 placeholder:text-slate-300 text-sm outline-none transition-all duration-300 ${
                        passwordErrors.newPassword
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                          : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-rose-500 text-xs mt-1.5">{passwordErrors.newPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setPasswordErrors({}); }}
                      placeholder="Confirm 6-digit password"
                      maxLength={6}
                      className={`w-full pl-12 pr-12 py-3.5 rounded-xl border bg-white text-navy-900 placeholder:text-slate-300 text-sm outline-none transition-all duration-300 ${
                        passwordErrors.confirmPassword
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                          : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-rose-500 text-xs mt-1.5">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Strength hint */}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                  </svg>
                  Password must be exactly 6 digits (0-9)
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-navy-900 hover:bg-navy-800 disabled:bg-navy-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-navy-900/20 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Resetting…
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ────── STEP 4 : SUCCESS ────── */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6 animate-fade-in-up">
                <CheckCircle2 className="w-10 h-10 text-teal-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 font-[Poppins] mb-3">
                Password Reset!
              </h2>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                Your password has been successfully updated. You can now sign in
                with your new credentials.
              </p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-navy-900/20 hover:shadow-navy-900/30"
              >
                Continue to Home
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
