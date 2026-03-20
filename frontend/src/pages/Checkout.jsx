import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, initiatePhonePe, validateCoupon } from '../services/api';
import { ChevronRight, ShieldCheck, Lock, CreditCard, Wallet, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const { cartItems, updateCartQty, removeFromCart, clearCart, appliedCoupon, setAppliedCoupon, openCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [billingAddress, setBillingAddress] = useState({
    firstName: userInfo?.name?.split(' ')[0] || '',
    lastName: userInfo?.name?.split(' ')[1] || '',
    country: 'India',
    address: '',
    apartment: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    phone: '',
    email: userInfo?.email || ''
  });

  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    country: 'India',
    address: '',
    apartment: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    phone: '',
    email: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shippingPrice = subtotal >= 2500 ? 0 : 100;
  
  const discount = appliedCoupon 
    ? (appliedCoupon.discountType === 'percentage' 
        ? (subtotal * appliedCoupon.discount) / 100 
        : appliedCoupon.discount)
    : 0;

  const totalPrice = subtotal + shippingPrice - discount;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/');
    }
    if (!userInfo) {
       navigate('/login?redirect=checkout');
    }
  }, [cartItems, navigate, userInfo]);

  const handleApplyCoupon = async () => {
    try {
      if (!couponCode) return setCouponError('Please enter a code');
      setCouponError('');
      const { data } = await validateCoupon({ code: couponCode.toUpperCase().trim() });
      setAppliedCoupon(data);
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid Coupon');
      setAppliedCoupon(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    const finalShippingAddress = shipToDifferentAddress ? shippingAddress : billingAddress;

    if (!finalShippingAddress.address || !finalShippingAddress.city || !finalShippingAddress.postalCode) {
        setErrorMessage('Please fill in all required address fields');
        return;
    }

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
           firstName: finalShippingAddress.firstName,
           lastName: finalShippingAddress.lastName,
           address: finalShippingAddress.address + (finalShippingAddress.apartment ? `, ${finalShippingAddress.apartment}` : ''),
           city: finalShippingAddress.city,
           state: finalShippingAddress.state,
           postalCode: finalShippingAddress.postalCode,
           country: finalShippingAddress.country,
           phone: finalShippingAddress.phone || billingAddress.phone,
           email: finalShippingAddress.email || billingAddress.email
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
          try {
            const { data: phonePeData } = await initiatePhonePe({ orderId: createdOrder._id });
            if (phonePeData.success && phonePeData.url) {
                clearCart();
                window.location.href = phonePeData.url;
            } else {
                setErrorMessage(phonePeData.message || 'PhonePe: Payment initiation rejected. Please try COD.');
            }
          } catch (paymentErr) {
             const errorMsg = paymentErr.response?.data?.message || paymentErr.message || 'Payment service unavailable';
             setErrorMessage(`PhonePe Error: ${errorMsg}. Your order is saved—you can pay later from your profile or try COD now.`);
          }
      } else {
          clearCart();
          navigate(`/order/${createdOrder._id}/success`);
      }

    } catch (err) {
      console.error('Order Creation Error:', err);
      setErrorMessage(err.response?.data?.message || 'Order failed. Please check your inventory or login status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 font-arial">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-10">
           <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
           <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
              <button type="button" onClick={openCart} className="hover:text-theme-rust">Cart</button>
              <ChevronRight size={12} />
              <span className="text-gray-900">Place Order</span>
           </div>
        </div>

        {errorMessage && (
            <div className="mb-8 bg-red-50 border border-red-100 p-4 rounded-sm flex items-center gap-3 text-red-600 text-xs font-bold uppercase">
                <AlertCircle size={16} />
                {errorMessage}
            </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm">
                <h3 className="text-xl font-serif text-gray-900 mb-6 pb-3 border-b border-gray-50">Billing details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                   <div>
                      <label className="text-xs font-bold text-gray-700 mb-2 block">First name *</label>
                      <input 
                        required 
                        value={billingAddress.firstName}
                        onChange={(e) => setBillingAddress({...billingAddress, firstName: e.target.value})}
                        className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm" 
                      />
                   </div>
                   <div>
                      <label className="text-xs font-bold text-gray-700 mb-2 block">Last name *</label>
                      <input 
                        required 
                        value={billingAddress.lastName}
                        onChange={(e) => setBillingAddress({...billingAddress, lastName: e.target.value})}
                        className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm" 
                      />
                   </div>
                </div>

                <div className="mb-5">
                   <label className="text-xs font-bold text-gray-700 mb-2 block">Country / Region *</label>
                   <p className="font-bold text-gray-900 border border-gray-200 bg-gray-50 p-3 rounded-sm text-sm">India</p>
                </div>

                <div className="mb-5 space-y-3">
                   <label className="text-xs font-bold text-gray-700 block">Street address *</label>
                   <input 
                     required 
                     placeholder="House number and street name"
                     value={billingAddress.address}
                     onChange={(e) => setBillingAddress({...billingAddress, address: e.target.value})}
                     className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm placeholder:text-gray-400" 
                   />
                   <input 
                     placeholder="Apartment, suite, unit, etc. (optional)"
                     value={billingAddress.apartment}
                     onChange={(e) => setBillingAddress({...billingAddress, apartment: e.target.value})}
                     className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm placeholder:text-gray-400" 
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                   <div>
                      <label className="text-xs font-bold text-gray-700 mb-2 block">Town / City *</label>
                      <input 
                        required 
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                        className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm" 
                      />
                   </div>
                   <div>
                      <label className="text-xs font-bold text-gray-700 mb-2 block">State *</label>
                      <select 
                        required
                        value={billingAddress.state}
                        onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
                        className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm"
                      >
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Telangana">Telangana</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Haryana">Haryana</option>
                      </select>
                   </div>
                </div>

                <div className="mb-5">
                   <label className="text-xs font-bold text-gray-700 mb-2 block">PIN Code *</label>
                   <input 
                     required 
                     value={billingAddress.postalCode}
                     onChange={(e) => setBillingAddress({...billingAddress, postalCode: e.target.value})}
                     className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm" 
                   />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                   <div>
                      <label className="text-xs font-bold text-gray-700 mb-2 block">Phone (optional)</label>
                      <input 
                        type="tel"
                        value={billingAddress.phone}
                        onChange={(e) => setBillingAddress({...billingAddress, phone: e.target.value})}
                        className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm" 
                      />
                   </div>
                   <div>
                      <label className="text-xs font-bold text-gray-700 mb-2 block">Email address *</label>
                      <input 
                        required
                        type="email"
                        value={billingAddress.email}
                        onChange={(e) => setBillingAddress({...billingAddress, email: e.target.value})}
                        className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm" 
                      />
                   </div>
                </div>

                {/* Shipping Toggle */}
                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-3">
                   <input 
                     type="checkbox" 
                     id="shipDifferent"
                     checked={shipToDifferentAddress}
                     onChange={(e) => setShipToDifferentAddress(e.target.checked)}
                     className="w-4 h-4 text-theme-rust ring-theme-rust border-gray-300 rounded"
                   />
                   <label htmlFor="shipDifferent" className="text-base font-serif text-gray-900 italic cursor-pointer">
                     Ship to a different address?
                   </label>
                </div>

                {/* Conditional Shipping Form */}
                {shipToDifferentAddress && (
                  <div className="mt-6 space-y-5 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div>
                          <label className="text-xs font-bold text-gray-700 mb-2 block">First name *</label>
                          <input required value={shippingAddress.firstName} onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})} className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm" />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-gray-700 mb-2 block">Last name *</label>
                          <input required value={shippingAddress.lastName} onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})} className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm" />
                       </div>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-gray-700 mb-2 block">Country / Region *</label>
                       <p className="font-bold text-gray-900 border border-gray-200 bg-gray-50 p-3 rounded-sm text-sm">India</p>
                    </div>
                    <div className="space-y-3">
                       <label className="text-xs font-bold text-gray-700 block">Street address *</label>
                       <input required placeholder="House number and street name" value={shippingAddress.address} onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})} className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm placeholder:text-gray-400" />
                       <input placeholder="Apartment, suite, unit, etc. (optional)" value={shippingAddress.apartment} onChange={(e) => setShippingAddress({...shippingAddress, apartment: e.target.value})} className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm placeholder:text-gray-400" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div>
                          <label className="text-xs font-bold text-gray-700 mb-2 block">Town / City *</label>
                          <input required value={shippingAddress.city} onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm" />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-gray-700 mb-2 block">State *</label>
                          <select required value={shippingAddress.state} onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})} className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm">
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Karnataka">Karnataka</option>
                          </select>
                       </div>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-gray-700 mb-2 block">PIN Code *</label>
                       <input required value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})} className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-theme-rust outline-none transition-all text-sm" />
                    </div>
                  </div>
                )}
            </div>

            <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-8 pb-3 border-b border-gray-50">Select Payment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setPaymentMethod('COD')}
                    className={`relative p-6 border rounded-sm cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-3 ${paymentMethod === 'COD' ? 'border-theme-rust bg-theme-cream/30 ring-1 ring-theme-rust/20' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                  >
                     <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${paymentMethod === 'COD' ? 'bg-theme-rust border-theme-rust' : 'border-gray-200'}`}>
                        {paymentMethod === 'COD' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                     </div>
                     <Wallet size={28} className={paymentMethod === 'COD' ? 'text-theme-rust' : 'text-gray-300'} />
                     <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">COD</span>
                     <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Pay on Delivery</p>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('PhonePe')}
                    className={`relative p-6 border rounded-sm cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-3 ${paymentMethod === 'PhonePe' ? 'border-theme-rust bg-theme-cream/30 ring-1 ring-theme-rust/20' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                  >
                     <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${paymentMethod === 'PhonePe' ? 'bg-theme-rust border-theme-rust' : 'border-gray-200'}`}>
                        {paymentMethod === 'PhonePe' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                     </div>
                     <CreditCard size={28} className={paymentMethod === 'PhonePe' ? 'text-theme-rust' : 'text-gray-300'} />
                     <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">PhonePe Online</span>
                     <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">NetBanking / UPI / Cards</p>
                  </div>
                </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm">
               <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-8 pb-3 border-b border-gray-50">Summary</h3>
               
               <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.product} className="flex gap-4 items-center">
                        <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-sm border border-gray-50" />
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-gray-900 uppercase truncate">{item.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase">Qty: {item.qty}</p>
                        </div>
                        <span className="text-xs font-bold text-gray-900">₹{(item.qty * item.price).toFixed(0)}</span>
                    </div>
                  ))}
               </div>

                <div className="pt-6 border-t border-gray-50 mb-8">
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 bg-gray-50 border border-gray-200 p-3 rounded-sm outline-none text-[11px] font-bold uppercase"
                      />
                      <button 
                        type="button"
                        onClick={handleApplyCoupon}
                        className="bg-gray-900 text-white px-4 text-[10px] font-bold uppercase rounded-sm"
                      >
                         Apply
                      </button>
                   </div>
                   {couponError && <p className="text-[9px] text-red-500 mt-2 font-bold uppercase">{couponError}</p>}
                </div>

                <div className="space-y-3 mb-8">
                   <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-400 uppercase">Subtotal</span>
                      <span className="text-gray-900">₹{subtotal.toFixed(0)}</span>
                   </div>
                   {discount > 0 && (
                     <div className="flex justify-between items-center text-xs font-bold text-green-600 uppercase">
                        <span>Savings</span>
                        <span>-₹{discount.toFixed(0)}</span>
                     </div>
                   )}
                   <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-400 uppercase">Shipping</span>
                      <span className="text-gray-900 font-bold uppercase">
                         {shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}
                      </span>
                   </div>
                   <div className="flex justify-between items-center pt-5 border-t border-gray-100">
                      <span className="text-sm font-bold text-gray-900 uppercase">Grand Total</span>
                      <span className="text-2xl font-bold text-gray-900">₹{totalPrice.toFixed(0)}</span>
                   </div>
                </div>

               <button 
                 type="submit"
                 disabled={loading}
                 className="w-full bg-gray-900 text-white py-5 text-sm font-bold hover:bg-theme-rust transition-all flex items-center justify-center gap-2 rounded-sm"
               >
                 {loading ? (
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 ) : (
                   <><Lock size={16} /> Confirm Order</>
                 )}
               </button>

               <div className="mt-8 flex flex-col items-center gap-2 opacity-30 grayscale">
                  <ShieldCheck size={24} />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-center">Encrypted & Secure Transaction</span>
               </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
