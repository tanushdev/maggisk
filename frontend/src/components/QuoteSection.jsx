import React from 'react';

const QuoteSection = () => {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#f4ece3] flex items-center justify-center min-h-[400px] md:min-h-[500px]"
    >
      {/* Background Image Wrapper */}
      <div
        className="absolute inset-0 w-full h-full bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/images/quote-bg.png')" }}
      ></div>

      {/* Overlay to ensure text readability if needed (optional) */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] md:hidden"></div>

      {/* Center Quote Content */}
      <div className="relative z-10 w-full text-center flex flex-col items-center justify-center px-4 py-20">

      </div>
    </section>
  );
};

export default QuoteSection;
