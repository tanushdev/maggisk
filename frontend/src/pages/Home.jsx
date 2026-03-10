import React from 'react';
import HeroSlider from '../components/HeroSlider';
import MustHaveSection from '../components/MustHaveSection';
import FeaturedProducts from '../components/FeaturedProducts';
import QuoteSection from '../components/QuoteSection';
import Testimonials from '../components/Testimonials';
import ServicesSection from '../components/ServicesSection';
import PerfectionSection from '../components/PerfectionSection';

const Home = () => {
  return (
    <div className="home-page">
      <HeroSlider />

      {/* Perfection Layout from image 4 */}
      <PerfectionSection />

      {/* Services/Icons from image 3 */}
      <ServicesSection />

      {/* Featured/Latest Products from image 5 */}
      <FeaturedProducts />

      {/* Large Quote from image 1/2 */}
      <QuoteSection />

      {/* Must Have Section */}
      <MustHaveSection />

      {/* Testimonials */}
      <Testimonials />

      {/* Subtle Divider */}
      <div className="h-[1px] bg-gray-100 max-w-6xl mx-auto"></div>
    </div>
  );
};

export default Home;
