import React, { useEffect, useState } from 'react';
import { fetchCoupons, createCoupon, deleteCoupon } from '../../services/api';
import { Tag, Plus, Trash2, Calendar, X } from 'lucide-react';

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
      setLoading(true);
      const { data } = await fetchCoupons();
      setCoupons(data || []);
    } catch (err) {
      console.error('Coupon fetch error:', err);
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
      alert('Coupon created successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id);
        getCoupons();
      } catch (err) {
        alert('Error deleting coupon');
      }
    }
  };

  if (loading) return (
    <div className="py-20 flex justify-center">
       <div className="w-8 h-8 border-2 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-end gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Coupons & Promotions</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Manage your store's promotional offers</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all border ${
            showAdd 
              ? 'bg-white border-gray-200 text-gray-500 hover:text-gray-900' 
              : 'bg-gray-900 border-gray-900 text-white hover:bg-theme-rust'
          }`}
        >
          {showAdd ? <X size={16} /> : <Plus size={16} />} 
          {showAdd ? 'Cancel' : 'Add New Coupon'}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm animate-in slide-in-from-top-4 duration-300">
           <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
              <div className="md:col-span-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Coupon Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="EX: SAVE10"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-bold rounded-md focus:border-theme-rust outline-none transition-all"
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Discount</label>
                <input 
                  type="number" 
                  required
                  value={newCoupon.discount}
                  onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-bold rounded-md focus:border-theme-rust outline-none transition-all"
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Type</label>
                <select 
                  value={newCoupon.discountType}
                  onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-bold rounded-md focus:border-theme-rust outline-none transition-all"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Expiry Date</label>
                <div className="relative">
                  <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input 
                    type="date" 
                    required
                    value={newCoupon.expiry}
                    onChange={(e) => setNewCoupon({...newCoupon, expiry: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-bold rounded-md focus:border-theme-rust outline-none pr-10"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="bg-theme-rust text-white py-3 px-6 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-all rounded-lg shadow-sm"
              >
                Create
              </button>
           </form>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4">Coupon Info</th>
                <th className="px-6 py-4">Benefit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Expiration</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Tag size={14} className="text-theme-rust" />
                       <span className="text-sm font-bold text-gray-900">{c.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                        {c.discountType === 'percentage' ? `${c.discount}% OFF` : `₹${c.discount} FLAT`}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     {new Date(c.expiry) > new Date() ? (
                       <span className="text-[8px] font-bold uppercase py-1 px-2.5 bg-green-50 text-green-600 border border-green-100 rounded-md">Active</span>
                     ) : (
                       <span className="text-[8px] font-bold uppercase py-1 px-2.5 bg-red-50 text-red-600 border border-red-100 rounded-md">Expired</span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-bold uppercase">
                     {new Date(c.expiry).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1.5 min-w-[120px]">
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-theme-rust" style={{ width: `${Math.min((c.usedCount / c.usageLimit) * 100, 100)}%` }}></div>
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-right">
                           {c.usedCount} / {c.usageLimit} Used
                        </span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(c._id)} 
                      className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">No active coupons configured</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponList;
