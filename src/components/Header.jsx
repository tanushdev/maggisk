import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, User, Search, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-700 hover:text-black transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation - Left (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
            <Link to="/" className="text-sm uppercase tracking-widest font-medium text-gray-800 hover:text-[#91c9bb] transition-colors relative group py-2">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#91c9bb] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <div className="relative group py-2">
              <Link to="/shop" className="text-sm uppercase tracking-widest font-medium text-gray-800 hover:text-[#91c9bb] transition-colors flex items-center gap-1">
                Shop
                <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              {/* Dropdown would go here */}
            </div>
            <Link to="/collections" className="text-sm uppercase tracking-widest font-medium text-gray-800 hover:text-[#91c9bb] transition-colors relative group py-2">
              Collections
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#91c9bb] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Logo - Center */}
          <Link to="/" className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-serif tracking-widest uppercase text-gray-900 leading-none">Maggik</span>
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#91c9bb] mt-0.5">Stones</span>
          </Link>

          {/* Actions - Right */}
          <div className="flex items-center space-x-2 md:space-x-6">
            <button className="p-2 text-gray-700 hover:text-black transition-colors">
              <Search size={22} />
            </button>
            <Link to="/account" className="hidden sm:block p-2 text-gray-700 hover:text-black transition-colors">
              <User size={22} />
            </Link>
            <Link to="/wishlist" className="hidden sm:block p-2 text-gray-700 hover:text-black transition-colors relative">
              <Heart size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#91c9bb] rounded-full"></span>
            </Link>
            <Link to="/cart" className="p-2 text-gray-700 hover:text-black transition-colors relative group">
              <div className="relative">
                <ShoppingBag size={22} />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#222] text-white text-[10px] flex items-center justify-center rounded-full group-hover:bg-[#91c9bb] transition-colors">0</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl overflow-y-auto max-h-[calc(100vh-80px)] transition-all duration-300">
          <nav className="flex flex-col p-6 space-y-4">
            <Link to="/" className="text-base uppercase tracking-widest font-medium text-gray-800 py-2 border-b border-gray-50" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="text-base uppercase tracking-widest font-medium text-gray-800 py-2 border-b border-gray-50" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <Link to="/collections" className="text-base uppercase tracking-widest font-medium text-gray-800 py-2 border-b border-gray-50" onClick={() => setIsMenuOpen(false)}>Collections</Link>
            <Link to="/about" className="text-base uppercase tracking-widest font-medium text-gray-800 py-2 border-b border-gray-50" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link to="/contact" className="text-base uppercase tracking-widest font-medium text-gray-800 py-2 border-b border-gray-50" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <div className="flex items-center space-x-6 pt-4">
              <Link to="/account" className="flex items-center gap-2 text-gray-800" onClick={() => setIsMenuOpen(false)}>
                <User size={20} /> <span className="text-sm uppercase tracking-widest">Profile</span>
              </Link>
              <Link to="/wishlist" className="flex items-center gap-2 text-gray-800" onClick={() => setIsMenuOpen(false)}>
                <Heart size={20} /> <span className="text-sm uppercase tracking-widest">Wishlist</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
