import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import displayINRCurrency from '../helpers/displayCurrency';
import TransactionModal from '../components/TransactionModal';
import AdminTransactionHistory from '../components/AdminTransactionHistory';

const AdminPaymentVerification = () => {
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState(null);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('approve'); // 'approve' or 'reject'
    const [selectedTransaction, setSelectedTransaction] = useState(null);

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

    // Helper function to determine transaction display details
    const getTransactionDisplay = (transaction) => {
        const orderId = transaction.orderId 
        ? (typeof transaction.orderId === 'object' 
            ? transaction.orderId._id  
            : transaction.orderId)     
        : null;  
    
        // Check for wallet payments for orders
        if (transaction.paymentMethod === 'wallet' && transaction.type === 'payment') {
            return {
                type: 'Wallet Payment',
                cssClass: 'bg-indigo-100 text-indigo-800',
                details: orderId ? `Order #${orderId}` : 'Order payment',
                isWalletCredit: false
            };
        }
        
        // Check for installment/partial payments
        if ((transaction.isInstallmentPayment === true || transaction.type === 'payment') && 
            orderId && 
            transaction.installmentNumber) {
            // Add this check for partial payments
            if (transaction.isPartialInstallmentPayment) {
                return {
                    type: 'Partial UPI Payment',
                    cssClass: 'bg-purple-100 text-purple-800',
                    details: `UPI Portion of Installment #${transaction.installmentNumber} for Order #${orderId}`,
                    isWalletCredit: false
                };
            }
            return {
                type: 'Installment Payment',
                cssClass: 'bg-blue-100 text-blue-800',
                details: `Installment #${transaction.installmentNumber} for Order #${orderId}`,
                isWalletCredit: false
            };
        }
        
        // Regular wallet recharge
        if (transaction.type === 'deposit' || !transaction.isInstallmentPayment) {
            return {
                type: 'Wallet Recharge',
                cssClass: 'bg-green-100 text-green-800',
                details: 'Funds added to wallet',
                isWalletCredit: true
            };
        }
        
        // Fallback for any other transaction types
        return {
            type: 'Payment',
            cssClass: 'bg-gray-100 text-gray-800',
            details: 'Transaction',
            isWalletCredit: false
        };
    };

    // Open approve modal
    const openApproveModal = (transaction) => {
        setSelectedTransaction(transaction);
        setModalType('approve');
        setIsModalOpen(true);
    };
    
    // Open reject modal
    const openRejectModal = (transaction) => {
        setSelectedTransaction(transaction);
        setModalType('reject');
        setIsModalOpen(true);
    };
    
    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

    // Approve transaction
    const approveTransaction = async (transaction) => {
        setProcessingId(transaction._id);
        try {
            // Determine if this is an installment payment
            const transactionDetails = getTransactionDisplay(transaction);
            
            // First approve the transaction
            // console.log("Approving transaction:", transaction._id);
            
            const response = await fetch(SummaryApi.wallet.approveTransaction.url, {
                method: SummaryApi.wallet.approveTransaction.method,
                credentials: 'include',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    transactionId: transaction._id,
                    userId: transaction.userId._id || transaction.userId,
                    skipWalletCredit: !transactionDetails.isWalletCredit // Skip adding to wallet for installment payments
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // console.log("Transaction approved successfully:", data);
                
                // Show appropriate success message
                toast.success(transactionDetails.isWalletCredit ? 
                    'Wallet recharge approved successfully' : 
                    'Payment approved successfully');
                
                fetchPendingTransactions();
                closeModal();
            } else {
                toast.error(data.message || 'Approval failed');
            }
        } catch (error) {
            console.error('Error approving transaction:', error);
            toast.error('Failed to approve transaction: ' + (error.message || 'Unknown error'));
        } finally {
            setProcessingId(null);
        }
    };

    // Reject transaction
    const rejectTransaction = async (transaction, rejectionReason) => {
        setProcessingId(transaction._id);
        try {
          const response = await fetch(SummaryApi.wallet.rejectTransaction.url, {
            method: SummaryApi.wallet.rejectTransaction.method,
            credentials: 'include',
            headers: {
              "Content-Type": 'application/json'
            },
            body: JSON.stringify({
              transactionId: transaction._id,
              rejectionReason: rejectionReason
            })
          });
          
          const data = await response.json();
          
          if (data.success) {
            toast.success('Transaction rejected');
            fetchPendingTransactions();
            closeModal();
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
        <>
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
                                    <th className="py-2 px-4 text-left">Type</th>
                                    <th className="py-2 px-4 text-right">Amount</th>
                                    <th className="py-2 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingTransactions.map((transaction) => {
                                    const txDisplay = getTransactionDisplay(transaction);
                                    
                                    return (
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
                                                {transaction.userId && typeof transaction.userId === 'object' ? (
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
                                            <td className="py-3 px-4">
                                                <div className={`text-xs px-2 py-1 rounded inline-block ${txDisplay.cssClass}`}>
                                                    {txDisplay.type}
                                                </div>
                                                {txDisplay.details && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {txDisplay.details}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right font-medium">
                                                {displayINRCurrency(transaction.amount)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        onClick={() => openApproveModal(transaction)}
                                                        disabled={processingId === transaction._id}
                                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-gray-300"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => openRejectModal(transaction)}
                                                        disabled={processingId === transaction._id}
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-300"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            {/* Transaction modal */}
            <TransactionModal 
                transaction={selectedTransaction}
                isOpen={isModalOpen}
                onClose={closeModal}
                onApprove={approveTransaction}
                onReject={rejectTransaction}
                type={modalType}
                isProcessing={processingId === (selectedTransaction && selectedTransaction._id)}
            />
            
            {/* Admin Transaction History */}
            <AdminTransactionHistory />
        </>
    );
};

export default AdminPaymentVerification;