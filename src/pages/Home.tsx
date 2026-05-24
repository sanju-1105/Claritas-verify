import Header from '../components/Header';
import Hero from '../components/Hero';
import TrustedBy from '../components/TrustedBy';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';
import WhyChooseUs from '../components/WhyChooseUs';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <TrustedBy />
      <Services />
      <HowItWorks />
      <Testimonials />
      <Stats />
      <WhyChooseUs />
      <Footer />
    </div>
  );
}
