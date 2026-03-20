import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, Package, ArrowRight, ClipboardList } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="bg-gray-50 min-h-screen py-32 flex items-center justify-center font-arial">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <div className="bg-white p-12 md:p-20 rounded-sm shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-inner">
             <CheckCircle size={48} strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed</h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-12">
            Reference ID: {id?.substring(0, 10).toUpperCase()}
          </p>
          
          <div className="max-w-md mx-auto space-y-6 mb-12">
             <p className="text-sm text-gray-500 font-bold uppercase leading-relaxed tracking-wide">
                Thank you for your order. Your artifacts are being prepared for their journey.
             </p>
             <div className="inline-flex items-center gap-2 py-3 px-6 bg-gray-50 rounded-sm border border-gray-100 text-gray-400">
                <Package size={18} className="text-gray-900" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-900">Delivery expected in 5-7 days</span>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <Link to="/" className="bg-gray-900 text-white py-4 px-8 text-xs font-bold hover:bg-theme-rust transition-all flex items-center justify-center gap-2 rounded-sm shadow-sm">
              Back to Home <ArrowRight size={14} />
            </Link>
            <Link to="/profile" className="bg-white border border-gray-200 text-gray-900 py-4 px-8 text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 rounded-sm">
              <ClipboardList size={14} /> My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
