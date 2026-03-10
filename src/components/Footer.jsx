import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col space-y-8">
            <Link to="/" className="flex flex-col">
              <span className="text-3xl font-serif tracking-widest uppercase text-gray-900">Maggik</span>
              <span className="text-xs tracking-[0.3em] uppercase text-[#91c9bb] mt-0.5">Stones</span>
            </Link>
            <p className="text-gray-500 text-sm leading-loose max-w-sm">
              Handpicked crystals and sacred beads that bring harmony, healing, and beauty into your life. Every stone is a gift from the Earth, cleansed and energized for your journey.
            </p>
            <div className="flex items-center space-x-5">
              <a href="#" className="text-gray-400 hover:text-[#91c9bb] transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#91c9bb] transition-colors"><Twitter size={20} /></a>
              <a href="https://www.instagram.com/maggikstones/" target="_blank" className="text-gray-400 hover:text-[#91c9bb] transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#91c9bb] transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-900 mb-8">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-500 hover:text-[#91c9bb] text-sm transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-gray-500 hover:text-[#91c9bb] text-sm transition-colors">Shop All</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-[#91c9bb] text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-[#91c9bb] text-sm transition-colors">Contact</Link></li>
              <li><Link to="/blog" className="text-gray-500 hover:text-[#91c9bb] text-sm transition-colors">Stone Meanings</Link></li>
            </ul>
          </div>

          {/* Policies Column */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-900 mb-8">Client Care</h4>
            <ul className="space-y-4">
              <li><Link to="/shipping" className="text-gray-500 hover:text-[#91c9bb] text-sm transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-gray-500 hover:text-[#91c9bb] text-sm transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-[#91c9bb] text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-[#91c9bb] text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/faq" className="text-gray-500 hover:text-[#91c9bb] text-sm transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-900 mb-8">Newsletter</h4>
            <p className="text-gray-500 text-sm leading-loose mb-6">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex flex-col space-y-4 scale-95 origin-left">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-[#91c9bb] transition-colors"
                required
              />
              <button className="bg-[#222] text-white py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#91c9bb] transition-colors">
                Subscribe Now
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-[10px] md:text-xs text-gray-400 uppercase tracking-widest">
          <p>© 2026 Maggikstones. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <span>Powered by XeeDesign</span>
            <div className="flex gap-4">
              {/* Payment Icons Placeholder */}
              <div className="w-8 h-5 bg-gray-100 rounded"></div>
              <div className="w-8 h-5 bg-gray-100 rounded"></div>
              <div className="w-8 h-5 bg-gray-100 rounded"></div>
              <div className="w-8 h-5 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
