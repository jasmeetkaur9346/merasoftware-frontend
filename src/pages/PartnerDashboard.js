import React, { useEffect, useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { FaUsers, FaMoneyBillWave, FaChartLine, FaWallet, FaPlus, FaExchangeAlt, FaSignOutAlt } from 'react-icons/fa'
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
  const [showTransactionDetailModal, setShowTransactionDetailModal] = useState(false)
  const [selectedTransactionDetail, setSelectedTransactionDetail] = useState(null)
  const [expandedCustomer, setExpandedCustomer] = useState(null)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isUpdating, setIsUpdating] = useState(false)

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
        commissionAmount: -withdrawal.requestedAmount, // Negative amount
        adminResponse: withdrawal.adminResponse, // Add this line
       selectedBankAccount: withdrawal.selectedBankAccount
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

  // Handle customer update function
const handleUpdateCustomer = async (customerId) => {
  if (!editFormData.name && !editFormData.email && !editFormData.phone) {
    toast.error('At least one field is required to update')
    return
  }

  setIsUpdating(true)
  
  try {
    const response = await fetch(`${SummaryApi.updatePartnerCustomer.url}/${customerId}`, {
      method: SummaryApi.updatePartnerCustomer.method,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(editFormData)
    })
    
    const result = await response.json()
    
    if (result.success) {
      toast.success('Customer details updated successfully')
      setEditingCustomer(null)
      setEditFormData({ name: '', email: '', phone: '' })
      fetchCustomers() // Refresh customer list
    } else {
      toast.error(result.message || 'Failed to update customer')
    }
  } catch (error) {
    console.error('Error updating customer:', error)
    toast.error('Something went wrong while updating customer')
  } finally {
    setIsUpdating(false)
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

  const getStatusColor = (status) => {
    switch (status) {
        case 'completed':
        case 'approved':
        case 'Credited':
            return 'bg-green-100 text-green-800'
        case 'pending':
            return 'bg-yellow-100 text-yellow-800'
        case 'rejected':
            return 'bg-red-100 text-red-800'
        case 'Transferred':
            return 'bg-blue-100 text-blue-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

  const getStatusText = (transaction) => {
    if (transaction.commissionType === 'Withdrawal Request') {
      switch (transaction.status) {
        case 'approved':
          return 'Transferred'
        case 'pending':
          return 'Transfer'
        case 'rejected':
          return 'Rejected'
        default:
          return 'Transfer'
      }
    } else {
      return transaction.status === 'credited' ? 'Credited' : 'Pending'
    }
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

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'customers', label: 'My Customers', icon: FaUsers }
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Partner Portal</h2>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-6">
          <button className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                Welcome back, {user?.name}! 
                <span className="text-2xl ml-2">🎯</span>
              </h1>
              <p className="text-gray-600">Here's what's happening with your partnership</p>
            </div>
            {activeTab === 'dashboard' && (
              <button
                onClick={() => setShowWithdrawalModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                <FaExchangeAlt className="w-4 h-4" />
                Request Transfer
              </button>
            )}
          </div>

          {/* Dashboard Tab Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Current Balance */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium mb-1">CURRENT BALANCE</p>
                      {loadingStats ? (
                        <div className="w-24 h-6 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(walletBalance)}
                        </p>
                      )}
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-green-600 font-medium">+12.5%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <FaWallet className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Total Commission */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium mb-1">TOTAL COMMISSION</p>
                      {loadingCommissions ? (
                        <div className="w-24 h-6 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(totalCommissionEarned)}
                        </p>
                      )}
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-green-600 font-medium">+8.2%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FaMoneyBillWave className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Total Customers */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium mb-1">TOTAL CUSTOMERS</p>
                      {loadingCustomers ? (
                        <div className="w-16 h-6 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                      )}
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-green-600 font-medium">+100%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <FaUsers className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium mb-1">TOTAL ORDERS</p>
                      {loadingStats ? (
                        <div className="w-16 h-6 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                      )}
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-red-600 font-medium">-2.5%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <FaChartLine className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                    <p className="text-gray-500 text-sm">Your latest earnings and transfers</p>
                  </div>
                  <div className="w-6 h-6 text-gray-400">
                    🔔
                  </div>
                </div>
                
                <div className="p-6">
                  {loadingCommissions ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
                          <div className="flex-1">
                            <div className="w-40 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                            <div className="w-24 h-3 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                          <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : commissionHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaMoneyBillWave className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No recent transactions found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {commissionHistory.map((transaction, index) => (
                        <div 
                          key={transaction._id || index}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedTransactionDetail(transaction)
                            setShowTransactionDetailModal(true)
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.commissionType === 'Withdrawal Request' ? 'bg-red-100' : 'bg-green-100'
                            }`}>
                              {transaction.commissionType === 'Withdrawal Request' ? 
                                <span className="text-lg">↗️</span> : 
                                <span className="text-lg">↗️</span>
                              }
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {transaction.commissionType === 'Withdrawal Request' 
                                  ? 'Money Transfer Request' 
                                  : `${transaction.customerName || 'Customer'} purchased ${transaction.serviceName || 'Service'}`
                                }
                              </p>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                  {getStatusText(transaction)}
                                </span>
                                <span>•</span>
                                <span>{moment(transaction.createdAt).format('MMM DD, YYYY at hh:mm A')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-lg ${
                              transaction.commissionType === 'Withdrawal Request' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {transaction.commissionType === 'Withdrawal Request' ? '-' : '+'}
                              {formatCurrency(Math.abs(transaction.commissionAmount))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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
          <React.Fragment key={customer._id}>
            {/* Main Row */}
            <tr 
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setExpandedCustomer(expandedCustomer === customer._id ? null : customer._id)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex items-center">
                  <span className="mr-2">
                    {expandedCustomer === customer._id ? '▼' : '▶'}
                  </span>
                  {customer.name}
                </div>
              </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {customer.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {customer.phone || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {moment(customer.dateAdded).format('MMM DD, YYYY')}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </td>
          </tr>

            {/* Expanded Row */}
          {expandedCustomer === customer._id && (
            <tr>
              <td colSpan="5" className="px-6 py-4 bg-gray-50">
                <div className="space-y-4">
                  {/* Customer Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Total Purchases</p>
                      <p className="text-lg font-semibold text-blue-600">{customer.totalPurchases}</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Total Spend</p>
                      <p className="text-lg font-semibold text-green-600">{formatCurrency(customer.totalSpend)}</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Wallet Balance</p>
                      <p className="text-lg font-semibold text-purple-600">{formatCurrency(customer.walletBalance)}</p>
                    </div>
                  </div>

                    {/* Edit Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingCustomer(customer._id)
                        setEditFormData({
                          name: customer.name,
                          email: customer.email,
                          phone: customer.phone || ''
                        })
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Edit Details
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Customer Modal */}
{editingCustomer && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Edit Customer Details</h3>
        <button
          onClick={() => {
            setEditingCustomer(null)
            setEditFormData({ name: '', email: '', phone: '' })
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault()
        handleUpdateCustomer(editingCustomer)
      }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={editFormData.name}
            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter customer name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={editFormData.email}
            onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={editFormData.phone}
            onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter phone number"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setEditingCustomer(null)
              setEditFormData({ name: '', email: '', phone: '' })
            }}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Customer'}
          </button>
        </div>
      </form>
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

              <form autoComplete="off" onSubmit={handleAddCustomer} className="space-y-4">
                 {/* Hidden fake fields to fool browser */}
  <input type="text" name="fakeusernameremembered" autoComplete="username" style={{ display: 'none' }} />
  <input type="password" name="fakepasswordremembered" autoComplete="new-password" style={{ display: 'none' }} />
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
                    name="email"
                    autoComplete="new-email"  
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
                    name="newCustomerPassword"
                    autoComplete="new-password" 
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
                     name="confirmCustomerPassword"
                    autoComplete="new-password"
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

        {/* Transaction Detail Modal */}
{showTransactionDetailModal && selectedTransactionDetail && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {selectedTransactionDetail.commissionType === 'Withdrawal Request' 
                            ? 'Withdrawal Request Details' 
                            : 'Commission Details'}
                    </h3>
                    <button
                        onClick={() => {
                            setShowTransactionDetailModal(false)
                            setSelectedTransactionDetail(null)
                        }}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
                {selectedTransactionDetail.commissionType === 'Withdrawal Request' ? (
                    // Withdrawal Request Details
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Type</p>
                                <p className="font-semibold">Withdrawal Request</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Amount</p>
                                <p className="font-semibold text-red-600">
                                    {formatCurrency(Math.abs(selectedTransactionDetail.commissionAmount))}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <p className={`font-semibold ${getStatusColor(selectedTransactionDetail.status)}`}>
                                    {selectedTransactionDetail.status?.charAt(0).toUpperCase() + selectedTransactionDetail.status?.slice(1)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Requested At</p>
                                <p className="font-semibold">
                                    {moment(selectedTransactionDetail.createdAt).format('MMM DD, YYYY hh:mm A')}
                                </p>
                            </div>
                        </div>

                        {/* Bank Account Details - यह data backend से आना चाहिए */}
                        {selectedTransactionDetail.selectedBankAccount && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
                                <h4 className="font-semibold text-gray-900 mb-2">Bank Account Details:</h4>
                                <div className="text-sm space-y-1">
                                    <p><strong>Bank:</strong> {selectedTransactionDetail.selectedBankAccount.bankName}</p>
                                    <p><strong>Account No:</strong> {selectedTransactionDetail.selectedBankAccount.bankAccountNumber}</p>
                                    <p><strong>IFSC:</strong> {selectedTransactionDetail.selectedBankAccount.bankIFSCCode}</p>
                                    <p><strong>Account Holder:</strong> {selectedTransactionDetail.selectedBankAccount.accountHolderName}</p>
                                </div>
                            </div>
                        )}

                        {/* Admin Response Details */}
                        {selectedTransactionDetail.status === 'approved' && selectedTransactionDetail.adminResponse && (
                            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                <h4 className="font-semibold text-gray-900 mb-2">Approval Details:</h4>
                                <div className="text-sm space-y-1">
                                    <p><strong>Approved By:</strong> Admin</p>
                                    <p><strong>Payment Mode:</strong> {selectedTransactionDetail.adminResponse.paymentMode}</p>
                                    <p><strong>Transaction ID:</strong> {selectedTransactionDetail.adminResponse.transactionId}</p>
                                    <p><strong>Processed At:</strong> {moment(selectedTransactionDetail.adminResponse.processedAt).format('MMM DD, YYYY hh:mm A')}</p>
                                </div>
                            </div>
                        )}

                        {selectedTransactionDetail.status === 'rejected' && selectedTransactionDetail.adminResponse && (
                            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                                <h4 className="font-semibold text-gray-900 mb-2">Rejection Details:</h4>
                                <div className="text-sm space-y-1">
                                    <p><strong>Rejected By:</strong> Admin</p>
                                    <p><strong>Reason:</strong> {selectedTransactionDetail.adminResponse.rejectionReason}</p>
                                    <p><strong>Rejected At:</strong> {moment(selectedTransactionDetail.adminResponse.processedAt).format('MMM DD, YYYY hh:mm A')}</p>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    // Commission Details 
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Customer Name</p>
                                <p className="font-semibold">{selectedTransactionDetail.customerName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Commission Type</p>
                                <p className="font-semibold">{formatCommissionType(selectedTransactionDetail.commissionType)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Date & Time</p>
                                <p className="font-semibold">
                                    {moment(selectedTransactionDetail.createdAt).format('MMM DD, YYYY hh:mm A')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Amount Credited</p>
                                <p className="font-semibold text-green-600">
                                    {formatCurrency(selectedTransactionDetail.commissionAmount)}
                                </p>
                            </div>
                        </div>

                        {/* Customer Contact Details */}
                        {selectedTransactionDetail.customerId && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                                <h4 className="font-semibold text-gray-900 mb-2">Customer Contact:</h4>
                                <div className="text-sm space-y-1">
                                    <p><strong>Email:</strong> {selectedTransactionDetail.customerId.email || 'N/A'}</p>
                                    <p><strong>Phone:</strong> {selectedTransactionDetail.customerId.phone || 'N/A'}</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Commission Rate</p>
                                <p className="font-semibold">
                                    {selectedTransactionDetail.commissionRate ? `${(selectedTransactionDetail.commissionRate * 100).toFixed(0)}%` : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Order Amount</p>
                                <p className="font-semibold">
                                    {selectedTransactionDetail.orderAmount ? formatCurrency(selectedTransactionDetail.orderAmount) : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {selectedTransactionDetail.serviceName && (
                            <div>
                                <p className="text-sm text-gray-600">Service Name</p>
                                <p className="font-semibold">{selectedTransactionDetail.serviceName}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    </div>
)}

      </div>
    </div>
    </div>
  )
}

export default PartnerDashboard;