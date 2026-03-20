import React from 'react';

const ShippingPolicy = () => {
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
            Shipping & Delivery Policy
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
              The orders are shipped through registered domestic courier companies and /or speed post only. Orders are shipped within 0-2 days or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms.
            </p>
            
            <p>
              Maggikstones is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 2 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation. Product will be delivered within 10 days of order booked/ confirmation.
            </p>

            <p>
              Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration.
            </p>
            
            <div className="pt-6 border-t border-gray-100">
              <p>
                For any issues in utilizing our services you may contact our helpdesk on <span className="font-bold text-gray-900">+91 9136366662</span> or <a href="mailto:maggikstones@gmail.com" className="font-bold text-gray-900 hover:text-theme-rust transition-colors">maggikstones@gmail.com</a>
              </p>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicy;
