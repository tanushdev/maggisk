import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById, createProduct, updateProduct } from '../../services/api';
import { ChevronRight, Save, X, Image as ImageIcon, Sparkles, Layout, Info } from 'lucide-react';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    discountPrice: 0,
    shortDescription: '',
    description: '',
    category: '',
    headerSection: 'Category',
    stoneType: '',
    countInStock: 0,
    metaTitle: '',
    metaDescription: '',
    images: []
  });


  const [imageInput, setImageInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProductById(id);
        setFormData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!isNew) fetchProduct();
  }, [id, isNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNew) {
        await createProduct(formData);
      } else {
        await updateProduct(id, formData); 
      }

      navigate('/admin/products');
    } catch (err) {
      console.error(err);
    }
  };


  const addImage = () => {
    if (imageInput) {
      setFormData({ ...formData, images: [...formData.images, imageInput] });
      setImageInput('');
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-theme-cream">
       <div className="w-10 h-10 border-4 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-theme-cream min-h-screen py-20 font-sans">


      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
              {isNew ? 'Forge Artifact' : 'Refine Artifact'}
            </h1>
            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-gray-400 uppercase font-bold">
              <Link to="/admin" className="hover:text-theme-rust">Admin</Link>
              <ChevronRight size={10} />
              <Link to="/admin/products" className="hover:text-theme-rust">Products</Link>
              <ChevronRight size={10} />
              <span className="text-gray-900">{isNew ? 'Discovery' : 'Modification'}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/admin/products')}
            className="text-gray-400 hover:text-gray-900 flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold transition-all"
          >
            <X size={16} /> Discard Changes
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-50 text-xs font-bold text-gray-900 uppercase tracking-widest">
                 <Sparkles size={20} className="text-theme-rust" /> Essential Essence
              </div>
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Sacred Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Celestial Amethyst Cluster"
                    className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all font-bold uppercase tracking-wider text-sm" 
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Short Lore (Above Cart)</label>
                  <textarea 
                    rows="3" 
                    value={formData.shortDescription} 
                    onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} 
                    placeholder="A brief resonance..."
                    className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all font-light leading-relaxed"
                  ></textarea>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Ancient Lore (Description)</label>
                  <textarea 
                    rows="8" 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    placeholder="Describe the energy and origin..."
                    className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all font-light leading-relaxed"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-50 text-xs font-bold text-gray-900 uppercase tracking-widest">
                 <ImageIcon size={20} className="text-theme-rust" /> Visual Visions
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={imageInput} 
                    onChange={(e) => setImageInput(e.target.value)} 
                    placeholder="Paste image resonance (URL)..."
                    className="flex-1 bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-xs" 
                  />
                  <button 
                    type="button" 
                    onClick={addImage}
                    className="bg-gray-900 text-white px-6 uppercase tracking-widest text-[10px] font-bold hover:bg-theme-rust transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square bg-gray-50 rounded-sm overflow-hidden group">
                      <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50 text-xs font-bold text-gray-900 uppercase tracking-widest">
                 <Layout size={18} className="text-theme-rust" /> Classification
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-2 block">Header Section</label>
                  <select 
                    value={formData.headerSection || 'Category'} 
                    onChange={(e) => setFormData({...formData, headerSection: e.target.value})} 
                    className="w-full bg-theme-cream border-none p-3 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm font-bold uppercase tracking-wider"
                  >
                    <option value="Category">Shop By Category</option>
                    <option value="Stone">Shop By Stone</option>
                    <option value="Home Decor">Home Decor</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-2 block">Value / Name</label>
                  <input 
                    type="text" 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})} 
                    placeholder="e.g. Bracelet or Crystal Ball"
                    className="w-full bg-theme-cream border-none p-3 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm" 
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-2 block">Stone Type</label>
                  <input 
                    type="text" 
                    value={formData.stoneType} 
                    onChange={(e) => setFormData({...formData, stoneType: e.target.value})} 
                    className="w-full bg-theme-cream border-none p-3 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-2 block">Price (₹)</label>
                    <input 
                      type="number" 
                      value={formData.price} 
                      onChange={(e) => setFormData({...formData, price: e.target.value})} 
                      className="w-full bg-theme-cream border-none p-3 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm font-sans" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-2 block">Stock</label>
                    <input 
                      type="number" 
                      value={formData.countInStock} 
                      onChange={(e) => setFormData({...formData, countInStock: e.target.value})} 
                      className="w-full bg-theme-cream border-none p-3 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm font-sans" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50 text-xs font-bold text-gray-900 uppercase tracking-widest">
                 <Info size={18} className="text-theme-rust" /> Meta Echoes
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-2 block">Spirit Title (SEO)</label>
                  <input 
                    type="text" 
                    value={formData.metaTitle} 
                    onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} 
                    className="w-full bg-theme-cream border-none p-3 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-xs" 
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gray-900 text-white py-5 px-6 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-theme-rust transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200"
            >
              <Save size={16} /> Forge Collection Piece
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
