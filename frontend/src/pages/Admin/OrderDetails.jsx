import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchOrderById, deliverOrder, checkPhonePeStatus } from '../../services/api';
import { ChevronLeft, Package, User, MapPin, CreditCard, Calendar, CheckCircle, Clock, RefreshCcw } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        setLoading(true);
        const { data } = await fetchOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order details", error);
        navigate('/admin/orders');
      } finally {
        setLoading(false);
      }
    };
    getOrderDetails();
  }, [id, navigate]);

  useEffect(() => {
    let interval;
    if (order && !order.isPaid && order.paymentMethod === 'PhonePe') {
      const runSync = async () => {
        try {
          await checkPhonePeStatus(id);
          const { data: updated } = await fetchOrderById(id);
          setOrder(updated);
        } catch (err) {
          console.error("Admin auto-sync error", err);
        }
      };
      runSync();
      interval = setInterval(runSync, 5000);
    }
    return () => clearInterval(interval);
  }, [id, order?.isPaid]);

  const handleDeliver = async () => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        await deliverOrder(order._id);
        const { data } = await fetchOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSyncPayment = async () => {
    try {
      setLoading(true);
      const { data } = await checkPhonePeStatus(order._id);
      if (data.success && data.status === 'SUCCESS') {
        alert('Payment confirmed! Order updated to Paid.');
      } else {
        alert(`Payment Status: ${data.message || data.status}`);
      }
      const { data: updatedOrder } = await fetchOrderById(id);
      setOrder(updatedOrder);
    } catch (err) {
      console.error(err);
      alert('Error syncing payment status. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="bg-gray-50 min-h-screen py-32 flex items-center justify-center font-arial">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-3 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-gray-400">Loading order info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16 font-arial">
      <div className="container mx-auto px-4 max-w-5xl">

        <div className="mb-8">
          <Link to="/admin/orders" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors">
            <ChevronLeft size={16} /> Back to Orders
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Order Details</h1>
            <p className="text-xs font-bold text-gray-400">ID: {order._id.toUpperCase()}</p>
          </div>
          <div className="flex gap-4">
            {!order.isDelivered && (
              <button 
                onClick={handleDeliver}
                className="bg-gray-900 text-white px-6 py-3 text-sm font-bold hover:bg-theme-rust transition-all flex items-center gap-2 rounded-sm"
              >
                <Package size={16} /> Mark as Delivered
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Products List */}
            <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm">
               <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 pb-3 border-b border-gray-50">Items Ordered</h3>
               
               <div className="space-y-4">
                 {order.orderItems.map((item, index) => (
                   <div key={index} className="flex gap-5 items-center p-4 bg-gray-50 rounded-sm border border-gray-100">
                     <div className="w-16 h-16 bg-white rounded-sm overflow-hidden flex-shrink-0 border border-gray-100">
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                       <p className="text-[11px] text-gray-400 font-bold mt-1">Qty: {item.qty} × ₹{item.price}</p>
                     </div>
                     <div className="text-right">
                       <span className="text-sm font-bold text-gray-900">₹{(item.price * item.qty).toFixed(0)}</span>
                     </div>
                   </div>
                 ))}
               </div>

               <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                   <div className="flex justify-between text-xs font-bold">
                     <span className="text-gray-400 uppercase">Subtotal</span>
                     <span className="text-gray-900">₹{order.itemsPrice.toFixed(0)}</span>
                   </div>
                   <div className="flex justify-between text-xs font-bold">
                     <span className="text-gray-400 uppercase">Shipping Fee</span>
                     <span className="text-gray-900">₹{order.shippingPrice.toFixed(0)}</span>
                   </div>
                   <div className="flex justify-between text-xs font-bold">
                     <span className="text-gray-400 uppercase">Tax / GST</span>
                     <span className="text-gray-900">₹{order.taxPrice.toFixed(0)}</span>
                   </div>
                   <div className="pt-4 border-t border-gray-900 flex justify-between items-center bg-gray-50 -mx-8 -mb-8 p-8 mt-4 rounded-b-sm">
                      <span className="text-sm font-bold text-gray-900 uppercase">Order Total</span>
                      <span className="text-2xl font-bold text-gray-900">₹{order.totalPrice.toFixed(0)}</span>
                   </div>
               </div>
            </div>

            {/* Transaction Timeline */}
            <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm">
                <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-6 pb-2 border-b border-gray-50">Transaction Log</h3>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="w-2 bg-theme-rust/20 rounded-full flex-shrink-0" />
                        <div>
                            <p className="text-[10px] font-bold text-gray-900 uppercase">Order Created</p>
                            <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                    {order.isPaid && (
                        <div className="flex gap-4">
                            <div className="w-2 bg-green-500 rounded-full flex-shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-900 uppercase">Payment Verified</p>
                                <p className="text-[10px] text-green-600">Paid at {new Date(order.paidAt).toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                    {order.isDelivered && (
                        <div className="flex gap-4">
                            <div className="w-2 bg-blue-500 rounded-full flex-shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-900 uppercase">Delivered</p>
                                <p className="text-[10px] text-blue-600">Delivered at {new Date(order.deliveredAt).toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-50">
                 <User size={16} className="text-theme-rust" />
                 <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Customer Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1 tracking-tighter">Full Name</p>
                  <p className="text-xs font-bold text-gray-900 border-l-2 border-gray-100 pl-3 py-1">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1 tracking-tighter">Email ID</p>
                  <p className="text-xs font-bold text-theme-rust border-l-2 border-gray-100 pl-3 py-1">
                    {order.shippingAddress.email || order.user?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1 tracking-tighter">Phone Number</p>
                  <p className="text-xs font-bold text-gray-900 border-l-2 border-gray-100 pl-3 py-1">
                    {order.shippingAddress.phone || 'Not Provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Ship-To Info */}
            <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-50">
                 <MapPin size={16} className="text-theme-rust" />
                 <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Ship-To Address</h3>
              </div>
              <div className="space-y-4">
                <div>
                   <p className="text-[9px] font-bold text-gray-400 uppercase mb-1 tracking-tighter">Destination</p>
                   <div className="text-xs font-bold text-gray-700 leading-relaxed uppercase border-l-2 border-theme-rust/10 pl-3 py-1 bg-gray-50/50">
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state || ''}</p>
                      <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                   </div>
                </div>
                
                <div className="pt-2">
                    <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold py-1.5 px-3 rounded-sm w-full justify-center ${order.isDelivered ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                      {order.isDelivered ? <CheckCircle size={12} /> : <Package size={12} />} 
                      {order.isDelivered ? 'ORDER DELIVERED' : 'IN TRANSIT / PENDING'}
                    </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-50">
                 <CreditCard size={16} className="text-theme-rust" />
                 <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Payment Summary</h3>
              </div>
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mb-1 tracking-tighter">Method</p>
                      <p className="text-[11px] font-bold text-gray-900 uppercase">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mb-1 tracking-tighter">Gateway</p>
                      <p className="text-[11px] font-bold text-gray-900 uppercase">{order.paymentMethod === 'PhonePe' ? 'PhonePe' : 'Cache On Delivery'}</p>
                    </div>
                </div>
                
                {order.paymentResult?.merchantTransactionId && (
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1 tracking-tighter">Transaction Ref</p>
                        <p className="text-[10px] font-bold text-gray-900 truncate bg-gray-50 p-1.5 border border-gray-100 rounded-sm">
                            {order.paymentResult.merchantTransactionId}
                        </p>
                    </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-50">
                 {order.isPaid ? (
                    <div className="text-[10px] font-bold text-green-600 bg-green-50 p-3 rounded-sm text-center uppercase border border-green-200 shadow-inner">
                       <CheckCircle size={12} className="inline mr-2" />
                       Fully Paid
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-[10px] font-bold text-amber-500 bg-amber-50 p-3 rounded-sm text-center uppercase border border-amber-200">
                         <Clock size={12} className="inline mr-2" />
                         Payment Awaited
                      </div>
                      
                      {order.paymentMethod === 'PhonePe' && (
                        <button 
                            onClick={handleSyncPayment}
                            className="w-full bg-gray-900 text-white py-2 text-[10px] font-bold uppercase hover:bg-theme-rust transition-all flex items-center justify-center gap-2 rounded-sm"
                        >
                            <RefreshCcw size={12} /> Sync From PhonePe
                        </button>
                      )}
                    </div>
                  )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
