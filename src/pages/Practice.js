import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, CreditCard, Calendar, Clock, ShoppingCart, Gift, RefreshCw } from 'lucide-react';

const TopUpWalletSystem = () => {
  const [balance, setBalance] = useState(1850.25);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Sample transaction history - top ups, purchases, entries, and cashbacks
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'credit',
      category: 'topup',
      amount: 500.00,
      description: 'Wallet Top-up via Credit Card',
      date: '2025-07-22',
      time: '15:20',
      status: 'completed'
    },
    {
      id: 2,
      type: 'debit',
      category: 'purchase',
      amount: 299.99,
      description: 'Product Purchase - Premium Plan',
      date: '2025-07-22',
      time: '14:45',
      status: 'completed'
    },
    {
      id: 3,
      type: 'credit',
      category: 'cashback',
      amount: 45.00,
      description: 'Cashback on Recent Purchase',
      date: '2025-07-22',
      time: '11:30',
      status: 'completed'
    },
    {
      id: 4,
      type: 'debit',
      category: 'entry',
      amount: 150.00,
      description: 'Contest Entry Fee - Gaming Tournament',
      date: '2025-07-21',
      time: '18:15',
      status: 'completed'
    },
    {
      id: 5,
      type: 'credit',
      category: 'topup',
      amount: 1000.00,
      description: 'Wallet Top-up via UPI',
      date: '2025-07-21',
      time: '16:00',
      status: 'completed'
    },
    {
      id: 6,
      type: 'debit',
      category: 'purchase',
      amount: 75.50,
      description: 'In-app Purchase - Extra Features',
      date: '2025-07-21',
      time: '13:25',
      status: 'completed'
    },
    {
      id: 7,
      type: 'credit',
      category: 'cashback',
      amount: 25.75,
      description: 'Referral Cashback Reward',
      date: '2025-07-20',
      time: '20:10',
      status: 'completed'
    },
    {
      id: 8,
      type: 'debit',
      category: 'entry',
      amount: 200.00,
      description: 'Event Entry - Virtual Conference',
      date: '2025-07-20',
      time: '09:45',
      status: 'completed'
    }
  ]);

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (amount > 0) {
      const paymentMethodText = paymentMethod === 'card' ? 'Credit Card' : 
                               paymentMethod === 'upi' ? 'UPI' : 'Net Banking';
      
      const newTransaction = {
        id: transactions.length + 1,
        type: 'credit',
        category: 'topup',
        amount: amount,
        description: `Wallet Top-up via ${paymentMethodText}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        status: 'completed'
      };
      
      setTransactions([newTransaction, ...transactions]);
      setBalance(balance + amount);
      setTopUpAmount('');
      setShowTopUpModal(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTransactionIcon = (category, type) => {
    if (category === 'topup') return <Plus className="w-6 h-6" />;
    if (category === 'purchase') return <ShoppingCart className="w-6 h-6" />;
    if (category === 'entry') return <ArrowUpRight className="w-6 h-6" />;
    if (category === 'cashback') return <Gift className="w-6 h-6" />;
    return <RefreshCw className="w-6 h-6" />;
  };

  const getTransactionColor = (category, type) => {
    if (type === 'credit') {
      if (category === 'topup') return 'bg-blue-100 text-blue-600';
      if (category === 'cashback') return 'bg-green-100 text-green-600';
    } else {
      if (category === 'purchase') return 'bg-purple-100 text-purple-600';
      if (category === 'entry') return 'bg-orange-100 text-orange-600';
    }
    return 'bg-gray-100 text-gray-600';
  };

  const getCategoryBadge = (category) => {
    const badges = {
      topup: { text: 'Top-up', color: 'bg-blue-100 text-blue-800' },
      purchase: { text: 'Purchase', color: 'bg-purple-100 text-purple-800' },
      entry: { text: 'Entry', color: 'bg-orange-100 text-orange-800' },
      cashback: { text: 'Cashback', color: 'bg-green-100 text-green-800' }
    };
    
    const badge = badges[category] || { text: 'Other', color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`${badge.color} px-2 py-1 rounded-full text-xs font-medium`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 p-3 rounded-full">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Digital Wallet</h1>
                <p className="text-gray-600">Top-up and spend with ease</p>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 mb-2">Current Balance</p>
              <h2 className="text-4xl font-bold">{formatCurrency(balance)}</h2>
              <p className="text-purple-100 mt-2">Available for spending</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <Wallet className="w-12 h-12" />
            </div>
          </div>
          
          <button 
            onClick={() => setShowTopUpModal(true)}
            className="mt-6 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Money</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Top-ups</span>
            </div>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {formatCurrency(transactions.filter(t => t.category === 'topup').reduce((sum, t) => sum + t.amount, 0))}
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Purchases</span>
            </div>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {formatCurrency(transactions.filter(t => t.category === 'purchase').reduce((sum, t) => sum + t.amount, 0))}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <ArrowUpRight className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Entries</span>
            </div>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {formatCurrency(transactions.filter(t => t.category === 'entry').reduce((sum, t) => sum + t.amount, 0))}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Cashback</span>
            </div>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {formatCurrency(transactions.filter(t => t.category === 'cashback').reduce((sum, t) => sum + t.amount, 0))}
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Transaction History</h3>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>All transactions</span>
            </div>
          </div>

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${getTransactionColor(transaction.category, transaction.type)}`}>
                    {getTransactionIcon(transaction.category, transaction.type)}
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-800">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-gray-600 text-sm mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{transaction.date}</span>
                      <Clock className="w-4 h-4" />
                      <span>{transaction.time}</span>
                      {getCategoryBadge(transaction.category)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-bold text-lg ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top-up Modal */}
        {showTopUpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Add Money to Wallet</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center space-y-1 ${
                      paymentMethod === 'card' 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs">Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center space-y-1 ${
                      paymentMethod === 'upi' 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span className="text-xs">UPI</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center space-y-1 ${
                      paymentMethod === 'netbanking' 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ArrowUpRight className="w-5 h-5" />
                    <span className="text-xs">Banking</span>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Amount</label>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="Enter amount to add"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[500, 1000, 2000, 5000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setTopUpAmount(amount.toString())}
                      className="py-2 px-3 text-sm border border-gray-300 rounded-lg hover:border-purple-500 hover:text-purple-600 transition-colors"
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowTopUpModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopUp}
                  disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add Money
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopUpWalletSystem;