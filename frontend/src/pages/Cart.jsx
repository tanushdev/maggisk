import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight, ShoppingBag, ChevronRight, ShieldCheck, X, Minus, Plus, PenLine, Truck, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartQty, appliedCoupon, setAppliedCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shipping = subtotal >= 2500 ? 0 : 100;
  
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
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid Coupon');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-[#ffffff] min-h-screen pt-32 pb-20 font-arial">
      <div className="container mx-auto px-4 max-w-2xl">
        
        {/* Header like the image */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
           <h1 className="text-3xl font-serif text-gray-900 italic">My Cart</h1>
           <button onClick={() => navigate(-1)} className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all">
             <X size={20} />
           </button>
        </div>

        <AnimatePresence>
        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center"
          >
            <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
               <ShoppingBag size={32} />
            </div>
            <p className="text-xl font-bold text-gray-900 mb-8">Your cart is empty</p>
            <Link to="/" className="inline-block bg-gray-900 text-white px-10 py-4 uppercase tracking-widest text-[10px] font-bold hover:bg-theme-rust transition-all">
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Items List */}
            <div className="space-y-8">
              {cartItems.map((item) => (
                <motion.div 
                  key={item.product}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-6 items-start pb-8 border-b border-gray-50 relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0 border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                       <h3 className="text-sm font-bold text-gray-800 leading-snug pr-6">{item.name}</h3>
                       <button 
                         onClick={() => removeFromCart(item.product)}
                         className="text-gray-400 hover:text-gray-900 transition-colors"
                       >
                         <X size={14} />
                       </button>
                    </div>
                    
                    <p className="text-sm font-bold text-gray-500 mt-1">₹{item.price.toFixed(2)}</p>

                    {/* Quantity Selector like image */}
                    <div className="mt-4 inline-flex items-center border border-gray-200 rounded-sm">
                       <button 
                         onClick={() => handleQtyChange(item.product, item.qty, -1)}
                         className="p-1.5 px-3 text-gray-400 hover:text-gray-900 transition-colors border-r border-gray-100"
                       >
                         <Minus size={12} />
                       </button>
                       <span className="px-4 text-xs font-bold text-gray-900">{item.qty}</span>
                       <button 
                         onClick={() => handleQtyChange(item.product, item.qty, 1)}
                         className="p-1.5 px-3 text-gray-400 hover:text-gray-900 transition-colors border-l border-gray-100"
                       >
                         <Plus size={12} />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Utility / Coupon Section */}
            <div className="py-8 border-b border-gray-50">
               <div className="flex flex-col items-center gap-6">
                  {!appliedCoupon ? (
                    <div className="w-full flex flex-col items-center gap-4">
                       <button 
                         onClick={() => setIsApplying(!isApplying)} 
                         className={`flex items-center gap-2 transition-all ${isApplying ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
                       >
                          <Ticket size={20} /> 
                          <span className="text-[11px] font-bold uppercase tracking-widest">Have a Coupon?</span>
                       </button>

                       {isApplying && (
                         <motion.div 
                           initial={{ opacity: 0, y: -5 }} 
                           animate={{ opacity: 1, y: 0 }}
                           className="flex w-full max-w-sm gap-2 mt-2"
                         >
                            <input 
                              type="text" 
                              placeholder="ENTER CODE"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              className="flex-1 bg-white border border-gray-200 p-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-gray-900 transition-all rounded-sm"
                            />
                            <button 
                              onClick={handleApplyCoupon}
                              className="bg-gray-900 text-white px-8 text-[11px] font-bold uppercase tracking-widest hover:bg-theme-rust transition-all rounded-sm"
                            >
                              Apply
                            </button>
                         </motion.div>
                       )}
                       {couponError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{couponError}</p>}
                    </div>
                  ) : (
                    <div className="flex justify-between items-center w-full bg-gray-50 p-6 rounded-sm border border-dashed border-gray-200">
                       <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
                              <Ticket size={18} />
                           </div>
                           <div>
                             <p className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em]">{appliedCoupon.code} ACTIVE</p>
                             <p className="text-[10px] text-green-600 font-bold uppercase">Estimated Savings: ₹{discount.toFixed(0)}</p>
                           </div>
                       </div>
                       <button 
                         onClick={() => setAppliedCoupon(null)}
                         className="text-[10px] font-bold text-gray-400 hover:text-rose-500 uppercase tracking-widest transition-colors border-b border-transparent hover:border-rose-100 pb-1"
                       >
                         Remove
                       </button>
                    </div>
                  )}
               </div>
            </div>

            {/* Totals */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                 <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                 <span className="text-sm font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                 <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Shipping</span>
                 <span className="text-sm font-bold text-gray-900 uppercase">
                    {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                 </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                   <span className="text-[11px] font-bold uppercase tracking-widest">Discount</span>
                   <span className="text-sm font-bold">-₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                 <span className="text-base font-bold text-gray-900 uppercase tracking-wider">Total</span>
                 <span className="text-xl font-bold text-gray-900">₹{total.toFixed(2)}</span>
              </div>

              {/* Buttons from image */}
              <div className="space-y-3 pt-6">
                 <button 
                   onClick={() => navigate('/checkout')}
                   className="w-full bg-[#1c1c1c] text-white py-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-theme-rust transition-all"
                 >
                   Proceed to Checkout
                 </button>
                 <button 
                   onClick={() => navigate('/')}
                   className="w-full bg-white text-gray-900 border border-gray-900 py-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
                 >
                   Continue Shopping
                 </button>
              </div>
            </div>
          </div>
        )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Cart;
