import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, userInfo } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      // Redirect handled by useEffect
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfaf7] min-h-screen flex items-center justify-center py-20 px-4 font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white flex items-center justify-center rounded-2xl shadow-xl border-2 border-gray-50 overflow-hidden">
               <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-contain p-2" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Account Access</h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-black">Authorized Personnel Only</p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 text-red-600 text-[10px] uppercase tracking-widest font-black text-center animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} strokeWidth={2.5} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@maggikstones.com"
                  className="w-full bg-gray-50 border-2 border-transparent p-4 pl-12 rounded-2xl focus:bg-white focus:border-theme-rust outline-none transition-all text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 mb-2 block">Secret Key</label>
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

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 text-white py-5 px-6 uppercase tracking-[0.2em] text-[11px] font-black hover:bg-theme-rust transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200 disabled:bg-gray-200 rounded-2xl"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={18} strokeWidth={3} /> Synchronize Access
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center space-y-4">
            <p className="text-[10px] tracking-widest text-gray-400 uppercase font-bold">
              New to the Sanctum? <Link to="/register" className="text-theme-rust font-black hover:underline underline-offset-4">Create Account</Link>
            </p>
            <p className="text-[10px] tracking-widest text-gray-400 uppercase font-bold">
              Lost your Key? <Link to="/forgot-password" className="text-theme-rust font-black hover:underline underline-offset-4">Reset Password</Link>
            </p>
            <p className="text-[10px] tracking-widest text-gray-400 uppercase font-bold">
              Forgotten Credentials? <Link to="/contact" className="text-gray-900 font-black hover:underline underline-offset-4">Contact Gateway Support</Link>
            </p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-4 text-gray-300">
           <ShieldCheck size={18} strokeWidth={2.5} />
           <span className="text-[9px] uppercase tracking-[0.5em] font-black">Secure Terminal Link Active</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
