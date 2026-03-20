import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { ChevronRight, Filter, ShoppingBag } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getSearchResults = async () => {
      try {
        setLoading(true);
        const params = {
          keyword: keyword,
          pageNumber: page,
          pageSize: 12
        };

        const { data } = await fetchProducts(params);

        if (data.products) {
          setProducts(data.products);
          setPages(data.pages);
          setTotal(data.total);
        } else {
          setProducts(data);
          setPages(1);
          setTotal(data.length);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    getSearchResults();
    window.scrollTo(0, 0);
  }, [keyword, page]);

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
          <span className="text-gray-900">Search Results</span>
        </div>

        {/* Header */}
        <div className="mb-12 border-b border-gray-50 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-gray-900">
            Results for: <span className="text-theme-rust italic">"{keyword}"</span>
          </h1>
          <p className="text-sm text-gray-500 mt-4 font-medium uppercase tracking-widest">
            {total} Artifacts discovered
          </p>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-20">
              {products.map((product) => {
                const hasSale = product.salePrice > 0 && product.salePrice < product.price;
                const displayPrice = hasSale ? product.salePrice : product.price;
                const originalPrice = hasSale ? product.price : null;

                return (
                  <Link
                    key={product._id}
                    to={`/product/${product.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-[4/5] bg-theme-cream overflow-hidden mb-6">
                      <img
                        src={product.images?.[0] || '/images/logo.jpg'}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {hasSale && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest py-1 px-2">
                          Sale
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform">
                          <ShoppingBag size={20} className="text-gray-900" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-base font-serif text-gray-900 group-hover:text-theme-rust transition-colors mb-2 leading-tight">
                      {product.name}
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

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-6 py-3 border border-gray-100 text-[10px] uppercase tracking-widest font-bold disabled:opacity-30 hover:bg-gray-50 transition-all font-sans"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 text-[10px] font-bold font-sans transition-all border ${page === i + 1 ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-100 text-gray-400 hover:border-gray-900 hover:text-gray-900'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={page === pages}
                  onClick={() => setPage(page + 1)}
                  className="px-6 py-3 border border-gray-100 text-[10px] uppercase tracking-widest font-bold disabled:opacity-30 hover:bg-gray-50 transition-all font-sans"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-32 text-center">
            <h3 className="text-xl font-serif text-gray-400 uppercase tracking-widest">No artifacts found matching your quest.</h3>
            <p className="mt-4 text-gray-500 mb-8">Try searching for a different crystal, stone, or intention.</p>
            <Link to="/" className="inline-block px-10 py-4 border-2 border-gray-900 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
              Return to Sanctuary
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
