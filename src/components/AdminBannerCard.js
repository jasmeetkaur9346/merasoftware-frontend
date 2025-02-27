import React, { useState } from 'react';
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { BsListOl } from "react-icons/bs";
import AdminEditBanner from './AdminEditBanner';
import AdminDeleteBanner from './AdminDeleteBanner';

const AdminBannerCard = ({ data, fetchData }) => {
    const [editBanner, setEditBanner] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const formatPosition = (position) => {
        return position?.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const getOrderDisplay = (order) => {
        if (order === 0) return "Top Banner";
        return `After ${order} ${order === 1 ? 'Card' : 'Cards'}`;
    };

    return (
        <div className='bg-white p-4 rounded shadow-sm hover:shadow-md transition-shadow'>
            {/* Image Container with fixed height */}
            <div className='h-48 mb-4 rounded-lg overflow-hidden bg-slate-100'>
                <img
                    src={data?.images[0]}
                    className='w-full h-full object-cover'
                    alt={`Banner for ${data?.serviceName}`}
                />
            </div>

            {/* Info Section - Compact Layout */}
            <div className='space-y-2'>
                <h3 className='font-semibold text-gray-800 truncate'>
                    {data?.serviceName || 'Unnamed Service'}
                </h3>
                
                <div className='flex flex-col gap-1.5'>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <IoLocationOutline className="text-blue-500 flex-shrink-0" />
                        <span className='truncate'>{formatPosition(data?.position)}</span>
                    </div>
                    
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <BsListOl className="text-green-500 flex-shrink-0" />
                        <span>{getOrderDisplay(data?.displayOrder)}</span>
                    </div>

                    <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full w-fit ${
                            data?.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {data?.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className='flex justify-end gap-2 pt-2'>
                    <button
                        onClick={() => setEditBanner(true)}
                        className='flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition-colors'
                    >
                        <MdModeEditOutline />
                        <span className='text-sm'>Edit</span>
                    </button>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className='flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors'
                    >
                        <MdDelete />
                        <span className='text-sm'>Delete</span>
                    </button>
                </div>
            </div>

            {/* Modals */}
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
        </div>
    );
};

export default AdminBannerCard;