import React, { useState, useEffect } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { Search } from 'lucide-react';

const ClientsServices = () => {
  const [clients, setClients] = useState([
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      company: 'Tech Corp',
      totalOrders: 5,
      totalSpent: 50000,
      status: 'active',
      joinDate: '2025-01-15'
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '9876543211',
      company: 'Design Studio',
      totalOrders: 3,
      totalSpent: 30000,
      status: 'active',
      joinDate: '2025-02-10'
    },
    {
      _id: '3',
      name: 'Ram Patel',
      email: 'ram@example.com',
      phone: '9876543212',
      company: 'Web Solutions',
      totalOrders: 7,
      totalSpent: 75000,
      status: 'active',
      joinDate: '2024-12-05'
    },
    {
      _id: '4',
      name: 'Priya Singh',
      email: 'priya@example.com',
      phone: '9876543213',
      company: 'Mobile Apps',
      totalOrders: 2,
      totalSpent: 25000,
      status: 'inactive',
      joinDate: '2025-03-20'
    },
    {
      _id: '5',
      name: 'Amit Kumar',
      email: 'amit@example.com',
      phone: '9876543214',
      company: 'E-Commerce',
      totalOrders: 8,
      totalSpent: 100000,
      status: 'active',
      joinDate: '2024-11-01'
    },
  ]);

  const [filteredClients, setFilteredClients] = useState(clients);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Filter clients based on search term
    const filtered = clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm]);

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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Company</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
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
                  <tr key={client._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{client.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-semibold">{client.totalOrders}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      {displayINRCurrency(client.totalSpent)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          client.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {client.status === 'active' ? '✓ Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(client.joinDate).toLocaleDateString('en-IN')}
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
