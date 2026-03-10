import React from 'react';

const iconsData = [
  {
    title: 'Delivery',
    text: 'Safe and secure delivery worldwide. We carefully pack every crystal and gemstone to ensure it reaches you in perfect condition, with fast and reliable shipping options.'
  },
  {
    title: 'Services',
    text: 'From raw crystals to custom jewelry and our services are designed to meet every customer\'s needs. We also offer bulk orders and personalized recommendations.'
  },
  {
    title: 'Contact',
    text: 'Have a question about crystals, gemstones, or your order? Our support team is here to guide you with product details, recommendations, and after-sales support.'
  }
];

const ServicesSection = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto gap-y-12 md:gap-y-0">
          {iconsData.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center px-4 md:px-12 py-12 md:py-8 ${index === 1 ? 'md:border-x border-gray-300' : ''
                }`}
            >
              <h3 className="text-3xl font-serif text-gray-900 mb-5 relative pb-5">
                {item.title}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rounded-full"></span>
              </h3>
              <p className="text-gray-500 text-[15px] leading-8 font-light tracking-wide max-w-[280px] mx-auto">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
