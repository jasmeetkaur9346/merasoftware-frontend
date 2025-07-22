import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, DollarSign, CreditCard, Calendar, Clock } from 'lucide-react';

const WalletSystem = () => {
  const [balance, setBalance] = useState(2450.75);
  const [transferAmount, setTransferAmount] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [bankAccount, setBankAccount] = useState('****1234');
  
  // Sample transaction history - commission payments and bank transfers
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'credit',
      amount: 150.00,
      description: 'Commission Payment - Order #ORD001',
      date: '2025-07-22',
      time: '14:30',
      status: 'completed'
    },
    {
      id: 2,
      type: 'debit',
      amount: 500.00,
      description: 'Bank Transfer to Account ****1234',
      date: '2025-07-22',
      time: '10:15',
      status: 'completed'
    },
    {
      id: 3,
      type: 'credit',
      amount: 75.50,
      description: 'Commission Payment - Order #ORD002',
      date: '2025-07-21',
      time: '16:45',
      status: 'completed'
    },
    {
      id: 4,
      type: 'credit',
      amount: 225.25,
      description: 'Commission Payment - Order #ORD003',
      date: '2025-07-21',
      time: '12:20',
      status: 'completed'
    },
    {
      id: 5,
      type: 'debit',
      amount: 300.00,
      description: 'Bank Transfer to Account ****1234',
      date: '2025-07-20',
      time: '09:30',
      status: 'completed'
    },
    {
      id: 6,
      type: 'credit',
      amount: 180.00,
      description: 'Commission Payment - Order #ORD004',
      date: '2025-07-20',
      time: '11:15',
      status: 'completed'
    }
  ]);

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (amount > 0 && amount <= balance) {
      const newTransaction = {
        id: transactions.length + 1,
        type: 'debit',
        amount: amount,
        description: `Bank Transfer to Account ${bankAccount}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        status: 'completed'
      };
      
      setTransactions([newTransaction, ...transactions]);
      setBalance(balance - amount);
      setTransferAmount('');
      setShowTransferModal(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-full">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Commission Wallet</h1>
                <p className="text-gray-600">Manage your earnings and transfers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-2">Available Balance</p>
              <h2 className="text-4xl font-bold">{formatCurrency(balance)}</h2>
              <p className="text-blue-100 mt-2">Last updated: Today, 2:30 PM</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <DollarSign className="w-12 h-12" />
            </div>
          </div>
          
          <button 
            onClick={() => setShowTransferModal(true)}
            className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
          >
            <ArrowUpRight className="w-5 h-5" />
            <span>Transfer to Bank</span>
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Transaction History</h3>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>Last 7 days</span>
            </div>
          </div>

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    transaction.type === 'credit' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? 
                      <ArrowDownLeft className="w-6 h-6" /> : 
                      <ArrowUpRight className="w-6 h-6" />
                    }
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-800">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{transaction.date}</span>
                      <Clock className="w-4 h-4" />
                      <span>{transaction.time}</span>
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

        {/* Transfer Modal */}
        {showTransferModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Transfer to Bank Account</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Bank Account</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-xl">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800">{bankAccount}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Amount</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  max={balance}
                />
                <p className="text-sm text-gray-600 mt-2">
                  Available balance: {formatCurrency(balance)}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={!transferAmount || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > balance}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletSystem;