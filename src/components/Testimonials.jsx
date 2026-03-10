import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Anjali Mehta',
    text: 'I ordered a Rose Quartz healing stone from Maggikstones and the quality truly exceeded my expectations. The packaging was premium and delivery was on time. Highly recommended!',
    rating: 5
  },
  {
    name: 'Rahul Sharma',
    text: 'My experience with Maggikstones was amazing. The crystals feel authentic and bring a very positive energy at home. The collection is unique and beautiful.',
    rating: 5
  },
  {
    name: 'Priya Nair',
    text: 'I purchased an Amethyst crystal for meditation and I’m extremely satisfied with the quality. It arrived safely packed and looks exactly like the pictures.',
    rating: 5
  },
  {
    name: 'Divya Patel',
    text: 'Maggikstones is now my go-to store for healing crystals. Trusted quality, beautiful packaging, and very helpful customer support. Simply the best!',
    rating: 4
  }
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  return (
    <section className="py-24 md:py-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-[#91c9bb] text-sm uppercase tracking-[0.3em] font-medium mb-4 block">Kind Words</span>
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900">What Our Clients Say</h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Carousel Area */}
          <div className="relative min-h-[300px] flex items-center justify-center">
            {testimonials.map((item, index) => (
              <div 
                key={index}
                className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 transform ${
                  index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < item.rating ? "#91c9bb" : "transparent"} color="#91c9bb" />
                  ))}
                </div>
                <p className="text-xl md:text-3xl font-serif text-gray-800 leading-relaxed italic mb-10 px-4 md:px-12">
                  "{item.text}"
                </p>
                <div className="flex flex-col items-center">
                  <span className="text-sm uppercase tracking-[0.2em] font-bold text-gray-900">{item.name}</span>
                  <span className="text-xs uppercase tracking-widest text-[#91c9bb] mt-1 italic">Verified Customer</span>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center mt-16 gap-8">
            <button 
              onClick={prev}
              className="p-3 border border-gray-200 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === current ? 'bg-[#91c9bb] w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            <button 
              onClick={next}
              className="p-3 border border-gray-200 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
