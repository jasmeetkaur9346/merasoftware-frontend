
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaUsers, FaMoneyBillWave, FaChartLine, FaWallet, FaPlus, FaExchangeAlt } from 'react-icons/fa'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'

const PartnerDashboard = () => {
  const user = useSelector(state => state?.user?.user)
  
  // States for dashboard data
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalCommissionEarned, setTotalCommissionEarned] = useState(0)
  const [walletBalance, setWalletBalance] = useState(0)
  const [commissionHistory, setCommissionHistory] = useState([])
  const [customers, setCustomers] = useState([])
  
  // Loading states
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingCommissions, setLoadingCommissions] = useState(true)
  const [loadingCustomers, setLoadingCustomers] = useState(true)
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('dashboard')

  // Add New Customer Modal State
  const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Withdrawal Request Modal States
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [selectedBankAccountIndex, setSelectedBankAccountIndex] = useState('')
  const [isRequestingWithdrawal, setIsRequestingWithdrawal] = useState(false)
  const [bankAccounts, setBankAccounts] = useState([])

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    try {
      setLoadingStats(true)
      const response = await fetch(SummaryApi.getCommissionWalletSummary.url, {
        method: SummaryApi.getCommissionWalletSummary.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setWalletBalance(data.data.availableBalance || 0)
      }
    } catch (error) {
      console.error('Error fetching wallet summary:', error)
      toast.error('Error fetching wallet summary')
    } finally {
      setLoadingStats(false)
    }
  }

  // Calculate total commission from commission history
  const calculateTotalCommission = (commissions) => {
    const total = commissions.reduce((sum, commission) => {
      // Only count positive amounts for total commission calculation
      if (commission.commissionAmount > 0) {
        return sum + (commission.commissionAmount || 0)
      }
      return sum
    }, 0)
    setTotalCommissionEarned(total)
  }

 // Fetch commission history for recent transactions AND total calculation
const fetchCommissionHistory = async () => {
  try {
    setLoadingCommissions(true)
    
    // Commission history fetch करें
    const commissionResponse = await fetch(SummaryApi.getCommissionHistory.url, {
      method: SummaryApi.getCommissionHistory.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    // Withdrawal history fetch करें
    const withdrawalResponse = await fetch(SummaryApi.getWithdrawalHistory.url, {
      method: SummaryApi.getWithdrawalHistory.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const commissionData = await commissionResponse.json()
    const withdrawalData = await withdrawalResponse.json()
    
    if (commissionData.success && withdrawalData.success) {
      // Withdrawal requests ko commission format में convert करें
      const formattedWithdrawals = withdrawalData.data.map(withdrawal => ({
        _id: withdrawal._id,
        customerName: 'Admin Transfer',
        commissionType: 'Withdrawal Request',
        createdAt: withdrawal.createdAt,
        status: withdrawal.status,
        commissionAmount: -withdrawal.requestedAmount // Negative amount
      }))
      
      // दोनों को combine करके date wise sort करें
      const combinedHistory = [...commissionData.data, ...formattedWithdrawals]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10) // Latest 10 entries
      
      setCommissionHistory(combinedHistory)
      
      // Total commission calculation (only positive amounts)
      calculateTotalCommission(commissionData.data)
    }
  } catch (error) {
    console.error('Error fetching transaction history:', error)
    toast.error('Error fetching transaction history')
  } finally {
    setLoadingCommissions(false)
  }
}


  // Fetch customers list using correct API endpoint
  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true)
      const response = await fetch(SummaryApi.partnerCustomers.url, {
        method: SummaryApi.partnerCustomers.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCustomers(data.data)
        setTotalUsers(data.data.length)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error('Error fetching customers')
    } finally {
      setLoadingCustomers(false)
      setLoadingStats(false)
    }
  }

  // Handle new customer form submission
  const handleAddCustomer = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Password and confirm password do not match')
      return
    }
    
    setSubmitting(true)
    
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'customer',
        referredBy: user._id
      }
      
      const response = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success('Customer created successfully')
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        })
        setOpenAddCustomerModal(false)
        fetchCustomers()
        fetchWalletBalance()
      } else {
        toast.error(result.message || 'Failed to create customer')
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      toast.error('Something went wrong while creating customer')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle withdrawal request submission
  const handleWithdrawalRequest = async () => {
    if (!withdrawalAmount || isNaN(withdrawalAmount) || parseFloat(withdrawalAmount) <= 0) {
      toast.error('Please enter a valid positive amount.')
      return
    }
    if (parseFloat(withdrawalAmount) > walletBalance) {
      toast.error('Requested amount exceeds available balance.')
      return
    }
    if (selectedBankAccountIndex === '' || selectedBankAccountIndex === null) {
      toast.error('Please select a bank account.')
      return
    }

    const confirmWithdrawal = window.confirm(
      `Are you sure you want to withdraw ${formatCurrency(parseFloat(withdrawalAmount))} to your selected account?`
    )

    if (!confirmWithdrawal) {
      return
    }

    setIsRequestingWithdrawal(true)
    try {
      const response = await fetch(SummaryApi.requestWithdrawal.url, {
        method: SummaryApi.requestWithdrawal.method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: parseFloat(withdrawalAmount),
          selectedBankAccountIndex: parseInt(selectedBankAccountIndex)
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success(result.message)
        setShowWithdrawalModal(false)
        setWithdrawalAmount('')
        setSelectedBankAccountIndex('')
        
        // Update wallet balance immediately
        setWalletBalance(prev => prev - parseFloat(withdrawalAmount))
        
        // Add withdrawal request entry to commission history (optimistically)
        const withdrawalEntry = {
          _id: `withdrawal_${Date.now()}`, // Temporary ID
          customerName: 'Admin Transfer',
          commissionType: 'Withdrawal Request',
          createdAt: new Date().toISOString(),
          status: 'pending',
          commissionAmount: -parseFloat(withdrawalAmount)
        }
        
        setCommissionHistory(prev => [withdrawalEntry, ...prev.slice(0, 9)])
        
        // Don't call fetchCommissionHistory() here to preserve the optimistic update
        // Only refresh wallet balance to ensure it's in sync with backend
        setTimeout(() => {
          fetchWalletBalance()
        }, 1000)

      } else {
        toast.error(result.message || 'Failed to submit withdrawal request.')
      }
    } catch (error) {
      console.error('Error submitting withdrawal request:', error)
      toast.error('Something went wrong while submitting your request.')
    } finally {
      setIsRequestingWithdrawal(false)
    }
  }

  // Format commission type for display
  const formatCommissionType = (type) => {
    switch(type) {
      case 'first_purchase':
        return 'First Purchase'
      case 'repeat_purchase':
        return 'Repeat Purchase'
      case 'referral_bonus':
        return 'Referral Bonus'
      case 'Withdrawal Request':
        return 'Withdrawal Request'
      default:
        return type?.replace(/_/g, ' ')?.toUpperCase() || 'Commission'
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

  useEffect(() => {
    fetchWalletBalance()
    fetchCommissionHistory()
    fetchCustomers()
    // Set bank accounts from user details if available
    if (user && user.userDetails && user.userDetails.bankAccounts) {
      setBankAccounts(user.userDetails.bankAccounts)
    }
  }, [user])

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'customers', label: 'Customer List', icon: FaUsers }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">Here's what's happening with your partnership</p>
          </div>
          {/* Request Transfer Button */}
          <button
            onClick={() => setShowWithdrawalModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md"
          >
            <FaExchangeAlt className="w-4 h-4" />
            Request Transfer
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Current Balance */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Balance</p>
                    {loadingStats ? (
                      <div className="w-24 h-8 bg-gray-200 animate-pulse rounded mt-2"></div>
                    ) : (
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(walletBalance)}
                      </p>
                    )}
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <FaWallet className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Total Commission */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Commission</p>
                    {loadingCommissions ? (
                      <div className="w-24 h-8 bg-gray-200 animate-pulse rounded mt-2"></div>
                    ) : (
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(totalCommissionEarned)}
                      </p>
                    )}
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FaMoneyBillWave className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Total Customers */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    {loadingCustomers ? (
                      <div className="w-16 h-8 bg-gray-200 animate-pulse rounded mt-2"></div>
                    ) : (
                      <p className="text-2xl font-bold text-purple-600">{totalUsers}</p>
                    )}
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <FaUsers className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Total Orders (Placeholder for now) */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    {loadingStats ? (
                      <div className="w-16 h-8 bg-gray-200 animate-pulse rounded mt-2"></div>
                    ) : (
                      <p className="text-2xl font-bold text-orange-600">{totalOrders}</p>
                    )}
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <FaChartLine className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <p className="text-gray-600 text-sm">Your latest commission entries and withdrawal requests</p>
              </div>
              <div className="overflow-x-auto">
                {loadingCommissions ? (
                  <div className="p-6">
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex space-x-4">
                          <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
                          <div className="w-24 h-4 bg-gray-200 animate-pulse rounded"></div>
                          <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
                          <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
                          <div className="w-24 h-4 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {commissionHistory.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            No recent transactions found
                          </td>
                        </tr>
                      ) : (
                        commissionHistory.map((transaction, index) => (
                          <tr key={transaction._id || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {transaction.commissionType === 'Withdrawal Request' ? 'Admin Transfer' : transaction.customerName || transaction.customerDetails?.name || transaction.customerId?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCommissionType(transaction.commissionType)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {moment(transaction.createdAt).format('MMM DD, YYYY hh:mm A')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                transaction.status === 'credited' ? 'bg-green-100 text-green-800' :
                                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {transaction.status === 'credited' ? 'Credited' : transaction.status === 'pending' ? 'Pending' : 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                {transaction.commissionType === 'Withdrawal Request' ? (
                                  <FaExchangeAlt className="w-4 h-4 text-red-600 mr-2" />
                                ) : (
                                  <FaMoneyBillWave className="w-4 h-4 text-green-600 mr-2" />
                                )}
                                <span className={`${transaction.commissionType === 'Withdrawal Request' ? 'text-red-600' : 'text-green-600'} font-medium`}>
                                  {formatCurrency(transaction.commissionAmount)}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Customer List Tab Content */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            {/* Add New Customer Button */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Customer List</h2>
                <p className="text-gray-600">Manage your referred customers</p>
              </div>
              <button
                onClick={() => setOpenAddCustomerModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                Add New Customer
              </button>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="overflow-x-auto">
                {loadingCustomers ? (
                  <div className="p-6">
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex space-x-4">
                          <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
                          <div className="w-48 h-4 bg-gray-200 animate-pulse rounded"></div>
                          <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
                          <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mobile
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            No customers found
                          </td>
                        </tr>
                      ) : (
                        customers.map((customer) => (
                          <tr key={customer._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {customer.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {customer.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {customer.mobile || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {moment(customer.createdAt).format('MMM DD, YYYY')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add New Customer Modal */}
        {openAddCustomerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Customer</h3>
                <button
                  onClick={() => setOpenAddCustomerModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm password"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setOpenAddCustomerModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? 'Adding...' : 'Add Customer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Withdrawal Request Modal */}
        {showWithdrawalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Request Withdrawal</h3>
                <button
                  onClick={() => setShowWithdrawalModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Amount (INR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 500.00"
                  />
                </div>

                <div className="text-sm text-gray-600">
                  Available Balance: <span className="font-semibold text-green-600">{formatCurrency(walletBalance)}</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Bank Account
                  </label>
                  <select
                    value={selectedBankAccountIndex}
                    onChange={(e) => setSelectedBankAccountIndex(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="">-- Select an account --</option>
                    {bankAccounts.length > 0 ? (
                      bankAccounts.map((account, index) => (
                        <option key={index} value={index}>
                          {account.bankName} - {account.bankAccountNumber} ({account.accountHolderName})
                          {account.upiId && ` (UPI: ${account.upiId})`}
                        </option>
                      ))
                    ) : (
                      <option disabled>No bank accounts found. Please update your profile.</option>
                    )}
                  </select>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Important Notification:</p>
                  <ul className="list-disc list-inside">
                    <li>Withdrawal requests are processed within 24-48 business hours.</li>
                    <li>Ensure your bank account details are accurate to avoid delays.</li>
                    <li>Minimum withdrawal amount is INR 100.</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawalModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    disabled={isRequestingWithdrawal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleWithdrawalRequest}
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    disabled={isRequestingWithdrawal || bankAccounts.length === 0}
                  >
                    {isRequestingWithdrawal ? 'Processing...' : 'Proceed'}
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

export default PartnerDashboard;