import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Ticket, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  ExternalLink
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { title: 'Products', icon: Package, path: '/admin/products' },
    { title: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    { title: 'Coupons', icon: Ticket, path: '/admin/coupons' },
    { title: 'Transactions', icon: CreditCard, path: '/admin/transactions' },
    { title: 'PhonePe Config', icon: Settings, path: '/admin/phonepe' },
    { title: 'Users', icon: User, path: '/admin/users' },
  ];

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Sidebar - Clean Professional Dark */}
      <aside 
        className={`bg-[#111111] text-white w-64 transition-all duration-300 fixed h-full z-50 border-r border-white/5 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Simple Professional Logo */}
          <div className="h-24 flex items-center px-6 border-b border-white/5">
            <Link to="/" className={`flex items-center gap-3 ${!isSidebarOpen ? 'lg:hidden' : ''}`}>
              <img src="/images/logo.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-sm" />
              <div className="flex flex-col">
                <span className="text-white text-xs font-bold tracking-widest uppercase">MAGGIK</span>
                <span className="text-theme-rust text-[10px] uppercase font-medium">ADMIN PANEL</span>
              </div>
            </Link>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden ml-auto text-gray-400">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-8 px-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-md transition-all duration-200 group ${
                    isActive 
                      ? 'bg-theme-rust text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-[12px] uppercase font-semibold tracking-wider ${!isSidebarOpen ? 'lg:hidden' : ''}`}>
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/5 space-y-1">
            <Link to="/" target="_blank" className="flex items-center gap-3 p-3 text-[11px] uppercase font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-all">
              <ExternalLink size={16} />
              <span className={!isSidebarOpen ? 'lg:hidden' : ''}>View Website</span>
            </Link>
            <button 
              onClick={logoutHandler}
              className="flex items-center gap-3 p-3 text-[11px] uppercase font-bold text-red-400 hover:bg-red-400/10 rounded-md transition-all w-full"
            >
              <LogOut size={16} />
              <span className={!isSidebarOpen ? 'lg:hidden' : ''}>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Simple Clean Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
               <h2 className="text-sm font-bold text-gray-900 tracking-tight">Management Dashboard</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
               <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Account</p>
               <p className="text-xs font-bold text-gray-900">Administrator</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-theme-rust flex items-center justify-center text-white shadow-sm">
               <User size={16} strokeWidth={2.5} />
            </div>
          </div>
        </header>

        {/* Page Container */}
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Mask */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
