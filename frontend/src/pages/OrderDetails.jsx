import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchOrderById, initiatePhonePe, checkPhonePeStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Package, MapPin, CreditCard, Calendar, Clock, AlertCircle, CheckCircle, RefreshCcw } from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const getOrderData = async () => {
    try {
      setLoading(true);
      const { data } = await fetchOrderById(id);
      if (data.user?._id !== userInfo?._id && !userInfo?.isAdmin) {
        navigate('/profile');
        return;
      }
      setOrder(data);
    } catch (error) {
      console.error("Order retrieval failed:", error);
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) getOrderData();
  }, [id, userInfo, navigate]);

  useEffect(() => {
    let interval;
    if (order && !order.isPaid && order.paymentMethod === 'PhonePe') {
      const runSync = async () => {
        try {
          setSyncing(true);
          const { data } = await checkPhonePeStatus(id);
          // Always refresh order data to get the latest DB state
          const { data: updated } = await fetchOrderById(id);
          setOrder(updated);
        } catch (err) {
          console.error("Auto-sync error", err);
        } finally {
          setSyncing(false);
        }
      };

      // Run once immediately
      runSync();

      // Then every 5 seconds
      interval = setInterval(runSync, 5000);
    }
    return () => clearInterval(interval);
  }, [order?.isPaid, id]);

  const handleSyncStatus = async () => {
    try {
      setSyncing(true);
      const { data } = await checkPhonePeStatus(id);
      await getOrderData();
      if (data.status === 'SUCCESS') {
        alert('Payment confirmed! Thank you for your purchase.');
      } else if (data.status === 'FAILED') {
        alert(`Payment Failed: ${data.message}`);
      }
    } catch (err) {
      alert('Could not reach payment gateway. Please try again in a moment.');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-40 flex items-center justify-center font-arial">
        <div className="w-10 h-10 border-3 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-gray-50 min-h-screen py-40 flex flex-col items-center justify-center font-arial">
         <h2 className="text-xl font-bold text-gray-900 mb-4">Order Not Found</h2>
         <Link to="/profile" className="text-theme-rust font-bold uppercase text-xs">Return to Profile</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16 font-arial">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <Link to="/profile" className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-gray-400 hover:text-gray-900 transition-colors">
            <ChevronLeft size={14} /> Back to Profile
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Order Summary</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID: {order._id.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase border ${order.isDelivered ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-900 text-white border-gray-900'}`}>
               {order.isDelivered ? 'Delivered' : 'Processing'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm">
               <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 pb-2 border-b border-gray-50">Products</h3>
               <div className="divide-y divide-gray-50">
                 {order.orderItems.map((item, index) => (
                   <div key={index} className="flex gap-6 py-6 group">
                      <div className="w-20 h-20 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0 border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-gray-900 mb-1">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Qty: {item.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₹{(item.price * item.qty).toFixed(0)}</p>
                      </div>
                   </div>
                 ))}
               </div>

               <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold uppercase">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-900">₹{order.itemsPrice.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-gray-900">₹{order.shippingPrice.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-gray-900">
                    <span className="text-sm font-bold text-gray-900 uppercase">Total Paid</span>
                    <span className="text-2xl font-bold text-gray-900">₹{order.totalPrice.toFixed(0)}</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-50">Shipping Destination</h3>
              <div className="space-y-1 text-xs font-bold text-gray-900 uppercase leading-relaxed">
                 <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                 <p>{order.shippingAddress.address}</p>
                 <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                 <p>{order.shippingAddress.state}</p>
                 <p>{order.shippingAddress.country}</p>
                 {order.shippingAddress.email && <p className="lowercase pt-2 text-theme-rust">{order.shippingAddress.email}</p>}
                 {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
              </div>
            </div>

            <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-50">Payment Info</h3>
              <div className="space-y-5">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Method</p>
                  <p className="text-[11px] font-bold text-gray-900 uppercase">{order.paymentMethod}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Payment Status</p>
                    {syncing && (
                       <span className="text-[8px] font-bold text-theme-rust flex items-center gap-1 uppercase">
                         <RefreshCcw size={8} className="animate-spin" /> Updating...
                       </span>
                    )}
                  </div>

                   {order.isPaid ? (
                    <div className="flex flex-col gap-4">
                       <span className="text-[9px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-sm inline-flex items-center gap-2 border border-green-200 uppercase w-fit">
                          <CheckCircle size={12} /> Successfully Paid
                       </span>
                       
                       {/* PhonePe Specific Success Details */}
                       {order.paymentResult?.rawResponse?.data?.paymentInstrument && (
                         <div className="bg-gray-50 p-4 rounded-sm border border-gray-100 space-y-3">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight pb-1 border-b border-gray-100">Success Details</p>
                            
                            {order.paymentResult.rawResponse.data.paymentInstrument.maskedAccountNumber && (
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                 <span className="text-gray-400 uppercase">Account</span>
                                 <span className="text-gray-900">{order.paymentResult.rawResponse.data.paymentInstrument.maskedAccountNumber}</span>
                              </div>
                            )}

                            {order.paymentResult.rawResponse.data.paymentInstrument.maskedCardNumber && (
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                 <span className="text-gray-400 uppercase">Card Number</span>
                                 <span className="text-gray-900">{order.paymentResult.rawResponse.data.paymentInstrument.maskedCardNumber}</span>
                              </div>
                            )}
                            
                            {(order.paymentResult.rawResponse.data.paymentInstrument.bankId || order.paymentResult.rawResponse.data.paymentInstrument.cardNetwork) && (
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                 <span className="text-gray-400 uppercase">Network / Bank</span>
                                 <span className="text-gray-900">
                                   {order.paymentResult.rawResponse.data.paymentInstrument.cardNetwork || order.paymentResult.rawResponse.data.paymentInstrument.bankId}
                                 </span>
                              </div>
                            )}

                            {order.paymentResult.rawResponse.data.paymentInstrument.accountHolderName && (
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                 <span className="text-gray-400 uppercase">Holder</span>
                                 <span className="text-gray-900">{order.paymentResult.rawResponse.data.paymentInstrument.accountHolderName}</span>
                              </div>
                            )}

                            {order.paymentResult.rawResponse.data.paymentInstrument.cardType && (
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                 <span className="text-gray-400 uppercase">Card Type</span>
                                 <span className="text-gray-900">{order.paymentResult.rawResponse.data.paymentInstrument.cardType}</span>
                              </div>
                            )}
                         </div>
                       )}

                       <p className="text-[9px] text-gray-400 font-bold uppercase ml-1">Processed on {new Date(order.paidAt).toLocaleDateString()}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Detailed Failure Notice */}
                      {order.paymentResult?.status?.includes('FAIL') || order.paymentResult?.status?.includes('EXPIRE') ? (
                        <div className="bg-rose-50 border border-rose-100 p-4 rounded-sm space-y-3">
                          <div className="flex items-center gap-2 text-rose-600">
                             <AlertCircle size={16} />
                             <span className="text-[10px] font-bold uppercase tracking-tight">Last Payment Attempt Failed</span>
                          </div>
                          <p className="text-[10px] text-rose-400 font-bold leading-relaxed italic lowercase">
                            Reason: {order.paymentResult.message || 'Transaction was declined by bank or expired.'}
                          </p>
                          <div className="h-[1px] bg-rose-100/50 w-full" />
                          <p className="text-[9px] text-gray-500 font-bold uppercase leading-tight">
                            Your order is still safe. Use the button below to start a <span className="text-gray-900">new secure transaction</span>.
                          </p>
                        </div>
                      ) : (
                        <span className="text-[9px] font-bold text-amber-500 bg-amber-50 px-3 py-1.5 rounded-sm inline-flex items-center gap-2 border border-amber-200 uppercase w-fit">
                           <Clock size={12} /> Payment Awaited
                        </span>
                      )}
                      
                      {order.paymentMethod === 'PhonePe' && (
                        <div className="pt-2">
                          <button 
                            disabled={syncing}
                            onClick={async () => {
                              try {
                                setSyncing(true);
                                const { data } = await initiatePhonePe({ orderId: order._id });
                                if (data.url) {
                                  window.location.href = data.url;
                                } else {
                                  alert('Could not initiate payment. Please contact support.');
                                }
                              } catch (err) {
                                console.error('Re-attempt error:', err);
                                const detail = err.response?.data?.message || err.message || 'Unknown Error';
                                alert(`Gateway Error: ${detail}`);
                              } finally {
                                setSyncing(false);
                              }
                            }}
                            className={`w-full py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] ${syncing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-theme-rust'}`}
                          >
                            {syncing ? (
                               <RefreshCcw size={14} className="animate-spin" /> 
                            ) : (
                               <Package size={14} /> 
                            )}
                            {syncing ? 'Connecting...' : order.paymentResult?.status ? 'Retry Payment Now' : 'Pay via PhonePe'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Placed On</p>
                  <p className="text-[11px] font-bold text-gray-900 uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
