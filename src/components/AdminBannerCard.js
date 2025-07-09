import React, { useState } from 'react';
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import AdminEditBanner from './AdminEditBanner';
import AdminDeleteBanner from './AdminDeleteBanner';

const AdminBannerCard = ({ data, index, fetchData, userRole, isExpanded, onRowClick }) => {
    const [editBanner, setEditBanner] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    // const [expanded, setExpanded] = useState(false);

    const formatPosition = (position) => {
        return position?.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <>
            <tr
                className={`cursor-pointer hover:bg-gray-100 ${isExpanded ? 'bg-blue-100' : ''}`}
                 onClick={onRowClick}
            >
                <td className="py-2 px-3 border-b border-gray-300">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                    </div>
                    </td>
                <td className="py-2 px-3 border-b border-gray-300">{formatPosition(data.position)}</td>
                <td className="py-2 px-3 border-b border-gray-300">
                    {data?.images && data.images.length > 0 ? (
                        <img
                            src={data.images[0]}
                            alt={`Banner ${index + 1}`}
                            className="w-20 h-12 object-cover rounded"
                        />
                    ) : (
                        <span className="text-gray-400">No Image</span>
                    )}
                </td>
                <td className="py-2 px-3 border-b border-gray-300">
                    <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full w-fit ${
                            data.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {data.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
            </tr>
            {isExpanded && (
                <tr className="bg-gray-50">
                    <td colSpan="4" className="py-2 px-4 border-b border-gray-300">
                        <div className="flex space-x-4">
                            <button
                                className="inline-flex items-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditBanner(true);
                                }}
                            >
                                <MdModeEditOutline className="mr-1" />
                                Edit
                            </button>
                            {userRole === 'admin' && (
                                <button
                                    className="inline-flex items-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    <MdDelete className="mr-1" />
                                    Delete
                                </button>
                            )}
                        </div>
                    </td>
                </tr>
            )}
            {editBanner && (
                <AdminEditBanner
                    bannerData={data}
                    onClose={() => setEditBanner(false)}
                    fetchData={fetchData}
                />
            )}
            {showDeleteModal && (
                <AdminDeleteBanner
                    bannerId={data?._id}
                    onClose={() => setShowDeleteModal(false)}
                    fetchData={fetchData}
                />
            )}
        </>
    );
};

export default AdminBannerCard;
