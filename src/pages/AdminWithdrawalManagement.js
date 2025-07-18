
import React, { useEffect, useState } from 'react'
import { FaMoneyBillWave, FaUser, FaCalendarAlt, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'

const AdminWithdrawalManagement = () => {
  // State management
  const [withdrawalRequests, setWithdrawalRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  
  // Approve modal states
  const [paymentMode, setPaymentMode] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [processingApproval, setProcessingApproval] = useState(false)
  
  // Reject modal states
  const [rejectionReason, setRejectionReason] = useState('')
  const [processingRejection, setProcessingRejection] = useState(false)

  // Fetch all withdrawal requests
  const fetchWithdrawalRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch(SummaryApi.getAllWithdrawalRequests.url, {
        method: SummaryApi.getAllWithdrawalRequests.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setWithdrawalRequests(data.data)
      } else {
        toast.error(data.message || 'Failed to fetch withdrawal requests')
      }
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error)
      toast.error('Error fetching withdrawal requests')
    } finally {
      setLoading(false)
    }
  }

  // Handle approve button click
  const handleApproveClick = (request) => {
    setSelectedRequest(request)
    setShowApproveModal(true)
    setPaymentMode('')
    setTransactionId('')
  }

  // Handle reject button click
  const handleRejectClick = (request) => {
    setSelectedRequest(request)
    setShowRejectModal(true)
    setRejectionReason('')
  }

  // Handle approve withdrawal
  const handleApproveWithdrawal = async () => {
    if (!paymentMode) {
      toast.error('Please select a payment mode')
      return
    }
    if (!transactionId.trim()) {
      toast.error('Please enter transaction ID')
      return
    }

    setProcessingApproval(true)
    try {
      const response = await fetch(`${SummaryApi.approveWithdrawalRequest.url}/${selectedRequest._id}`, {
        method: SummaryApi.approveWithdrawalRequest.method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          paymentMode: paymentMode,
          transactionId: transactionId.trim()
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Withdrawal request approved successfully!')
        setShowApproveModal(false)
        setSelectedRequest(null)
        setPaymentMode('')
        setTransactionId('')
        // Refresh the list
        fetchWithdrawalRequests()
      } else {
        toast.error(result.message || 'Failed to approve withdrawal request')
      }
    } catch (error) {
      console.error('Error approving withdrawal:', error)
      toast.error('Error approving withdrawal request')
    } finally {
      setProcessingApproval(false)
    }
  }

  // Handle reject withdrawal
  const handleRejectWithdrawal = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    setProcessingRejection(true)
    try {
      const response = await fetch(`${SummaryApi.rejectWithdrawalRequest.url}/${selectedRequest._id}`, {
        method: SummaryApi.rejectWithdrawalRequest.method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          rejectionReason: rejectionReason.trim()
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Withdrawal request rejected successfully!')
        setShowRejectModal(false)
        setSelectedRequest(null)
        setRejectionReason('')
        // Refresh the list
        fetchWithdrawalRequests()
      } else {
        toast.error(result.message || 'Failed to reject withdrawal request')
      }
    } catch (error) {
      console.error('Error rejecting withdrawal:', error)
      toast.error('Error rejecting withdrawal request')
    } finally {
      setProcessingRejection(false)
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0)
  }

  // Format bank account (masked)
  const formatBankAccount = (account) => {
    if (!account || !account.bankAccountNumber) return 'N/A'
    const accountNumber = account.bankAccountNumber
    const masked = accountNumber.slice(0, 4) + '****' + accountNumber.slice(-4)
    return `${account.bankName} - ${masked}`
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Close modals
  const closeApproveModal = () => {
    setShowApproveModal(false)
    setSelectedRequest(null)
    setPaymentMode('')
    setTransactionId('')
  }

  const closeRejectModal = () => {
    setShowRejectModal(false)
    setSelectedRequest(null)
    setRejectionReason('')
  }

  useEffect(() => {
    fetchWithdrawalRequests()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaMoneyBillWave className="text-green-600" />
            Money Transfer Requests - Admin Panel
          </h1>
          <p className="text-gray-600">Manage partner withdrawal requests and process payments</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-blue-600">{withdrawalRequests.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaMoneyBillWave className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {withdrawalRequests.filter(req => req.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaCalendarAlt className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(withdrawalRequests.reduce((sum, req) => sum + (req.requestedAmount || 0), 0))}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaUser className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Requests Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Withdrawal Requests</h2>
            <p className="text-gray-600 text-sm">Review and process partner withdrawal requests</p>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex space-x-4 animate-pulse">
                      <div className="w-32 h-4 bg-gray-200 rounded"></div>
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      <div className="w-48 h-4 bg-gray-200 rounded"></div>
                      <div className="w-32 h-4 bg-gray-200 rounded"></div>
                      <div className="w-20 h-4 bg-gray-200 rounded"></div>
                      <div className="w-32 h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : withdrawalRequests.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FaMoneyBillWave className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium">No withdrawal requests found</p>
                <p className="text-sm">All requests will appear here when partners submit them</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Partner Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank Account
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Date
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
                  {withdrawalRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.partnerId?.name || request.partnerName || 'Unknown Partner'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-semibold text-green-600">
                          {formatCurrency(request.requestedAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatBankAccount(request.selectedBankAccount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {moment(request.createdAt).format('MMM DD, YYYY hh:mm A')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                          {request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.status === 'pending' ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveClick(request)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <FaCheck className="w-3 h-3 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectClick(request)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <FaTimes className="w-3 h-3 mr-1" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            {request.status === 'approved' ? 'Completed' : 'Processed'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Approve Modal */}
        {showApproveModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FaCheck className="text-green-600" />
                  Approve Withdrawal
                </h3>
                <button
                  onClick={closeApproveModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                  disabled={processingApproval}
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                {/* Request Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Partner:</span>
                      <span className="font-medium">{selectedRequest.partnerId?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-green-600">{formatCurrency(selectedRequest.requestedAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Request Date:</span>
                      <span className="font-medium">{moment(selectedRequest.createdAt).format('MMM DD, YYYY')}</span>
                    </div>
                  </div>
                </div>

                {/* Bank Account Details */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Bank Account Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank Name:</span>
                      <span className="font-medium">{selectedRequest.selectedBankAccount?.bankName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Number:</span>
                      <span className="font-medium">{selectedRequest.selectedBankAccount?.bankAccountNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IFSC Code:</span>
                      <span className="font-medium">{selectedRequest.selectedBankAccount?.bankIFSCCode || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Holder:</span>
                      <span className="font-medium">{selectedRequest.selectedBankAccount?.accountHolderName || 'N/A'}</span>
                    </div>
                    {selectedRequest.selectedBankAccount?.upiId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">UPI ID:</span>
                        <span className="font-medium">{selectedRequest.selectedBankAccount.upiId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Mode Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Payment Mode *
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                    disabled={processingApproval}
                  >
                    <option value="">-- Select Payment Mode --</option>
                    <option value="UPI">UPI</option>
                    <option value="IMPS">IMPS</option>
                    <option value="NEFT">NEFT</option>
                    <option value="RTGS">RTGS</option>
                  </select>
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID *
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter transaction/reference ID"
                    disabled={processingApproval}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeApproveModal}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    disabled={processingApproval}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApproveWithdrawal}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    disabled={processingApproval}
                  >
                    {processingApproval ? 'Processing...' : 'Complete Payment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FaExclamationTriangle className="text-red-600" />
                  Reject Withdrawal
                </h3>
                <button
                  onClick={closeRejectModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                  disabled={processingRejection}
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                {/* Request Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Partner:</span>
                      <span className="font-medium">{selectedRequest.partnerId?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-red-600">{formatCurrency(selectedRequest.requestedAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Rejection Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Rejection *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                    placeholder="Please provide a detailed reason for rejecting this withdrawal request..."
                    disabled={processingRejection}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeRejectModal}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    disabled={processingRejection}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectWithdrawal}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    disabled={processingRejection}
                  >
                    {processingRejection ? 'Processing...' : 'Reject Payment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminWithdrawalManagement;