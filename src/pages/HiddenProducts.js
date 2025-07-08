import React, { useEffect, useState } from 'react'
import AdminProductCard from '../components/AdminProductCard'
import SummaryApi from '../common'

const HiddenProducts = () => {
  const [hiddenProducts, setHiddenProducts] = useState([])

  const fetchHiddenProducts = async () => {
    try {
      const response = await fetch(SummaryApi.getHiddenProducts.url, {
        credentials: 'include'
      })
      const dataResponse = await response.json()
      if (dataResponse.success) {
        setHiddenProducts(dataResponse.data || [])
      } else {
        alert(dataResponse.message || 'Failed to fetch hidden products')
      }
    } catch (error) {
      alert('Error fetching hidden products')
    }
  }

  useEffect(() => {
    fetchHiddenProducts()
  }, [])

  return (
    <div>
      <h2 className='font-bold text-lg mb-4'>Hidden Products</h2>
      <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
        {hiddenProducts.map((product, index) => (
          <AdminProductCard
            key={index + "hiddenProduct"}
            data={product}
            fetchdata={fetchHiddenProducts}
            isHiddenSection={true}
          />
        ))}
      </div>
    </div>
  )
}

export default HiddenProducts
