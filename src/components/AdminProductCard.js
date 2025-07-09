import React, { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import AdminDeleteProduct from './AdminDeleteProduct';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';

const AdminProductCard = ({
  data,
  index,
  fetchdata,
  isHiddenSection = false,
  userRole,
  isExpanded, // New prop
  onRowClick // New prop
}) => {
  const [editProduct, setEditProduct] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  // const [expanded, setExpanded] = useState(null)

  const handleHide = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch(SummaryApi.hideProduct.url, {
        method: SummaryApi.hideProduct.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id: data._id })
      })
      const result = await response.json()
      if (result.success) {
        localStorage.removeItem('categories');
        localStorage.removeItem(data.category);
        fetchdata()
      } else {
        alert(result.message || 'Failed to hide product')
      }
    } catch (error) {
      alert('Error hiding product')
    }
    setIsProcessing(false)
  }

  const handleUnhide = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch(SummaryApi.UnhideProduct.url, {
        method: SummaryApi.UnhideProduct.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id: data._id })
      })
      const result = await response.json()
      if (result.success) {
        localStorage.removeItem('categories');
        localStorage.removeItem(data.category);
        fetchdata()
      } else {
        alert(result.message || 'Failed to unhide product')
      }
    } catch (error) {
      alert('Error unhiding product')
    }
    setIsProcessing(false)
  }

  return (
    <>
      <tr
        className="hover:bg-gray-100 cursor-pointer"
        onClick={onRowClick}
      >
        <td className="px-6 py-4 whitespace-nowrap border-b">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
  isHiddenSection ? 'bg-red-400 text-red-800' :
  (data?.serviceCategoryName || data?.serviceType)?.includes('Websites') || 
  (data?.serviceCategoryName || data?.serviceType) === 'Websites Development' ? 'bg-yellow-400 text-yellow-800' :
  (data?.serviceCategoryName || data?.serviceType)?.includes('Mobile') || 
  (data?.serviceCategoryName || data?.serviceType) === 'Mobile Apps' ? 'bg-blue-400 text-blue-800' :
  (data?.serviceCategoryName || data?.serviceType)?.includes('Cloud') || 
  (data?.serviceCategoryName || data?.serviceType) === 'Cloud Softwares' ? 'bg-pink-400 text-pink-800' :
  (data?.serviceCategoryName || data?.serviceType)?.includes('Website') ||
  (data?.serviceCategoryName || data?.serviceType) === 'Feature Upgrades' ? 'bg-green-400 text-green-800' :
  'bg-gray-100 text-gray-800'
}`}>
  {index + 1}
</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap border-b text-sm text-gray-900">{data?.serviceName}</td>
        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300 w-56 max-w-56">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
  isHiddenSection ? 'bg-red-50 text-red-800' :
  (data?.serviceCategoryName || data?.serviceType)?.includes('Websites') || 
  (data?.serviceCategoryName || data?.serviceType) === 'Websites Development' ? 'bg-yellow-50 text-yellow-800' :
  (data?.serviceCategoryName || data?.serviceType)?.includes('Mobile') || 
  (data?.serviceCategoryName || data?.serviceType) === 'Mobile Apps' ? 'bg-blue-50 text-blue-800' :
  (data?.serviceCategoryName || data?.serviceType)?.includes('Cloud') || 
  (data?.serviceCategoryName || data?.serviceType) === 'Cloud Softwares' ? 'bg-pink-50 text-pink-800' :
  (data?.serviceCategoryName || data?.serviceType)?.includes('Website') ||
  (data?.serviceCategoryName || data?.serviceType) === 'Feature Upgrades' ? 'bg-green-50 text-green-800' :
  'bg-gray-100 text-gray-800'
} `}>
  {isHiddenSection ? '-' : (data?.serviceCategoryName || data?.serviceType)}
</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm border-b border-gray-300">{displayINRCurrency(data?.sellingPrice)}</td>
      </tr>
      {isExpanded && (
        <tr className="bg-gray-50">
          <td colSpan="4" className="py-2 px-4 border-b border-gray-300">
            <div className="flex space-x-4">
              {!isHiddenSection && (
                <>
                  <button
                    className="inline-flex items-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditProduct(true)
                    }}
                  >
                    Edit Product
                  </button>
                  {userRole === 'admin' && (
                    <button
                      className="inline-flex items-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowDeleteModal(true)
                      }}
                    >
                      Delete Product
                    </button>
                  )}
                  <button
                    className="inline-flex items-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium bg-yellow-400 text-black rounded hover:bg-yellow-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleHide()
                    }}
                    disabled={isProcessing}
                  >
                    Hide Product
                  </button>
                </>
              )}
              {isHiddenSection && (
                <button
                  className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnhide()
                  }}
                  disabled={isProcessing}
                >
                  Unhide Product
                </button>
              )}
            </div>
          </td>
        </tr>
      )}
      {editProduct && (
        <AdminEditProduct productData={data} onClose={() => setEditProduct(false)} fetchdata={fetchdata} />
      )}
      {showDeleteModal && (
        <AdminDeleteProduct productId={data._id} onClose={() => setShowDeleteModal(false)} fetchdata={fetchdata} />
      )}
    </>
  )
}

export default AdminProductCard;
