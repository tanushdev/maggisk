import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Search, ShoppingBag, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../services/api';

const Header = () => {
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [homeDecor, setHomeDecor] = useState([]);
  const [stones, setStones] = useState([]);
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getDropdownData = async () => {
      try {
        const { data } = await fetchProducts();

        // Categories from 'Category' section
        const catItems = [...new Set(data.filter(p => p.headerSection === 'Category').map(p => p.category))].filter(Boolean);
        setCategories(catItems);

        // Home Decor from 'Home Decor' section
        const hdItems = [...new Set(data.filter(p => p.headerSection === 'Home Decor').map(p => p.category))].filter(Boolean);
        setHomeDecor(hdItems);

        // Stones from all products stoneType
        const stoneItems = [...new Set(data.map(p => p.stoneType))].filter(Boolean);
        setStones(stoneItems);
      } catch (err) {
        console.error('Error fetching header data:', err);
      }
    };
    getDropdownData();
  }, []);



  return (
    <header className="bg-[#FFF7E9] border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-stretch justify-between h-28 md:h-[130px]">

          {/* Mobile Menu Button - Centered vertically */}
          <div className="flex items-center lg:hidden">
            <button
              className="p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo - Perfectly flush with top and bottom edges */}
          <Link to="/" className="h-full md:ml-4 lg:ml-0 flex-shrink-0">
            <img
              src="https://maggikstones.com/wp-content/uploads/2022/12/Artboard-2-e1764250088421.jpg"
              alt="MaggikStones Logo"
              className="h-full w-auto object-cover block"
            />
          </Link>

          {/* Desktop Navigation - Centered vertically */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link to="/" className="text-[16px] font-medium text-[#bda689] transition-colors">Home</Link>
            <Link to="/about" className="text-[16px] font-medium text-gray-700 hover:text-[#bda689] transition-colors">About Us</Link>

            <div className="relative group flex items-center h-full">
              <button className="flex items-center gap-1 text-[16px] font-medium text-gray-700 hover:text-[#bda689] transition-colors">
                Shop By Category <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 w-64 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-4 z-50 border border-gray-50">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
                    className="block px-6 py-3 text-[14px] uppercase tracking-widest font-bold text-gray-600 hover:bg-gray-50 hover:text-theme-rust"
                  >
                    {cat}
                  </Link>
                ))}
                {categories.length === 0 && <span className="block px-6 py-2 text-[14px] text-gray-400">Loading Categories...</span>}
              </div>
            </div>

            <div className="relative group flex items-center h-full">
              <button className="flex items-center gap-1 text-[16px] font-medium text-gray-700 hover:text-[#bda689] transition-colors">
                Shop By Stone <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 w-64 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-4 z-50 border border-gray-50">
                {stones.map((stone) => (
                  <Link
                    key={stone}
                    to={`/stone/${stone.toLowerCase().replace(/ /g, '-')}`}
                    className="block px-6 py-3 text-[14px] uppercase tracking-widest font-bold text-gray-600 hover:bg-gray-50 hover:text-theme-rust"
                  >
                    {stone}
                  </Link>
                ))}
                {stones.length === 0 && <span className="block px-6 py-2 text-[14px] text-gray-400">Loading</span>}
              </div>
            </div>

            <div className="relative group flex items-center h-full">
              <button className="flex items-center gap-1 text-[16px] font-medium text-gray-700 hover:text-[#bda689] transition-colors">
                Home Decor <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 w-64 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-4 z-50 border border-gray-50">
                {homeDecor.map((item) => (
                  <Link
                    key={item}
                    to={`/category/${item.toLowerCase().replace(/ /g, '-')}`}
                    className="block px-6 py-3 text-[14px] uppercase tracking-widest font-bold text-gray-600 hover:bg-gray-50 hover:text-theme-rust"
                  >
                    {item}
                  </Link>
                ))}
                {homeDecor.length === 0 && <span className="block px-6 py-2 text-[14px] text-gray-400">Loading Decor...</span>}
              </div>
            </div>

            <Link to="/contact" className="text-[16px] font-medium text-gray-700 hover:text-[#bda689] transition-colors">Contact Us</Link>
          </nav>


          {/* Secondary Actions - Centered vertically */}
          <div className="flex items-center space-x-6 md:space-x-8">
            {userInfo ? (

              <div className="hidden lg:flex items-center gap-6">
                <Link
                  to={userInfo.isAdmin ? "/admin" : "/profile"}
                  className="flex items-center text-gray-700 text-[16px] font-medium gap-3 hover:text-theme-rust"
                >
                  <User size={20} className="text-theme-rust" />
                  <span>{userInfo.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden lg:flex items-center text-gray-700 text-[16px] font-medium gap-3 hover:text-theme-rust">
                <User size={20} className="text-theme-rust" />
                <span>Login / Register</span>
              </Link>
            )}

            <button className="text-gray-700 hover:text-theme-rust">
              <Search size={20} />
            </button>
            <Link to="/cart" className="relative text-gray-700 hover:text-theme-rust">
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-3 -right-3 bg-theme-rust text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>

          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 p-6 shadow-xl absolute top-full left-0 w-full animate-fadeIn max-h-[80vh] overflow-y-auto z-[60]">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-sm font-bold py-2 border-b border-gray-50 uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Home</Link>

            <div className="py-2 border-b border-gray-50">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Categories</span>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <Link
                    key={cat}
                    to={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
                    className="text-xs font-medium text-gray-600 hover:text-theme-rust"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            <div className="py-2 border-b border-gray-50">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Stones</span>
              <div className="grid grid-cols-2 gap-2">
                {stones.map(stone => (
                  <Link
                    key={stone}
                    to={`/stone/${stone.toLowerCase().replace(/ /g, '-')}`}
                    className="text-xs font-medium text-gray-600 hover:text-theme-rust"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {stone}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/category/home-decor" className="text-sm font-bold py-2 border-b border-gray-50 uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Home Decor</Link>
            <Link to="/contact" className="text-sm font-bold py-2 border-b border-gray-50 uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
          </nav>
        </div>
      )}

    </header>
  );
};

export default Header;
