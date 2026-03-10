import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/assets/banner-1.jpg',
    title: 'Earth\'s Natural Treasures',
    subtitle: 'Healing Crystals & Sacred Stones',
    buttonText: 'Shop New Arrivals',
    align: 'left'
  },
  {
    image: '/assets/banner-2.jpg',
    title: 'Radiate Positive Energy',
    subtitle: 'Elevate Your Spiritual Journey',
    buttonText: 'Explore Collections',
    align: 'center'
  },
  {
    image: '/assets/banner-3.jpg',
    title: 'Divine Harmony',
    subtitle: 'Sacred Stones for Inner Peace',
    buttonText: 'Discover More',
    align: 'right'
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[70vh] md:h-[90vh] overflow-hidden bg-gray-100">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          <img 
            src={slide.image} 
            alt={slide.title}
            className={`w-full h-full object-cover transition-transform duration-[10000ms] ${
              index === current ? 'scale-110' : 'scale-100'
            }`}
          />
          
          {/* Content */}
          <div className={`absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-20 container mx-auto
            ${slide.align === 'center' ? 'items-center text-center' : slide.align === 'right' ? 'items-end text-right' : 'items-start text-left'}
          `}>
            <div className={`transition-all duration-1000 transform ${
              index === current ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-10 opacity-0'
            }`}>
              <span className="text-white text-xs md:text-sm uppercase tracking-[0.4em] font-medium mb-4 block">
                {slide.subtitle}
              </span>
              <h1 className="text-4xl md:text-7xl lg:text-8xl text-white font-serif mb-8 max-w-4xl leading-[1.1]">
                {slide.title}
              </h1>
              <button className="bg-white text-black px-8 md:px-12 py-3 md:py-4 uppercase tracking-widest text-xs md:text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-xl">
                {slide.buttonText}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 text-white border border-white/30 rounded-full hover:bg-white hover:text-black transition-all duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 text-white border border-white/30 rounded-full hover:bg-white hover:text-black transition-all duration-300"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex space-x-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-12 h-1 transition-all duration-300 ${
              index === current ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
