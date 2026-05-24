import {
  UserCheck,
  FileSearch,
  GraduationCap,
  MapPin,
  Briefcase,
  Scale,
  ArrowUpRight,
} from 'lucide-react';

const services = [
  {
    icon: UserCheck,
    title: 'Identity Verification',
    description: 'Comprehensive Aadhaar, PAN, and government ID verification with real-time validation against official databases.',
    color: 'from-teal-500 to-teal-600',
    shadow: 'shadow-teal-500/20',
  },
  {
    icon: Briefcase,
    title: 'Employment Verification',
    description: 'Verify past employment details including designation, tenure, and conduct directly with previous employers.',
    color: 'from-violet-500 to-violet-600',
    shadow: 'shadow-violet-500/20',
  },
  {
    icon: GraduationCap,
    title: 'Education Verification',
    description: 'Authenticate degrees, certifications, and academic credentials from universities and institutions across India.',
    color: 'from-amber-500 to-orange-500',
    shadow: 'shadow-amber-500/20',
  },
  {
    icon: MapPin,
    title: 'Address Verification',
    description: 'Physical and digital address verification through field agents and advanced geo-validation technology.',
    color: 'from-rose-500 to-pink-500',
    shadow: 'shadow-rose-500/20',
  },
  {
    icon: Scale,
    title: 'India Verification Support',
    description: 'Dedicated verification support across India with local document validation and regional screening expertise.',
    color: 'from-emerald-500 to-green-500',
    shadow: 'shadow-emerald-500/20',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span className="text-sm font-semibold text-teal-700">Our Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 font-[Poppins] leading-tight">
            Comprehensive Screening{' '}
            <span className="text-teal-600">Solutions</span>
          </h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">
            End-to-end background verification services designed for speed, accuracy, and compliance. 
            Everything you need to make confident hiring decisions.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl p-8 border border-slate-100 hover:border-slate-200 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg ${service.shadow} transition-transform duration-300 group-hover:scale-110`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-navy-900 mb-3 font-[Poppins]">
                {service.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-[15px]">
                {service.description}
              </p>

              {/* Arrow link */}
              <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-teal-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                Learn More
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
