import React, { useState, useEffect } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AddRoleToUserModal = ({ onClose, callFunc, userId }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(userId || '');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const response = await fetch(SummaryApi.allUser.url, {
            method: SummaryApi.allUser.method,
            credentials: 'include',
          });
          const data = await response.json();
          if (data.success) {
            setUsers(data.data);
          } else {
            toast.error('Failed to load users');
          }
        } catch (error) {
          toast.error('Error loading users');
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [userId]);

  const handleAddRole = async () => {
    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    try {
      const response = await fetch(SummaryApi.addRoleToUser.url, { 
        method: SummaryApi.addRoleToUser.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: selectedUserId,
          role: selectedRole,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Role added successfully');
        if (callFunc) callFunc();
        if (onClose) onClose();
      } else {
        toast.error(data.message || 'Failed to add role');
      }
    } catch (error) {
      toast.error('Error adding role');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New Role to Existing User</h2>
        {!userId && (
          <div className="mb-4">
            <label className="block mb-1">Select User:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">--Select User--</option>
              {loading ? (
                <option disabled>Loading users...</option>
              ) : (
                users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))
              )}
            </select>
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-1">Select Role:</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">--Select Role--</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="partner">Partner</option>
            <option value="customer">Customer</option>
            <option value="developer">Developer</option>
          </select>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleAddRole}
        >
          Add Role
        </button>
      </div>
    </div>
  );
};

export default AddRoleToUserModal;
