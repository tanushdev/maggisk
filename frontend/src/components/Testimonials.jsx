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
  }
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  return (
    <section className="bg-white overflow-hidden py-16 md:py-24">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900">Testimonials</h2>
        </div>

        <div className="relative max-w-5xl mx-auto flex items-center justify-center">
          
          <button 
            onClick={prev}
            className="hidden md:flex absolute -left-12 lg:-left-16 p-2 text-gray-200 hover:text-gray-400 transition-colors z-10"
          >
            <ChevronLeft size={40} strokeWidth={1} />
          </button>

          <div className="bg-[#795a34] w-full px-8 py-16 md:px-20 md:py-24 text-center rounded-sm shadow-sm relative mx-8 md:mx-0">
            {/* Mobile Nav if needed inside for smaller screens */}
            <button 
              onClick={prev}
              className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={next}
              className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
            >
              <ChevronRight size={24} />
            </button>

            <p className="text-white text-lg md:text-xl font-sans italic font-light leading-relaxed mb-8 md:mb-10 w-full max-w-3xl mx-auto">
              {testimonials[current].text}
            </p>
            
            <h4 className="text-white text-2xl md:text-3xl font-serif">
              {testimonials[current].name}
            </h4>
          </div>

          <button 
            onClick={next}
            className="hidden md:flex absolute -right-12 lg:-right-16 p-2 text-gray-200 hover:text-gray-400 transition-colors z-10"
          >
            <ChevronRight size={40} strokeWidth={1} />
          </button>

        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
           {testimonials.map((_, idx) => (
             <button
               key={idx}
               onClick={() => setCurrent(idx)}
               className={`w-2 h-2 rounded-full transition-all duration-300 ${
                 idx === current ? 'bg-black' : 'bg-gray-300 hover:bg-gray-400'
               }`}
               aria-label={`Go to slide ${idx + 1}`}
             />
           ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
