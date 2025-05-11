import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import AddAdminModal from './AddAdminModal';

const AdminManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);

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
                credentials: 'include' // Include cookies for authentication
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Filter only admin users
                const adminUsers = result.data.filter(user => user.role === 'admin');
                setAdmins(adminUsers);
            } else {
                toast.error(result.message || "Failed to load admins");
            }
        } catch (error) {
            console.error("Error fetching admins:", error);
            toast.error("Something went wrong while loading admins");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAdminAdded = (newAdmin) => {
        setAdmins((prevAdmins) => [...prevAdmins, newAdmin]);
        fetchAdmins(); // Refetch all admins to ensure data consistency
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Management</h1>
                <button 
                    onClick={handleOpenModal} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                    Add New Admin
                </button>
            </div>
            
            <AddAdminModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                onAdminAdded={handleAdminAdded} 
            />
            
            {loading ? (
                <div className="text-center py-8">Loading admins...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2 text-left">Name</th>
                                <th className="border px-4 py-2 text-left">Email</th>
                                <th className="border px-4 py-2 text-center">Profile Pic</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.length > 0 ? (
                                admins.map(admin => (
                                    <tr key={admin._id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{admin.name}</td>
                                        <td className="border px-4 py-2">{admin.email.split('_')[0]}</td>
                                        <td className="border px-4 py-2 text-center">
                                            {admin.profilePic ? (
                                                <img 
                                                    src={admin.profilePic} 
                                                    alt="Profile" 
                                                    className="w-10 h-10 rounded-full inline-block object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-200 rounded-full inline-flex items-center justify-center">
                                                    <span className="text-gray-500">{admin.name.charAt(0)}</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="border px-4 py-4 text-center">
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