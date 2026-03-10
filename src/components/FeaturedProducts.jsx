import React from 'react';
import ProductCard from './ProductCard';

const featuredProducts = [
  {
    name: 'Amethyst with Clear Quartz Geode',
    price: 3600,
    discountPrice: 2800,
    image: '/wp-content/uploads/2026/02/Geode-Amethys-with-Clear-Quartz-450-gm-600x720.jpeg',
    hoverImage: '/wp-content/uploads/2026/02/Geode-Amethys-with-Clear-Quartz-550-gm-600x720.jpeg',
    category: 'Geode Caves',
    stoneType: 'Amethyst'
  },
  {
    name: 'Rose Quartz Maggik Gift Box',
    price: 1350,
    image: '/wp-content/uploads/2026/02/Maggik-Box-Rose-Quartz-3-600x720.jpeg',
    category: 'Gift Box',
    stoneType: 'Rose Quartz'
  },
  {
    name: 'Wealth Maggik Gift Box',
    price: 1530,
    image: '/wp-content/uploads/2026/02/Maggik-Box-Pyriteselenite-1-600x720.jpeg',
    category: 'Gift Box',
    stoneType: 'Pyrite & Citrine'
  },
  {
    name: 'Amethyst Maggik Gift Box',
    price: 1530,
    image: '/wp-content/uploads/2026/02/Maggik-Box-Amethyst-2-600x720.jpeg',
    category: 'Gift Box',
    stoneType: 'Amethyst'
  },
  {
    name: 'Pyrite Ganesha Idol',
    price: 360,
    image: '/assets/Ganesha-Pyrite-1.jpg',
    category: 'Home Decor',
    stoneType: 'Pyrite'
  },
  {
    name: 'Howlite Crystal Heart',
    price: 405,
    image: '/assets/Heart-Howlite-1-600x531.jpg',
    category: 'Hearts',
    stoneType: 'Howlite'
  },
  {
    name: 'Seven Chakra Mini Tree',
    price: 850,
    image: '/assets/chakra-tree.jpg',
    category: 'Home Decor',
    stoneType: 'Mixed Stones'
  },
  {
    name: 'Clear Quartz Point',
    price: 550,
    image: '/assets/clear-quartz.jpg',
    category: 'Points',
    stoneType: 'Clear Quartz'
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 md:py-32 bg-[#fafafa]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="text-[#91c9bb] text-sm uppercase tracking-[0.3em] font-medium mb-4 block">Handpicked for you</span>
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-6">Featured Crystals</h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Discover our most loved pieces, carefully selected for their energy and natural beauty.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
          {featuredProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <button className="bg-transparent border border-[#222] text-black px-12 py-4 uppercase tracking-widest text-xs md:text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
