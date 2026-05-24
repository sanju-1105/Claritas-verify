import { Building2 } from 'lucide-react';

const companies = [
  { name: 'TechMahindra', initials: 'TM' },
  { name: 'Wipro', initials: 'Wi' },
  { name: 'Infosys', initials: 'IN' },
  { name: 'Razorpay', initials: 'Rz' },
  { name: 'PhonePe', initials: 'PP' },
  { name: 'Flipkart', initials: 'FK' },
  { name: 'Swiggy', initials: 'Sw' },
  { name: 'Zomato', initials: 'Zm' },
  { name: 'Paytm', initials: 'Pt' },
  { name: 'Ola', initials: 'OL' },
];

export default function TrustedBy() {
  const doubled = [...companies, ...companies];

  return (
    <section className="relative py-16 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-teal-400" />
            <p className="text-sm font-semibold text-teal-400 uppercase tracking-[0.2em]">
              Trusted Partners
            </p>
          </div>
          <p className="text-white/60 text-base">
            Trusted by leading companies across India
          </p>
        </div>

        {/* Scrolling Track */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-navy-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-navy-900 to-transparent z-10 pointer-events-none" />

          <div className="flex animate-slide w-max">
            {doubled.map((company, i) => (
              <div
                key={i}
                className="flex items-center justify-center mx-6 sm:mx-10 shrink-0"
              >
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.12] hover:border-white/[0.16] transition-all duration-300 group cursor-default">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                    <span className="text-xs font-bold text-teal-400">{company.initials}</span>
                  </div>
                  <span className="text-sm font-semibold text-white/80 whitespace-nowrap group-hover:text-white transition-colors">
                    {company.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
