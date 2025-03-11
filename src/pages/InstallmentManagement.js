// Create a new file: components/InstallmentManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import TriangleMazeLoader from '../components/TriangleMazeLoader';
import { toast } from 'react-toastify';

const InstallmentManagement = () => {
    const [pendingInstallments, setPendingInstallments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingInstallments();
    }, []);

    const fetchPendingInstallments = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.getPendingInstallments.url, {
                method: SummaryApi.getPendingInstallments.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                setPendingInstallments(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch installments');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handlePayInstallment = (order) => {
        navigate('/installment-payment', { 
            state: { 
                orderId: order._id,
                installmentNumber: order.currentInstallment,
                productName: order.productId.serviceName,
                amount: order.installments.find(i => i.installmentNumber === order.currentInstallment)?.amount || 0
            } 
        });
    };

    if (loading) {
        return <TriangleMazeLoader />;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Your Installment Payments</h1>
            
            {pendingInstallments.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-600">You don't have any pending installments.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {pendingInstallments.map(order => (
                        <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-blue-600 text-white p-4">
                                <h2 className="text-lg font-semibold">{order.productId.serviceName}</h2>
                                <p className="text-sm">Order ID: {order._id}</p>
                            </div>
                            
                            <div className="p-4">
                                <div className="flex justify-between mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="text-lg font-semibold">₹{order.totalAmount?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Paid Amount</p>
                                        <p className="text-lg font-semibold text-green-600">₹{order.paidAmount?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Remaining</p>
                                        <p className="text-lg font-semibold text-blue-600">₹{order.remainingAmount?.toLocaleString()}</p>
                                    </div>
                                </div>
                                
                                <h3 className="font-medium mb-2">Installment Status</h3>
                                <div className="space-y-3 mb-4">
                                    {order.installments.map(installment => (
                                        <div 
                                            key={installment.installmentNumber}
                                            className={`p-3 rounded-lg ${
                                                installment.paid 
                                                ? 'bg-green-50 border border-green-100' 
                                                : installment.installmentNumber === order.currentInstallment
                                                ? 'bg-yellow-50 border border-yellow-100'
                                                : 'bg-gray-50 border border-gray-100'
                                            }`}
                                        >
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="font-medium">
                                                        Installment #{installment.installmentNumber} ({installment.percentage}%)
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {installment.paid 
                                                        ? `Paid on ${new Date(installment.paidDate).toLocaleDateString()}` 
                                                        : installment.dueDate 
                                                            ? `Due by ${new Date(installment.dueDate).toLocaleDateString()}`
                                                            : 'Upcoming'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">₹{installment.amount?.toLocaleString()}</p>
                                                    <p className="text-sm">
                                                        {installment.paid 
                                                        ? <span className="text-green-600">Paid</span> 
                                                        : installment.installmentNumber === order.currentInstallment
                                                            ? <span className="text-yellow-600">Current</span>
                                                            : <span className="text-gray-500">Pending</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {!order.paymentComplete && (
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handlePayInstallment(order)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            Pay Next Installment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstallmentManagement;