import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import displayINRCurrency from '../helpers/displayCurrency';

const AdminPaymentVerification = () => {
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState(null);

    // Fetch pending transactions
    const fetchPendingTransactions = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.wallet.pendingTransactions.url, {
                method: SummaryApi.wallet.pendingTransactions.method,
                credentials: 'include',
                headers: {
                    "Content-Type": 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                setPendingTransactions(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching pending transactions:', error);
            toast.error('Failed to load pending transactions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingTransactions();
        
        // Poll for new transactions every 30 seconds
        const interval = setInterval(() => {
            fetchPendingTransactions();
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    // Approve transaction
    const approveTransaction = async (transaction) => {
        if (!window.confirm(`Are you sure you want to approve this transaction of ${displayINRCurrency(transaction.amount)}?`)) {
            return;
        }
        
        setProcessingId(transaction._id);
        try {
            const response = await fetch(SummaryApi.wallet.approveTransaction.url, {
                method: SummaryApi.wallet.approveTransaction.method,
                credentials: 'include',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    transactionId: transaction._id,
                    userId: transaction.userId._id || transaction.userId
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                toast.success('Transaction approved successfully');
                fetchPendingTransactions();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error approving transaction:', error);
            toast.error('Failed to approve transaction');
        } finally {
            setProcessingId(null);
        }
    };

    // Reject transaction
    const rejectTransaction = async (transaction) => {
        if (!window.confirm(`Are you sure you want to reject this transaction?`)) {
            return;
        }
        
        setProcessingId(transaction._id);
        try {
            const response = await fetch(SummaryApi.wallet.rejectTransaction.url, {
                method: SummaryApi.wallet.rejectTransaction.method,
                credentials: 'include',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    transactionId: transaction._id
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                toast.success('Transaction rejected');
                fetchPendingTransactions();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error rejecting transaction:', error);
            toast.error('Failed to reject transaction');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Pending Payment Verifications</h2>
                <button 
                    onClick={fetchPendingTransactions}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>
            
            {pendingTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No pending transactions to verify
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
                                <th className="py-2 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingTransactions.map((transaction) => (
                                <tr key={transaction._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <span className="font-mono text-sm">{transaction.transactionId}</span>
                                        {transaction.upiTransactionId && (
                                        <div className="text-xs text-green-600 mt-1">
                                            UPI ID: {transaction.upiTransactionId}
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
                                    <td className="py-3 px-4">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => approveTransaction(transaction)}
                                                disabled={processingId === transaction._id}
                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-gray-300"
                                            >
                                                {processingId === transaction._id ? 'Processing...' : 'Approve'}
                                            </button>
                                            <button
                                                onClick={() => rejectTransaction(transaction)}
                                                disabled={processingId === transaction._id}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-300"
                                            >
                                                Reject
                                            </button>
                                        </div>
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

export default AdminPaymentVerification;