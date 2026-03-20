import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MustHaveSection = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await fetchProducts();
        setProducts(data.slice(0, 6)); // Display up to 6 products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    getProducts();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 2 >= products.length ? 0 : prevIndex + 2
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 2 < 0 ? Math.max(0, products.length - 2) : prevIndex - 2
    );
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + 2);

  return (
    <section className="w-full flex flex-col lg:flex-row min-h-[600px] overflow-hidden">
      
      {/* Left Area - Image Placeholder */}
      <div 
        className="w-full lg:w-1/2 bg-black relative min-h-[400px] lg:min-h-full flex items-end bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/2151101603.webp')" }}
      >
        
        {/* The Text "UNIQUE DESIGNS" */}
        <div className="relative z-10 p-10 md:p-16 w-full">
          <h2 className="text-white text-5xl md:text-7xl lg:text-8xl font-serif font-bold uppercase leading-[0.85] tracking-tight drop-shadow-lg">
            UNIQUE<br />DESIGNS
          </h2>
        </div>
      </div>

      {/* Right Area - Must Have Content */}
      <div className="w-full lg:w-1/2 bg-[#aa6943] relative min-h-[400px] lg:min-h-full p-10 md:p-16 lg:p-24 flex flex-col justify-center overflow-hidden">
        
        {/* Clean background without wave for premium feel */}

        <div className="relative z-10 w-full max-w-xl mx-auto">
          <h3 className="text-white text-4xl md:text-5xl lg:text-5xl font-serif mb-6 drop-shadow-sm">
            Must Have
          </h3>
          <p className="text-white/90 text-sm md:text-sm font-light leading-relaxed mb-12 max-w-md drop-shadow-sm">
            Handpicked crystals and sacred beads that bring harmony, and beauty into your life. Perfect to keep close for positivity, balance, and natural wellness.
          </p>

          <div className="relative w-full flex items-center justify-center">
            
            {/* Left Button */}
            <button 
              onClick={prevSlide}
              className="absolute -left-4 md:-left-12 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-[#aa6943] hover:bg-gray-50 shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              disabled={products.length <= 2}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Slider Track */}
            <div className="w-full overflow-hidden px-2 py-4">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
                >
                  {visibleProducts.map((product) => (
                    <Link 
                      key={product._id} 
                      to={`/product/${product.slug}`}
                      className="group flex flex-col"
                    >
                      <div className="aspect-square bg-white w-full rounded-md overflow-hidden mb-5 shadow-lg relative group">
                         {product.images?.[0] ? (
                           <img 
                            src={product.images[0]} 
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                           />
                         ) : (
                           <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">No Image</div>
                         )}
                      </div>
                      <h4 className="text-white text-[13px] md:text-sm font-semibold tracking-wide leading-snug drop-shadow-sm line-clamp-2 transition-colors group-hover:text-amber-100">
                        {product.title}
                      </h4>
                      <p className="text-white/90 text-[13px] md:text-sm mt-2 font-medium">
                        ₹{product.price.toFixed(2)}
                      </p>
                    </Link>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Button */}
            <button 
              onClick={nextSlide}
              className="absolute -right-4 md:-right-12 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-[#aa6943] hover:bg-gray-50 shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              disabled={products.length <= 2}
            >
              <ChevronRight size={20} />
            </button>
            
          </div>
        </div>

      </div>

    </section>
  );
};

export default MustHaveSection;
