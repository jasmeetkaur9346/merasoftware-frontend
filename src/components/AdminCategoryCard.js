import React, { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
import AdminEditCategory from './AdminEditCategory';
import AdminDeleteCategory from './AdminDeleteCategory';
import { MdDelete } from "react-icons/md";

const serviceTypeOrder = [
  'Websites Development',
  'Mobile Apps',
  'Cloud Softwares',
  'Feature Upgrades'
]

const serviceTypeColors = {
  'Websites Development': 'bg-yellow-50 text-yellow-800',
  'Mobile Apps': 'bg-blue-50 text-blue-800',
  'Cloud Softwares': 'bg-pink-50 text-pink-800',
  'Feature Upgrades': 'bg-green-50 text-green-800',
  'default': 'bg-gray-100 text-gray-800'
}

const AdminCategoryCard = ({
  data,
  index,
  fetchData,
  userRole
}) => {
  const [editCategory, setEditCategory] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const getServiceTypeColor = (serviceType) => {
    return serviceTypeColors[serviceType] || serviceTypeColors['default']
  }

  // Function to get the service type icon (optional, can be added if needed)
  // const getServiceIcon = (serviceType) => {
  //   switch (serviceType) {
  //     case 'Websites Development':
  //       return <Monitor className="h-4 w-4" />;
  //     case 'Mobile Apps':
  //       return <Smartphone className="h-4 w-4" />;
  //     case 'Cloud Softwares':
  //       return <Cloud className="h-4 w-4" />;
  //     case 'Feature Upgrades':
  //       return <Plus className="h-4 w-4" />;
  //     default:
  //       return <Monitor className="h-4 w-4" />;
  //   }
  // };

  return (
    <>
      <tr
        className="hover:bg-gray-100 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-6 py-4 whitespace-nowrap border-b">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold  ${getServiceTypeColor(data?.serviceType)}`}>
            {index + 1}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap border-b text-sm text-gray-900">{data?.categoryName}</td>
        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 w-36 max-w-34">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getServiceTypeColor(data?.serviceType)}`}>
          {data?.serviceType || 'Uncategorized'}
          </span>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-gray-50">
          <td colSpan="3" className="py-2 px-4 border-b border-gray-300">
            <div className="flex space-x-4">
              <button
                className="inline-flex items-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                onClick={(e) => {
                  e.stopPropagation()
                  setEditCategory(true)
                }}
              >
                Edit Service
              </button>
              {userRole === 'admin' && (
                <button
                  className="inline-flex items-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDeleteModal(true)
                  }}
                >
                  Delete Service
                </button>
              )}
            </div>
          </td>
        </tr>
      )}
      {editCategory && (
        <AdminEditCategory
          categoryData={data}
          onClose={() => setEditCategory(false)}
          fetchData={fetchData}
        />
      )}
      {showDeleteModal && (
        <AdminDeleteCategory
          categoryId={data?._id}
          onClose={() => setShowDeleteModal(false)}
          fetchData={fetchData}
        />
      )}
    </>
  )
}

export default AdminCategoryCard;
