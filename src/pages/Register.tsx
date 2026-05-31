import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck, User, Mail, Lock, Building2,
  Briefcase, ArrowRight, CheckCircle2, Loader2,
} from 'lucide-react';

const positions = [
  'Hiring Manager', 'HR Manager', 'HR Executive', 'Talent Acquisition',
  'Recruiter', 'CHRO', 'Founder / CEO', 'Operations Manager', 'Other',
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', position: '', companyName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (formData.fullName.trim().length < 2) newErrors.fullName = 'Name must be at least 2 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.position) newErrors.position = 'Please select your position';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const success = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        position: formData.position,
        companyName: formData.companyName,
      });
      if (success) {
        setStep('success');
      } else {
        setErrors({ email: 'Registration failed. This email may already be in use.' });
      }
    } catch {
      setErrors({ email: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex">
      {/* Left Panel */}
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
              Start verifying with <span className="text-teal-400">confidence</span> today.
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Join 50+ companies that trust Claritas Verify for fast, accurate, and compliant background verification.
            </p>
            <div className="space-y-4">
              {['99% verification accuracy', '24-hour turnaround time', 'PAN India coverage', 'Compliance-ready reports'].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-teal-400" />
                  </div>
                  <span className="text-white/70 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/30 text-sm">© {new Date().getFullYear()} Claritas Verify Pvt. Ltd.</p>
        </div>
      </div>

      {/* Right Panel */}
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

          {/* Form Step */}
          {step === 'form' && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 font-[Poppins]">Create your account</h2>
                <p className="text-slate-500 mt-2">
                  Already have an account?{' '}
                  <Link to="/login" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">Sign in</Link>
                </p>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Full Name <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input type="text" value={formData.fullName} onChange={(e) => handleChange('fullName', e.target.value)} placeholder="Enter your full name"
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white text-navy-900 placeholder:text-slate-300 text-sm transition-all duration-300 outline-none ${errors.fullName ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'}`} />
                  </div>
                  {errors.fullName && <p className="text-rose-500 text-xs mt-1.5">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Email Address <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="you@company.com"
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white text-navy-900 placeholder:text-slate-300 text-sm transition-all duration-300 outline-none ${errors.email ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'}`} />
                  </div>
                  {errors.email && <p className="text-rose-500 text-xs mt-1.5">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-900 mb-2">Password <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input type="password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} placeholder="Min 6 chars"
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white text-navy-900 placeholder:text-slate-300 text-sm transition-all duration-300 outline-none ${errors.password ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'}`} />
                    </div>
                    {errors.password && <p className="text-rose-500 text-xs mt-1.5">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-900 mb-2">Confirm <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input type="password" value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} placeholder="Confirm"
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white text-navy-900 placeholder:text-slate-300 text-sm transition-all duration-300 outline-none ${errors.confirmPassword ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'}`} />
                    </div>
                    {errors.confirmPassword && <p className="text-rose-500 text-xs mt-1.5">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Position <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none z-10" />
                    <select value={formData.position} onChange={(e) => handleChange('position', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white text-navy-900 text-sm transition-all duration-300 outline-none appearance-none cursor-pointer ${errors.position ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'} ${!formData.position ? 'text-slate-300' : ''}`}>
                      <option value="" disabled>Select your position</option>
                      {positions.map((pos) => <option key={pos} value={pos}>{pos}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.position && <p className="text-rose-500 text-xs mt-1.5">{errors.position}</p>}
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Company / Firm Name <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input type="text" value={formData.companyName} onChange={(e) => handleChange('companyName', e.target.value)} placeholder="Enter your company name"
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white text-navy-900 placeholder:text-slate-300 text-sm transition-all duration-300 outline-none ${errors.companyName ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'}`} />
                  </div>
                  {errors.companyName && <p className="text-rose-500 text-xs mt-1.5">{errors.companyName}</p>}
                </div>

                {/* Submit */}
                <button type="submit" disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-navy-900 hover:bg-navy-800 disabled:bg-navy-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-navy-900/20 disabled:cursor-not-allowed cursor-pointer">
                  {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Creating account...</>) : (<>Create Account<ArrowRight className="w-4 h-4" /></>)}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  By registering, you agree to our{' '}
                  <button type="button" className="text-teal-600 hover:underline cursor-pointer">Terms of Service</button>
                  {' '}and{' '}
                  <button type="button" className="text-teal-600 hover:underline cursor-pointer">Privacy Policy</button>
                </p>
              </form>
            </>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-teal-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 font-[Poppins] mb-3">Account Created!</h2>
              <p className="text-slate-500 mb-2">Welcome to Claritas Verify, {formData.fullName.split(' ')[0]}!</p>
              <p className="text-slate-400 text-sm mb-8">
                A verification email has been sent to <span className="font-semibold text-navy-900">{formData.email}</span>. Please verify before logging in.
              </p>
              <button onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-navy-900/20 cursor-pointer">
                Continue to Login <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}