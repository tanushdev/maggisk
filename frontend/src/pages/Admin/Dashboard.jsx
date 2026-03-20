import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, TrendingUp, ArrowUpRight, Clock, Plus, Ticket, Settings, ArrowRight } from 'lucide-react';
import { fetchDashboardStats, fetchOrders } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingPayments: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes] = await Promise.all([
          fetchDashboardStats(),
          fetchOrders()
        ]);
        
        setStats(statsRes.data);
        setRecentOrders((ordersRes.data || []).slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    getDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Unpaid Orders', value: stats.pendingPayments, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  if (loading) return (
    <div className="py-20 flex justify-center">
       <div className="w-8 h-8 border-2 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Store performance and activity metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className={`${card.bg} ${card.color} p-4 rounded-lg`}>
               <card.icon size={24} />
            </div>
            <div>
               <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{card.label}</p>
               <h2 className="text-xl font-bold text-gray-900 leading-none">{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Tasks */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-fit">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Quick Actions</h3>
              </div>
              <div className="p-2 space-y-1">
                 {[
                    { label: 'View Products', to: '/admin/products', icon: Package },
                    { label: 'Add New Product', to: '/admin/product/new/edit', icon: Plus },
                    { label: 'Manage Orders', to: '/admin/orders', icon: ShoppingBag },
                    { label: 'Coupon Management', to: '/admin/coupons', icon: Ticket },
                    { label: 'Store Settings', to: '/admin/phonepe', icon: Settings },
                 ].map((link, idx) => (
                    <Link key={idx} to={link.to} className="flex items-center justify-between p-3 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-theme-rust transition-all rounded-md group">
                       <div className="flex items-center gap-3">
                          <link.icon size={16} className="text-gray-400 group-hover:text-theme-rust" />
                          {link.label}
                       </div>
                       <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                 ))}
              </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Recent Orders</h3>
                  <Link to="/admin/orders" className="text-xs font-bold text-theme-rust hover:underline">View All</Link>
              </div>
              
              <div className="overflow-x-auto">
                {recentOrders.length > 0 ? (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] text-gray-400 uppercase font-bold border-b border-gray-100">
                        <th className="py-4 px-6">Order ID</th>
                        <th className="py-4 px-6">Customer</th>
                        <th className="py-4 px-6">Total</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="py-4 px-6 text-xs font-bold text-gray-900 tracking-tight">#{order._id.slice(-6).toUpperCase()}</td>
                          <td className="py-4 px-6">
                            <p className="text-xs font-bold text-gray-900 leading-none mb-1">{order.user?.name || 'Guest User'}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="py-4 px-6 text-xs font-bold text-gray-900">₹{order.totalPrice.toFixed(0)}</td>
                          <td className="py-4 px-6">
                             <span className={`text-[8px] font-bold uppercase py-1 px-2 rounded-md border inline-block ${order.isPaid ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                {order.isPaid ? 'Paid' : 'Unpaid'}
                             </span>
                          </td>
                          <td className="py-4 px-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                             <Link to={`/admin/order/${order._id}`} className="text-gray-400 hover:text-gray-900"><ArrowUpRight size={16} /></Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center">
                     <p className="text-gray-400 text-xs font-bold uppercase tracking-widest italic">No orders recorded yet</p>
                  </div>
                )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
