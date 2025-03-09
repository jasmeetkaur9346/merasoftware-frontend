import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import Context from '../context';
import SummaryApi from '../common';
import displayINRCurrency from '../helpers/displayCurrency';
import TriangleMazeLoader from '../components/TriangleMazeLoader';
import DashboardLayout from '../components/DashboardLayout';
import WalletRecharge from '../components/WalletRecharge';

const WalletDetails = () => {
  const [walletHistory, setWalletHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state?.user?.user);
  const context = useContext(Context);
  
  // Fetch wallet history
  const fetchWalletHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.wallet.history.url, {
        method: SummaryApi.wallet.history.method,
        credentials: 'include',
        headers: {
          "content-type": 'application/json'
        }
      });
      const responseData = await response.json();
      
      if (responseData.success) {
        setWalletHistory(responseData.data);
      }
    } catch (error) {
      console.error('Error fetching wallet history:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchWalletHistory();
    // Refresh wallet balance
    if (context?.fetchWalletBalance) {
      context.fetchWalletBalance();
    }
  }, []);

  // Helper to determine transaction display properties
  const getTransactionDisplay = (transaction) => {
    if (transaction.type === 'refund') {
      return {
        sign: '+',
        color: 'text-green-600',
        title: transaction.description || 'Refund',
        icon: '↩️'
      };
    } else if (transaction.type === 'deposit') {
      return {
        sign: '+',
        color: 'text-green-600',
        title: 'Wallet Deposit',
        icon: '💰',
        status: transaction.status
      };
    } else {
      return {
        sign: '-',
        color: 'text-red-600',
        title: transaction.productId?.serviceName || 'Payment',
        icon: '🛒'
      };
    }
  };

  // Get status badge for deposit transactions
  const getStatusBadge = (status) => {
    if (!status) return null;
    
    switch(status) {
      case 'completed':
        return (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <DashboardLayout 
    user={user}
  > 
    <div className='p-4'>
      {/* Greeting & Balance Card */}
      <div className='bg-white rounded-lg p-6 mb-6 shadow'>
        <h1 className="text-2xl font-bold mb-4 capitalize">
          {getGreeting()}, {user?.name}!
        </h1>
        <div className="flex items-center justify-between">
          <span className="text-lg">Current Balance</span>
          <span className="text-blue-600 text-2xl font-bold">
            {displayINRCurrency(context?.walletBalance || 0)}
          </span>
        </div>
      </div>

      {/* Add the Wallet Recharge Component */}
      <WalletRecharge />

      {/* Transaction History */}
      <div className='bg-white rounded-lg p-6 shadow'>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <button 
            onClick={fetchWalletHistory}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Refresh
          </button>
        </div>
        
        {loading ? (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="rounded-lg p-8">
              <TriangleMazeLoader />
            </div>
          </div>
        ) : walletHistory.length === 0 ? (
          <p className='text-center text-gray-500 py-4'>No transaction history available</p>
        ) : (
          <div className="space-y-4">
            {walletHistory.map((transaction) => {
              const display = getTransactionDisplay(transaction);
              
              return (
                <div
                  key={transaction.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <span className="text-xl">{display.icon}</span>
                      <div>
                        <div className="font-medium">
                          {display.title}
                          {/* Add status badge for deposit transactions */}
                          {transaction.type === 'deposit' && getStatusBadge(transaction.status)}
                        </div>
                        {transaction.quantity && (
                          <div className="text-sm text-gray-600">Quantity: {transaction.quantity}</div>
                        )}
                        <div className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()} {new Date(transaction.date).toLocaleTimeString()}
                        </div>
                        {transaction.upiTransactionId && (
                          <div className="text-xs text-gray-600 mt-1">
                            UPI ID: {transaction.upiTransactionId}
                          </div>
                        )}
                        <div className="mt-1">
                          {transaction.type && (
                            <span className={`text-xs uppercase px-2 py-0.5 rounded-full ${
                              transaction.type === 'refund' 
                                ? 'bg-green-100 text-green-800' 
                                : transaction.type === 'deposit'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {transaction.type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`${display.color} font-semibold`}>
                      {display.sign}{displayINRCurrency(Math.abs(transaction.amount))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
};

export default WalletDetails;