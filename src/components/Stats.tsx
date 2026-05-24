import { useEffect, useState, useRef } from 'react';

const stats = [
  { value: 50, suffix: '+', label: 'Enterprise Clients', prefix: '' },
  { value: 99, suffix: '%', label: 'Verification Accuracy', prefix: '' },
  { value: 500, suffix: '+', label: 'Cities Covered', prefix: '' },
  { value: 10, suffix: 'K+', label: 'Verifications Completed', prefix: '' },
];

function useCountUp(target: number, duration: number, isVisible: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, isVisible]);

  return count;
}

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 bg-navy-900 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => {
            const count = useCountUp(stat.value, 2000, isVisible);
            return (
              <div key={i} className="text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-[Poppins]">
                  {stat.prefix}{count}{stat.suffix}
                </div>
                <div className="text-sm sm:text-base text-white/40 mt-2 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
