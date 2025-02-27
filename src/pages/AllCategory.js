import React, { useEffect, useState } from 'react'
import UploadCategory from '../components/UploadCategory'
import SummaryApi from '../common'
import AdminCategoryCard from '../components/AdminCategoryCard'

const AllCategory = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false)
  const [allCategory,setAllCategory] = useState([])

  const fetchAllCategory = async() => {
    const response = await fetch(SummaryApi.allCategory.url)
    const dataResponse = await response.json()

    setAllCategory(dataResponse?.data || [])

  }

  useEffect(()=>{
    fetchAllCategory()
  },[])

  return (
    <div>
    <div className='bg-white px-2 py-2 flex justify-between items-center'>
      <h2 className='font-bold text-lg'>All Categories</h2>
      <button className='border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full' onClick={()=>setOpenUploadProduct(true)}>Upload New Category</button>
    </div>

    {/* all product */}

    <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
      {
        allCategory.map((product,index)=>{
          return(
           <AdminCategoryCard data={product} key={index+"allCategory"} fetchData={fetchAllCategory} />
          )
        })
      }
    </div>

  {/* upload product component */}
  {
    openUploadProduct && (
      <UploadCategory onClose={()=>setOpenUploadProduct(false)} fetchData={fetchAllCategory} />
    )
  } 
  </div>
  )
}

export default AllCategory
