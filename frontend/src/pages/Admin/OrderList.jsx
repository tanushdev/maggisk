import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders, deliverOrder, deleteOrder } from '../../services/api';
import { User, CheckCircle, Clock, Trash2, ArrowUpRight, Truck, Search } from 'lucide-react';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await fetchOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
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
        getOrders();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order record?')) {
      try {
        await deleteOrder(id);
        getOrders();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="py-20 flex justify-center">
       <div className="w-8 h-8 border-2 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Monitor and fulfill customer orders</p>
        </div>

        <div className="w-full md:w-auto">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or Customer..."
              className="w-full md:w-80 pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:border-theme-rust outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total Price</th>
                <th className="px-6 py-4">Payment Status</th>
                <th className="px-6 py-4">Delivery State</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-6 py-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    #{o._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-gray-50 flex items-center justify-center text-gray-300 rounded-full border border-gray-100">
                          <User size={14} />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-gray-900 leading-none mb-1">{o.user?.name || 'Guest Checkout'}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{new Date(o.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    ₹{o.totalPrice.toFixed(0)}
                  </td>
                  <td className="px-6 py-4">
                    {o.isPaid ? (
                      <span className="inline-flex items-center gap-1.5 text-[8px] font-bold uppercase py-1 px-2.5 bg-green-50 text-green-600 border border-green-100 rounded-md">
                         <CheckCircle size={10} /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[8px] font-bold uppercase py-1 px-2.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-md">
                         <Clock size={10} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`text-[8px] font-bold uppercase py-1 px-2.5 rounded-md border inline-block ${o.isDelivered ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {o.isDelivered ? 'Delivered' : 'In Progress'}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/admin/order/${o._id}`} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                           <ArrowUpRight size={18} />
                        </Link>
                        {!o.isDelivered && (
                          <button onClick={() => handleDeliver(o._id)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Truck size={18} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(o._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">No matching orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
