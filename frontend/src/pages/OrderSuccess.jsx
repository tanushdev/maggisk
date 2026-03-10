import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { CheckCircle, Package, ArrowRight, Sparkles } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="bg-theme-cream min-h-screen py-32 flex items-center justify-center font-sans tracking-tight">

      <div className="container mx-auto px-4 max-w-3xl text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 md:p-24 rounded-sm shadow-2xl border border-theme-rust/5 relative overflow-hidden"
        >
          {/* Success Glow Animation */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-10">
               <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                 className="w-32 h-32 bg-green-50 text-green-500 rounded-full flex items-center justify-center relative z-10 shadow-lg"
               >
                 <CheckCircle size={64} strokeWidth={1.5} />
               </motion.div>
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute inset-0 bg-green-200 rounded-full"
               ></motion.div>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-6 italic leading-none">Celestial Success</h1>
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-theme-rust mb-16 px-6 py-2 bg-theme-rust/5 rounded-full inline-block">Order ID #{id?.substring(0, 10).toUpperCase()}</p>
            
            <div className="max-w-md mx-auto space-y-8 mb-16">
               <p className="text-base text-gray-500 leading-relaxed font-light italic">
                 "Your artifacts have been recognized by the earth and are now embarking on their journey to your domain."
               </p>
               <div className="flex items-center justify-center gap-4 py-4 px-6 border-y border-gray-50 text-gray-400">
                  <Package size={20} className="text-theme-rust" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Estimated manifestation: 5-7 Solar Days</span>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
              <Link to="/" className="group bg-gray-900 text-white py-5 px-10 uppercase tracking-widest text-[10px] font-bold hover:bg-theme-rust transition-all flex items-center justify-center gap-3">
                Continue Exploring <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/admin/orders" className="bg-white border border-gray-100 text-gray-900 py-5 px-10 uppercase tracking-widest text-[10px] font-bold hover:bg-theme-cream transition-all flex items-center justify-center gap-3">
                View My History
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};


export default OrderSuccess;
