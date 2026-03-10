import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ name, price, discountPrice, image, hoverImage, category, stoneType }) => {
  return (
    <div className="product-card group bg-white">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/5] bg-[#f9f9f9]">
        {/* Main Image */}
        <Link to={`/product/${name.toLowerCase().replace(/ /g, '-')}`}>
          <img 
            src={image} 
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${hoverImage ? 'group-hover:opacity-0' : ''}`}
          />
          {/* Hover Image */}
          {hoverImage && (
            <img 
              src={hoverImage} 
              alt={`${name} secondary`}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
            />
          )}
        </Link>

        {/* Action Buttons overlay */}
        <div className="absolute right-4 top-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button className="bg-white p-2.5 rounded-full shadow-md text-gray-700 hover:bg-[#222] hover:text-white transition-all transform hover:scale-110">
            <Heart size={18} />
          </button>
          <button className="bg-white p-2.5 rounded-full shadow-md text-gray-700 hover:bg-[#222] hover:text-white transition-all transform hover:scale-110">
            <Eye size={18} />
          </button>
        </div>

        {/* Quick Add To Cart */}
        <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <button className="w-full bg-[#222] text-white py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#91c9bb] transition-colors flex items-center justify-center gap-2">
            <ShoppingCart size={14} /> Add to Cart
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="pt-6 pb-2 text-center">
        {category && (
          <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">{category}</span>
        )}
        <h3 className="text-sm md:text-base text-gray-900 font-medium mb-2 group-hover:text-[#91c9bb] transition-colors line-clamp-1 px-4">
          <Link to={`/product/${name.toLowerCase().replace(/ /g, '-')}`}>{name}</Link>
        </h3>
        <div className="flex items-center justify-center gap-3">
          {discountPrice ? (
            <>
              <span className="text-sm md:text-base font-semibold text-red-600">₹{discountPrice}</span>
              <span className="text-xs md:text-sm text-gray-400 line-through">₹{price}</span>
            </>
          ) : (
            <span className="text-sm md:text-base font-semibold text-gray-900">₹{price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
