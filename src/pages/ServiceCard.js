import React, { useState } from 'react';
import { AlertCircle, CreditCard, RefreshCw, ShoppingCart, User } from 'lucide-react';

const WalletApp = () => {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  
  // Transaction history data
  const transactions = [
    {
      id: 1,
      type: 'Payment',
      date: '22/3/2025 5:32:55 pm',
      upiId: '2786387463877',
      category: 'PAYMENT',
      amount: -8398.80
    },
    {
      id: 2,
      type: 'Restaurant Website',
      date: '22/3/2025 5:32:54 pm',
      quantity: 1,
      category: 'PAYMENT',
      amount: -8398.80
    },
    {
      id: 3,
      type: 'Payment',
      date: '22/3/2025 1:43:12 pm',
      upiId: '3438589475975',
      category: 'PAYMENT',
      amount: -13998.00
    }
  ];

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleRecharge = () => {
    if (amount && !isNaN(amount)) {
      setBalance(prevBalance => prevBalance + Number(amount));
      setAmount('');
      alert('Wallet recharged successfully!');
    } else {
      alert('Please enter a valid amount');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with User Info and Balance */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Good Evening, Sandeep Singh!</h1>
              <p className="text-gray-500 mt-1">Welcome back to your wallet dashboard</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-blue-600">₹{balance.toFixed(2)}</p>
                  <button className="ml-4 text-blue-600 hover:text-blue-800 flex items-center text-sm">
                    <RefreshCw className="mr-1" size={16} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recharge Wallet Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Recharge Your Wallet</h2>
            
            <div>
              <label htmlFor="amount" className="block text-gray-600 mb-2">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter amount to recharge"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                {[500, 1000, 2000, 5000].map(quickAmount => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition text-sm"
                  >
                    ₹{quickAmount}
                  </button>
                ))}
              </div>
              
              <div className="mt-6">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Summary</h3>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">Amount</span>
                    <span className="text-sm">₹{amount || '0'}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">Fee</span>
                    <span className="text-sm">₹0.00</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{amount || '0'}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleRecharge}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center"
                >
                  <CreditCard className="mr-2" size={18} />
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
          
          {/* Activity Summary for Desktop */}
          <div className="hidden lg:block bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Activity Summary</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Today's Activity</h3>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Total Spending</span>
                  <span className="font-medium">₹30,795.60</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Number of Transactions</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-2">
                  <div className="h-2 bg-blue-600 rounded-full w-3/4"></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Previous Transactions</h3>
                <div className="space-y-3">
                  {transactions.slice(0, 2).map(transaction => (
                    <div key={transaction.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-gray-200 p-2 rounded-md mr-3">
                          <ShoppingCart className="text-gray-600" size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{transaction.type}</p>
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <p className="font-medium text-red-600">{transaction.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Transaction History - Full Width */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
            <button className="text-blue-500 hover:text-blue-700 flex items-center text-sm mt-2 md:mt-0">
              <RefreshCw className="mr-1" size={16} />
              Refresh
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map(transaction => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-100 p-2 rounded-md mr-3">
                          <ShoppingCart className="text-gray-600" size={18} />
                        </div>
                        <span className="font-medium text-gray-800">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.upiId && <div>UPI ID: {transaction.upiId}</div>}
                      {transaction.quantity && <div>Quantity: {transaction.quantity}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-red-600">
                      {transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Transaction List (shows on small screens only) */}
          <div className="lg:hidden mt-4 space-y-4">
            {transactions.map(transaction => (
              <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-md mr-3">
                      <ShoppingCart className="text-gray-600" size={18} />
                    </div>
                    <span className="font-medium text-gray-800">{transaction.type}</span>
                  </div>
                  <span className="font-medium text-red-600">{transaction.amount.toFixed(2)}</span>
                </div>
                <div className="ml-11 text-sm text-gray-500">
                  <p>{transaction.date}</p>
                  <p className="mt-1">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
                      {transaction.category}
                    </span>
                  </p>
                  {transaction.upiId && <p className="mt-1">UPI ID: {transaction.upiId}</p>}
                  {transaction.quantity && <p className="mt-1">Quantity: {transaction.quantity}</p>}
                </div>
              </div>
            ))}
          </div>
          
          {transactions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No transactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletApp;