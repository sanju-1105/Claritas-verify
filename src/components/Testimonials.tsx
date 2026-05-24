import { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Head of HR',
    company: 'TechVista Solutions',
    text: 'Claritas Verify transformed our hiring process. What used to take weeks now takes 24 hours. The accuracy and reliability of their reports gave us the confidence to scale our team from 50 to 200 in just one year.',
    avatar: 'PS',
    color: 'from-teal-400 to-teal-600',
  },
  {
    name: 'Rajesh Menon',
    role: 'Co-Founder & CEO',
    company: 'FinLeap Technologies',
    text: "As a fintech startup, compliance is non-negotiable. Claritas Verify's comprehensive background checks ensure we meet every regulatory requirement. Their PAN India coverage is truly impressive.",
    avatar: 'RM',
    color: 'from-blue-400 to-blue-600',
  },
  {
    name: 'Ananya Iyer',
    role: 'VP - People & Culture',
    company: 'CloudNine Digital',
    text: "We've tried multiple BGV providers, and Claritas Verify stands out for their speed and customer service. The dedicated support team understands our urgency and delivers every single time.",
    avatar: 'AI',
    color: 'from-violet-400 to-violet-600',
  },
  {
    name: 'Vikram Patel',
    role: 'CHRO',
    company: 'NexGen Pharma',
    text: 'The compliance-ready reports from Claritas Verify have been instrumental in our ISO certification process. Their attention to detail and data accuracy is second to none in the industry.',
    avatar: 'VP',
    color: 'from-amber-400 to-orange-500',
  },
  {
    name: 'Deepika Nair',
    role: 'Director of Operations',
    company: 'SwiftLogix',
    text: "Claritas Verify's platform is intuitive and powerful. We onboarded 300 employees in Q3, and every single verification was completed within the promised timeline. Exceptional service.",
    avatar: 'DN',
    color: 'from-rose-400 to-rose-600',
  },
  {
    name: 'Arjun Kapoor',
    role: 'Founder',
    company: 'GreenStack AI',
    text: "As a fast-growing startup, we needed a BGV partner who could match our pace. Claritas Verify's 24-hour turnaround and 99% accuracy rate makes them our top recommendation.",
    avatar: 'AK',
    color: 'from-emerald-400 to-emerald-600',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const itemsPerView = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(goNext, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goNext]);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
              <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
              <span className="text-sm font-semibold text-gold-600">Client Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 font-[Poppins] leading-tight">
              What Our Clients{' '}
              <span className="text-teal-600">Say</span>
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-xl">
              Join 50+ companies that trust Claritas Verify for their background verification needs.
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                goPrev();
                setIsAutoPlaying(false);
              }}
              className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-navy-900 text-slate-500 hover:text-white flex items-center justify-center transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                goNext();
                setIsAutoPlaying(false);
              }}
              className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-navy-900 text-slate-500 hover:text-white flex items-center justify-center transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="w-full md:w-1/3 flex-shrink-0 px-3"
                >
                  <div className="h-full bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-lg hover:shadow-slate-100 relative group">
                    {/* Quote icon */}
                    <Quote className="w-10 h-10 text-teal-100 mb-4" />

                    {/* Stars */}
                    <div className="flex gap-1 mb-5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-gold-400 fill-gold-400" />
                      ))}
                    </div>

                    {/* Text */}
                    <p className="text-slate-600 leading-relaxed text-[15px] mb-8">
                      "{t.text}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                        {t.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-navy-900 text-sm">{t.name}</div>
                        <div className="text-slate-400 text-sm">{t.role}, {t.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentIndex(i);
                  setIsAutoPlaying(false);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-8 bg-teal-500'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
