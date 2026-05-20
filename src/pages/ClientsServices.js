import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { Search } from 'lucide-react';

const ClientsServices = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch customers from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await fetch(SummaryApi.allUser.url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const result = await response.json();
        if (result.success) {
          const customers = result.data.filter(user => user.roles.includes('customer'));
          setClients(customers);
          setFilteredClients(customers);
        } else {
          toast.error(result.message || 'Failed to load clients');
        }
      } catch (error) {
        console.error(error);
        toast.error('Error fetching clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search term
  useEffect(() => {
    const filtered = clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const displayINRCurrency = (num) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    });
    return formatter.format(num);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Clients Services</h1>
        <p className="text-gray-600 mt-2">
          Manage all your clients and their services
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Clients</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{clients.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Active Clients</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {clients.filter(c => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {clients.reduce((sum, c) => sum + c.totalOrders, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {displayINRCurrency(clients.reduce((sum, c) => sum + c.totalSpent, 0))}
          </p>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Roles</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Join Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr
                    key={client._id}
                    className="hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin-panel/customer-detail/${client._id}`)}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{client.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.email || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {client.roles && client.roles.length > 0
                        ? client.roles.map(role => (
                            <span key={role} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 capitalize">
                              {role}
                            </span>
                          ))
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {client.createdAt
                        ? new Date(client.createdAt).toLocaleDateString('en-IN')
                        : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No clients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Info */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredClients.length} of {clients.length} clients
      </div>
    </div>
  );
};

export default ClientsServices;
