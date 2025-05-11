// src/components/DeveloperManagement.js
import React, { useState, useEffect } from 'react';
import AddDeveloperModal from './AddDeveloperModal';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const DeveloperManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.allUser.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        setDevelopers(result.data.filter(user => user.role === 'developer'));
      } else {
        toast.error(result.message || 'Failed to load developers');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching developers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleDeveloperAdded = (newDeveloper) => {
    setDevelopers(prev => [...prev, newDeveloper]);
    fetchDevelopers();
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Developer Management</h1>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition"
          onClick={handleOpenModal}
        >
          Add New Developer
        </button>
      </div>

      <AddDeveloperModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDeveloperAdded={handleDeveloperAdded}
      />

      {loading ? (
        <p className="text-center text-gray-600">Loading developers...</p>
      ) : (
        <table className="min-w-full bg-white border rounded-md shadow-sm text-left">
          <thead className="bg-indigo-50 text-indigo-700">
            <tr>
              <th className="py-3 px-6 border-b">Name</th>
              <th className="py-3 px-6 border-b">Email</th>
              <th className="py-3 px-6 border-b">Profile Picture</th>
            </tr>
          </thead>
          <tbody>
            {developers.length > 0 ? (
              developers.map(dev => (
                <tr key={dev._id} className="hover:bg-indigo-100">
                  <td className="py-3 px-6 border-b">{dev.name}</td>
                  <td className="py-3 px-6 border-b">{dev.email.split('_')[0]}</td>
                  <td className="py-3 px-6 border-b">
                    {dev.profilePic ? (
                      <img
                        src={dev.profilePic}
                        alt={dev.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                        {dev.name?.charAt(0).toUpperCase() || 'D'}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" className="py-4 text-center text-gray-500">No developers found</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeveloperManagement;