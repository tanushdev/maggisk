import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById, createProduct, updateProduct, uploadImage, fetchDistinctValues, createCategoryMeta } from '../../services/api';
import { ChevronRight, Save, X, Image as ImageIcon, Plus, Info, Layout } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder, minHeight = "100px" }) => {
  const editorRef = React.useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      if (html !== value) {
        onChange(html);
      }
    }
  };

  const toggleBold = (e) => {
    e.preventDefault();
    document.execCommand('bold', false);
    handleInput();
  };

  return (
    <div className="border border-gray-200 rounded-sm overflow-hidden flex flex-col bg-gray-50 group focus-within:border-theme-rust transition-all shadow-sm">
      <div className="bg-white border-b border-gray-100 p-2 flex items-center justify-between">
        <div className="flex gap-1">
          <button 
            type="button"
            onMouseDown={toggleBold}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-sm font-black transition-colors"
          >
            B
          </button>
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full p-4 outline-none text-sm leading-relaxed"
        style={{ minHeight }}
      />
    </div>
  );
};

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    sale_price: 0,
    short_description_html: '',
    long_description_html: '',
    categories: [],
    headerSection: ['Category'],
    stoneType: [],
    countInStock: 0,
    tags: [],
    images: []
  });

  const [loading, setLoading] = useState(false);
  const [imageInput, setImageInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Master Lists
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
    "Hearts", "Miner Miniature", "Pyramids", "Pyrite Frames", "Wish/Glass Dome Tree"
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (!isNew) {
          const { data } = await fetchProductById(id);
          const stoneType = Array.isArray(data.stoneType) ? data.stoneType : (data.stoneType ? [data.stoneType] : []);
          const categories = Array.isArray(data.categories) ? data.categories : (data.categories ? [data.categories] : []);
          setFormData({ ...data, stoneType, categories });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
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

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append('image', file);
    try {
      setLoading(true);
      const { data: uploadData } = await uploadImage(data);
      setFormData({ ...formData, images: [...formData.images, uploadData.image] });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
       <div className="w-8 h-8 border-3 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Navigation */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wider">{isNew ? 'Create Artifact' : 'Refine Artifact'}</h1>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              <Link to="/admin" className="hover:text-theme-rust">Admin</Link>
              <ChevronRight size={10} />
              <Link to="/admin/products" className="hover:text-theme-rust">Inventory</Link>
              <ChevronRight size={10} />
              <span className="text-gray-900">{isNew ? 'New Manifestation' : 'Refining'}</span>
            </div>
          </div>
          <div className="flex gap-3">
             <button onClick={() => navigate('/admin/products')} className="px-6 py-2.5 bg-white border border-gray-200 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-gray-50 transition-all flex items-center gap-2">
               <X size={14} /> Cancel
             </button>
             <button onClick={handleSubmit} className="px-8 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-theme-rust transition-all flex items-center gap-2 shadow-lg shadow-gray-200">
               <Save size={14} /> Save Changes
             </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Form Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Content & Media */}
            <div className="lg:col-span-2 space-y-8">
              {/* General Info */}
              <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm">
                <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] mb-8 pb-3 border-b border-gray-50 flex items-center gap-2">
                   <Info size={14} className="text-theme-rust" /> Description Realm
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Artifact Title</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})} 
                      className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm focus:border-theme-rust outline-none transition-all font-bold text-gray-800" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Aura Summary (Short)</label>
                    <RichTextEditor 
                      value={formData.short_description_html} 
                      onChange={(html) => setFormData({...formData, short_description_html: html})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Artifact Lore (Detailed)</label>
                    <RichTextEditor 
                      value={formData.long_description_html} 
                      onChange={(html) => setFormData({...formData, long_description_html: html})}
                      minHeight="200px"
                    />
                  </div>
                </div>
              </div>

              {/* Media Manifestation */}
              <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm">
                <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] mb-8 pb-3 border-b border-gray-50 flex items-center gap-2">
                   <ImageIcon size={14} className="text-theme-rust" /> Visual Frequency
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="relative group">
                       <input type="file" onChange={uploadFileHandler} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                       <div className="h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center group-hover:border-theme-rust transition-all">
                          <Plus size={24} className="text-gray-300 group-hover:text-theme-rust mb-2" />
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Upload Local Fragment</span>
                       </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <input 
                          type="text" 
                          value={imageInput} 
                          onChange={(e) => setImageInput(e.target.value)} 
                          placeholder="Eternal URL Link..."
                          className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm text-xs focus:border-theme-rust outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            if(imageInput) {
                              setFormData({...formData, images: [...formData.images, imageInput]});
                              setImageInput('');
                            }
                          }}
                          className="w-full py-3 bg-gray-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-theme-rust transition-all"
                        >
                          Anchor URL
                        </button>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-sm overflow-hidden border border-gray-200 group group-hover:shadow-lg transition-all">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, images: formData.images.filter((_, i) => i !== idx)})}
                          className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center p-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags Section - Manifestation Frequencies */}
              <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm">
                <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] mb-6 pb-2 border-b border-gray-50 flex items-center gap-2">
                   <Plus size={14} className="text-theme-rust" /> Search Frequencies (SEO Tags)
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Manifest tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), (tagInput && !formData.tags.includes(tagInput) && (setFormData({...formData, tags: [...formData.tags, tagInput]}), setTagInput(''))))}
                      className="flex-1 bg-gray-50 border border-gray-200 p-3 text-xs outline-none rounded-sm font-bold focus:border-theme-rust transition-all" 
                    />
                    <button type="button" onClick={() => (tagInput && !formData.tags.includes(tagInput) && (setFormData({...formData, tags: [...formData.tags, tagInput]}), setTagInput('')))} className="bg-gray-900 text-white px-4 rounded-sm hover:bg-theme-rust transition-all flex items-center justify-center"><Plus size={16}/></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.tags || []).map(tag => (
                      <span key={tag} className="flex items-center gap-1 bg-gray-50 text-gray-500 text-[9px] uppercase font-black px-3 py-1.5 border border-gray-100 rounded-sm">
                        {tag}
                        <button type="button" onClick={() => setFormData({...formData, tags: formData.tags.filter(t => t !== tag)})} className="hover:text-red-500 transition-colors"><X size={10}/></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Classification Matrix */}
            <div className="space-y-8">
              {/* Classification Trinity */}
              <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-theme-rust/5 -mr-16 -mt-16 rounded-full"></div>
                
                <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] mb-8 pb-3 border-b border-gray-50 flex items-center gap-2">
                   <Layout size={14} className="text-theme-rust" /> Classification Matrix
                </h3>

                <div className="space-y-10">
                  {/* Category Field */}
                  <div className="space-y-4">
                    <label className="text-[9px] uppercase font-bold text-gray-400 block tracking-[0.2em] border-l-2 border-theme-rust/30 pl-3">Form (Main Category)</label>
                    <div className="bg-gray-50/50 p-4 rounded-sm border border-gray-100 space-y-4 shadow-inner">
                      <div className="flex flex-wrap gap-2 min-h-[60px] content-start">
                        {formData.categories.filter(c => BASE_CATEGORIES.includes(c)).map(cat => (
                          <div key={cat} className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-200 rounded-full group hover:border-theme-rust/30 transition-all">
                            <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">{cat}</span>
                            <button type="button" onClick={() => setFormData({...formData, categories: formData.categories.filter(c => c !== cat)})} className="text-gray-300 hover:text-red-500"><X size={10} /></button>
                          </div>
                        ))}
                      </div>
                      <select 
                        value="" 
                        onChange={(e) => e.target.value && !formData.categories.includes(e.target.value) && setFormData({...formData, categories: [...formData.categories, e.target.value]})}
                        className="w-full bg-white border border-gray-200 p-3 text-[10px] font-bold uppercase tracking-widest outline-none rounded-sm shadow-sm focus:border-theme-rust transition-all"
                      >
                        <option value="">+ Append Form</option>
                        {BASE_CATEGORIES.filter(c => !formData.categories.includes(c)).sort().map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Stone Field */}
                  <div className="space-y-4">
                    <label className="text-[9px] uppercase font-bold text-gray-400 block tracking-[0.2em] border-l-2 border-[#bda689]/30 pl-3">Essence (Shop By Stone)</label>
                    <div className="bg-gray-50/50 p-4 rounded-sm border border-gray-100 space-y-4 shadow-inner">
                      <div className="flex flex-wrap gap-2 min-h-[60px] content-start">
                        {formData.stoneType.map(stone => (
                          <div key={stone} className="flex items-center gap-2 bg-white px-3 py-1.5 border border-[#bda689]/20 rounded-full group hover:border-[#bda689]/60 transition-all">
                            <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">{stone}</span>
                            <button type="button" onClick={() => setFormData({...formData, stoneType: formData.stoneType.filter(s => s !== stone)})} className="text-gray-300 hover:text-red-500"><X size={10} /></button>
                          </div>
                        ))}
                      </div>
                      <select 
                        value="" 
                        onChange={(e) => e.target.value && !formData.stoneType.includes(e.target.value) && setFormData({...formData, stoneType: [...formData.stoneType, e.target.value]})}
                        className="w-full bg-white border border-gray-200 p-3 text-[10px] font-bold uppercase tracking-widest outline-none rounded-sm shadow-sm focus:border-theme-rust transition-all"
                      >
                        <option value="">+ Imbue Essence</option>
                        {BASE_STONES.filter(s => !formData.stoneType.includes(s)).sort().map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Home Decor Field */}
                  <div className="space-y-4">
                    <label className="text-[9px] uppercase font-bold text-gray-400 block tracking-[0.2em] border-l-2 border-gray-300/30 pl-3">Space (Home Decor)</label>
                    <div className="bg-gray-50/50 p-4 rounded-sm border border-gray-100 space-y-4 shadow-inner">
                      <div className="flex flex-wrap gap-2 min-h-[60px] content-start">
                        {formData.categories.filter(c => BASE_HOME_DECOR.includes(c)).map(dec => (
                          <div key={dec} className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-200 rounded-full group hover:border-gray-400 transition-all">
                            <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">{dec}</span>
                            <button type="button" onClick={() => setFormData({...formData, categories: formData.categories.filter(c => c !== dec)})} className="text-gray-300 hover:text-red-500"><X size={10} /></button>
                          </div>
                        ))}
                      </div>
                      <select 
                        value="" 
                        onChange={(e) => e.target.value && !formData.categories.includes(e.target.value) && setFormData({...formData, categories: [...formData.categories, e.target.value]})}
                        className="w-full bg-white border border-gray-200 p-3 text-[10px] font-bold uppercase tracking-widest outline-none rounded-sm shadow-sm focus:border-theme-rust transition-all"
                      >
                        <option value="">+ Add Decor</option>
                        {BASE_HOME_DECOR.filter(d => !formData.categories.includes(d)).sort().map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pricing & Vitality */}
                <div className="mt-12 pt-8 border-t border-gray-50 space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Ritual (Regular) ₹</label>
                        <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-black outline-none rounded-sm focus:border-theme-rust" />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Grace (Sale) ₹</label>
                        <input type="number" value={formData.sale_price} onChange={(e) => setFormData({...formData, sale_price: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-black outline-none rounded-sm focus:border-theme-rust" />
                      </div>
                   </div>
                   <div>
                      <label className="text-[9px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Essence Count (Stock)</label>
                      <input type="number" value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-black outline-none rounded-sm focus:border-theme-rust" />
                   </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
