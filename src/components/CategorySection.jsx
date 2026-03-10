import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Crystal Clusters',
    image: '/assets/category-1.jpg',
    count: '12 Products',
    slug: 'crystal-clusters'
  },
  {
    name: 'Healing Wands',
    image: '/assets/category-2.jpg',
    count: '08 Products',
    slug: 'healing-wands'
  },
  {
    name: 'Sacred Spheres',
    image: '/assets/category-3.jpg',
    count: '15 Products',
    slug: 'sacred-spheres'
  },
  {
    name: 'Premium Gift Boxes',
    image: '/assets/category-4.jpg',
    count: '06 Products',
    slug: 'gift-boxes'
  }
];

const CategorySection = () => {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16">
          <div className="max-w-xl">
            <span className="text-[#91c9bb] text-sm uppercase tracking-[0.3em] font-medium mb-4 block">Our Collections</span>
            <h2 className="text-3xl md:text-5xl font-serif text-gray-900 leading-tight">Shop by Category</h2>
          </div>
          <Link to="/shop" className="text-xs uppercase tracking-widest font-semibold border-b border-black pb-1 hover:text-[#91c9bb] hover:border-[#91c9bb] transition-all mt-6 md:mt-0">
            View All Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((cat, index) => (
            <Link 
              to={`/category/${cat.slug}`} 
              key={index}
              className="group relative overflow-hidden aspect-[4/5] bg-gray-50"
            >
              <img 
                src={cat.image} 
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 transition-transform duration-500 transform group-hover:-translate-y-2">
                <span className="text-white/70 text-[10px] uppercase tracking-widest mb-1 block">
                  {cat.count}
                </span>
                <h3 className="text-white text-xl md:text-2xl font-serif mb-4">
                  {cat.name}
                </h3>
                <div className="w-8 h-0.5 bg-white transition-all duration-500 group-hover:w-full"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
