import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCoupons, createCoupon, deleteCoupon } from '../../services/api';

import { Tag, Plus, Trash2, Calendar, ChevronRight, Sparkles, X } from 'lucide-react';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 0,
    discountType: 'percentage',
    expiry: '',
    usageLimit: 100
  });

  const getCoupons = async () => {
    try {
      const { data } = await fetchCoupons();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      await createCoupon({
        ...newCoupon,
        discount: Number(newCoupon.discount),
        usageLimit: Number(newCoupon.usageLimit)
      });
      setNewCoupon({ code: '', discount: 0, discountType: 'percentage', expiry: '', usageLimit: 100 });
      setShowAdd(false);
      getCoupons();
      alert('Voucher Manifested Safely');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Dissolve this manifestation from the cosmic vault?')) {
      try {
        await deleteCoupon(id);
        getCoupons();
        alert('Voucher dissolved successfully!');
      } catch (err) {
        alert('Failed to dissolve voucher');
      }
    }
  };


  return (
    <div className="bg-theme-cream min-h-screen py-20" style={{ fontFamily: 'Arial, sans-serif' }}>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 uppercase tracking-tight">Cosmic Vouchers</h1>
            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-gray-400 uppercase font-bold">
              <Link to="/admin" className="hover:text-theme-rust">Admin</Link>
              <ChevronRight size={10} />
              <span className="text-gray-900">Coupons</span>
            </div>
          </div>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="bg-gray-900 text-white px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-theme-rust transition-all flex items-center gap-3"
          >
            {showAdd ? <X size={16} /> : <Plus size={16} />} 
            {showAdd ? 'Cancel Ritual' : 'Forge New Coupon'}
          </button>
        </div>

        {showAdd && (
          <div className="bg-white p-8 md:p-12 rounded-sm shadow-xl border border-theme-rust/10 mb-12 animate-fadeInDown">
             <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50 text-xs font-bold text-gray-900 uppercase tracking-widest">
                <Sparkles size={20} className="text-theme-rust" /> Coupon Creation Ritual
             </div>
             <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Code</label>
                  <input 
                    type="text" 
                    required
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                    className="w-full bg-theme-cream border-none p-3 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm font-bold tracking-widest"
                    placeholder="e.g. CRYSTAL20"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Discount</label>
                  <input 
                    type="number" 
                    required
                    value={newCoupon.discount}
                    onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})}
                    className="w-full bg-theme-cream border-none p-3 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Type</label>
                  <select 
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value})}
                    className="w-full bg-theme-cream border-none p-3 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Fixed Amount (₹)</option>

                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Expiry</label>
                  <input 
                    type="date" 
                    required
                    value={newCoupon.expiry}
                    onChange={(e) => setNewCoupon({...newCoupon, expiry: e.target.value})}
                    className="w-full bg-theme-cream border-none p-3 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-theme-rust text-white py-3 px-6 uppercase tracking-widest text-[10px] font-bold hover:bg-gray-900 transition-all rounded-sm shadow-lg shadow-theme-rust/20"
                >
                  Confirm Forge
                </button>
             </form>
          </div>
        )}

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
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Coupon Code</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Discount</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Status</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Expires</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Usage</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {coupons.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-theme-cream text-theme-rust rounded-sm">
                              <Tag size={14} />
                           </div>
                           <span className="text-sm font-bold tracking-widest text-gray-900">{c.code}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-[10px] uppercase tracking-widest font-bold text-theme-rust">
                            {c.discountType === 'percentage' ? `${c.discount}% OFF` : `₹${c.discount} OFF`}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         {new Date(c.expiry) > new Date() ? (
                           <span className="text-[9px] uppercase tracking-widest font-bold text-green-600 py-1 px-3 bg-green-50 rounded-full">Active</span>
                         ) : (
                           <span className="text-[9px] uppercase tracking-widest font-bold text-red-600 py-1 px-3 bg-red-50 rounded-full">Expired</span>
                         )}
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase tracking-widest font-medium">
                            <Calendar size={12} />
                            {c.expiry.substring(0, 10)}
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="w-full max-w-[100px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-theme-rust" 
                              style={{ width: `${(c.usedCount / c.usageLimit) * 100}%` }}
                            ></div>
                         </div>
                         <span className="text-[9px] text-gray-400 block mt-2 tracking-widest uppercase">{c.usedCount} / {c.usageLimit} USED</span>
                      </td>
                      <td className="px-8 py-6">
                        <button 
                          onClick={() => handleDelete(c._id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>

                    </tr>
                  ))}
                  {coupons.length === 0 && (
                     <tr>
                        <td colSpan="6" className="px-8 py-20 text-center">
                           <p className="font-serif italic text-gray-400 text-xl">The cosmic vault contains no vouchers yet...</p>
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

export default CouponList;
