import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import displayINRCurrency from '../helpers/displayCurrency';

const AdminTransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'failed'

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.wallet.adminTransactionHistory.url, {
        method: SummaryApi.wallet.adminTransactionHistory.method,
        credentials: 'include',
        headers: {
          "Content-Type": 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions based on selected status
  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === filter);

  // Function to get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <div className="flex space-x-2">
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 text-sm ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Approved
            </button>
            <button 
              onClick={() => setFilter('failed')}
              className={`px-3 py-1 text-sm ${filter === 'failed' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Rejected
            </button>
          </div>
          <button 
            onClick={fetchTransactionHistory}
            className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 text-sm"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No transaction history found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Transaction ID</th>
                <th className="py-2 px-4 text-left">User</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-right">Amount</th>
                <th className="py-2 px-4 text-center">Status</th>
                <th className="py-2 px-4 text-left">Verified By</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm">{transaction.transactionId}</span>
                    {transaction.upiTransactionId && (
                      <div className="text-xs text-green-600 mt-1">
                        UPI: {transaction.upiTransactionId}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {transaction.userId.name ? (
                      <>
                        <div className="font-medium">{transaction.userId.name}</div>
                        <div className="text-sm text-gray-500">{transaction.userId.email}</div>
                      </>
                    ) : (
                      <span className="text-gray-500">User ID: {transaction.userId}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(transaction.date).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-medium">
                    {displayINRCurrency(transaction.amount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="py-3 px-4">
                    {transaction.verifiedBy ? (
                      transaction.verifiedBy.name || <span className="text-gray-500">{transaction.verifiedBy}</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTransactionHistory;