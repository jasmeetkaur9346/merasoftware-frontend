// components/EditProfileModal.jsx
import React, { useState } from 'react';
import imageTobase64 from '../helpers/imageTobase64';
import uploadImage from '../helpers/uploadImage';
import { toast } from 'react-toastify';

const EditProfileModal = ({ user, onClose, onUpdate, loading }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        age: user?.age || '',
        profilePic: user?.profilePic || ''
    });
    const [imagePreview, setImagePreview] = useState(user?.profilePic || '');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = async(e) => {
        const file = e.target.files[0];
        
        // Preview के लिए
        const base64Image = await imageTobase64(file);
        setImagePreview(base64Image);
        
        try {
            // Cloudinary पर upload
            const imageData = await uploadImage(file);
            if (imageData.url) {
                setFormData(prev => ({
                    ...prev,
                    profilePic: imageData.url
                }));
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit Profile</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Profile Image */}
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                                {imagePreview ? (
                                    <img 
                                        src={imagePreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-3xl">{formData.name?.charAt(0)}</span>
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;