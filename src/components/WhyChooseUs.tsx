import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  FileCheck,
  HeadphonesIcon,
  ShieldCheck,
  Send,
} from 'lucide-react';

const features = [
  {
    icon: CheckCircle2,
    title: 'Accurate & Verified Data',
    description: 'Multi-layer verification ensures 99% accuracy across all checks.',
  },
  {
    icon: Clock,
    title: 'Fast Turnaround Time',
    description: 'Most verifications completed within 24–48 hours, guaranteed.',
  },
  {
    icon: MapPin,
    title: 'PAN India Coverage',
    description: 'Extensive network across 500+ cities and 28 states.',
  },
  {
    icon: FileCheck,
    title: 'Compliance-Ready Reports',
    description: 'Reports formatted for ISO, SOC2, and regulatory audits.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Support',
    description: 'Assigned account manager with priority response SLAs.',
  },
];

export default function WhyChooseUs() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    contactMethod: 'email',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    } else if (!/^\d{10}$/.test(formData.whatsapp.replace(/[\s-+]/g, '').slice(-10))) {
      newErrors.whatsapp = 'Please enter a valid 10-digit number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Why Choose Us */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-900/5 border border-navy-900/10 mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-navy-900" />
              <span className="text-sm font-semibold text-navy-900">Why Claritas Verify</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy-900 font-[Poppins] leading-tight mb-6">
              Why Choose{' '}
              <span className="text-teal-600">Claritas Verify?</span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-10">
              We combine cutting-edge technology with an extensive on-ground network 
              to deliver India's most reliable background verification service.
            </p>

            <div className="space-y-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-teal-500 group-hover:border-teal-500 group-hover:shadow-lg group-hover:shadow-teal-500/25">
                    <feature.icon className="w-5 h-5 text-teal-600 transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-navy-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Contact Form */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy-900 mb-3 font-[Poppins]">Request Submitted!</h3>
                  <p className="text-slate-500 mb-6">
                    Our team will reach out to you within 2 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ fullName: '', email: '', whatsapp: '', contactMethod: 'email' });
                    }}
                    className="text-teal-600 font-semibold text-sm hover:text-teal-700 transition-colors"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-navy-900 font-[Poppins]">
                      Request Verification
                    </h3>
                    <p className="text-slate-500 mt-2 text-sm">
                      Fill in your details and our team will get back to you within 2 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-2">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3.5 rounded-xl border bg-white text-navy-900 placeholder:text-slate-300 text-sm transition-all duration-300 outline-none ${
                          errors.fullName
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                            : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-rose-500 text-xs mt-1.5">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-2">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="you@company.com"
                        className={`w-full px-4 py-3.5 rounded-xl border bg-white text-navy-900 placeholder:text-slate-300 text-sm transition-all duration-300 outline-none ${
                          errors.email
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                            : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-rose-500 text-xs mt-1.5">{errors.email}</p>
                      )}
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-2">
                        WhatsApp Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">+91</span>
                        <input
                          type="tel"
                          value={formData.whatsapp}
                          onChange={(e) => handleChange('whatsapp', e.target.value)}
                          placeholder="9876543210"
                          className={`w-full pl-14 pr-4 py-3.5 rounded-xl border bg-white text-navy-900 placeholder:text-slate-300 text-sm transition-all duration-300 outline-none ${
                            errors.whatsapp
                              ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                              : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
                          }`}
                        />
                      </div>
                      {errors.whatsapp && (
                        <p className="text-rose-500 text-xs mt-1.5">{errors.whatsapp}</p>
                      )}
                    </div>

                    {/* Contact Method */}
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-3">
                        Preferred Contact Method
                      </label>
                      <div className="flex gap-4">
                        {[
                          { value: 'email', label: 'Email' },
                          { value: 'whatsapp', label: 'WhatsApp' },
                        ].map((option) => (
                          <label
                            key={option.value}
                            htmlFor={`contact-${option.value}`}
                            className={`flex items-center gap-3 px-5 py-3 rounded-xl border cursor-pointer transition-all duration-300 flex-1 ${
                              formData.contactMethod === option.value
                                ? 'border-teal-500 bg-teal-50 text-teal-700'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              id={`contact-${option.value}`}
                              name="contactMethod"
                              value={option.value}
                              checked={formData.contactMethod === option.value}
                              onChange={(e) => handleChange('contactMethod', e.target.value)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              formData.contactMethod === option.value
                                ? 'border-teal-500'
                                : 'border-slate-300'
                            }`}>
                              {formData.contactMethod === option.value && (
                                <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                              )}
                            </div>
                            <span className="text-sm font-medium">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-navy-900/20 hover:shadow-navy-900/30 hover:-translate-y-0.5 mt-2"
                    >
                      <Send className="w-4 h-4" />
                      Request Verification
                    </button>

                    <p className="text-xs text-slate-400 text-center mt-4">
                      By submitting, you agree to our Privacy Policy. We never share your data.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
