import React, { useState, useEffect } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import SignUp from '../pages/SignUp'
import AddRoleToUserModal from './AddRoleToUserModal'

const PartnerManagement = () => {
  const [openAddUserModal, setOpenAddUserModal] = useState(false)
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(false)
  const [expandedUserId, setExpandedUserId] = useState(null)
  const [openRoleModal, setOpenRoleModal] = useState(false)
  const [selectedUserForRole, setSelectedUserForRole] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      setLoading(true)
      const response = await fetch(SummaryApi.allUser.url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const result = await response.json()
      if (result.success) {
        setPartners(result.data.filter(user => user.roles.includes('partner')))
      } else {
        toast.error(result.message || 'Failed to load partners')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error fetching partners')
    } finally {
      setLoading(false)
    }
  }

  const handleUserAdded = (newUser) => {
    setPartners(prev => [...prev, newUser])
    fetchPartners()
  }

  const toggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId)
  }

  const openManageRoleModal = (user) => {
    setSelectedUserForRole(user)
    setOpenRoleModal(true)
  }

  const filteredPartners = partners.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Partner Management</h1>
        <button
          onClick={() => setOpenAddUserModal(true)}
          className="bg-green-800 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Add New User
        </button>
      </div>

      <input
        type="text"
        placeholder="Search partners..."
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
          callFunc={fetchPartners}
        />
      )}

      {loading ? (
        <p className="text-center text-gray-600">Loading partners...</p>
      ) : (
        <table className="min-w-full bg-white border rounded-md shadow-sm text-left">
          <thead className="bg-green-50 text-green-700">
            <tr>
              <th className="py-3 px-6 border-b">Name</th>
              <th className="py-3 px-6 border-b">Email</th>
              {/* <th className="py-3 px-6 border-b">Roles</th> */}
              <th className="py-3 px-6 border-b">Profile Picture</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.length > 0 ? (
              filteredPartners.map(user => (
                <React.Fragment key={user._id}>
                  <tr
                    className="cursor-pointer hover:bg-green-100"
                    onClick={() => toggleExpand(user._id)}
                  >
                    <td className="py-3 px-6 border-b">{user.name}</td>
                    <td className="py-3 px-6 border-b">{user.email.split('_')[0]}</td>
                    {/* <td className="py-3 px-6 border-b">{user.roles ? user.roles.join(', ') : ''}</td> */}
                    <td className="py-3 px-6 border-b">
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                          {user.name?.charAt(0).toUpperCase() || 'P'}
                        </div>
                      )}
                    </td>
                  </tr>
                  {expandedUserId === user._id && (
                    <tr>
                      <td colSpan="4" className="bg-green-100 px-6 py-4">
                        <button
                          className="bg-green-700 text-white px-4 py-2 rounded"
                          onClick={() => openManageRoleModal(user)}
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
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No partners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default PartnerManagement
