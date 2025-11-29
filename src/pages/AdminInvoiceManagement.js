import React, { useState, useEffect } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AdminInvoiceManagement = () => {
    const [invoices, setInvoices] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState({
        paymentMethod: 'upi',
        transactionReference: '',
        notes: ''
    });
    const [testingAutoRenewal, setTestingAutoRenewal] = useState(false);
    const [debuggingOrders, setDebuggingOrders] = useState(false);

    useEffect(() => {
        fetchInvoices();
        fetchStatistics();
    }, [filter]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const url = filter === 'all'
                ? SummaryApi.invoices.getAllInvoices.url
                : `${SummaryApi.invoices.getAllInvoices.url}?status=${filter}`;

            const response = await fetch(url, {
                method: SummaryApi.invoices.getAllInvoices.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                setInvoices(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch invoices');
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
            toast.error('Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await fetch(SummaryApi.invoices.getInvoiceStatistics.url, {
                method: SummaryApi.invoices.getInvoiceStatistics.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                setStatistics(data.data);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const markAsPaid = async () => {
        if (!selectedInvoice) return;

        if (!paymentData.transactionReference.trim()) {
            toast.error('Please enter transaction reference');
            return;
        }

        try {
            const response = await fetch(`${SummaryApi.invoices.markInvoiceAsPaid.url}/${selectedInvoice._id}/mark-paid`, {
                method: SummaryApi.invoices.markInvoiceAsPaid.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Invoice marked as paid successfully');
                setShowPaymentModal(false);
                setSelectedInvoice(null);
                setPaymentData({ paymentMethod: 'upi', transactionReference: '', notes: '' });
                fetchInvoices();
                fetchStatistics();
            } else {
                toast.error(data.message || 'Failed to mark invoice as paid');
            }
        } catch (error) {
            console.error('Error marking invoice as paid:', error);
            toast.error('Failed to update invoice');
        }
    };

    const sendReminder = async (invoiceId) => {
        try {
            const response = await fetch(`${SummaryApi.invoices.sendInvoiceReminder.url}/${invoiceId}/send-reminder`, {
                method: SummaryApi.invoices.sendInvoiceReminder.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Reminder email sent successfully');
                fetchInvoices();
            } else {
                toast.error(data.message || 'Failed to send reminder');
            }
        } catch (error) {
            console.error('Error sending reminder:', error);
            toast.error('Failed to send reminder');
        }
    };

    const cancelInvoice = async (invoiceId, reason) => {
        if (!reason) {
            reason = prompt('Enter reason for cancellation:');
            if (!reason) return;
        }

        try {
            const response = await fetch(`${SummaryApi.invoices.cancelInvoice.url}/${invoiceId}/cancel`, {
                method: SummaryApi.invoices.cancelInvoice.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Invoice cancelled successfully');
                fetchInvoices();
                fetchStatistics();
            } else {
                toast.error(data.message || 'Failed to cancel invoice');
            }
        } catch (error) {
            console.error('Error cancelling invoice:', error);
            toast.error('Failed to cancel invoice');
        }
    };

    // 🔍 DEBUG FUNCTION - Check which orders are eligible
    const debugOrders = async () => {
        try {
            setDebuggingOrders(true);

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/debug-orders`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                console.log('🔍 DEBUG RESULTS:', data.data);

                const { totalOrders, eligibleForRenewal, eligibleOrders, orders } = data.data;

                alert(
                    `🔍 DEBUG RESULTS:\n\n` +
                    `Total Orders with Expiry: ${totalOrders}\n` +
                    `Eligible for Renewal: ${eligibleForRenewal}\n\n` +
                    `✅ Check browser console (F12) for detailed info`
                );

                if (eligibleOrders.length > 0) {
                    console.table(eligibleOrders);
                    toast.success(`Found ${eligibleForRenewal} orders ready for renewal!`);
                } else {
                    console.table(orders);
                    toast.warning('No orders eligible for renewal. Check console for details.');
                }
            } else {
                toast.error('Debug failed. Check console.');
                console.error('Debug failed:', data);
            }
        } catch (error) {
            console.error('Error debugging:', error);
            toast.error('Failed to debug orders');
        } finally {
            setDebuggingOrders(false);
        }
    };

    // 🧪 TEST FUNCTION - Remove after testing
    const testAutoRenewal = async () => {
        const confirmed = window.confirm(
            '🧪 TEST MODE\n\n' +
            'This will manually trigger the auto-renewal process for all Monthly Limited Plans expiring today.\n\n' +
            '⚠️ Make sure you have:\n' +
            '1. Created a Monthly Limited Plan order\n' +
            '2. Set its currentMonthExpiryDate to today in database\n\n' +
            'Continue?'
        );

        if (!confirmed) return;

        try {
            setTestingAutoRenewal(true);
            toast.info('Testing auto-renewal... This may take a few seconds.');

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/test-auto-renewal`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                toast.success('✅ Auto-renewal test completed! Check:\n1. Console logs\n2. Database (orders & invoices)\n3. Email inbox\n4. Invoice list below', {
                    autoClose: 10000
                });

                // Refresh invoices and statistics
                fetchInvoices();
                fetchStatistics();

                console.log('🧪 Test Results:', data);
            } else {
                toast.error(data.message || 'Test failed. Check console for details.');
                console.error('Test failed:', data);
            }
        } catch (error) {
            console.error('Error testing auto-renewal:', error);
            toast.error('Failed to run test. Check console for details.');
        } finally {
            setTestingAutoRenewal(false);
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'unpaid':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading invoices...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Invoice Management</h1>
                        <p className="text-gray-600">Manage monthly plan invoices and payments</p>
                    </div>

                    {/* 🧪 TEST BUTTONS - Remove after testing */}
                    <div className="flex gap-2">
                        <button
                            onClick={debugOrders}
                            disabled={debuggingOrders}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {debuggingOrders ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    Checking...
                                </>
                            ) : (
                                <>
                                    <span>🔍</span>
                                    Debug Orders
                                </>
                            )}
                        </button>

                        <button
                            onClick={testAutoRenewal}
                            disabled={testingAutoRenewal}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {testingAutoRenewal ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    Testing...
                                </>
                            ) : (
                                <>
                                    <span>🧪</span>
                                    Test Auto-Renewal
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
                            <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
                            <p className="text-2xl font-bold text-gray-800">{statistics.total}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
                            <p className="text-sm text-gray-600 mb-1">Unpaid</p>
                            <p className="text-2xl font-bold text-yellow-600">{statistics.unpaid}</p>
                            <p className="text-xs text-gray-500">₹{statistics.totalUnpaidAmount?.toLocaleString()}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                            <p className="text-sm text-gray-600 mb-1">Paid</p>
                            <p className="text-2xl font-bold text-green-600">{statistics.paid}</p>
                            <p className="text-xs text-gray-500">₹{statistics.totalPaidAmount?.toLocaleString()}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
                            <p className="text-sm text-gray-600 mb-1">Overdue</p>
                            <p className="text-2xl font-bold text-red-600">{statistics.overdue}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-500">
                            <p className="text-sm text-gray-600 mb-1">Cancelled</p>
                            <p className="text-2xl font-bold text-gray-600">{statistics.cancelled}</p>
                        </div>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
                    <div className="flex flex-wrap gap-2">
                        {['all', 'unpaid', 'overdue', 'paid', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                                    filter === status
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Invoices Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Invoice
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Plan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            No invoices found
                                        </td>
                                    </tr>
                                ) : (
                                    invoices.map((invoice) => (
                                        <tr key={invoice._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {invoice.invoiceNumber}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {formatDate(invoice.invoiceDate)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{invoice.userId?.name}</div>
                                                <div className="text-xs text-gray-500">{invoice.userId?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {invoice.orderId?.productId?.serviceName || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    ₹{invoice.amount.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(invoice.dueDate)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(invoice.status)}`}>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                {invoice.status === 'unpaid' || invoice.status === 'overdue' ? (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedInvoice(invoice);
                                                                setShowPaymentModal(true);
                                                            }}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Mark Paid
                                                        </button>
                                                        <button
                                                            onClick={() => sendReminder(invoice._id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Send Reminder
                                                        </button>
                                                        <button
                                                            onClick={() => cancelInvoice(invoice._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : invoice.status === 'paid' ? (
                                                    <span className="text-green-600">✓ Paid</span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Mark Invoice as Paid
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Invoice: {selectedInvoice.invoiceNumber} | Amount: ₹{selectedInvoice.amount.toLocaleString()}
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Method
                                </label>
                                <select
                                    value={paymentData.paymentMethod}
                                    onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="upi">UPI</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="cash">Cash</option>
                                    <option value="wallet">Wallet</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Transaction Reference *
                                </label>
                                <input
                                    type="text"
                                    value={paymentData.transactionReference}
                                    onChange={(e) => setPaymentData({ ...paymentData, transactionReference: e.target.value })}
                                    placeholder="Enter transaction ID or reference"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={paymentData.notes}
                                    onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                                    placeholder="Add any notes..."
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setSelectedInvoice(null);
                                    setPaymentData({ paymentMethod: 'upi', transactionReference: '', notes: '' });
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={markAsPaid}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                            >
                                Mark as Paid
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInvoiceManagement;
