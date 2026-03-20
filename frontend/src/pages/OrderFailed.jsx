import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, RefreshCw, MessageSquare } from 'lucide-react';

const OrderFailed = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const errorMessage = queryParams.get('message') || "We couldn't process your payment. Don't worry, your items are still safe in your cart, and your order has been saved as pending.";
  const errorCode = queryParams.get('code');

  return (
    <div className="bg-[#fafafa] min-h-screen py-32 flex items-center justify-center font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <div className="bg-white p-12 md:p-16 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center">
          
          {/* Animated Icon Container */}
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-8 border border-rose-100 shadow-sm animate-pulse">
             <AlertCircle size={32} strokeWidth={2} />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Transaction Failed</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-10">
            Order Ref: #{id?.slice(-8).toUpperCase()}
          </p>
          
          <div className="max-w-md mx-auto space-y-6 mb-12">
             <p className="text-sm text-gray-500 font-bold leading-relaxed">
                {errorMessage}
             </p>
             <div className="inline-flex items-center gap-3 py-3 px-5 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-900">
                  {errorCode ? `Status: ${errorCode}` : 'Declined by Bank'}
                </span>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Link to={`/order-details/${id}`} className="flex-1 bg-gray-900 text-white py-4 px-6 text-[11px] font-bold uppercase tracking-widest hover:bg-theme-rust transition-all flex items-center justify-center gap-3 rounded-lg shadow-lg active:scale-95">
              <RefreshCw size={14} /> Retry Payment
            </Link>
            <Link to="/contact" className="flex-1 bg-white border border-gray-200 text-gray-900 py-4 px-6 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-3 rounded-lg active:scale-95">
              <MessageSquare size={14} /> Support
            </Link>
          </div>
          
          <Link to="/" className="mt-10 group text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-all flex items-center gap-2">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Sanctuary
          </Link>
        </div>
        
        <p className="mt-8 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
          Secured by PhonePe Corporate Gateway
        </p>
      </div>
    </div>
  );
};

export default OrderFailed;
