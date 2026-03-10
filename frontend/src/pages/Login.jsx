import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ChevronRight, ShieldCheck } from 'lucide-react';

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
      setError(err.response?.data?.message || 'The cosmic gates are currently closed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-theme-cream min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-theme-coral flex items-center justify-center rounded-sm shadow-xl">
               <span className="text-white text-[10px] font-serif text-center leading-none tracking-tighter">MAGGIK<br/>STONES</span>
            </div>
          </div>
          <h1 className="text-4xl font-serif text-gray-900 mb-4 italic">Welcome, Seeker</h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">Enter the sanctuary of crystals</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-50 relative overflow-hidden">
          {/* Subtle decorative element */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-theme-rust/5 -mr-12 -mt-12 rounded-full blur-3xl"></div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-xs uppercase tracking-widest font-bold text-center animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Sacred Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@soul.com"
                  className="w-full bg-theme-cream border-none p-4 pl-12 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-3 block">Secret Key (Password)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-theme-cream border-none p-4 pl-12 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all text-sm"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 text-white py-5 px-6 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-theme-rust transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={16} /> Open Sanctuary
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-50 text-center">
            <p className="text-[10px] tracking-widest text-gray-400 uppercase font-medium">
              New to our boutique? <Link to="/register" className="text-theme-rust font-bold hover:underline underline-offset-4">Create a Seeker account</Link>
            </p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-4 text-gray-300">
           <ShieldCheck size={16} />
           <span className="text-[8px] uppercase tracking-[0.4em] font-bold">Secure Guardian Access</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
