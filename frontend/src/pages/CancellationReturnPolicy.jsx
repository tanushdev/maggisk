import React from 'react';

const CancellationReturnPolicy = () => {
  return (
    <div className="policy-container bg-[#FDFBF7]">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/3554-1.jpg')`,
            filter: 'brightness(0.3)'
          }}
        ></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight drop-shadow-lg mb-4">
            Cancellation & Return Policy
          </h1>
          <p className="text-theme-cream/80 text-xs md:text-sm tracking-[0.2em] font-bold uppercase">
            Last updated on Nov 25th 2025
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 md:px-10 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-8 text-gray-600 leading-relaxed text-base md:text-lg font-light">
            
            <p>
              We do not have a return or cancellation policy once the order is placed and confirmed. We hope that you’ll be thrilled with your crystal products when they arrive but if anything isn’t right, we are on hand to help. Contact us on <a href="mailto:maggikstones@gmail.com" className="font-bold text-gray-900 hover:text-theme-rust transition-colors">maggikstones@gmail.com</a> for assistance and we’ll get back to you promptly.
            </p>
            
            <p>
              The products are fragile; hence we ensure the product is packed and wrapped well from our end. We take every care to ensure your ordered products are properly protected during transit. Since all products are custom hand-made and fragile, we do not accept returns at the moment.
            </p>

            <p>
              However, for all claims for shortages or damages must be reported to customer service within 24 hours of the day of delivery with fully visible product unwrapping/opening videos and photographic proof. After verification of proofs, the replacement order will be delivered within 7 working days.
            </p>
            
            <p>
              We sadly cannot refund or replace the product once delivered. The shipping and handling charges are given at the time of check out and valued customers will know about this before making payments.
            </p>
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default CancellationReturnPolicy;
