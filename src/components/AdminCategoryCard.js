import React, { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
import AdminEditCategory from './AdminEditCategory';
import AdminDeleteCategory from './AdminDeleteCategory';
import { MdDelete } from "react-icons/md";
import { Monitor, Smartphone, Cloud, Plus } from 'lucide-react';

const AdminCategoryCard = ({
    data,
    fetchData
}) => {
    const [editCategory, setEditCategory] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // Function to get the appropriate service type icon
    const getServiceIcon = (serviceType) => {
        switch (serviceType) {
            case 'Websites Development':
                return <Monitor className="h-4 w-4" />;
            case 'Mobile Apps':
                return <Smartphone className="h-4 w-4" />;
            case 'Cloud Softwares':
                return <Cloud className="h-4 w-4" />;
            case 'Feature Upgrades':
                return <Plus className="h-4 w-4" />;
            default:
                return <Monitor className="h-4 w-4" />;
        }
    };

    // Function to get the service type badge color
    const getServiceTypeBgColor = (serviceType) => {
        switch (serviceType) {
            case 'Websites Development':
                return 'bg-indigo-100 text-indigo-800';
            case 'Mobile Apps':
                return 'bg-green-100 text-green-800';
            case 'Cloud Softwares':
                return 'bg-blue-100 text-blue-800';
            case 'Feature Upgrades':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className='bg-white p-4 rounded shadow-sm hover:shadow-md transition-shadow'>
            <div className='w-40'>
                {/* Service Type Badge */}
                <div className={`flex items-center space-x-1 text-xs mb-2 px-2 py-1 rounded-full w-fit ${getServiceTypeBgColor(data?.serviceType)}`}>
                    {getServiceIcon(data?.serviceType)}
                    <span className="truncate max-w-[100px]">{data?.serviceType || 'Uncategorized'}</span>
                </div>

                <div className='w-32 h-32 flex justify-center items-center'>
                    <img 
                        src={data?.imageUrl[0]} 
                        className='mx-auto object-fill h-full' 
                        alt={data?.categoryName}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'placeholder-image-url';
                        }}
                    />
                </div>
                <h1 className='text-ellipsis line-clamp-2 font-medium mt-2'>{data?.categoryName}</h1>
                <div className='mt-2'>
                    <div className='flex justify-end space-x-2'>
                        <div 
                            className='p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer transition-colors' 
                            onClick={() => setShowDeleteModal(true)}
                        >
                            <MdDelete />
                        </div>
                        <div 
                            className='p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer transition-colors' 
                            onClick={() => setEditCategory(true)}
                        >
                            <MdModeEditOutline />
                        </div>
                    </div>
                </div>
            </div>
            {
                editCategory && (
                    <AdminEditCategory 
                        categoryData={data} 
                        onClose={() => setEditCategory(false)} 
                        fetchData={fetchData}
                    />
                )
            }
            {
                showDeleteModal && (
                    <AdminDeleteCategory 
                        categoryId={data?._id} 
                        onClose={() => setShowDeleteModal(false)} 
                        fetchData={fetchData}
                    />
                )
            }
        </div>
    )
}

export default AdminCategoryCard