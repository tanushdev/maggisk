import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/images/hero-1.jpg',
    title: 'TRANSFORMING',
    line2: 'SPACES WITH',
    line3: 'TIMELESS STONES',
    description: 'At Maggikstones, we believe every stone tells a story.',
    buttonText: 'CONTACT US'
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  return (
    <section className="relative h-[600px] md:h-screen bg-[#1a1a1a] overflow-hidden">
      <div className="absolute inset-0">
        <img src={slides[current].image} alt="Hero" className="w-full h-full object-cover brightness-[0.7]" />

        {/* Content Container Aligned to Right, Text Perfectly Centered relative to itself */}
        <div className="absolute inset-0 flex flex-col justify-center items-end px-6 md:px-20 lg:px-32">
          <div className="max-w-4xl flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-5xl lg:text-[70px] font-serif text-white tracking-[0.1em] leading-[0.85] animate-fadeInUp uppercase">
              {slides[current].title}
            </h1>
            <h1 className="text-3xl md:text-5xl lg:text-[70px] font-serif text-white tracking-[0.1em] leading-[0.85] animate-fadeInUp delay-75 uppercase">
              {slides[current].line2}
            </h1>
            <h1 className="text-3xl md:text-5xl lg:text-[70px] font-serif text-white tracking-[0.1em] leading-[0.85] animate-fadeInUp delay-100 uppercase">
              {slides[current].line3}
            </h1>

            <div className="mt-4 mb-8">
              <p className="text-white/90 text-sm md:text-xl font-serif tracking-wide animate-fadeInUp delay-200">
                {slides[current].description}
              </p>
            </div>

            <button className="bg-transparent border border-white/20 text-white px-10 py-3 uppercase tracking-[0.2em] text-[11px] font-medium hover:bg-white hover:text-black transition-all duration-300 animate-fadeInUp delay-300">
              {slides[current].buttonText}
            </button>
          </div>
        </div>

        {/* Side Arrows as seen in image */}
        <button className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-30">
          <svg width="30" height="15" viewBox="0 0 30 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 7.5H2M2 7.5L8 1.5M2 7.5L8 13.5" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
        <button className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-30">
          <svg width="30" height="15" viewBox="0 0 30 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 7.5H28M28 7.5L22 1.5M28 7.5L22 13.5" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSlider;
