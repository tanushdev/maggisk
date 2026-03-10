import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders, deliverOrder, deleteOrder } from '../../services/api';
import { ShoppingBag, ChevronRight, User as UserIcon, Calendar, CheckCircle, Clock, Truck, Trash2 } from 'lucide-react';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      const { data } = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleDeliver = async (id) => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        await deliverOrder(id);
        getOrders(); // Refresh list
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRemoveOrder = async (id) => {
    if (window.confirm('Are you sure you want to remove this order history?')) {
      try {
        await deleteOrder(id);
        getOrders(); // Refresh list
      } catch (err) {
        console.error(err);
        alert('Failed to remove order');
      }
    }
  };

  return (
    <div className="bg-theme-cream min-h-screen py-20 font-sans">


      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 uppercase tracking-tight">Ancient Orders</h1>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-gray-400 uppercase font-bold">
            <Link to="/admin" className="hover:text-theme-rust">Admin</Link>
            <ChevronRight size={10} />
            <span className="text-gray-900">Orders</span>
          </div>
        </div>


        {loading ? (
          <div className="flex justify-center py-20">
             <div className="w-10 h-10 border-4 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">ID</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Seeker</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Manifested On</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Total Price</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Offering (Paid)</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">State</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 text-[10px] text-gray-400 uppercase tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>
                        {o._id.substring(0, 8)}...
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-theme-cream flex items-center justify-center text-theme-rust border border-theme-rust/10">
                              <UserIcon size={14} />
                           </div>
                           <span className="text-sm font-medium text-gray-900">{o.user?.name || 'Guest Seeker'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase tracking-widest font-medium">
                            <Calendar size={12} />
                            {o.createdAt.substring(0, 10)}
                         </div>
                      </td>
                      <td className="px-8 py-6 font-sans">
                        <span className="font-bold text-gray-900">₹{o.totalPrice.toFixed(0)}</span>
                        {o.shippingPrice > 0 && <span className="block text-[9px] text-gray-400 uppercase tracking-widest mt-1">+ ₹{o.shippingPrice} Shipping</span>}
                      </td>
                      <td className="px-8 py-6">
                        {o.isPaid ? (
                          <div className="flex items-center gap-2 text-green-600">
                             <CheckCircle size={14} />
                             <span className="text-[10px] uppercase tracking-widest font-bold">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-amber-500">
                             <Clock size={14} />
                             <span className="text-[10px] uppercase tracking-widest font-bold">Pending</span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                         <span className={`text-[9px] uppercase tracking-[0.2em] font-bold py-1 px-3 rounded-full ${o.isDelivered ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                            {o.isDelivered ? 'Delivered' : 'En Route'}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                           {!o.isDelivered && (
                             <button 
                               onClick={() => handleDeliver(o._id)}
                               className="p-2 text-gray-400 hover:text-theme-rust hover:bg-white rounded-full shadow-sm transition-all"
                               title="Mark as Delivered"
                             >
                               <Truck size={16} />
                             </button>
                           )}
                           <button onClick={() => handleRemoveOrder(o._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-full shadow-sm transition-all" title="Remove Order">
                             <Trash2 size={16} />
                           </button>
                           <Link to={`/admin/order/${o._id}`} className="text-[10px] uppercase tracking-[0.2em] font-bold text-theme-rust hover:underline underline-offset-4">
                             Inspect
                           </Link>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {orders.length === 0 && (
                     <tr>
                        <td colSpan="7" className="px-8 py-20 text-center">
                           <p className="font-bold text-gray-400 text-xl uppercase tracking-wider">The boutique scrolls show no order manifest yet...</p>
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
