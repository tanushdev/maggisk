import React, { useState, useEffect } from 'react';
import { fetchConfigs, saveConfig } from '../../services/api';
import { Save, Shield, Globe, Terminal, Lock } from 'lucide-react';

const PhonePeConfig = () => {
  const [configs, setConfigs] = useState({
    phonepe_merchant_id: '',
    phonepe_salt_key: '',
    phonepe_salt_index: '',
    phonepe_base_url: '',
    phonepe_callback_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getConfigs = async () => {
      try {
        setLoading(true);
        const { data } = await fetchConfigs();
        const configMap = {};
        if (Array.isArray(data)) {
            data.forEach(c => {
                configMap[c.key] = c.value;
            });
        }
        setConfigs(prev => ({ ...prev, ...configMap }));
      } catch (err) {
        console.error('Error fetching configs:', err);
      } finally {
        setLoading(false);
      }
    };
    getConfigs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const promises = Object.entries(configs).map(([key, value]) => 
        saveConfig({ key, value })
      );
      await Promise.all(promises);
      alert('Merchant configuration updated successfully');
    } catch (err) {
      console.error('Error saving configs:', err);
      alert('Failed to update configurations');
    } finally {
      setSaving(false);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Merchant Configuration</h1>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Setup and manage your payment gateway credentials</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Section */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
             <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-50 uppercase text-[10px] font-bold text-gray-900 tracking-widest">
                <Terminal size={18} className="text-gray-400" /> Merchant Identity
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Merchant ID</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter Merchant ID"
                    value={configs.phonepe_merchant_id} 
                    onChange={(e) => setConfigs({...configs, phonepe_merchant_id: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-bold rounded-lg focus:border-theme-rust outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Salt Index</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter Salt Index"
                    value={configs.phonepe_salt_index} 
                    onChange={(e) => setConfigs({...configs, phonepe_salt_index: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-bold rounded-lg focus:border-theme-rust outline-none transition-all" 
                  />
                </div>
             </div>

             <div className="mt-6">
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Secret Salt Key</label>
                <div className="relative">
                    <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                    type="password" 
                    required
                    placeholder="••••••••••••••••"
                    value={configs.phonepe_salt_key} 
                    onChange={(e) => setConfigs({...configs, phonepe_salt_key: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-bold rounded-lg focus:border-theme-rust outline-none transition-all pr-12" 
                    />
                </div>
             </div>
          </div>

          {/* Endpoints Section */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
             <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-50 uppercase text-[10px] font-bold text-gray-900 tracking-widest">
                <Globe size={18} className="text-gray-400" /> Service Routing
             </div>

             <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Gateway Base URL</label>
                  <input 
                    type="text" 
                    required
                    placeholder="https://api.phonepe.com/..."
                    value={configs.phonepe_base_url} 
                    onChange={(e) => setConfigs({...configs, phonepe_base_url: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-bold rounded-lg focus:border-theme-rust outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block tracking-widest">Post-Transaction Callback URL</label>
                  <input 
                    type="text" 
                    required
                    placeholder="https://maggikstones.com/api/payment/status"
                    value={configs.phonepe_callback_url} 
                    onChange={(e) => setConfigs({...configs, phonepe_callback_url: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-bold rounded-lg focus:border-theme-rust outline-none transition-all" 
                  />
                  <p className="text-[9px] text-gray-400 mt-2 uppercase font-bold tracking-tight">Automated redirect destination after payment sequence</p>
                </div>
             </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm sticky top-24">
             <div className="flex items-center gap-2 mb-6 text-[10px] font-bold text-gray-900 uppercase tracking-widest">
                <Shield size={18} className="text-green-600" /> System Integrity
             </div>
             <p className="text-[11px] text-gray-500 font-bold mb-8 uppercase leading-none tracking-tight">
                Merchant keys are handled via background secure relay. Access is restricted to authorized administrative nodes.
             </p>
             <button 
               type="submit" 
               disabled={saving}
               className="w-full bg-gray-900 text-white py-4 px-6 text-xs font-bold uppercase tracking-widest hover:bg-theme-rust transition-all flex items-center justify-center gap-3 rounded-lg disabled:bg-gray-100 shadow-sm"
             >
               {saving ? 'Syncing...' : <><Save size={18} /> Save Settings</>}
             </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PhonePeConfig;
