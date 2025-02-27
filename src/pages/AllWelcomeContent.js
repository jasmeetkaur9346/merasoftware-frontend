import React, { useEffect, useState } from 'react'
import GuestSlidesForm from '../components/GuestSlidesForm'
import UserWelcomeForm from '../components/UserWelcomeForm'
import SummaryApi from '../common'
import AdminWelcomeCard from '../components/AdminWelcomeCard'

const AllWelcomeContent = () => {
  const [openGuestSlidesForm, setOpenGuestSlidesForm] = useState(false)
  const [openUserWelcomeForm, setOpenUserWelcomeForm] = useState(false)
  const [guestSlides, setGuestSlides] = useState([])
  const [userWelcome, setUserWelcome] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchGuestSlides = async() => {
    try {
      const response = await fetch(SummaryApi.guestSlides.url)
      const dataResponse = await response.json()
      console.log('Guest Slides Response:', dataResponse) // Add this
     
      if (dataResponse?.success) {
        setGuestSlides(dataResponse.data || [])
      } else {
        console.error('Error fetching guest slides:', dataResponse)
        setGuestSlides([])
      }
    } catch (error) {
      console.error('Error fetching guest slides:', error)
      setGuestSlides([])
    }
  }

  const fetchUserWelcome = async() => {
    try {
      const response = await fetch(SummaryApi.userWelcome.url)
      const dataResponse = await response.json()
     
      if (dataResponse?.success) {
        setUserWelcome(dataResponse.data)
      } else {
        console.error('Error fetching user welcome:', dataResponse)
        setUserWelcome(null)
      }
    } catch (error) {
      console.error('Error fetching user welcome:', error)
      setUserWelcome(null)
    }
  }

  const fetchAllContent = async () => {
    setIsLoading(true)
    await Promise.all([fetchGuestSlides(), fetchUserWelcome()])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchAllContent()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white px-2 py-2">
        <h2 className='font-bold text-lg'>Welcome Content Management</h2>
        <div className="mt-4">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className='bg-white px-2 py-2 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>Welcome Content Management</h2>
        <div className='flex gap-3'>
          <button
            className='border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full'
            onClick={() => setOpenGuestSlidesForm(true)}
          >
            Add Guest Slide
          </button>
          <button
            className='border-2 border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white transition-all py-1 px-3 rounded-full'
            onClick={() => setOpenUserWelcomeForm(true)}
          >
            Add User Welcome
          </button>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
        {/* Guest Slides Section */}
        <div>
          <h3 className='font-semibold text-lg mb-3'>Guest Slides</h3>
          {guestSlides.length > 0 ? (
            <div className='space-y-4'>
              {guestSlides.map((slide) => (
                <AdminWelcomeCard
                  key={slide._id}
                  data={slide}
                  type="guestSlide"
                  fetchData={fetchGuestSlides}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 bg-white rounded">
              No guest slides found
            </div>
          )}
        </div>

        {/* User Welcome Section */}
        <div>
          <h3 className='font-semibold text-lg mb-3'>User Welcome</h3>
          {userWelcome ? (
            <AdminWelcomeCard
              data={userWelcome}
              type="userWelcome"
              fetchData={fetchUserWelcome}
            />
          ) : (
            <div className="text-center py-4 text-gray-500 bg-white rounded">
              No user welcome message found
            </div>
          )}
        </div>
      </div>

      {/* Upload Forms */}
      {openGuestSlidesForm && (
        <GuestSlidesForm
          onClose={() => setOpenGuestSlidesForm(false)}
          fetchData={fetchGuestSlides}
        />
      )}
      {openUserWelcomeForm && (
        <UserWelcomeForm
          onClose={() => setOpenUserWelcomeForm(false)}
          fetchData={fetchUserWelcome}
        />
      )}
    </div>
  )
}

export default AllWelcomeContent