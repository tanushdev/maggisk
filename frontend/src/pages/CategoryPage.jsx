import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { ChevronRight, Filter, ShoppingBag } from 'lucide-react';

const CategoryPage = ({ type }) => {
  const { slug } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const section = queryParams.get('section');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getProductsData = async () => {
      try {
        setLoading(true);

        const params = { 
          pageNumber: page, 
          pageSize: 12 
        };

        if (section) {
          params.headerSection = section;
        }

        if (type === 'stone') {
          // Send original slug to handle complex cases, backend handles regex
          params.stoneType = slug.replace(/-/g, ' ');
        } else if (type === 'category') {
          params.categorySlug = slug;
        }

        const { data } = await fetchProducts(params);
        
        let fetchedProducts = [];
        if (data.products) {
          fetchedProducts = data.products;
          setPages(data.pages);
          setTotal(data.total);
        } else {
          fetchedProducts = data;
          setPages(1);
          setTotal(data.length);
        }

        setProducts(fetchedProducts);

        // Determine Display Name more accurately (Manifesting the correct collection title)
        const formattedSlug = slug.replace(/-/g, ' ');
        const baseDisplayName = formattedSlug.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        if (type === 'category' && fetchedProducts.length > 0) {
          const cat = fetchedProducts[0].categories.find(c => c.toLowerCase() === formattedSlug.toLowerCase());
          setDisplayName(cat || baseDisplayName);
        } else if (type === 'stone' && fetchedProducts.length > 0) {
          // Find the specific stone name from the product's stoneType array
          const stone = fetchedProducts[0].stoneType.find(s => s.toLowerCase() === formattedSlug.toLowerCase());
          setDisplayName(stone || baseDisplayName);
        } else {
          setDisplayName(baseDisplayName);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getProductsData();
    window.scrollTo(0, 0);
  }, [type, slug, page]);

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
            Showing artifacts {((page - 1) * 12) + 1} - {Math.min(page * 12, total)} of {total}
          </span>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-20">
              {products.map((product) => {
                const hasSale = product.sale_price > 0 && product.sale_price < product.price;
                const displayPrice = hasSale ? product.sale_price : product.price;
                const originalPrice = hasSale ? product.price : null;

                return (
                  <Link
                    key={product._id}
                    to={`/product/${product.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-[4/5] bg-theme-cream overflow-hidden mb-6">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {hasSale && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest py-1 px-2">
                          Sale
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform">
                          <ShoppingBag size={20} className="text-gray-900" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-base font-serif text-gray-900 group-hover:text-theme-rust transition-colors mb-2 leading-tight">
                      {product.title}
                    </h3>
                    <div className="flex flex-col gap-1">
                      {hasSale ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-gray-400">After Sale:</span>
                            <span className="text-sm font-bold text-theme-rust font-sans">₹{displayPrice}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-gray-400">Before Sale:</span>
                            <span className="text-xs text-gray-400 line-through font-sans">₹{originalPrice}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-widest text-gray-400">Price:</span>
                          <span className="text-sm font-bold text-gray-900 font-sans">₹{displayPrice}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-6 py-3 border border-gray-100 text-[10px] uppercase tracking-widest font-bold disabled:opacity-30 hover:bg-gray-50 transition-all"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 text-[10px] font-bold transition-all border ${page === i + 1 ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-100 text-gray-400 hover:border-gray-900 hover:text-gray-900'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={page === pages}
                  onClick={() => setPage(page + 1)}
                  className="px-6 py-3 border border-gray-100 text-[10px] uppercase tracking-widest font-bold disabled:opacity-30 hover:bg-gray-50 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
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