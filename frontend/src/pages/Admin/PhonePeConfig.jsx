import React, { useState, useEffect } from 'react';
import { fetchConfigs, saveConfig } from '../../services/api';
import { ChevronRight, Save, Layout, CreditCard, Shield, Globe, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        data.forEach(c => {
          configMap[c.key] = c.value;
        });
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
      alert('Celestial Settings Synchronized');
    } catch (err) {
      console.error('Error saving configs:', err);
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 uppercase tracking-tighter">
              PhonePe Integration
            </h1>
            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-gray-400 uppercase font-bold">
              <Link to="/admin" className="hover:text-theme-rust">Sanctum</Link>
              <ChevronRight size={10} />
              <span className="text-gray-900">Oracle Config</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 md:p-12 rounded-sm border border-gray-50 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                  <CreditCard size={120} />
               </div>
               
               <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-50 text-xs font-bold text-gray-900 uppercase tracking-widest relative z-10">
                  <Terminal size={20} className="text-theme-rust" /> Merchant Resonance
               </div>

               <div className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Merchant ID</label>
                      <input 
                        type="text" 
                        value={configs.phonepe_merchant_id} 
                        onChange={(e) => setConfigs({...configs, phonepe_merchant_id: e.target.value})} 
                        className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm font-bold" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Salt Index</label>
                      <input 
                        type="text" 
                        value={configs.phonepe_salt_index} 
                        onChange={(e) => setConfigs({...configs, phonepe_salt_index: e.target.value})} 
                        className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm font-bold" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Salt Key (Master Resonance)</label>
                    <input 
                      type="password" 
                      value={configs.phonepe_salt_key} 
                      onChange={(e) => setConfigs({...configs, phonepe_salt_key: e.target.value})} 
                      className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm font-bold" 
                    />
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-sm border border-gray-50 shadow-sm">
               <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-50 text-xs font-bold text-gray-900 uppercase tracking-widest">
                  <Globe size={20} className="text-theme-rust" /> Endpoint Alignment
               </div>

               <div className="space-y-8">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Base URL (Ethereal Link)</label>
                    <input 
                      type="text" 
                      value={configs.phonepe_base_url} 
                      onChange={(e) => setConfigs({...configs, phonepe_base_url: e.target.value})} 
                      className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm font-medium" 
                    />
                    <p className="text-[9px] text-gray-400 mt-2 italic uppercase">Sandbox: https://api-preprod.phonepe.com/apis/pg-sandbox</p>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Callback URL (Echo Chamber)</label>
                    <input 
                      type="text" 
                      value={configs.phonepe_callback_url} 
                      onChange={(e) => setConfigs({...configs, phonepe_callback_url: e.target.value})} 
                      className="w-full bg-theme-cream border-none p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm font-medium" 
                    />
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-50 border-t-4 border-t-theme-rust">
               <div className="flex items-center gap-3 mb-8 text-xs font-bold text-gray-900 uppercase tracking-widest">
                  <Shield size={18} className="text-theme-rust" /> Security Ward
               </div>
               <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-tighter mb-8">
                  Ensure all keys are transferred directly from your PhonePe Dashboard. Any minor fracture in the resonance will lead to failed manifestations.
               </p>
               <button 
                 type="submit" 
                 disabled={saving}
                 className="w-full bg-gray-900 text-white py-5 px-6 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-theme-rust transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200 disabled:bg-gray-400"
               >
                 {saving ? 'Synchronizing...' : <><Save size={16} /> Seal Config</>}
               </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhonePeConfig;
