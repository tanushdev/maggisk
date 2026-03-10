import React from 'react';

const QuoteSection = () => {
  return (
    <section className="relative py-32 md:py-48 overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
        <img src="/assets/m3-bg-1b.png" alt="" className="w-full h-full object-contain object-right" />
      </div>
      <div className="absolute bottom-0 left-0 w-1/4 h-full opacity-10 pointer-events-none">
        <img src="/assets/13034.webp" alt="" className="w-full h-full object-contain object-left" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-12">
            <svg fill="none" height="60" viewBox="0 0 52 50" width="62" xmlns="http://www.w3.org/2000/svg" className="text-[#91c9bb] opacity-40">
              <path d="M11.81 50c5.142 0 9.523-3.774 9.523-8.868 0-11.32-15.047-4.34-15.047-16.604 0-7.17 4.952-17.17 13.143-23.207L18.095 0C5.715 8.68 0 21.887 0 33.208 0 42.83 4.19 50 11.81 50Zm30.476 0C47.809 50 52 46.226 52 41.132c0-11.32-15.048-4.34-15.048-16.604 0-7.17 5.143-17.17 13.334-23.207L48.952 0c-12.38 8.68-18.285 21.887-18.285 33.208C30.667 42.83 35.047 50 42.286 50Z" fill="currentColor"></path>
            </svg>
          </div>
          <blockquote className="text-3xl md:text-5xl lg:text-6xl font-serif text-gray-900 leading-[1.3] italic mb-12">
            "Every stone carries the whispers of the Earth, waiting to guide your soul towards harmony and light."
          </blockquote>
          <div className="flex flex-col items-center">
            <div className="w-16 h-0.5 bg-[#91c9bb] mb-6"></div>
            <span className="text-sm uppercase tracking-[0.4em] font-medium text-gray-400">Divine Wisdom</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
