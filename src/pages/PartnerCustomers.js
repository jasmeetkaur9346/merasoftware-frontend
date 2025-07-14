import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const PartnerCustomers = () => {
  const user = useSelector(state => state?.user?.user);
  const [customers, setCustomers] = useState([]);
  const [firstPurchaseList, setFirstPurchaseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      fetchCustomers();
      fetchFirstPurchaseList();
    }
  }, [user]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SummaryApi.allUser.url}?referredBy=${user._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success) {
        setCustomers(result.data);
      } else {
        toast.error(result.message || 'Failed to load customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Something went wrong while loading customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchFirstPurchaseList = async () => {
    try {
      const response = await fetch(SummaryApi.onlyFirstPurchase.url, {
        method: SummaryApi.onlyFirstPurchase.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (result.success) {
        setFirstPurchaseList(result.data);
      } else {
        toast.error(result.message || 'Failed to load first purchase summary');
      }
    } catch (error) {
      console.error('Error fetching first purchase summary:', error);
      toast.error('Something went wrong while loading first purchase summary');
    }
  };

  // Helper to get purchase details for a customer
  const getPurchaseDetailsForCustomer = (customerId) => {
    const purchase = firstPurchaseList.find(p => p.customerId.toString() === customerId.toString());
    if (purchase) {
      return {
        productName: purchase.productName,
        finalPrice: purchase.finalPrice,
        paymentType: purchase.paymentType
      };
    }
    return {
      productName: 'Pending',
      finalPrice: 'Pending',
      paymentType: 'Pending'
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Password and confirm password do not match');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'customer',
        referredBy: user._id
      };
      const response = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Customer created successfully');
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setOpenAddCustomerModal(false);
        fetchCustomers();
      } else {
        toast.error(result.message || 'Failed to create customer');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Something went wrong while creating customer');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCustomers = customers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold text-gray-800">My Customer</h1>
        <button
          onClick={() => setOpenAddCustomerModal(true)}
          className="bg-purple-700 hover:bg-purple-800 font-semibold text-white px-4 py-2 rounded-md"
        >
          Add New Customer
        </button>
      </div>

      <input
        type="text"
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      {openAddCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setOpenAddCustomerModal(false)}
            >
              &times;
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
              >
                {submitting ? 'Creating...' : 'Create Customer'}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-600">Loading customers...</p>
      ) : filteredCustomers.length === 0 ? (
        <p className="text-center text-gray-600">No customers found.</p>
      ) : (
        <table className="min-w-full bg-white border rounded-md shadow-sm text-left">
          <thead className="bg-purple-50 text-purple-700">
            <tr>
              <th className="py-3 px-6 border-b">S.No</th>
              <th className="py-3 px-6 border-b">Customer Name</th>
              <th className="py-3 px-6 border-b">Phone No</th>
              <th className="py-3 px-6 border-b">Product</th>
              <th className="py-3 px-6 border-b">Final price</th>
              <th className="py-3 px-6 border-b">Payment Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((user, index) => {
              const purchaseDetails = getPurchaseDetailsForCustomer(user._id);
              return (
                <tr key={user._id} className="cursor-pointer hover:bg-purple-100">
                  <td className="py-3 px-6 border-b">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-purple-700 text-white">
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-3 px-6 border-b">{user.name}</td>
                  <td className="py-3 px-6 border-b">{user?.phone || 'Not set'}</td>
                  <td className="py-3 px-6 border-b">{purchaseDetails.productName}</td>
                  <td className="py-3 px-6 border-b">{purchaseDetails.finalPrice}</td>
                  <td className="py-3 px-6 border-b">{purchaseDetails.paymentType}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PartnerCustomers;
