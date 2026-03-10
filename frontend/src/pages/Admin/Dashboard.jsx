import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, Package, TrendingUp, ChevronRight, ArrowUpRight, Clock, Star, Trash2 } from 'lucide-react';
import { fetchProducts, fetchOrders, fetchUsers, deleteOrder } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          fetchProducts(),
          fetchOrders(),
          fetchUsers()
        ]);
        
        const products = productsRes.data;
        const orders = ordersRes.data;
        const users = usersRes.data;

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue: orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0),
          activeUsers: users.length
        });
        
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    getDashboardData();
  }, []);

  const handleRemoveOrder = async (id) => {
    if (window.confirm('Are you sure you want to remove this cosmic resonance?')) {
      try {
        await deleteOrder(id);
        setRecentOrders(recentOrders.filter(o => o._id !== id));
        setStats(prev => ({
          ...prev,
          totalOrders: prev.totalOrders - 1
        }));
      } catch(err) {
        console.error(err);
        alert('Failed to remove order');
      }
    }
  };


  const statCards = [
    { label: 'Total Treasures', value: stats.totalProducts, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Ancient Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Soul Revenue', value: `₹${stats.totalRevenue}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Seekers', value: stats.activeUsers, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="bg-theme-cream min-h-screen py-20" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="container mx-auto px-4">

        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 uppercase tracking-tight">Sanctum Dashboard</h1>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-gray-400 uppercase font-bold">
            <span className="text-gray-900">Guardian Access</span>
            <ChevronRight size={10} />
            <span className="text-gray-400">Overview</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, i) => (
            <div key={i} className="bg-white p-8 rounded-sm shadow-sm border border-gray-50 flex items-center justify-between group hover:shadow-md transition-all">
              <div>
                 <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 block">{card.label}</span>
                 <p className="text-3xl font-bold text-gray-900 tracking-tight">{card.value}</p>
              </div>
              <div className={`${card.bg} ${card.color} p-4 rounded-full group-hover:scale-110 transition-transform`}>
                 <card.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Quick Actions */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-50">
                 <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-900 mb-8 pb-4 border-b border-gray-50">Quick Rituals</h3>
                 <div className="space-y-4">
                    <Link to="/admin/products" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-theme-rust hover:text-white transition-all rounded-sm group text-sm font-medium">
                       Manage Inventory <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <Link to="/admin/product/new/edit" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-theme-rust hover:text-white transition-all rounded-sm group text-sm font-medium">
                       Add New Piece <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <Link to="/admin/orders" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-theme-rust hover:text-white transition-all rounded-sm group text-sm font-medium">
                       View Recent Orders <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <Link to="/admin/coupons" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-theme-rust hover:text-white transition-all rounded-sm group text-sm font-medium">
                       Manage Vouchers <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <Link to="/admin/transactions" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-theme-rust hover:text-white transition-all rounded-sm group text-sm font-medium">
                       Cosmic Treasury <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <Link to="/admin/phonepe" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-theme-rust hover:text-white transition-all rounded-sm group text-sm font-medium">
                       PhonePe Integration <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>


                 </div>
              </div>

              <div className="bg-theme-rust p-8 rounded-sm shadow-xl text-white">
                 <Star size={32} className="mb-6 opacity-30" />
                 <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">Guardian Tip</h3>
                 <p className="text-xs leading-relaxed opacity-80 uppercase tracking-widest font-bold">
                    "Ensure every crystal has a unique lore description to attract the right soul."
                 </p>
              </div>
           </div>

            <div className="lg:col-span-2">
               <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-50 h-full">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50 uppercase tracking-widest text-[10px] md:text-xs">
                     <h3 className="font-bold text-gray-900">Recent Cosmic Resonance</h3>
                     <Clock size={16} className="text-gray-300" />
                  </div>
                  <div className="space-y-6 md:space-y-8">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order, i) => (
                        <div key={order._id} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 group">
                           <div className="flex items-center gap-4 flex-1">
                             <div className="w-10 h-10 md:w-12 md:h-12 bg-theme-cream flex-shrink-0 flex items-center justify-center rounded-sm text-theme-rust border border-theme-rust/10 font-bold uppercase tracking-widest text-[10px]">
                                {i + 1}
                             </div>
                             <div className="min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate" style={{ fontFamily: 'Arial, sans-serif' }}>Order #{order._id.substring(0, 8)}</h4>
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                  {new Date(order.createdAt).toLocaleDateString()} By {order.user?.name || 'Guest'}
                                </p>
                             </div>
                           </div>
                           <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-gray-50 pt-3 sm:pt-0">
                             <div className="flex flex-col items-end">
                               <span className="text-base font-semibold text-gray-900">₹{order.totalPrice.toFixed(0)}</span>
                               {order.shippingPrice > 0 && <span className="text-xs text-gray-500">+ ₹{order.shippingPrice} Shipping</span>}
                             </div>
                             <button onClick={() => handleRemoveOrder(order._id)} className="text-gray-300 hover:text-red-500 transition-colors p-2 hidden sm:block">
                               <Trash2 size={16} />
                             </button>
                             <Link to={`/admin/order/${order._id}`}>
                               <ChevronRight size={16} className="text-gray-300 hover:text-theme-rust group-hover:translate-x-1 transition-all hidden sm:block" />
                             </Link>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center">
                         <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px] font-bold">No cosmic resonance found yet...</p>
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

export default AdminDashboard;
