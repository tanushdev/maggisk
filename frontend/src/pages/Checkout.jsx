import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, initiatePhonePe, validateCoupon } from '../services/api';

import { ChevronRight, ShieldCheck, Lock, CreditCard, Wallet } from 'lucide-react';

const Checkout = () => {
  const { cartItems, updateCartQty, removeFromCart, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    firstName: userInfo?.name?.split(' ')[0] || '',
    lastName: userInfo?.name?.split(' ')[1] || '',
    address: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    country: 'India',
    phone: '',
    email: userInfo?.email || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shippingPrice = subtotal >= 2500 ? 0 : 100;
  
  const discount = appliedCoupon 
    ? (appliedCoupon.discountType === 'percentage' 
        ? (subtotal * appliedCoupon.discount) / 100 
        : appliedCoupon.discount)
    : 0;

  const totalPrice = subtotal + shippingPrice - discount;

  const handleApplyCoupon = async () => {
    try {
      if (!couponCode) return setCouponError('Please enter a code');
      setCouponError('');
      const { data } = await validateCoupon({ code: couponCode.toUpperCase().trim() });
      setAppliedCoupon(data);
      alert('Coupon Applied Successfully!');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid Coupon');
      setAppliedCoupon(null);
    }
  };



  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    if (!userInfo) {
       navigate('/login?redirect=checkout');
    }
  }, [cartItems, navigate, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product
        })),
        shippingAddress: {
           address: shippingAddress.address,
           city: shippingAddress.city,
           postalCode: shippingAddress.postalCode,
           country: shippingAddress.country
        },
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice,
        taxPrice: 0,
        totalPrice,
        couponCode: appliedCoupon ? appliedCoupon.code : null
      };


      const { data: createdOrder } = await createOrder(orderData);

      if (paymentMethod === 'PhonePe') {
          const { data: phonePeData } = await initiatePhonePe({ orderId: createdOrder._id });
          
          if (phonePeData.success) {
               // Usually for the sandbox we'd need to submit a form. 
               // For now, let's assume we can redirect or show the payload.
               // Direct redirect if URL provided (Simulating it)
               window.location.href = phonePeData.url;
          } else {
               alert('Payment initiation failed');
          }
      } else {
          // COD or Success
          clearCart();
          navigate(`/order/${createdOrder._id}/success`);
      }

    } catch (err) {
      console.error('Order/Payment Error:', err);
      alert(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-theme-cream min-h-screen py-20 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
           <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-4 lowercase tracking-tighter">checkout</h1>
           <div className="flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] text-gray-400 uppercase font-bold">
              <Link to="/cart" className="hover:text-theme-rust">bag</Link>
              <ChevronRight size={10} />
              <span className="text-gray-900">manifestation details</span>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Billing Details */}
          <div className="lg:col-span-7 space-y-12">
            <div className="bg-white p-8 md:p-12 rounded-sm border border-gray-50 shadow-sm">
                <h3 className="text-xl font-serif text-gray-900 mb-10 italic border-b border-gray-50 pb-4">Billing details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                   <div>
                      <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">First name *</label>
                      <input 
                        required 
                        value={shippingAddress.firstName}
                        onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                        className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm" 
                      />
                   </div>
                   <div>
                      <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Last name *</label>
                      <input 
                        required 
                        value={shippingAddress.lastName}
                        onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                        className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm" 
                      />
                   </div>
                </div>

                <div className="mb-8">
                   <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Country / Region *</label>
                   <select 
                     required
                     value={shippingAddress.country}
                     onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                     className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm font-bold uppercase tracking-wider"
                   >
                     <option>India</option>
                   </select>
                </div>

                <div className="mb-8">
                   <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Street address *</label>
                   <input 
                     required 
                     placeholder="House number and street name"
                     value={shippingAddress.address}
                     onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                     className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm mb-4" 
                   />
                   <input 
                     placeholder="Apartment, suite, unit, etc. (optional)"
                     className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm" 
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                   <div>
                      <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Town / City *</label>
                      <input 
                        required 
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm" 
                      />
                   </div>
                   <div>
                      <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">State *</label>
                      <select 
                        required
                        value={shippingAddress.state}
                        onHide={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm font-bold uppercase tracking-wider"
                      >
                        <option>Maharashtra</option>
                        <option>Delhi</option>
                        <option>Karnataka</option>
                        <option>Tamil Nadu</option>
                        <option>Gujarat</option>
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">PIN Code *</label>
                      <input 
                        required 
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                        className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm" 
                      />
                   </div>
                   <div>
                      <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Phone (optional)</label>
                      <input 
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm" 
                      />
                   </div>
                </div>
            </div>
          </div>

          {/* Order Sidebar */}
          <div className="lg:col-span-5 space-y-12">
            <div className="bg-white p-8 md:p-12 rounded-sm border-2 border-theme-rust/10 shadow-sm h-full">
               <h3 className="text-xl font-serif text-gray-900 mb-10 italic pb-4 border-b border-gray-50">Your order</h3>
               
               <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-gray-400 border-b border-gray-50 pb-4">
                     <span>Product</span>
                     <span>Subtotal</span>
                  </div>
                  {cartItems.map((item) => (
                    <div key={item.product} className="flex flex-col gap-3 pb-6 border-b border-gray-50/50 last:border-0 last:pb-0">
                       <div className="flex justify-between items-start gap-4">
                          <span className="text-[11px] text-gray-900 font-bold uppercase tracking-wider leading-relaxed flex-1">
                             {item.name}
                          </span>
                          <span className="text-sm font-bold text-gray-900">₹{(item.qty * item.price).toFixed(0)}</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center border border-gray-100 h-8 bg-theme-cream/30 scale-90 -ml-2">
                             <button type="button" onClick={() => updateCartQty(item.product, item.qty - 1)} className="px-3 h-full hover:bg-white transition-colors">-</button>
                             <span className="w-10 text-center text-xs font-bold">{item.qty}</span>
                             <button type="button" onClick={() => updateCartQty(item.product, item.qty + 1)} className="px-3 h-full hover:bg-white transition-colors">+</button>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeFromCart(item.product)}
                            className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-red-500 font-bold transition-colors"
                          >
                             Remove
                          </button>
                       </div>
                    </div>
                  ))}
               </div>

                <div className="pt-6 border-t border-gray-50 mb-10">
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 bg-theme-cream border-none p-3 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-xs uppercase tracking-widest font-bold"

                      />
                      <button 
                        type="button"
                        onClick={handleApplyCoupon}
                        className="bg-gray-900 text-white px-6 py-3 uppercase tracking-widest text-[10px] font-bold hover:bg-theme-rust transition-all"
                      >
                         Apply
                      </button>
                   </div>
                   {couponError && <p className="text-[10px] text-red-500 mt-2 uppercase tracking-widest font-bold">{couponError}</p>}
                   {appliedCoupon && (
                     <p className="text-[10px] text-green-600 mt-2 uppercase tracking-widest font-bold flex items-center gap-2">
                        <ShieldCheck size={12} /> Coupon Applied: {appliedCoupon.code}
                     </p>
                   )}
                </div>

                <div className="space-y-4 mb-10 pt-6 border-t border-gray-50">
                   <div className="flex justify-between text-sm">
                      <span className="font-light text-gray-500 uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                      <span className="font-bold text-gray-900">₹{subtotal.toFixed(0)}</span>
                   </div>
                   {discount > 0 && (
                     <div className="flex justify-between text-sm text-green-600">
                        <span className="uppercase tracking-widest text-[10px] font-bold">Resonance Discount</span>
                        <span className="font-bold">-₹{discount.toFixed(0)}</span>
                     </div>
                   )}
                   <div className="flex justify-between text-sm items-center">
                      <span className="font-light text-gray-500 uppercase tracking-widest text-[10px] font-bold">Shipment</span>
                      <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">
                         {shippingPrice === 0 ? 'Free Shipping' : `Flat rate: ₹${shippingPrice}`}
                      </span>
                   </div>
                   <div className="flex justify-between text-xl pt-6 border-t border-gray-50">
                      <span className="font-serif italic text-gray-900">Total</span>
                      <span className="font-bold text-gray-900">₹{totalPrice.toFixed(0)}</span>
                   </div>
                </div>


               {/* Payment Methods */}
               <div className="space-y-6 mb-12">
                  <div 
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-6 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-theme-rust bg-theme-rust/5 ring-1 ring-theme-rust' : 'border-gray-100'}`}
                  >
                     <div className="flex items-center gap-4 mb-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'COD' ? 'border-theme-rust' : 'border-gray-300'}`}>
                           {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-theme-rust"></div>}
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-900">Cash on delivery</span>
                        <Wallet size={16} className="text-gray-400 ml-auto" />
                     </div>
                     <p className="text-[10px] text-gray-500 uppercase tracking-wider ml-8">Pay with cash upon delivery.</p>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('PhonePe')}
                    className={`p-6 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'PhonePe' ? 'border-theme-rust bg-theme-rust/5 ring-1 ring-theme-rust' : 'border-gray-100'}`}
                  >
                     <div className="flex items-center gap-4 mb-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'PhonePe' ? 'border-theme-rust' : 'border-gray-300'}`}>
                           {paymentMethod === 'PhonePe' && <div className="w-2 h-2 rounded-full bg-theme-rust"></div>}
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-900">PhonePe Payment</span>
                        <CreditCard size={16} className="text-gray-400 ml-auto" />
                     </div>
                     <p className="text-[10px] text-gray-500 uppercase tracking-wider ml-8">Integrated Secure UPI via PhonePe.</p>
                  </div>
               </div>

               <p className="text-[9px] text-gray-400 leading-relaxed uppercase tracking-tighter mb-8">
                  Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <span className="underline cursor-pointer">privacy policy</span>.
               </p>

               <button 
                 type="submit"
                 disabled={loading}
                 className="w-full bg-gray-900 text-white py-6 uppercase tracking-[0.3em] text-xs font-bold hover:bg-theme-rust transition-all flex items-center justify-center gap-4 disabled:bg-gray-400"
               >
                 {loading ? (
                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 ) : (
                   <><Lock size={16} /> PLACE ORDER</>
                 )}
               </button>

               <div className="flex items-center justify-center gap-8 mt-12 opacity-30 grayscale contrast-125">
                  <ShieldCheck size={32} />
                  <span className="text-[8px] font-bold tracking-[0.4em] uppercase">Secured manifesting system</span>
               </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
