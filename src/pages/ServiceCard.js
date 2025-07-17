import React, { useState } from 'react';
import { CheckCircle, XCircle, User, CreditCard, Building, DollarSign, Clock } from 'lucide-react';

const AdminMoneyTransferPanel = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMode, setPaymentMode] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Sample money transfer requests
  const [requests, setRequests] = useState([
    {
      id: 1,
      partnerName: "John Smith",
      amount: 15000,
      bankAccount: "HDFC Bank - ***1234",
      requestDate: "2024-07-15",
      status: "pending"
    },
    {
      id: 2,
      partnerName: "Sarah Johnson",
      amount: 25000,
      bankAccount: "ICICI Bank - ***5678",
      requestDate: "2024-07-14",
      status: "pending"
    },
    {
      id: 3,
      partnerName: "Mike Wilson",
      amount: 8500,
      bankAccount: "SBI Bank - ***9012",
      requestDate: "2024-07-13",
      status: "pending"
    }
  ]);

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setShowPaymentForm(true);
  };

  const handleReject = (requestId) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' } : req
    ));
  };

  const handlePaymentComplete = () => {
    if (paymentMode && transactionId) {
      setRequests(requests.map(req => 
        req.id === selectedRequest.id ? { ...req, status: 'completed' } : req
      ));
      setShowPaymentForm(false);
      setSelectedRequest(null);
      setPaymentMode('');
      setTransactionId('');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            Money Transfer Requests - Admin Panel
          </h1>
          <p className="text-gray-600 mt-2">Manage partner money transfer requests</p>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Requests</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {requests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Partner Name */}
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Partner Name</p>
                          <p className="font-medium text-gray-900">{request.partnerName}</p>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-medium text-gray-900">₹{request.amount.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Bank Account */}
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Bank Account</p>
                          <p className="font-medium text-gray-900">{request.bankAccount}</p>
                        </div>
                      </div>

                      {/* Request Date */}
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Request Date</p>
                          <p className="font-medium text-gray-900">{request.requestDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center gap-3 ml-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Completion Form Modal */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Complete Payment for {selectedRequest?.partnerName}
              </h3>
              
              <div className="space-y-4">
                {/* Request Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="font-medium">₹{selectedRequest?.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bank Account:</span>
                    <span className="font-medium">{selectedRequest?.bankAccount}</span>
                  </div>
                </div>

                {/* Payment Mode Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="UPI">UPI</option>
                    <option value="IMPS">IMPS</option>
                  </select>
                </div>

                {/* Transaction ID Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter transaction ID"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowPaymentForm(false);
                      setSelectedRequest(null);
                      setPaymentMode('');
                      setTransactionId('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePaymentComplete}
                    disabled={!paymentMode || !transactionId}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Complete Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMoneyTransferPanel;