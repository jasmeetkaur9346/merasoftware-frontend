import React, { useState } from 'react'
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import AdminDeleteWelcomeContent from './AdminDeleteWelcomeContent';
import GuestSlidesForm from './GuestSlidesForm';
import UserWelcomeForm from './UserWelcomeForm';

const AdminWelcomeCard = ({
    data,
    type,
    fetchData,
    userRole
}) => {
    const [editContent, setEditContent] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    
    const renderGuestSlideContent = () => (
        <div className='mb-4'>
            <p className='font-medium text-ellipsis line-clamp-1'>{data.title}</p>
            {data.subtitle && (
                <p className='text-sm text-gray-500'>{data.subtitle}</p>
            )}
            <p className='text-sm text-gray-600 line-clamp-2'>{data.description}</p>
            {data.ctaButtons?.[0] && (
                <div className='mt-2 text-sm text-blue-600'>
                    Button: {data.ctaButtons[0].text}
                </div>
            )}
        </div>
    )
    
    const renderUserWelcomeContent = () => (
        <div className='mb-4'>
            <p className='font-medium text-ellipsis line-clamp-1'>{data.title}</p>
            <p className='text-sm text-gray-600 line-clamp-2'>{data.description}</p>
            {data.cta?.text && (
                <div className='mt-2 text-sm text-blue-600'>
                    CTA: {data.cta.text}
                </div>
            )}
        </div>
    )
    
    // Map internal type to contentType for delete modal
    const getContentType = () => {
        return type === 'guestSlide' ? 'guestSlide' : 'userWelcome';
    };
    
    return (
        <div className='bg-white p-4 rounded'>
            <div className='w-full'>
                {/* Content based on type */}
                {type === 'guestSlide' ? renderGuestSlideContent() : renderUserWelcomeContent()}
                {/* Status */}
                <div className='text-sm mb-3'>
                    <p>Status: <span className={data.isActive ? 'text-green-600' : 'text-red-600'}>
                        {data.isActive ? 'Active' : 'Inactive'}
                    </span></p>
                    {type === 'guestSlide' && <p>Display Order: {data.displayOrder}</p>}
                </div>
                {/* Action Buttons */}
                <div className='flex justify-end gap-2'>
                    {userRole === 'admin' && (
                        <div
                            className='w-fit p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer'
                            onClick={() => setShowDeleteModal(true)}
                        >
                            <MdDelete />
                        </div>
                    )}
                    <div
                        className='w-fit p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer'
                        onClick={() => setEditContent(true)}
                    >
                        <MdModeEditOutline />
                    </div>
                </div>
            </div>
            {/* Edit Modal */}
            {editContent && (
                type === 'guestSlide' ? (
                    <GuestSlidesForm
                        data={data}
                        onClose={() => setEditContent(false)}
                        fetchData={fetchData}
                        isEditing={true}
                    />
                ) : (
                    <UserWelcomeForm
                        data={data}
                        onClose={() => setEditContent(false)}
                        fetchData={fetchData}
                        isEditing={true}
                    />
                )
            )}
            {/* Delete Modal */}
            {showDeleteModal && (
                <AdminDeleteWelcomeContent
                    contentId={data._id}
                    contentType={getContentType()}
                    onClose={() => setShowDeleteModal(false)}
                    fetchData={fetchData}
                />
            )}
        </div>
    )
}

export default AdminWelcomeCard;