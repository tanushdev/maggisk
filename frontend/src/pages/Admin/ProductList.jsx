import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../../services/api';
import { Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight, Package, Grid } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');

  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await fetchProducts({ 
        pageNumber: page, 
        pageSize: 15,
        keyword: keyword
      });
      
      if (data && data.products) {
        setProducts(data.products);
        setPages(data.pages || 1);
        setTotal(data.total || data.products.length);
      } else {
        const productList = Array.isArray(data) ? data : [];
        setProducts(productList);
        setPages(1);
        setTotal(productList.length);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
    window.scrollTo(0, 0);
  }, [page, keyword]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        getProducts();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  return (
    <div className="space-y-8 font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
            <span className="bg-theme-rust/10 text-theme-rust text-[10px] font-bold px-2 py-0.5 rounded-full border border-theme-rust/20">
              {total} Total
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Manage your store's inventory and stock</p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch gap-4">
          <div className="relative flex-grow min-w-[300px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:border-theme-rust outline-none transition-all shadow-sm"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Link 
            to="/admin/product/new/edit" 
            className="bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-theme-rust transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus size={18} /> Add Product
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <div className="w-10 h-10 border-2 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Loading Products...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stone Type</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Menu Sections</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                      <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.length > 0 ? (
                      products.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded border border-gray-100 overflow-hidden flex-shrink-0 bg-white">
                              {p.images && p.images[0] ? (
                                <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200"><Grid size={20} /></div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 leading-none mb-1">{p.title}</p>
                              <p className="text-[10px] text-gray-400 font-bold">ID: {p._id.slice(-6).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold text-gray-600 px-3 py-1 bg-gray-100 rounded-full uppercase tracking-wider">
                            {p.categories?.[0] || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold text-[#bda689] px-3 py-1 bg-[#FFF7E9] rounded-full uppercase tracking-wider">
                            {p.stoneType || 'None'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(p.headerSection || []).map(sec => (
                              <span key={sec} className="text-[8px] font-bold text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">
                                {sec}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">₹{p.price}</p>
                          {p.sale_price > 0 && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter">Sale Active</p>}
                        </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${p.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <p className={`text-[11px] font-bold uppercase ${p.countInStock > 0 ? 'text-gray-900' : 'text-red-500'}`}>
                            {p.countInStock} In Stock
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link 
                               to={`/admin/product/${p._id}/edit`} 
                               className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                            >
                              <Edit size={18} />
                            </Link>
                            <button 
                               onClick={() => handleDelete(p._id)} 
                               className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                         </div>
                      </td>
                    </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-20 text-center">
                         <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No products found in the catalog</p>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Page {page} of {pages}</span>
              <div className="flex items-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  disabled={page === pages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
