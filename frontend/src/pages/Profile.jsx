import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMyOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Package, 
  ChevronRight, 
  User as UserIcon, 
  LogOut, 
  ShoppingBag, 
  ShieldCheck, 
  Settings, 
  History,
  Mail,
  Calendar,
  CreditCard,
  MapPin,
  ExternalLink,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const Profile = () => {
  const { userInfo, logout } = useAuth();
  const { openCart } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'overview', 'orders', 'settings'

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const { data } = await fetchMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      getOrders();
    }
    window.scrollTo(0, 0);
  }, [userInfo]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!userInfo) return (
    <div className="min-h-screen pt-40 pb-20 bg-gray-50 flex items-center justify-center font-arial">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 bg-white border border-gray-100 shadow-2xl max-w-md w-full rounded-sm"
      >
        <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-tight">Access Restricted</h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">Please authenticate to access your personal dashboard and order history.</p>
        <Link to="/login" className="block w-full py-4 bg-gray-900 text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-theme-rust transition-all rounded-sm shadow-xl shadow-gray-200">
          Login to Continue
        </Link>
      </motion.div>
    </div>
  );

  return (
    <div className="bg-[#fcfcfa] min-h-screen font-arial">
      
      {/* Premium earthy Hero Header */}
      <div className="relative bg-[#f4ece3] pt-32 pb-48 overflow-hidden border-b border-theme-rust/10">
        <div className="absolute inset-0 opacity-40">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-theme-rust/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-theme-coral/10 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="relative"
            >
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white p-1 shadow-xl">
                <div className="w-full h-full bg-theme-cream rounded-full flex items-center justify-center text-theme-rust shadow-inner">
                  <UserIcon size={48} />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 w-8 h-8 bg-theme-rust rounded-full flex items-center justify-center border-2 border-white text-white shadow-lg">
                <ShieldCheck size={14} />
              </div>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-center md:text-left flex-1"
            >
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-tight">{userInfo.name}</h1>
                {userInfo.isAdmin && (
                  <span className="px-3 py-1 bg-theme-rust text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-sm">Admin Access</span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2"><Mail size={12} className="text-theme-rust" /> {userInfo.email}</span>
                <span className="flex items-center gap-2"><Calendar size={12} className="text-theme-rust" /> Member since {new Date(userInfo.createdAt || Date.now()).getFullYear()}</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-3"
            >
              {userInfo.isAdmin && (
                <Link to="/admin" className="px-6 py-3 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-theme-rust transition-all rounded-sm flex items-center gap-2 shadow-xl shadow-gray-200">
                  <Settings size={14} /> Control Panel
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="px-6 py-3 border border-gray-200 bg-white text-gray-900 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all rounded-sm flex items-center gap-2 shadow-sm"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-24 pb-20 relative z-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Navigation Tabs */}
          <div className="flex gap-1 mb-8 bg-white/80 backdrop-blur-md p-1 rounded-sm border border-white inline-flex shadow-xl shadow-gray-100">
            {[
              { id: 'overview', label: 'Overview', icon: UserIcon },
              { id: 'orders', label: 'Orders', icon: History },
              { id: 'settings', label: 'Profile Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm ${activeTab === tab.id ? 'bg-theme-rust text-white shadow-lg' : 'text-gray-400 hover:bg-theme-cream hover:text-theme-rust'}`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-theme-rust transition-colors h-full">
                  <div>
                    <div className="w-12 h-12 bg-gray-50 text-theme-rust rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                      <ShoppingBag size={20} />
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Total Orders</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{orders.length}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Active order portfolio</p>
                  </div>
                  <Link to="#" onClick={() => setActiveTab('orders')} className="mt-8 flex items-center gap-2 text-theme-rust text-[10px] font-bold uppercase tracking-widest hover:gap-3 transition-all">
                    View Portfolio <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-theme-rust transition-colors h-full">
                  <div>
                    <div className="w-12 h-12 bg-gray-50 text-theme-rust rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                      <CreditCard size={20} />
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Total Volume</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-1">₹{orders.reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Lifetime acquisition value</p>
                  </div>
                  <Link to="/products" className="mt-8 flex items-center gap-2 text-theme-rust text-[10px] font-bold uppercase tracking-widest hover:gap-3 transition-all">
                    Browse Collection <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 md:col-span-1">
                   <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 pb-2 border-b border-gray-50">Quick Navigation</h3>
                   <div className="space-y-2">
                      <button onClick={openCart} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-700 transition-all rounded-sm w-full">
                        <span>Check Cart</span>
                        <ShoppingBag size={14} className="text-gray-400" />
                      </button>
                      <Link to="/about-us" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-700 transition-all rounded-sm">
                        <span>Our Heritage</span>
                        <History size={14} className="text-gray-400" />
                      </Link>
                      <Link to="/contact" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-700 transition-all rounded-sm">
                        <span>Concierge Support</span>
                        <Mail size={14} className="text-gray-400" />
                      </Link>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div 
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {loading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-32 bg-white/50 animate-pulse rounded-sm border border-gray-100"></div>
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div 
                        key={order._id} 
                        className="bg-white border border-gray-100 p-8 rounded-sm hover:shadow-xl hover:border-theme-rust/20 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group"
                      >
                        <div className="flex items-center gap-8">
                          <div className="w-16 h-16 bg-gray-50 flex items-center justify-center text-gray-300 rounded-sm group-hover:text-theme-rust transition-colors">
                            <Package size={28} />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                                
                                {/* Payment Status Badge */}
                                {order.isPaid ? (
                                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[8px] font-bold uppercase tracking-widest border border-green-100 rounded-full flex items-center gap-1.5 shadow-sm">
                                    <CheckCircle size={10} /> Paid
                                  </span>
                                ) : (
                                  order.paymentResult?.status?.includes('FAIL') || order.paymentResult?.status?.includes('EXPIRE') ? (
                                    <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[8px] font-bold uppercase tracking-widest border border-rose-100 rounded-full flex items-center gap-1.5 shadow-sm">
                                      <AlertCircle size={10} /> Failed
                                    </span>
                                  ) : (
                                    <span className="px-3 py-1 bg-amber-50 text-amber-500 text-[8px] font-bold uppercase tracking-widest border border-amber-100 rounded-full flex items-center gap-1.5 shadow-sm">
                                      <Clock size={10} /> Pending
                                    </span>
                                  )
                                )}

                                {/* Fulfillment Status Badge */}
                                <span className={`px-3 py-1 text-[8px] font-bold uppercase tracking-widest border rounded-full flex items-center gap-1.5 shadow-sm ${order.isDelivered ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                  {order.isDelivered ? 'Delivered' : (order.isPaid ? 'Processing' : 'Awaiting Payment')}
                                </span>
                            </div>
                            <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest divide-x divide-gray-100">
                                <span className="flex items-center gap-2 transition-colors group-hover:text-gray-600"><Calendar size={12} className="text-theme-rust/60" /> {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                <span className="pl-6 flex items-center gap-2 transition-colors group-hover:text-gray-600"><Package size={12} className="text-theme-rust/60" /> {order.orderItems.length} Products</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-12 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0 mt-2 md:mt-0">
                          <div className="text-left md:text-right">
                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-widest">Total Value</p>
                            <p className="text-xl font-bold text-gray-900">₹{order.totalPrice.toLocaleString()}</p>
                          </div>
                          
                          <div className="text-left md:text-right min-w-[120px]">
                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-widest">Fulfillment</p>
                            <div className="flex items-center gap-2 justify-start md:justify-end">
                                <div className={`w-2 h-2 rounded-full ${order.isDelivered ? 'bg-green-500' : 'bg-gray-900 animate-pulse'}`}></div>
                                <p className="text-[11px] font-bold uppercase text-gray-900">{order.isDelivered ? 'Delivered' : 'In Progress'}</p>
                            </div>
                          </div>

                          <Link 
                            to={`/order-details/${order._id}`} 
                            className="w-12 h-12 bg-gray-900 text-white rounded-sm hover:bg-theme-rust transition-all shadow-xl shadow-gray-200 flex items-center justify-center group-hover:scale-110 active:scale-95 translate-x-3 md:translate-x-0"
                          >
                            <ChevronRight size={20} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center bg-white rounded-sm border border-dashed border-gray-200 shadow-sm flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-tight">No Acquisition History</h3>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest max-w-xs mb-8">You haven't added any luxury pieces to your portfolio yet.</p>
                    <Link to="/" className="px-10 py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-theme-rust transition-all rounded-sm shadow-xl shadow-gray-200">
                      Explore Collection
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl"
              >
                <div className="bg-white p-10 rounded-sm shadow-sm border border-gray-100">
                   <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-50">
                      <h2 className="text-sm font-bold text-gray-900 uppercase tracking-[0.2em]">Credential Management</h2>
                      <div className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-bold uppercase tracking-widest rounded-full border border-green-100">Verified Account</div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-8">
                        <div>
                           <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Full Identity</label>
                           <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-sm border border-gray-100/50">
                              <UserIcon size={18} className="text-gray-400" />
                              <span className="text-sm font-bold text-gray-900">{userInfo.name}</span>
                           </div>
                        </div>
                        <div>
                           <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Communication Channel</label>
                           <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-sm border border-gray-100/50">
                              <Mail size={18} className="text-gray-400" />
                              <span className="text-sm font-bold text-gray-900">{userInfo.email}</span>
                           </div>
                        </div>
                      </div>

                      <div className="p-8 bg-theme-cream/30 rounded-sm border border-theme-rust/10">
                         <div className="flex items-center gap-3 mb-4 text-theme-rust">
                            <ShieldCheck size={20} />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest">Data Privacy</h4>
                         </div>
                         <p className="text-[11px] text-gray-500 font-bold uppercase leading-relaxed mb-6">Your data is stored securely using enterprise-grade encryption standard. Identity changes require concierge authentication.</p>
                         <button className="text-[10px] text-gray-900 font-bold uppercase tracking-widest border-b-2 border-gray-900 pb-1 hover:text-theme-rust hover:border-theme-rust transition-all">Request Identity Update</button>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default Profile;
