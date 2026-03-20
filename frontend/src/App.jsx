import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const ProductPage = lazy(() => import('./pages/ProductPage'));

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const ProductList = lazy(() => import('./pages/Admin/ProductList'));
const ProductEdit = lazy(() => import('./pages/Admin/ProductEdit'));
const OrderList = lazy(() => import('./pages/Admin/OrderList'));
const OrderDetails = lazy(() => import('./pages/Admin/OrderDetails'));
const CouponList = lazy(() => import('./pages/Admin/CouponList'));
const Transactions = lazy(() => import('./pages/Admin/Transactions'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const OrderFailed = lazy(() => import('./pages/OrderFailed'));
const PhonePeConfig = lazy(() => import('./pages/Admin/PhonePeConfig'));
const UserList = lazy(() => import('./pages/Admin/UserList'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const CancellationReturnPolicy = lazy(() => import('./pages/CancellationReturnPolicy'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const Profile = lazy(() => import('./pages/Profile'));
const Contact = lazy(() => import('./pages/Contact'));
const UserOrderDetails = lazy(() => import('./pages/OrderDetails'));

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-theme-cream">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 animate-pulse">Loading Content...</p>
    </div>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="app flex flex-col min-h-screen">
      {!isAdminPath && <AnnouncementBar />}
      {!isAdminPath && <Header />}
      {!isAdminPath && <CartDrawer />}
      
      <main className="flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Admin Routes Protected */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/products" element={<AdminLayout><ProductList /></AdminLayout>} />
              <Route path="/admin/product/:id/edit" element={<AdminLayout><ProductEdit /></AdminLayout>} />
              <Route path="/admin/orders" element={<AdminLayout><OrderList /></AdminLayout>} />
              <Route path="/admin/order/:id" element={<AdminLayout><OrderDetails /></AdminLayout>} />
              <Route path="/admin/coupons" element={<AdminLayout><CouponList /></AdminLayout>} />
              <Route path="/admin/transactions" element={<AdminLayout><Transactions /></AdminLayout>} />
              <Route path="/admin/phonepe" element={<AdminLayout><PhonePeConfig /></AdminLayout>} />
              <Route path="/admin/users" element={<AdminLayout><UserList /></AdminLayout>} />
            </Route>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/category/:slug" element={<CategoryPage type="category" />} />
            <Route path="/stone/:slug" element={<CategoryPage type="stone" />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/cancellation" element={<CancellationReturnPolicy />} />
            <Route path="/shipping" element={<ShippingPolicy />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/order-details/:id" element={<UserOrderDetails />} />
            <Route path="/order/:id/success" element={<OrderSuccess />} />
            <Route path="/order/:id/failed" element={<OrderFailed />} />
          </Routes>
        </Suspense>
      </main>
      
      {!isAdminPath && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
