import React from 'react';

const PerfectionSection = () => {
  return (
    <section className="bg-white w-full overflow-hidden">
      <div className="flex flex-col md:flex-row items-stretch w-full min-h-[600px]">
        {/* Left Image Half */}
        <div className="w-full md:w-1/2 relative min-h-[400px]">
          <img
            src="/images/craftsmanship.webp"
            alt="Natural Stone Artifact"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right Content Half */}
        <div className="w-full md:w-1/2 py-20 px-8 md:p-24 flex flex-col justify-center">
          <div className="max-w-xl mx-auto md:mx-0 space-y-16">

            <div className="item group">
              <span className="text-gray-400 text-xs md:text-[18px] font-medium tracking-wide mb-3 block">Unveiling timeless designs in natural stone.</span>
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-[#a66a4a]"></div>
                <h2 className="text-3xl md:text-5xl font-serif text-[#9b6243]">Crafted with Perfection</h2>
              </div>
            </div>

            <div className="item group">
              <span className="text-gray-400 text-xs md:text-[18px] font-medium tracking-wide mb-3 block">Bring home the beauty of natural crystals, gemstones & quartz</span>
              <div className="flex items-center gap-4">
                <h2 className="text-3xl md:text-5xl font-serif text-bold ">Go Natural</h2>
              </div>
            </div>

            <div className="item group">
              <span className="text-gray-400 text-xs md:text-[18px] font-medium tracking-wide mb-3 block">Luxury that lasts for generations.</span>
              <div className="flex items-center gap-4">
                <h2 className="text-3xl md:text-5xl font-serif text-bold ">Elevate Your Space</h2>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default PerfectionSection;
