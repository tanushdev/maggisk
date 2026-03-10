import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative w-full bg-[#0a0a0a] overflow-hidden mt-12">
      {/* Background Image with blur and zoom-to-top effect */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-top bg-no-repeat scale-125 blur-md"
        style={{ backgroundImage: "url('/images/42324-1.webp')" }}
      ></div>

      {/* Optional dark overlay to ensure text readability over background image */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

      <div className="relative z-10 w-full">
        {/* Main Footer Content */}
        <div className="container mx-auto px-8 md:px-16 lg:px-24 py-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-16 md:gap-8">

          {/* Left Area - Logo & Socials */}
          <div className="flex flex-col items-start md:items-center lg:items-start gap-8">
            <Link to="/">
              <div className="w-40 md:w-48 overflow-hidden rounded-sm bg-white">
                <img
                  src="https://maggikstones.com/wp-content/uploads/2022/12/Artboard-2-e1764250088421.jpg"
                  alt="MaggikStones Logo"
                  className="w-full h-auto object-cover"
                />
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors">
                <Facebook size={16} fill="currentColor" stroke="none" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors">
                <Twitter size={16} fill="currentColor" stroke="none" />
              </a>
              <a href="https://www.instagram.com/maggikstones/" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors">
                <Instagram size={16} strokeWidth={2} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors">
                <Linkedin size={16} fill="currentColor" stroke="none" />
              </a>
            </div>
          </div>

          {/* Nav Links Grid */}
          <div className="flex flex-col md:flex-row gap-16 md:gap-32 w-full md:w-auto md:mr-auto lg:mr-32 ml-0 lg:ml-20">
            {/* Middle Column */}
            <div className="flex flex-col gap-6">
              <Link to="/" className="text-white text-[16px] font-serif hover:text-gray-300 transition-colors tracking-wide">Home</Link>
              <Link to="/about" className="text-white text-[16px] font-serif hover:text-gray-300 transition-colors tracking-wide">About</Link>
              <Link to="/cart" className="text-white text-[16px] font-serif hover:text-gray-300 transition-colors tracking-wide">Cart</Link>
              <Link to="/checkout" className="text-white text-[16px] font-serif hover:text-gray-300 transition-colors tracking-wide">Checkout</Link>
              <Link to="/contact" className="text-white text-[16px] font-serif hover:text-gray-300 transition-colors tracking-wide">Contact</Link>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              <Link to="/privacy-policy" className="text-white text-[16px] font-serif hover:text-gray-300 transition-colors tracking-wide">Privacy Policy</Link>
              <Link to="/terms" className="text-white text-[16px] font-serif hover:text-gray-300 transition-colors tracking-wide">Terms & Conditions</Link>
              <Link to="/cancellation" className="text-white text-[16px] font-serif hover:text-gray-300 transition-colors tracking-wide">Cancellation & Return Policy</Link>
              <Link to="/shipping" className="text-white text-[16px] font-serif hover:text-gray-300 transition-colors tracking-wide">Shipping & Delivery Policy</Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="w-full bg-[#0a0a0a]/90 py-5 text-center border-t border-white/5">
          <p className="text-white text-[11px] font-medium tracking-[0.05em]">
            COPYRIGHT 2026 © MAGGIKSTONES. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
