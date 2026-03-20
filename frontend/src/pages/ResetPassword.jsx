import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldCheck, RefreshCw, Key } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { resetPassword, userInfo } = useAuth();

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match their energy.');
    }
    
    setLoading(true);
    setError('');
    try {
      await resetPassword(token, password);
      // Redirect handled by useEffect or navigate manually
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'The sacred reset failed. The link might be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfaf7] min-h-screen flex items-center justify-center py-20 px-4 font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white flex items-center justify-center rounded-2xl shadow-xl border-2 border-gray-50 overflow-hidden">
               <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-contain p-2" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">New Resonance</h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-black">Redefine your access</p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 text-red-600 text-[10px] uppercase tracking-widest font-black text-center animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 mb-2 block">New Secret Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} strokeWidth={2.5} />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-gray-50 border-2 border-transparent p-4 pl-12 rounded-2xl focus:bg-white focus:border-theme-rust outline-none transition-all text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 mb-2 block">Confirm Secret Key</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} strokeWidth={2.5} />
                <input 
                  type="password" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-gray-50 border-2 border-transparent p-4 pl-12 rounded-2xl focus:bg-white focus:border-theme-rust outline-none transition-all text-sm font-bold"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 text-white py-5 px-6 uppercase tracking-[0.2em] text-[11px] font-black hover:bg-theme-rust transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200 disabled:bg-gray-200 rounded-2xl"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <RefreshCw size={18} strokeWidth={3} /> Restore Connection
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
             <div className="flex items-center justify-center gap-2 text-gray-300">
                <Key size={14} strokeWidth={2.5} />
                <span className="text-[9px] uppercase tracking-widest font-black">Authorized Reset Protocol</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
