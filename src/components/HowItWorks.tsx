import { Upload, Search, FileCheck, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Submit Request',
    description: 'Upload candidate details through our secure platform or API integration.',
  },
  {
    icon: Search,
    step: '02',
    title: 'We Verify',
    description: 'Our team conducts thorough multi-source verification across databases and field checks.',
  },
  {
    icon: FileCheck,
    step: '03',
    title: 'Review Report',
    description: 'Receive a detailed, compliance-ready report with clear findings and risk assessment.',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'Hire Confidently',
    description: 'Make informed hiring decisions backed by verified, accurate background data.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-50 rounded-full blur-[200px] opacity-50" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[150px] opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span className="text-sm font-semibold text-teal-700">How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 font-[Poppins] leading-tight">
            Verification Made{' '}
            <span className="text-teal-600">Simple</span>
          </h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">
            Our streamlined process ensures fast, accurate results every time.
            From submission to report — all in 24 hours.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-teal-200 via-teal-300 to-teal-200" />

          {steps.map((step, i) => (
            <div key={i} className="relative text-center group">
              {/* Step number circle on the line */}
              <div className="relative inline-flex flex-col items-center">
                <div className="w-32 h-32 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-teal-50 group-hover:border-teal-200 group-hover:shadow-xl group-hover:shadow-teal-100/50 group-hover:-translate-y-2 relative">
                  <step.icon className="w-12 h-12 text-slate-300 transition-colors duration-500 group-hover:text-teal-500" />
                  {/* Step badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-navy-900 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-navy-900/25 transition-all duration-300 group-hover:bg-teal-500 group-hover:shadow-teal-500/25">
                    {step.step}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-navy-900 mb-2 font-[Poppins]">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
