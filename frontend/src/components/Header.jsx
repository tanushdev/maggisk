import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Search, ShoppingBag, Menu, X, ChevronDown, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fetchProducts, fetchDistinctValues } from '../services/api';

const Header = () => {
  const { cartItems, openCart } = useCart();
  const cartItemsCount = cartItems?.reduce((a, c) => a + c.qty, 0) || 0;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [navData, setNavData] = useState({ 
    categories: [], 
    stones: [], 
    grouped: { Category: [], Stone: [], "Home Decor": [] } 
  });
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  // exact lists provided by user - precise casing
  const BASE_CATEGORIES = [
    "Anklet", "Bracelet", "Bottle", "Crystal Towers", "Crystal Balls", "Fossils", 
    "Geode/Caves", "Gemstone Trees", "Gift Box", "Ganesh Idol", "Hearts", "Jap Mala", 
    "Keychains", "Lingam", "Miner Miniature", "Pyramids", "Pendant", "Pyrite Frames", 
    "Rudraksha", "Rough Natural crystals", "Raw Crystal Chips", "Rings", "Selenite", 
    "Tumbled Stones", "Wish/Glass Dome Tree", "Zibu Coin"
  ];

  const BASE_STONES = [
    "Amethyst", "Clear Quartz", "Pyrite", "Lapis Lazuli", "Tiger Eye", 
    "Black Tourmaline", "Rose Quartz", "Citrine", "Carnelian", "Malachite", 
    "Labradorite", "Aura Quartz", "Green Jade", "Mahogany", "Red jasper", 
    "Hematite", "Smoky Quartz", "Selenite"
  ];

  const BASE_HOME_DECOR = [
    "Crystal Balls", "Crystal Towers", "Fossils", "Gemstone Trees", "Geode/Caves", 
    "Hearts", "Miner miniature", "Pyramids", "Pyrite Frames", "Wish/Glass Dome Tree"
  ];

  useEffect(() => {
    const loadNav = async () => {
      try {
        const { data } = await fetchDistinctValues();
        setNavData({
          categories: data.categories || [],
          stones: data.stones || [],
          grouped: data.groupedCategories || { Category: [], Stone: [], "Home Decor": [] }
        });
      } catch (err) {
        console.error('Nav fetch error:', err);
      }
    };
    loadNav();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          const { data } = await fetchProducts({ keyword: searchQuery, pageSize: 5 });
          setRecommendations(data.products || data || []);
        } catch (error) {
          console.error('Recommendation fetch error:', error);
        }
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setRecommendations([]);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setRecommendations([]);
    }
  };

  const slugify = (text) => text.toLowerCase().replace(/[\s\/]/g, '-');

  // Intelligent Merging: Case-insensitive unique lists
  const mergeLists = (base, dynamic) => {
    const seen = new Set(base.map(b => b.toLowerCase()));
    const final = [...base];
    if (dynamic) {
      dynamic.forEach(item => {
        if (!seen.has(item.toLowerCase())) {
          final.push(item);
          seen.add(item.toLowerCase());
        }
      });
    }
    return final;
  };

  const finalCategories = BASE_CATEGORIES;
  const finalStones = BASE_STONES;
  const finalHomeDecor = BASE_HOME_DECOR;
  
  const mobileCategories = finalCategories; // Home Decor has its own mobile section now

  return (
    <header className="bg-[#FFF7E9] border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-stretch justify-between h-28 md:h-[130px]">
          <div className="flex items-center lg:hidden">
            <button className="p-2 text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <Link to="/" className="h-full md:ml-4 lg:ml-0 flex-shrink-0">
            <img src="/images/logo.jpg" alt="Logo" className="h-full w-auto object-cover block" />
          </Link>

          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link to="/" className="text-[16px] font-medium text-[#bda689] transition-colors">Home</Link>
            <Link to="/about-us" className="text-[16px] font-medium text-gray-700 hover:text-[#bda689] transition-colors">About Us</Link>

            <div className="group flex items-center h-full">
              <button className="flex items-center gap-1 text-[16px] font-medium text-gray-700 hover:text-[#bda689] transition-colors">
                Shop By Category <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.4)] rounded-sm border-[3px] border-[#D4AF37]">
                <div className="relative p-12 min-h-[200px]">
                  <div className="absolute inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: "url('/images/27263975-1.jpg')" }} />
                  <div className="absolute inset-0 bg-black/40 -z-10 backdrop-blur-[1px]" />
                  <div className="grid grid-cols-4 gap-y-5 gap-x-8">
                    {finalCategories.map((cat) => (
                      <Link key={cat} to={`/category/${slugify(cat)}?section=Category`} className="flex items-center gap-3 text-white/90 hover:text-white transition-all group/item">
                        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 group-hover/item:bg-theme-rust transition-colors flex-shrink-0">
                          <ChevronDown size={10} className="-rotate-90 text-white" />
                        </div>
                        <span className="text-[15px] font-bold tracking-wide break-words">{cat}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="group flex items-center h-full">
              <button className="flex items-center gap-1 text-[16px] font-medium text-gray-700 hover:text-[#bda689] transition-colors">
                Shop By Stone <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.4)] rounded-sm border-[3px] border-[#D4AF37]">
                <div className="relative p-12 min-h-[200px]">
                  <div className="absolute inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: "url('/images/27263975-1.jpg')" }} />
                  <div className="absolute inset-0 bg-black/40 -z-10 backdrop-blur-[1px]" />
                  <div className="grid grid-cols-3 gap-y-5 gap-x-10">
                    {finalStones.map((stone) => (
                      <Link key={stone} to={`/stone/${slugify(stone)}?section=Stone`} className="flex items-center gap-3 text-white/90 hover:text-white transition-all group/item">
                        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 group-hover/item:bg-theme-rust transition-colors">
                          <ChevronDown size={10} className="-rotate-90 text-white" />
                        </div>
                        <span className="text-[15px] font-bold tracking-wide">{stone}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="group flex items-center h-full">
              <button className="flex items-center gap-1 text-[16px] font-medium text-gray-700 hover:text-[#bda689] transition-colors">
                Home Decor <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.4)] rounded-sm border-[3px] border-[#D4AF37]">
                <div className="relative p-12 min-h-[200px]">
                  <div className="absolute inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: "url('/images/27263975-1.jpg')" }} />
                  <div className="absolute inset-0 bg-black/40 -z-10 backdrop-blur-[1px]" />
                  <div className="grid grid-cols-3 gap-y-5 gap-x-10">
                    {finalHomeDecor.map((item) => (
                      <Link key={item} to={`/category/${slugify(item)}?section=Home Decor`} className="flex items-center gap-3 text-white/90 hover:text-white transition-all group/item">
                        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 group-hover/item:bg-theme-rust transition-colors">
                          <ChevronDown size={10} className="-rotate-90 text-white" />
                        </div>
                        <span className="text-[15px] font-bold tracking-wide">{item}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link to="/contact" className="text-[16px] font-medium text-gray-700 hover:text-[#bda689] transition-colors">Contact Us</Link>
          </nav>

          <div className="flex items-center space-x-4 md:space-x-6">
            {!isSearchOpen ? (
              <button onClick={() => setIsSearchOpen(true)} className="text-gray-700 hover:text-theme-rust transition-all p-2">
                <Search size={22} strokeWidth={1.5} />
              </button>
            ) : (
              <div className="relative">
                <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5">
                  <input autoFocus type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-32 md:w-64 text-gray-700 font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <button type="submit" className="text-gray-400 hover:text-theme-rust"><Search size={18} /></button>
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-2 text-gray-400 hover:text-red-400"><X size={16} /></button>
                </form>
              </div>
            )}
            <Link to={userInfo ? "/profile" : "/login"} className="text-gray-700 hover:text-theme-rust transition-colors p-2">
              <User size={22} strokeWidth={1.5} />
            </Link>
            <button onClick={openCart} className="relative text-gray-700 hover:text-theme-rust transition-colors p-2 group">
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-theme-rust text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 p-6 shadow-xl absolute top-full left-0 w-full z-[60] max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-sm font-bold py-2 border-b border-gray-50 uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <div className="py-2 border-b border-gray-50">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Shop By Category</span>
              <div className="grid grid-cols-2 gap-2">
                {mobileCategories.map(cat => (
                  <Link key={cat} to={`/category/${slugify(cat)}?section=Category`} className="text-xs font-medium text-gray-600 hover:text-theme-rust" onClick={() => setIsMenuOpen(false)}>{cat}</Link>
                ))}
              </div>
            </div>

            <div className="py-2 border-b border-gray-50">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Shop By Stone</span>
              <div className="grid grid-cols-2 gap-2">
                {finalStones.map(stone => (
                  <Link key={stone} to={`/stone/${slugify(stone)}?section=Stone`} className="text-xs font-medium text-gray-600 hover:text-theme-rust" onClick={() => setIsMenuOpen(false)}>{stone}</Link>
                ))}
              </div>
            </div>

            <div className="py-2 border-b border-gray-50">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Home Decor</span>
              <div className="grid grid-cols-2 gap-2">
                {finalHomeDecor.map(item => (
                  <Link key={item} to={`/category/${slugify(item)}?section=Home Decor`} className="text-xs font-medium text-gray-600 hover:text-theme-rust" onClick={() => setIsMenuOpen(false)}>{item}</Link>
                ))}
              </div>
            </div>

            <Link to="/contact" className="text-sm font-bold py-2 border-b border-gray-50 uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
            {userInfo ? (
              <button onClick={() => { logout(); navigate('/'); setIsMenuOpen(false); }} className="text-sm font-bold py-2 text-left text-red-400 uppercase tracking-widest">Logout</button>
            ) : (
              <Link to="/login" className="text-sm font-bold py-2 border-b border-gray-50 uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Login / Register</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;