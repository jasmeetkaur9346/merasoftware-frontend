import React, { useState } from 'react';

function CRMApp() {
  const [activeTab, setActiveTab] = useState('customers');
  const [customers] = useState([
    {
      id: 1,
      name: 'Rajesh Gupta',
      email: 'rajesh.g@example.com',
      phone: '9876543210',
      company: 'Gupta Enterprises'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.s@example.com',
      phone: '8765432109',
      company: 'Sharma Solutions'
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit.p@example.com',
      phone: '7654321098',
      company: 'Patel Traders'
    },
    {
      id: 4,
      name: 'Neha Singh',
      email: 'neha.s@example.com',
      phone: '6543210987',
      company: 'Singh & Co.'
    }
  ]);

  const [businessCreated] = useState([
    {
      id: 101,
      customerId: 1,
      customerName: 'Rajesh Gupta',
      productName: 'Premium Software Suite',
      price: 4999,
      purchaseDate: '2023-05-15',
      review: 'Excellent product, very satisfied with the performance.'
    },
    {
      id: 102,
      customerId: 2,
      customerName: 'Priya Sharma',
      productName: 'Business Analytics Tool',
      price: 8999,
      purchaseDate: '2023-06-20',
      review: 'Great insights, helped improve our decision making.'
    },
    {
      id: 103,
      customerId: 3,
      customerName: 'Amit Patel',
      productName: 'E-commerce Platform',
      price: 14999,
      purchaseDate: '2023-07-10',
      review: 'Solid platform with reliable performance.'
    },
    {
      id: 104,
      customerId: 1,
      customerName: 'Rajesh Gupta',
      productName: 'Advanced Analytics Suite',
      price: 15999,
      purchaseDate: '2023-08-15',
      review: 'Excellent product, very satisfied with the performance.'
    },
    {
      id: 105,
      customerId: 2,
      customerName: 'Priya Sharma',
      productName: 'CRM Integration Tool',
      price: 12999,
      purchaseDate: '2023-09-10',
      review: 'Great addition to our business tools.'
    },
    {
      id: 106,
      customerId: 1,
      customerName: 'Rajesh Gupta',
      productName: 'Security Package',
      price: 8999,
      purchaseDate: '2023-10-05',
      review: 'Very secure and reliable.'
    }
  ]);

  const [walletTransactions] = useState([
    {
      id: 1001,
      transactionDate: '2023-05-16',
      amount: 499.9,
      customerId: 1,
      customerName: 'Rajesh Gupta',
      productName: 'Premium Software Suite',
      status: 'Completed'
    },
    {
      id: 1002,
      transactionDate: '2023-06-21',
      amount: 899.9,
      customerId: 2,
      customerName: 'Priya Sharma',
      productName: 'Business Analytics Tool',
      status: 'Completed'
    },
    {
      id: 1003,
      transactionDate: '2023-07-11',
      amount: 1499.9,
      customerId: 3,
      customerName: 'Amit Patel',
      productName: 'E-commerce Platform',
      status: 'Pending'
    }
  ]);

  // Function to get purchase count for each customer
  const getBusinessWithPurchaseCount = () => {
    const customerPurchaseCount = {};
    
    // Sort by date to ensure correct order
    const sortedBusiness = [...businessCreated].sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));
    
    return sortedBusiness.map(business => {
      const customerId = business.customerId;
      
      if (!customerPurchaseCount[customerId]) {
        customerPurchaseCount[customerId] = 0;
      }
      
      customerPurchaseCount[customerId]++;
      
      return {
        ...business,
        purchaseCount: customerPurchaseCount[customerId]
      };
    });
  };

  // Function to get ordinal suffix (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) {
      return num + "st";
    }
    if (j === 2 && k !== 12) {
      return num + "nd";
    }
    if (j === 3 && k !== 13) {
      return num + "rd";
    }
    return num + "th";
  };

  return (
    <div className={`flex h-screen bg-gray-100`}>
      {/* Left Panel */}
      <div className={`w-1/4 bg-indigo-800 text-white p-4 flex flex-col`}>
        <div className={`flex items-center justify-center mb-8`}>
          <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/52d252d8-529a-41f3-b7e7-5accadabd82c.png" alt="CRM System Logo in dark blue with white text and modern sans-serif font" className={`h-12`} />
        </div>

        <nav className={`flex flex-col space-y-2`}>
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center p-3 rounded-lg transition-all ${activeTab === 'customers' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          >
            <span className={`w-8 h-8 flex items-center justify-center mr-3 bg-white text-indigo-800 rounded-full`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </span>
            <span>My Customers</span>
          </button>

          <button
            onClick={() => setActiveTab('businessCreated')}
            className={`flex items-center p-3 rounded-lg transition-all ${activeTab === 'businessCreated' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          >
            <span className={`w-8 h-8 flex items-center justify-center mr-3 bg-white text-indigo-800 rounded-full`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </span>
            <span>Business Created</span>
          </button>

          <button
            onClick={() => setActiveTab('walletManagement')}
            className={`flex items-center p-3 rounded-lg transition-all ${activeTab === 'walletManagement' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
          >
            <span className={`w-8 h-8 flex items-center justify-center mr-3 bg-white text-indigo-800 rounded-full`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </span>
            <span>Wallet Management</span>
          </button>
        </nav>
      </div>

      {/* Right Panel */}
      <div className={`w-3/4 p-6 bg-white`}>
        <div className={`mb-6`}>
          <h1 className={`text-2xl font-bold text-gray-800`}>
            {activeTab === 'customers' && 'Customers List'}
            {activeTab === 'businessCreated' && 'Business Created'}
            {activeTab === 'walletManagement' && 'Wallet Management'}
          </h1>
          <div className={`mt-2 w-20 h-1 bg-indigo-600`}></div>
        </div>

        {/* Customer List */}
        {activeTab === 'customers' && (
          <div className={`bg-white rounded-lg shadow-md overflow-hidden`}>
            <div className={`grid grid-cols-12 gap-4 bg-gray-100 p-4 font-semibold text-gray-700`}>
              <div className={`col-span-1`}>ID</div>
              <div className={`col-span-3`}>Name</div>
              <div className={`col-span-4`}>Email</div>
              <div className={`col-span-2`}>Phone</div>
              <div className={`col-span-2`}>Company</div>
            </div>

            {customers.map((customer) => (
              <div key={customer.id} className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50`}>
                <div className={`col-span-1 text-gray-600`}>#{customer.id}</div>
                <div className={`col-span-3 font-medium text-gray-800`}>{customer.name}</div>
                <div className={`col-span-4 text-gray-600 truncate`}>{customer.email}</div>
                <div className={`col-span-2 text-gray-600`}>{customer.phone}</div>
                <div className={`col-span-2 text-gray-600`}>{customer.company}</div>
              </div>
            ))}
          </div>
        )}

        {/* Business Created */}
        {activeTab === 'businessCreated' && (
          <div className={`bg-white rounded-lg shadow-md overflow-hidden`}>
            <div className={`grid grid-cols-12 gap-4 bg-gray-100 p-4 font-semibold text-gray-700`}>
              <div className={`col-span-1`}>ID</div>
              <div className={`col-span-3`}>Customer</div>
              <div className={`col-span-3`}>Product</div>
              <div className={`col-span-1`}>Price</div>
              <div className={`col-span-2`}>Date</div>
              <div className={`col-span-2`}>Revenue (10%)</div>
            </div>
            {getBusinessWithPurchaseCount().map((business) => (
              <div key={business.id} className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50`}>
                <div className={`col-span-1 text-gray-600`}>#{business.id}</div>
                <div className={`col-span-3 font-medium text-gray-800`}>
                  <div className="flex items-center gap-2">
                    <span>{business.customerName}</span>
                    {business.purchaseCount > 1 && (
                      <span className={`inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-semibold`}>
                        {getOrdinalSuffix(business.purchaseCount)} Purchase
                      </span>
                    )}
                  </div>
                </div>
                <div className={`col-span-3 text-gray-600`}>{business.productName}</div>
                <div className={`col-span-1 text-gray-600`}>₹{business.price.toLocaleString()}</div>
                <div className={`col-span-2 text-gray-600`}>{business.purchaseDate}</div>
                <div className={`col-span-2 font-medium text-green-600`}>
                  ₹{(business.price * 0.1).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Wallet Management */}
        {activeTab === 'walletManagement' && (
          <div className={`bg-white rounded-lg shadow-md overflow-hidden`}>
            <div className={`grid grid-cols-12 gap-4 bg-gray-100 p-4 font-semibold text-gray-700`}>
              <div className={`col-span-1`}>ID</div>
              <div className={`col-span-2`}>Date</div>
              <div className={`col-span-3`}>Customer</div>
              <div className={`col-span-3`}>Product</div>
              <div className={`col-span-2`}>Amount</div>
                            <div className={`col-span-1`}>Status</div>
            </div>

            {walletTransactions.map((tx) => (
              <div key={tx.id} className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50`}>
                <div className={`col-span-1 text-gray-600`}>#{tx.id}</div>
                <div className={`col-span-2 text-gray-600`}>{tx.transactionDate}</div>
                <div className={`col-span-3 font-medium text-gray-800`}>{tx.customerName}</div>
                <div className={`col-span-3 text-gray-600`}>{tx.productName}</div>
                <div className={`col-span-2 font-bold ${tx.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  ₹{tx.amount.toFixed(2)}
                </div>
                <div className={`col-span-1`}>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${tx.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}

            <div className={`p-4 bg-blue-50 border-t border-blue-100`}>
              <div className={`flex justify-between items-center`}>
                <div className={`text-blue-800`}>
                  Total Commission: <span className={`font-bold`}>₹{walletTransactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)}</span>
                </div>
                <div className={`text-blue-800`}>
                  Completed: <span className={`font-bold`}>₹{walletTransactions.filter(tx => tx.status === 'Completed').reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CRMApp;
