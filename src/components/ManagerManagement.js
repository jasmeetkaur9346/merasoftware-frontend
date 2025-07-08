import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import SignUp from '../pages/SignUp';
import AddRoleToUserModal from './AddRoleToUserModal';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.allUser.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success) {
        const adminUsers = result.data.filter(user => user.roles.includes('manager'));
        setAdmins(adminUsers);
      } else {
        toast.error(result.message || "Failed to load managers");
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
      toast.error("Something went wrong while loading managers");
    } finally {
      setLoading(false);
    }
  };

  const handleUserAdded = (newUser) => {
    setAdmins(prev => [...prev, newUser]);
    fetchAdmins();
  };

  const toggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const openManageRoleModal = (user) => {
    setSelectedUserForRole(user);
    setOpenRoleModal(true);
  };

  const filteredAdmins = admins.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manager Management</h1>
        <button
          onClick={() => setOpenAddUserModal(true)}
          className="bg-pink-700 hover:bg-pink-800 font-semibold text-white px-4 py-2 rounded-md"
        >
          Add New User
        </button>
      </div>

      <input
        type="text"
        placeholder="Search admins..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full max-w-md"
      />

      {openAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setOpenAddUserModal(false)}
            >
              &times;
            </button>
            <SignUp onClose={() => setOpenAddUserModal(false)} onUserAdded={handleUserAdded} />
          </div>
        </div>
      )}

      {openRoleModal && selectedUserForRole && (
        <AddRoleToUserModal
          onClose={() => setOpenRoleModal(false)}
          userId={selectedUserForRole._id}
          callFunc={fetchAdmins}
        />
      )}

      {loading ? (
        <div className="text-center py-8">Loading managers...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-md shadow-sm text-left">
          <thead className="bg-pink-50 text-pink-700">
            <tr>
              <th className="py-3 px-6 border-b">Name</th>
              <th className="py-3 px-6 border-b">Email</th>
              {/* <th className="py-3 px-6 border-b">Roles</th> */}
              <th className="py-3 px-6 border-b">Profile Picture</th>
            </tr>
          </thead>
            <tbody>
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map(admin => (
                  <React.Fragment key={admin._id}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleExpand(admin._id)}
                    >
                      <td className="border-b py-3 px-6">{admin.name}</td>
                      <td className="border-b py-3 px-6 ">{admin.email.split('_')[0]}</td>
                      {/* <td className="border-b px-6 py-2">{admin.roles ? admin.roles.join(', ') : ''}</td> */}
                      <td className="border-b py-3 px-6">
                        {admin.profilePic ? (
                          <img
                            src={admin.profilePic}
                            alt="Profile"
                            className="w-12 h-12 rounded-full inline-block object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-full inline-flex items-center justify-center">
                            <span className="text-gray-500">{admin.name.charAt(0)}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                    {expandedUserId === admin._id && (
                      <tr>
                        <td colSpan="4" className="bg-gray-100 px-4 py-4">
                          <button
                            className="bg-pink-700 text-white px-4 py-2 rounded"
                            onClick={() => openManageRoleModal(admin)}
                          >
                            Manage Role
                          </button>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border px-4 py-4 text-center">
                    No admin users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
