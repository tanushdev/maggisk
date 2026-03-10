import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../../services/api';
import { CreditCard, ChevronRight, ArrowUpRight, CheckCircle, Clock, Wallet } from 'lucide-react';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const { data } = await fetchOrders();
        // Filter only paid orders or show all with payment details
        setTransactions(data.filter(o => o.isPaid));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getTransactions();
  }, []);

  return (
    <div className="bg-theme-cream min-h-screen py-20 font-sans">


      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 uppercase tracking-tight">Cosmic Treasury</h1>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-gray-400 uppercase font-bold">
            <Link to="/admin" className="hover:text-theme-rust">Admin</Link>
            <ChevronRight size={10} />
            <span className="text-gray-900">Transactions</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="w-10 h-10 border-4 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
             <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-50">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 block">Total Soul Revenue</span>
                <p className="text-3xl font-bold text-theme-rust tracking-tight">₹{transactions.reduce((acc, item) => acc + item.totalPrice, 0)}</p>
             </div>
             <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-50">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 block">Verified Offerings</span>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{transactions.length}</p>
             </div>
             <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-50 flex items-center justify-between">
                <div>
                   <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 block">Payment Gateway</span>
                   <p className="text-xl font-bold text-gray-900 uppercase tracking-wider">Razorpay Portal</p>
                </div>
                <div className="p-4 bg-blue-50 text-blue-500 rounded-full">
                   <Wallet size={24} />
                </div>
             </div>
          </div>
        )}


        {!loading && (
          <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Transaction ID</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Seeker</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Amount</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Offering Date</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Method</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Gateway Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 text-[10px] font-mono text-gray-400">
                        {t.paymentResult?.id || `txn_${t._id.substring(0, 10)}`}
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-medium text-gray-900">{t.user?.name || 'Guest Seeker'}</span>
                      </td>
                      <td className="px-8 py-6 font-sans font-bold text-gray-900 text-lg">₹{t.totalPrice}</td>
                      <td className="px-8 py-6">
                         <span className="text-[10px] uppercase tracking-widest text-gray-500">{t.paidAt?.substring(0, 10) || t.createdAt.substring(0, 10)}</span>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-[10px] uppercase tracking-widest font-bold py-1 px-3 bg-gray-100 rounded-sm">
                            {t.paymentMethod || 'Razorpay'}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-green-600">
                           <CheckCircle size={14} />
                           <span className="text-[10px] uppercase tracking-widest font-bold">Captured</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                     <tr>
                        <td colSpan="6" className="px-8 py-20 text-center">
                           <p className="font-serif italic text-gray-400 text-xl">The treasury vault awaits its first offering...</p>
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

export default TransactionList;
