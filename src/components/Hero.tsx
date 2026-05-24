import { ArrowRight, Play, Shield, CheckCircle2, Users, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-navy-900">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Background image */}
        <img
          src="/images/hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950/90 via-navy-900/85 to-navy-800/90" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gold-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side — Copy */}
          <div className="space-y-8">
            {/* Trust badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm font-medium text-white/80">Trusted by 50+ companies across India</span>
            </div>

            {/* Headline */}
            <div className="animate-fade-in-up animation-delay-200 space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight font-[Poppins]">
                <span className="text-white">Hire with</span>
                <br />
                <span className="text-white">Confidence.</span>
                <br />
                <span className="gradient-text">Verify with Certainty.</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/60 max-w-lg leading-relaxed font-light">
                Fast, reliable, and compliant background verification solutions for modern businesses in India.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-navy-950 font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/25 hover:shadow-teal-400/40 hover:-translate-y-0.5 cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm cursor-pointer"
              >
                <Play className="w-4 h-4" />
                Book a Demo
              </button>
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up animation-delay-600 grid grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">99%</div>
                <div className="text-xs sm:text-sm text-white/40 mt-1">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">24h</div>
                <div className="text-xs sm:text-sm text-white/40 mt-1">Avg. Turnaround</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">500+</div>
                <div className="text-xs sm:text-sm text-white/40 mt-1">Cities Covered</div>
              </div>
            </div>
          </div>

          {/* Right Side — Visual */}
          <div className="relative hidden lg:block">
            <div className="animate-float relative">
              {/* Main card */}
              <div className="relative bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Verification Dashboard</h3>
                    <p className="text-white/40 text-sm">Real-time screening status</p>
                  </div>
                </div>

                {/* Verification items */}
                <div className="space-y-4">
                  {[
                    { label: 'Identity Verification', status: 'Verified', color: 'text-teal-400 bg-teal-500/10' },
                    { label: 'India Verification Support', status: 'Verified', color: 'text-teal-400 bg-teal-500/10' },
                    { label: 'Employment Verification', status: 'Verified', color: 'text-teal-400 bg-teal-500/10' },
                    { label: 'Education Verification', status: 'In Progress', color: 'text-gold-400 bg-gold-500/10' },
                    { label: 'Address Verification', status: 'Pending', color: 'text-white/40 bg-white/5' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className={`w-5 h-5 ${item.status === 'Verified' ? 'text-teal-400' : item.status === 'In Progress' ? 'text-gold-400' : 'text-white/20'}`} />
                        <span className="text-white/80 text-sm font-medium">{item.label}</span>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.color}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60 text-sm">Overall Progress</span>
                    <span className="text-teal-400 text-sm font-bold">60%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[60%] bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-1000" />
                  </div>
                </div>
              </div>

              {/* Floating badge - top right */}
              <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-400" />
                  <div>
                    <div className="text-white font-bold text-lg leading-none">1,247</div>
                    <div className="text-white/40 text-xs mt-0.5">Verified this month</div>
                  </div>
                </div>
              </div>

              {/* Floating badge - bottom left */}
              <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gold-400" />
                  <div>
                    <div className="text-white font-bold text-lg leading-none">99.2%</div>
                    <div className="text-white/40 text-xs mt-0.5">Accuracy Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
