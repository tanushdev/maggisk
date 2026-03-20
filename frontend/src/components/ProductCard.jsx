import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ _id, name, slug, price, discountPrice, image, hoverImage, category, countInStock }) => {
  const { addToCart } = useCart();
  const productSlug = slug || name?.toLowerCase().replace(/ /g, '-');

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Construct a minimal product object that addToCart expects
    const productObj = {
      _id,
      title: name,
      price,
      sale_price: discountPrice,
      images: [image],
      slug: productSlug,
      categories: [category],
      countInStock: countInStock || 10
    };
    
    addToCart(productObj, 1);
  };

  return (
    <div className="group bg-white font-arial">
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-50 border border-gray-100/50 rounded-sm">
        {/* Badges */}
        {discountPrice > 0 && discountPrice < price && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-gray-900 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-sm">
              Sale
            </span>
          </div>
        )}

        <Link to={`/product/${productSlug}`} className="block w-full h-full">
          <img 
            src={image || '/images/sample.jpg'} 
            alt={name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 ${hoverImage ? 'group-hover:opacity-0' : ''}`}
          />
          {hoverImage && (
            <img 
              src={hoverImage} 
              alt={`${name} secondary`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-110"
            />
          )}
        </Link>

        {/* Action Icons - Modern Sidebar */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-75">
          <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-gray-900 hover:bg-gray-900 hover:text-white transition-all transform hover:scale-110">
            <Heart size={16} />
          </button>
          <Link to={`/product/${productSlug}`} className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-gray-900 hover:bg-gray-900 hover:text-white transition-all transform hover:scale-110">
            <Eye size={16} />
          </Link>
        </div>

        {/* Quick Add - Reveal from bottom */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <button 
            onClick={handleQuickAdd}
            className="w-full bg-white/90 backdrop-blur-md text-gray-900 py-4 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl border border-gray-100"
          >
            <ShoppingCart size={13} /> Add to Bag
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="pt-8 pb-4 text-center">
        {category && (
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-3 block font-bold">{category}</span>
        )}
        <h3 className="text-sm text-gray-900 font-bold mb-3 group-hover:text-gray-600 transition-colors line-clamp-1 px-4 tracking-tight">
          <Link to={`/product/${productSlug}`}>{name}</Link>
        </h3>
        <div className="flex items-center justify-center gap-3">
          {discountPrice > 0 && discountPrice < price ? (
            <>
              <span className="text-base font-bold text-gray-900">₹{discountPrice}</span>
              <span className="text-xs text-gray-400 line-through font-bold">₹{price}</span>
            </>
          ) : (
            <span className="text-base font-bold text-gray-900">₹{price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
