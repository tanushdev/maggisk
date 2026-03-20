import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, Send, Sparkles } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await forgotPassword(email);
      setMessage('A sacred recovery link has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'The cosmic energy failed to reach you. Please try again.');
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
          <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Recover Sanctum</h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-black">Lost your resonance?</p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 text-red-600 text-[10px] uppercase tracking-widest font-black text-center animate-fadeIn">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-8 p-4 bg-green-50 border-2 border-green-100 text-green-600 text-[10px] uppercase tracking-widest font-black text-center animate-fadeIn">
              {message}
            </div>
          )}

          {!message ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-[11px] text-gray-400 font-bold leading-relaxed mb-6 uppercase tracking-wider text-center">
                Enter your email address and we'll send you a link to reset your password and restore your connection.
              </p>
              <div>
                <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} strokeWidth={2.5} />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@soul.com"
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
                    <Send size={18} strokeWidth={3} /> Send Recovery Link
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-500 rounded-full mb-6">
                 <Sparkles size={32} />
               </div>
               <p className="text-sm text-gray-600 font-bold mb-8">Please check your inbox (and spam folder) for further instructions.</p>
               <Link to="/login" className="inline-flex items-center gap-2 text-[11px] font-black text-theme-rust uppercase tracking-widest">
                  <ArrowLeft size={16} strokeWidth={3} /> Return to Login
               </Link>
            </div>
          )}

          {!message && (
            <div className="mt-10 pt-8 border-t border-gray-50 text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-[10px] tracking-widest text-gray-400 uppercase font-bold hover:text-theme-rust transition-colors">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
