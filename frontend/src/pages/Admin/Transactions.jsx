import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../../services/api';
import { CheckCircle, Wallet, TrendingUp, ShoppingCart } from 'lucide-react';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        setLoading(true);
        const { data } = await fetchOrders();
        setTransactions((data || []).filter(o => o.isPaid));
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    getTransactions();
  }, []);

  if (loading) return (
    <div className="py-20 flex justify-center">
       <div className="w-8 h-8 border-2 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const totalRevenue = transactions.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="space-y-8 font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Financial Ledger</h1>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Transaction history and revenue tracking</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                 <TrendingUp size={20} />
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">₹{totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                 <ShoppingCart size={20} />
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Success Transactions</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{transactions.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gray-50 text-gray-600 rounded-lg">
                 <Wallet size={20} />
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Gateway Status</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
               <p className="text-xs font-bold text-gray-900 uppercase">Live Systems</p>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4">Transaction ID / Order ID</th>
                <th className="px-6 py-4">Patron / contact</th>
                <th className="px-6 py-4">Shipping destination</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Settlement</th>
                <th className="px-6 py-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest leading-none mb-1">
                      {t.paymentResult?.merchantTransactionId || t.paymentResult?.id || 'N/A'}
                    </p>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tight">Order: #{t._id.slice(-8).toUpperCase()}</p>
                  </td>
                  <td className="px-6 py-4 min-w-[200px]">
                    <p className="text-xs font-bold text-gray-900 leading-none mb-1">{t.shippingAddress?.firstName} {t.shippingAddress?.lastName}</p>
                    <p className="text-[9px] text-theme-rust font-bold uppercase leading-none mb-1">{t.shippingAddress?.email || t.user?.email}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">{t.shippingAddress?.phone || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4 min-w-[200px]">
                    <p className="text-[10px] font-bold text-gray-600 leading-tight uppercase">
                      {t.shippingAddress?.address}, {t.shippingAddress?.city}
                    </p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                      PIN: {t.shippingAddress?.postalCode}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm text-gray-900">₹{t.totalPrice.toFixed(0)}</td>
                  <td className="px-6 py-4">
                    <p className="text-[10px] text-gray-900 font-bold uppercase tracking-widest">
                       {new Date(t.paidAt || t.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-[8px] text-gray-400 font-bold uppercase">{t.paymentMethod}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-[8px] font-bold uppercase py-1 px-2.5 bg-green-50 text-green-600 border border-green-100 rounded-md">
                       <CheckCircle size={10} /> Validated
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">No transaction history detected</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
