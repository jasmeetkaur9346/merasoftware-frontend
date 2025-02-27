import React, { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import AdminDeleteProduct from './AdminDeleteProduct';
import { MdDelete } from "react-icons/md";

const AdminProductCard = ({
    data,
    fetchdata
}) => {
    const [editProduct,setEditProduct] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

  return (
    <div className='bg-white p-4 rounded'>
    <div className='w-40'>
      <div className='w-32 h-32 flex justify-center items-center'>
      <img src={data?.serviceImage[0]} className='mx-auto object-fill h-full' />
      </div>
    <h1 className='text-ellipis line-clamp-2'>{data?.serviceName}</h1>

    <div>

    <p className='font-semibold'>
      {
        displayINRCurrency(data?.sellingPrice)
      }
    </p>


    <div className='w-fit ml-auto p-2 mb-2 bg-green-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer' onClick={()=>setShowDeleteModal(true)}>
        <MdDelete />
    </div>

    <div className='w-fit ml-auto p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer' onClick={()=>setEditProduct(true)}>
        <MdModeEditOutline />
    </div>

    </div>

      </div>

    {
      editProduct && (
        <AdminEditProduct productData={data} onClose={()=>setEditProduct(false)} fetchdata={fetchdata}/>
      )
    }
    {
      showDeleteModal && (
        <AdminDeleteProduct productId={data._id} onClose={() => setShowDeleteModal(false)} fetchdata={fetchdata}/>
       )
     }
    
  </div>
  )
}

export default AdminProductCard
