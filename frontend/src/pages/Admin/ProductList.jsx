import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../../services/api'; // Added deleteProduct
import { Edit, Trash2, Plus, Package, ShoppingBag, ChevronRight } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        console.error('Failed to delete product:', err);
        alert('Failed to delete product.');
      }
    }
  };

  return (
    <div className="bg-theme-cream min-h-screen py-20 font-sans">


      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 uppercase tracking-tight">Inventory Sanctum</h1>
            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-gray-400 uppercase font-bold">
              <Link to="/admin" className="hover:text-theme-rust">Admin</Link>
              <ChevronRight size={10} />
              <span className="text-gray-900">Products</span>
            </div>
          </div>
          <Link 
            to="/admin/product/new/edit" 
            className="bg-gray-900 text-white px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-theme-rust transition-all flex items-center gap-3"
          >
            <Plus size={16} /> Forge New Artifact
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="w-10 h-10 border-4 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Masterpiece</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Category</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Price</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Stock</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={p.images[0]} alt={p.name} loading="lazy" className="w-12 h-12 object-cover rounded-sm grayscale group-hover:grayscale-0" />
                          <div>
                            <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">{p.name}</p>
                            <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">ID: {p._id.substring(0,8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-theme-rust px-3 py-1 bg-theme-cream rounded-full border border-theme-rust/10">{p.category}</span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-gray-900 tracking-tight">₹{p.price}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${p.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-600">{p.countInStock} Pieces</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <Link 
                              to={`/admin/product/${p._id}/edit`} 
                              className="text-gray-400 hover:text-theme-rust transition-colors"
                              title="Refine Lore"
                            >
                              <Edit size={16} />
                            </Link>
                            <button 
                              onClick={() => handleDelete(p._id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title="Dissolve from Existence"
                            >
                              <Trash2 size={16} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                     <tr>
                        <td colSpan="6" className="px-8 py-20 text-center">
                           <p className="font-bold text-gray-400 text-xl uppercase tracking-wider">No artifacts found in the sanctum...</p>
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
