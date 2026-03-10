import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight, ShoppingBag, ChevronRight, ShieldCheck } from 'lucide-react';


const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useCart();


  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const freeShippingThreshold = 2500;
  const shippingLeft = freeShippingThreshold - subtotal;

  return (
    <div className="bg-theme-cream min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-4 italic">Sacred Bag</h1>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-gray-400 uppercase font-bold">
            <Link to="/" className="hover:text-theme-rust">Boutique</Link>
            <ChevronRight size={10} />
            <span className="text-gray-900">Your Selection</span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-sm shadow-sm max-w-2xl mx-auto border border-gray-50">
            <div className="flex justify-center mb-8">
               <ShoppingBag size={64} className="text-gray-200" />
            </div>
            <p className="text-xl md:text-2xl font-serif text-gray-900 mb-8 italic">Your bag is currently empty of earth's treasures.</p>
            <Link to="/" className="inline-block bg-gray-900 text-white px-12 py-4 uppercase tracking-widest text-xs font-bold hover:bg-theme-rust transition-all">
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              {subtotal < freeShippingThreshold && (
                <div className="bg-theme-rust/5 border border-theme-rust/20 p-4 rounded-sm mb-8 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-theme-rust font-bold">
                    Add ₹{shippingLeft.toFixed(0)} more to your bag for free insured shipping.
                  </p>
                </div>
              )}

              {cartItems.map((item) => (
                <div key={item.product} className="bg-white p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center border border-gray-50 transition-all hover:shadow-md rounded-sm">
                  <div className="w-32 h-40 bg-gray-50 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-theme-rust font-bold mb-2 block">{item.category}</span>
                    <h3 className="text-xl font-serif text-gray-900 mb-4 italic leading-tight">
                      <Link to={`/product/${item.slug || ''}`}>{item.name}</Link>
                    </h3>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-gray-500 text-sm">
                       <span>Qty: {item.qty}</span>
                       <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                       <span className="font-sans font-medium text-gray-900">₹{item.price}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:items-end gap-6 h-full justify-between">
                    <button 
                      onClick={() => removeFromCart(item.product)} 
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      title="Remove from bag"
                    >
                      <Trash2 size={20} />
                    </button>
                    <span className="font-sans font-bold text-lg">₹{(item.qty * item.price).toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-8">
              <div className="bg-white p-10 border border-gray-50 shadow-sm rounded-sm">
                <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-900 mb-10 pb-4 border-b border-gray-50">Order Summary</h3>
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span className="font-light tracking-wide">Subtotal</span>
                    <span className="font-sans text-gray-900">₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span className="font-light tracking-wide">Shipping</span>
                    <span className="text-theme-rust text-[10px] tracking-widest font-bold uppercase">
                      {subtotal >= freeShippingThreshold ? 'Free Insured' : 'Calculated at checkout'}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-50 pt-8 flex justify-between items-center mb-10">
                  <span className="text-xs uppercase tracking-widest font-bold text-gray-900">Estimated Total</span>
                  <span className="text-2xl font-sans font-bold text-gray-900">₹{subtotal.toFixed(0)}</span>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-gray-900 text-white py-5 px-6 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-theme-rust transition-all flex items-center justify-center gap-3"
                >
                  Proceed to Secure Checkout <ArrowRight size={14} />
                </button>

              </div>

              <div className="bg-white p-8 border border-gray-50 rounded-sm">
                 <div className="flex items-center gap-4 text-gray-500">
                    <ShieldCheck size={20} className="text-theme-rust" />
                    <div>
                       <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-900">Secure Payments</h4>
                       <p className="text-[9px] uppercase tracking-tighter mt-1">SSL Encrypted Transaction</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
