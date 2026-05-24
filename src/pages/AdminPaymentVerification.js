import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import displayINRCurrency from '../helpers/displayCurrency';
import TransactionModal from '../components/TransactionModal';
import { Trash2 } from 'lucide-react';

const AdminPaymentVerification = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState(null);
    const [selectedTransactions, setSelectedTransactions] = useState([]);
    const [selectAllProcessed, setSelectAllProcessed] = useState(false);
    const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('approve'); // 'approve' or 'reject'
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const [pendingResponse, historyResponse] = await Promise.all([
                fetch(SummaryApi.wallet.pendingTransactions.url, {
                    method: SummaryApi.wallet.pendingTransactions.method,
                    credentials: 'include',
                    headers: {
                        "Content-Type": 'application/json'
                    }
                }),
                fetch(SummaryApi.wallet.adminTransactionHistory.url, {
                    method: SummaryApi.wallet.adminTransactionHistory.method,
                    credentials: 'include',
                    headers: {
                        "Content-Type": 'application/json'
                    }
                })
            ]);

            const [pendingData, historyData] = await Promise.all([
                pendingResponse.json(),
                historyResponse.json()
            ]);

            if (!pendingData.success) {
                toast.error(pendingData.message || 'Failed to load pending transactions');
                return;
            }

            if (!historyData.success) {
                toast.error(historyData.message || 'Failed to load transaction history');
                return;
            }

            const mergedTransactions = [
                ...(pendingData.data || []),
                ...(historyData.data || [])
            ];

            setTransactions(mergedTransactions);
            setSelectedTransactions([]);
            setSelectAllProcessed(false);
        } catch (error) {
            console.error('Error fetching payment verification transactions:', error);
            toast.error('Failed to load payment verification data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
        
        const interval = setInterval(() => {
            fetchTransactions();
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const sortedTransactions = useMemo(() => {
        const statusPriority = {
            pending: 1,
            completed: 2,
            failed: 3
        };

        return [...transactions].sort((left, right) => {
            const priorityDiff = (statusPriority[left.status] || 9) - (statusPriority[right.status] || 9);
            if (priorityDiff !== 0) return priorityDiff;

            return new Date(right.date || right.updatedAt || right.createdAt || 0) - new Date(left.date || left.updatedAt || left.createdAt || 0);
        });
    }, [transactions]);

    const processedTransactions = useMemo(
        () => sortedTransactions.filter((transaction) => transaction.status !== 'pending'),
        [sortedTransactions]
    );

    useEffect(() => {
        if (processedTransactions.length === 0) {
            setSelectAllProcessed(false);
            return;
        }

        setSelectAllProcessed(
            processedTransactions.every((transaction) => selectedTransactions.includes(transaction._id))
        );
    }, [processedTransactions, selectedTransactions]);

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

    const handleTransactionSelect = (transactionId) => {
        setSelectedTransactions((previous) =>
            previous.includes(transactionId)
                ? previous.filter((id) => id !== transactionId)
                : [...previous, transactionId]
        );
    };

    const handleSelectAllProcessed = () => {
        if (selectAllProcessed) {
            setSelectedTransactions([]);
            setSelectAllProcessed(false);
            return;
        }

        setSelectedTransactions(processedTransactions.map((transaction) => transaction._id));
        setSelectAllProcessed(true);
    };

    const handleBulkDelete = async () => {
        try {
            const deletePromises = selectedTransactions.map((transactionId) =>
                fetch(`${SummaryApi.wallet.deleteTransaction.url}/${transactionId}`, {
                    method: SummaryApi.wallet.deleteTransaction.method,
                    credentials: 'include',
                    headers: {
                        "Content-Type": 'application/json'
                    }
                })
            );

            const responses = await Promise.all(deletePromises);
            const results = await Promise.all(responses.map((response) => response.json()));
            const successCount = results.filter((result) => result.success).length;
            const failCount = results.length - successCount;

            if (successCount > 0) {
                toast.success(`${successCount} transaction(s) deleted successfully`);
            }

            if (failCount > 0) {
                toast.error(`${failCount} transaction(s) failed to delete`);
            }

            setBulkDeleteConfirm(false);
            fetchTransactions();
        } catch (error) {
            console.error('Error deleting selected transactions:', error);
            toast.error('Failed to delete selected transactions');
        }
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

                // Notify dashboard
                localStorage.setItem('dashboardUpdate', JSON.stringify({ type: 'payment', timestamp: Date.now() }));

                fetchTransactions();
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

            // Notify dashboard
            localStorage.setItem('dashboardUpdate', JSON.stringify({ type: 'payment', timestamp: Date.now() }));

            fetchTransactions();
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

    const getStatusBadge = (status) => {
        if (status === 'pending') {
            return 'bg-yellow-100 text-yellow-800';
        }

        if (status === 'completed') {
            return 'bg-green-100 text-green-800';
        }

        if (status === 'failed') {
            return 'bg-red-100 text-red-800';
        }

        return 'bg-gray-100 text-gray-800';
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-full">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Payment Verification</h2>
                        <p className="mt-2 text-gray-600">Pending payments stay on top. Approved and rejected entries are listed below in time order.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {selectedTransactions.length > 0 && (
                            <button
                                onClick={() => setBulkDeleteConfirm(true)}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 inline-flex items-center"
                            >
                                <Trash2 size={16} className="mr-2" />
                                Delete Selected ({selectedTransactions.length})
                            </button>
                        )}
                        <button 
                            onClick={fetchTransactions}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Transaction ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Amount</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={selectAllProcessed && processedTransactions.length > 0}
                                            onChange={handleSelectAllProcessed}
                                            className="rounded border-gray-300"
                                        />
                                        <span className="ml-2">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sortedTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            No payment verification records found.
                                        </td>
                                    </tr>
                                ) : (
                                sortedTransactions.map((transaction) => {
                                    const txDisplay = getTransactionDisplay(transaction);
                                    
                                    return (
                                        <tr key={transaction._id} className="hover:bg-blue-50 transition-colors">
                                            <td className="py-3 px-6">
                                                <span className="font-mono text-sm">{transaction.transactionId}</span>
                                                {transaction.upiTransactionId && (
                                                    <div className="text-xs text-green-600 mt-1">
                                                        UPI ID: {transaction.upiTransactionId}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-6">
                                                {transaction.userId && typeof transaction.userId === 'object' ? (
                                                    <>
                                                        <div className="font-medium">{transaction.userId.name}</div>
                                                        <div className="text-sm text-gray-500">{transaction.userId.email}</div>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-500">User ID: {transaction.userId}</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-6">
                                                {new Date(transaction.date).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className={`text-xs px-2 py-1 rounded inline-block ${txDisplay.cssClass}`}>
                                                    {txDisplay.type}
                                                </div>
                                                {txDisplay.details && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {txDisplay.details}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(transaction.status)}`}>
                                                    {transaction.status === 'completed' ? 'Approved' : transaction.status === 'failed' ? 'Rejected' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-right font-medium">
                                                {displayINRCurrency(transaction.amount)}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                {transaction.status === 'pending' ? (
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
                                                ) : (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTransactions.includes(transaction._id)}
                                                        onChange={() => handleTransactionSelect(transaction._id)}
                                                        className="rounded border-gray-300"
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <TransactionModal 
                transaction={selectedTransaction}
                isOpen={isModalOpen}
                onClose={closeModal}
                onApprove={approveTransaction}
                onReject={rejectTransaction}
                type={modalType}
                isProcessing={processingId === (selectedTransaction && selectedTransaction._id)}
            />

            {bulkDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Selected Transactions</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete {selectedTransactions.length} processed transaction(s)? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setBulkDeleteConfirm(false)}
                                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminPaymentVerification;
