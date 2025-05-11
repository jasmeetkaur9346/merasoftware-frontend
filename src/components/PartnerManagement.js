import React, { useState, useEffect } from 'react'
import AddPartnerModal from './AddPartnerModal'
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const PartnerManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(false)

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
        setPartners(result.data.filter(user => user.role === 'partner'))
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

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handlePartnerAdded = newPartner => {
    setPartners(prev => [...prev, newPartner])
    fetchPartners()
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Partner Management</h1>
        <button
          onClick={handleOpenModal}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          Add New Partner
        </button>
      </div>

      <AddPartnerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPartnerAdded={handlePartnerAdded}
      />

      {loading ? (
        <p className="text-center text-gray-600">Loading partners...</p>
      ) : (
        <table className="min-w-full bg-white border rounded-md shadow-sm text-left">
          <thead className="bg-green-50 text-green-700">
            <tr>
              <th className="py-3 px-6 border-b">Name</th>
              <th className="py-3 px-6 border-b">Email</th>
              <th className="py-3 px-6 border-b">Profile Picture</th>
            </tr>
          </thead>
          <tbody>
            {partners.length > 0 ? (
              partners.map(partner => (
                <tr key={partner._id} className="hover:bg-green-100">
                  <td className="py-3 px-6 border-b">{partner.name}</td>
                  <td className="py-3 px-6 border-b">{partner.email.split('_')[0]}</td>
                  <td className="py-3 px-6 border-b">
                    {partner.profilePic ? (
                      <img
                        src={partner.profilePic}
                        alt={partner.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                        {partner.name?.charAt(0).toUpperCase() || 'P'}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-center text-gray-500">
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

export default PartnerManagement;