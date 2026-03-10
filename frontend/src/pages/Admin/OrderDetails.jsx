import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchOrderById, deliverOrder } from '../../services/api';
import { ChevronLeft, Package, User, MapPin, CreditCard, Calendar, CheckCircle, Clock } from 'lucide-react';

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

  const handleDeliver = async () => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        await deliverOrder(order._id);
        // Refresh Order Details
        const { data } = await fetchOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading || !order) {
    return (
      <div className="bg-theme-cream min-h-screen py-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 animate-pulse">Reading Ancient Scroll...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-theme-cream min-h-screen py-20 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">

        <div className="mb-8">
          <Link to="/admin/orders" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-theme-rust transition-colors">
            <ChevronLeft size={14} /> Back to Vault
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 uppercase tracking-tight">Order Scroll</h1>
            <p className="text-sm font-mono text-gray-500 bg-gray-100 px-3 py-1 inline-block rounded-sm">
              ID: {order._id}
            </p>
          </div>
          <div className="flex gap-4">
            {!order.isDelivered && (
              <button 
                onClick={handleDeliver}
                className="bg-gray-900 text-white px-6 py-3 uppercase tracking-widest text-[10px] font-bold hover:bg-theme-rust transition-all flex items-center gap-2 shadow-xl shadow-gray-200"
              >
                <Package size={14} /> Mark as Delivered
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Receipt Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-gray-50">
               <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-900 mb-8 pb-4 border-b border-gray-50">Artifacts Requested</h3>
               
               <div className="space-y-6">
                 {order.orderItems.map((item, index) => (
                   <div key={index} className="flex gap-6 items-center p-4 bg-gray-50 rounded-sm border border-gray-100">
                     <div className="w-20 h-20 bg-white rounded-sm overflow-hidden flex-shrink-0">
                       <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <Link to={`/product/${item.product}`} className="text-sm font-bold text-gray-900 uppercase tracking-tight hover:text-theme-rust transition-colors block truncate">
                          {item.name}
                       </Link>
                       <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Qty: {item.qty}</p>
                     </div>
                     <div className="text-right">
                       <span className="text-sm font-bold text-gray-900">₹{(item.price * item.qty).toFixed(0)}</span>
                     </div>
                   </div>
                 ))}
               </div>

               <div className="mt-10 pt-8 border-t border-gray-50 space-y-4">
                   <div className="flex justify-between text-sm text-gray-500 font-medium">
                     <span className="uppercase tracking-widest text-[10px]">Subtotal (Essence)</span>
                     <span className="font-sans text-gray-900">₹{order.itemsPrice.toFixed(0)}</span>
                   </div>
                   <div className="flex justify-between text-sm text-gray-500 font-medium">
                     <span className="uppercase tracking-widest text-[10px]">Shipping Tribute</span>
                     <span className="font-sans text-gray-900">₹{order.shippingPrice.toFixed(0)}</span>
                   </div>
                   <div className="flex justify-between text-sm text-gray-500 font-medium">
                     <span className="uppercase tracking-widest text-[10px]">Tax Allocation</span>
                     <span className="font-sans text-gray-900">₹{order.taxPrice.toFixed(0)}</span>
                   </div>
               </div>

               <div className="mt-8 pt-8 border-t border-gray-900 flex justify-between items-center text-gray-900">
                  <span className="text-xs uppercase tracking-widest font-bold">Total Exchange</span>
                  <span className="text-3xl font-bold font-sans tracking-tight">₹{order.totalPrice.toFixed(0)}</span>
               </div>
               
               {/* Quick Badge */}
               <div className="mt-8 border border-green-200 bg-green-50 p-4 rounded-sm flex items-center justify-center gap-2 text-green-700">
                 <CheckCircle size={14} />
                 <span className="text-[10px] uppercase tracking-widest font-bold">Checkout Complete - Offering Secured</span>
               </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            
            {/* Seeker / User Info */}
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                 <User size={16} className="text-theme-rust" />
                 <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-900">Seeker Details</h3>
              </div>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Name</span>
                  <p className="font-medium text-gray-900 uppercase">{order.user?.name || 'Guest'}</p>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Email Resonance</span>
                  <a href={`mailto:${order.user?.email}`} className="font-medium text-gray-900 hover:text-theme-rust transition-colors">{order.user?.email || 'N/A'}</a>
                </div>
              </div>
            </div>

            {/* Logistics Info */}
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                 <MapPin size={16} className="text-theme-rust" />
                 <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-900">Destination</h3>
              </div>
              <div className="space-y-2 text-xs font-medium text-gray-700 leading-relaxed uppercase tracking-wider">
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-50">
                  <span className={`inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold py-1.5 px-3 rounded-full ${order.isDelivered ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                    <Package size={12} /> {order.isDelivered ? `Delivered on ${order.deliveredAt.substring(0, 10)}` : 'On Its Way'}
                  </span>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                 <CreditCard size={16} className="text-theme-rust" />
                 <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-900">Transaction Status</h3>
              </div>
              <div className="space-y-4 text-xs mb-6">
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Payment Method</span>
                  <p className="font-medium text-gray-900 uppercase">{order.paymentMethod}</p>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Creation Date</span>
                  <div className="flex items-center gap-2 font-medium text-gray-900">
                    <Calendar size={12} className="text-gray-400" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-50">
                 {order.isPaid ? (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50/50 p-2 rounded-sm border border-green-100">
                       <CheckCircle size={14} />
                       <span className="text-[9px] uppercase tracking-[0.2em] font-bold">Paid on {order.paidAt.substring(0, 10)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-500 bg-amber-50/50 p-2 rounded-sm border border-amber-100">
                       <Clock size={14} />
                       <span className="text-[9px] uppercase tracking-[0.2em] font-bold">Awaiting Payment</span>
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
