import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, ShoppingBag, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartQty, isCartOpen, closeCart, appliedCoupon, setAppliedCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shipping = subtotal >= 2500 ? 0 : (subtotal > 0 ? 100 : 0);
  
  const discount = appliedCoupon 
    ? (appliedCoupon.discountType === 'percentage' 
        ? (subtotal * appliedCoupon.discount) / 100 
        : appliedCoupon.discount)
    : 0;

  const total = subtotal + shipping - discount;

  const handleQtyChange = (id, currentQty, delta) => {
    updateCartQty(id, currentQty + delta);
  };

  const handleApplyCoupon = async () => {
    try {
      if (!couponCode) return setCouponError('Enter code');
      setIsApplying(true);
      setCouponError('');
      const { data } = await import('../services/api').then(api => api.validateCoupon({ code: couponCode.toUpperCase().trim() }));
      setAppliedCoupon(data);
      setCouponCode('');
      setShowCouponInput(false);
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid Coupon');
    } finally {
      setIsApplying(false);
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[450px] bg-white z-[101] shadow-2xl flex flex-col font-arial"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-8 border-b border-gray-100">
              <h2 className="text-2xl font-serif italic text-gray-900">My Cart</h2>
              <button 
                onClick={closeCart}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors border border-transparent hover:border-gray-200 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <ShoppingBag size={48} className="mb-4 text-gray-300" />
                  <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {cartItems.map((item) => (
                    <div key={item.product} className="flex gap-6 items-start">
                      {/* Image */}
                      <div className="w-20 h-24 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.product)}
                            className="text-gray-300 hover:text-gray-900 transition-colors p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-gray-500 mt-2">₹{item.price.toFixed(2)}</p>

                        {/* Qty Selector */}
                        <div className="mt-4 inline-flex items-center border border-gray-200 rounded-sm">
                          <button 
                            onClick={() => handleQtyChange(item.product, item.qty, -1)}
                            className="p-1 px-3 text-gray-400 hover:text-gray-900 transition-colors border-r border-gray-100"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-4 text-xs font-bold text-gray-900">{item.qty}</span>
                          <button 
                            onClick={() => handleQtyChange(item.product, item.qty, 1)}
                            className="p-1 px-3 text-gray-400 hover:text-gray-900 transition-colors border-l border-gray-100"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                
                {/* Coupon Toggle Section */}
                <div className="mb-8">
                   {!appliedCoupon ? (
                     <div className="flex flex-col items-center">
                        <button 
                          onClick={() => setShowCouponInput(!showCouponInput)}
                          className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                           <Ticket size={20} />
                           <span className="text-[11px] font-bold uppercase tracking-widest">Apply Coupon</span>
                        </button>
                        
                        {showCouponInput && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }}
                            className="w-full flex gap-2 mt-4"
                          >
                            <input 
                              type="text" 
                              placeholder="CODE"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              className="flex-1 border border-gray-200 p-3 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-gray-900"
                            />
                            <button 
                              onClick={handleApplyCoupon}
                              disabled={isApplying}
                              className="bg-gray-900 text-white px-6 text-[11px] font-bold uppercase tracking-widest hover:bg-theme-rust transition-all"
                            >
                              {isApplying ? '...' : 'Apply'}
                            </button>
                          </motion.div>
                        )}
                        {couponError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-2">{couponError}</p>}
                     </div>
                   ) : (
                     <div className="flex justify-between items-center bg-gray-50 p-4 rounded-sm border border-dashed border-gray-200">
                        <div className="flex items-center gap-3">
                           <Ticket size={16} className="text-green-600" />
                           <div>
                             <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">{appliedCoupon.code} ACTIVE</p>
                             <p className="text-[9px] text-green-600 font-bold uppercase">Saved ₹{discount.toFixed(0)}</p>
                           </div>
                        </div>
                        <button onClick={() => setAppliedCoupon(null)} className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase transition-colors">
                           Remove
                        </button>
                     </div>
                   )}
                </div>

                {/* Totals */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                  </div>

                  {discount > 0 && (
                     <div className="flex justify-between items-center text-sm font-bold text-green-600 uppercase tracking-widest">
                        <span>Discount</span>
                        <span>-₹{discount.toFixed(2)}</span>
                     </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-base font-bold text-gray-900 uppercase">Total</span>
                    <span className="text-xl font-bold text-gray-900">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button Only */}
                <div className="space-y-3">
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-[#1c1c1c] text-white py-5 text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-gray-200 hover:bg-theme-rust transition-all active:scale-[0.98]"
                  >
                    Proceed to Checkout
                  </button>
                  <button 
                    onClick={closeCart}
                    className="w-full bg-white text-gray-900 border border-gray-900 py-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
