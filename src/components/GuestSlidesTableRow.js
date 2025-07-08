import React, { useState } from 'react';
import GuestSlidesForm from './GuestSlidesForm';
import AdminDeleteWelcomeContent from './AdminDeleteWelcomeContent';

const truncateText = (text, maxWords = 4) => {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
};

const GuestSlidesTableRow = ({ data, index, fetchData, userRole }) => {
  const [expanded, setExpanded] = useState(false);
  const [editContent, setEditContent] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <tr
        className="hover:bg-gray-100 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-6 py-4 whitespace-nowrap border-b">
             <div className='w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-red-600 text-white'>
                {index + 1}
                </div>
            </td>
        <td className="px-6 py-4 whitespace-nowrap border-b max-w-xs truncate">{truncateText(data.title)}</td>
        <td className="px-6 py-4 whitespace-nowrap border-b max-w-xs truncate">{truncateText(data.description)}</td>
        <td className="px-6 py-4 whitespace-nowrap border-b">{data.ctaButtons?.[0]?.text || ''}</td>
        <td className="px-6 py-4 whitespace-nowrap border-b">
          <span className={data.isActive ? 'text-green-600' : 'text-red-600'}>
            {data.isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-gray-50">
          <td colSpan="5" className="py-2 px-4 border-b border-gray-300">
            <div className="flex space-x-4">
             
                  <button
                    className="inline-flex items-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditContent(true);
                    }}
                  >
                    Edit
                  </button>
                   {userRole === 'admin' && (
                <>
                  <button
                    className="inline-flex items-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </td>
        </tr>
      )}
      {editContent && (
        <GuestSlidesForm
          data={data}
          onClose={() => setEditContent(false)}
          fetchData={fetchData}
          isEditing={true}
        />
      )}
      {showDeleteModal && (
        <AdminDeleteWelcomeContent
          contentId={data._id}
          contentType="guestSlide"
          onClose={() => setShowDeleteModal(false)}
          fetchData={fetchData}
        />
      )}
    </>
  );
};

export default GuestSlidesTableRow;
