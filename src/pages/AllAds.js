import React, { useEffect, useState } from 'react'
import UploadBanner from '../components/UploadBanner'
import SummaryApi from '../common'
import AdminBannerCard from '../components/AdminBannerCard'

const AllAds = () => {
  const [openUploadBanner, setOpenUploadBanner] = useState(false)
  const [allBanners, setAllBanners] = useState([])

  const fetchAllBanners = async() => {
    const response = await fetch(SummaryApi.allBanner.url)
    const dataResponse = await response.json()
    setAllBanners(dataResponse?.data || [])
  }

  useEffect(() => {
    fetchAllBanners()
  }, [])

  return (
    <div>
      <div className='bg-white px-2 py-2 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>All Banner Ads</h2>
        <button 
          className='border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full' 
          onClick={() => setOpenUploadBanner(true)}
        >
          Upload New Banner
        </button>
      </div>

      {/* all banners */}
      <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
        {
          allBanners.map((banner, index) => {
            return(
              <AdminBannerCard 
                data={banner} 
                key={index + "allBanners"} 
                fetchData={fetchAllBanners} 
              />
            )
          })
        }
      </div>

      {/* upload banner component */}
      {
        openUploadBanner && (
          <UploadBanner 
            onClose={() => setOpenUploadBanner(false)} 
            fetchData={fetchAllBanners} 
          />
        )
      }
    </div>
  )
}

export default AllAds