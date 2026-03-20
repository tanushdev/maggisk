import React from 'react';

const AboutUs = () => {
  return (
    <div className="about-us-container bg-[#FDFBF7]">
      {/* 1. Hero Section - Matches Image 1 */}
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/3554-1.jpg')`,
            filter: 'brightness(0.5)'
          }}
        ></div>
        <div className="relative z-10 text-center">
          <h1 className="text-white text-6xl md:text-7xl font-serif tracking-tight drop-shadow-lg">
            About Us
          </h1>
        </div>
      </section>

      {/* 2. Welcome Section - Matches Image 2 */}
      <section className="py-20 px-4 md:px-0">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif text-[#2D2D2D] leading-[1.1]">
                Welcome to Maggikstones
              </h2>
              <div className="space-y-6 text-[#666] leading-relaxed text-lg font-light">
                <p>
                  Where nature’s beauty meets mindful living. Explore our world of handpicked crystals, gemstones, and sacred treasures crafted to elevate spirit, home, and soul.
                </p>
                <p>
                  Our collection includes raw crystals, gemstone jewelry, home decor, Rudraksha, and each sourced and crafted to bring harmony and healing into your life.
                </p>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="/images/2150062917-1.jpg"
                alt="Gemstone Tree"
                className="w-full h-auto shadow-sm rounded-[2px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Banner Image - Matches Image 3 */}
      <section className="w-full h-[300px] md:h-[450px]">
        <img
          src="/images/2148083180-1.jpg"
          alt="Crystals Banner"
          className="w-full h-full object-cover"
        />
      </section>

      {/* 4. Differentiation Section - Matches Image 4 */}
      <section className="py-24 px-4 md:px-0 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="md:w-1/2 order-2 md:order-1">
              <img
                src="/images/Pyrite-Frame-Om-2.jpeg"
                alt="Om Frame"
                className="w-full h-auto shadow-lg"
              />
            </div>
            <div className="md:w-1/2 space-y-8 order-1 md:order-2">
              <h3 className="text-4xl md:text-5xl font-serif text-[#2D2D2D] leading-[1.2]">
                What Makes Us <br /> Different
              </h3>
              <ul className="space-y-4 text-[#333] text-lg font-light list-none p-0">
                {[
                  "Promise of Original & Authentic Products",
                  "Pre-Activated Stones",
                  "Premium Quality",
                  "Pocket Friendly Price",
                  "Packaging",
                  "Prompt Delivery"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#333] rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Mission Vision Values - Matches Image 5 */}
      <section className="py-24 px-4 md:px-0 bg-[#FDFBF7]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            {/* Our Mission */}
            <div className="space-y-6 flex flex-col items-center border-r md:border-[#EAEAEA] last:border-0 px-8">
              <h4 className="text-3xl font-serif text-[#2D2D2D]">Our Mission</h4>
              <div className="w-1 h-1 bg-[#2D2D2D] rounded-full"></div>
              <p className="text-[#666] leading-relaxed font-light">
                To spread the power of crystals and gemstones by offering authentic, high-quality, and ethically sourced products that inspire positivity, balance, and spiritual growth.
              </p>
            </div>

            {/* Our Vision */}
            <div className="space-y-6 flex flex-col items-center border-r md:border-[#EAEAEA] last:border-0 px-8">
              <h4 className="text-3xl font-serif text-[#2D2D2D]">Our Vision</h4>
              <div className="w-1 h-1 bg-[#2D2D2D] rounded-full"></div>
              <p className="text-[#666] leading-relaxed font-light">
                To become a global destination for crystal lovers — a place where people can discover not only stones, but also guidance, energy, and a deeper connection to themselves and the universe.
              </p>
            </div>

            {/* Our Core Values */}
            <div className="space-y-6 flex flex-col items-center last:border-0 px-8">
              <h4 className="text-3xl font-serif text-[#2D2D2D]">Our Core Values</h4>
              <div className="w-1 h-1 bg-[#2D2D2D] rounded-full"></div>
              <p className="text-[#666] leading-relaxed font-light">
                We believe in authenticity, sustainability, and integrity — ensuring every crystal is genuine, responsibly sourced, and filled.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;