import React, { useState, useEffect } from 'react';
import AddCustomerModal from './AddCustomerModal';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const CustomerManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.allUser.url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        setCustomers(result.data.filter(user => user.role === 'customer'));
      } else {
        toast.error(result.message || 'Failed to load customers');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching customers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCustomerAdded = newCustomer => {
    setCustomers(prev => [...prev, newCustomer]);
    fetchCustomers();
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Customer Management</h1>
        <button
          onClick={handleOpenModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          Add New Customer
        </button>
      </div>

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCustomerAdded={handleCustomerAdded}
      />

      {loading ? (
        <p className="text-center text-gray-600">Loading customers...</p>
      ) : (
        <table className="min-w-full bg-white border rounded-md shadow-sm text-left">
          <thead className="bg-purple-50 text-purple-700">
            <tr>
              <th className="py-3 px-6 border-b">Name</th>
              <th className="py-3 px-6 border-b">Email</th>
              <th className="py-3 px-6 border-b">Profile Picture</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map(customer => (
                <tr key={customer._id} className="hover:bg-purple-100">
                  <td className="py-3 px-6 border-b">{customer.name}</td>
                  <td className="py-3 px-6 border-b">{customer.email.split('_')[0]}</td>
                  <td className="py-3 px-6 border-b">
                    {customer.profilePic ? (
                      <img
                        src={customer.profilePic}
                        alt={customer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                        {customer.name?.charAt(0).toUpperCase() || 'C'}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerManagement;