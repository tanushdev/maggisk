import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
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
const PhonePeConfig = lazy(() => import('./pages/Admin/PhonePeConfig'));

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-theme-cream">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 animate-pulse">Manifesting Page...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app flex flex-col min-h-screen">
            <AnnouncementBar />
            <Header />
            <main className="flex-grow">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:slug" element={<ProductPage />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/category/:slug" element={<CategoryPage type="category" />} />
                  <Route path="/stone/:slug" element={<CategoryPage type="stone" />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order/:id/success" element={<OrderSuccess />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<ProductList />} />
                  <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
                  <Route path="/admin/orders" element={<OrderList />} />
                  <Route path="/admin/order/:id" element={<OrderDetails />} />
                  <Route path="/admin/coupons" element={<CouponList />} />
                  <Route path="/admin/transactions" element={<Transactions />} />
                  <Route path="/admin/phonepe" element={<PhonePeConfig />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}


export default App;
