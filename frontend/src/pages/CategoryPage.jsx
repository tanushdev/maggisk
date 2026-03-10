import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { ChevronRight, Filter, ShoppingBag } from 'lucide-react';

const CategoryPage = ({ type }) => {
  const { slug } = useParams(); // type is passed as prop

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProducts();
        
        const formattedSlug = slug.replace(/-/g, ' ');
        setDisplayName(formattedSlug.charAt(0).toUpperCase() + formattedSlug.slice(1));

        const filtered = data.filter(p => {
          if (type === 'category') {
            return p.category.toLowerCase() === formattedSlug.toLowerCase();
          } else {
            return p.stoneType.toLowerCase() === formattedSlug.toLowerCase();
          }
        });
        
        setProducts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [type, slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-theme-cream">
       <div className="w-10 h-10 border-4 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-gray-400 uppercase font-bold mb-8">
          <Link to="/" className="hover:text-theme-rust">Home</Link>
          <ChevronRight size={10} />
          <span className="text-gray-400">{type === 'category' ? 'Collection' : 'Lore'}</span>
          <ChevronRight size={10} />
          <span className="text-gray-900">{displayName}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-gray-900 capitalize">
              {displayName}
            </h1>
            <p className="text-sm text-gray-500 mt-4 max-w-xl">
              Discover our curated selection of {displayName} artifacts, each carrying unique energy and ancient significance.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-6 py-3 border border-gray-100 text-[10px] uppercase tracking-widest font-bold hover:bg-gray-50 transition-colors">
               <Filter size={14} /> Filter
             </button>
             <select className="px-6 py-3 border border-gray-100 text-[10px] uppercase tracking-widest font-bold bg-transparent outline-none">
               <option>Sort by Default</option>
               <option>Price: Low to High</option>
               <option>Price: High to Low</option>
               <option>Newest Arrivals</option>
             </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 border-b border-gray-50 pb-4">
           <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
             Showing {products.length} {products.length === 1 ? 'result' : 'results'}
           </span>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product) => (
              <Link 
                key={product._id} 
                to={`/product/${product.slug}`}
                className="group"
              >
                <div className="relative aspect-[4/5] bg-theme-cream overflow-hidden mb-6">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform">
                      <ShoppingBag size={20} className="text-gray-900" />
                    </button>
                  </div>
                </div>
                <h3 className="text-base font-serif text-gray-900 group-hover:text-theme-rust transition-colors mb-2 leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">₹{product.price}</span>
                  {product.discountPrice > 0 && (
                    <span className="text-[10px] text-red-400 line-through">₹{product.discountPrice}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <h3 className="text-xl font-serif text-gray-400">No treasures found in this realm yet.</h3>
            <Link to="/" className="inline-block mt-8 text-[10px] uppercase tracking-widest font-bold text-theme-rust hover:underline">
              Return to Sanctuary
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
