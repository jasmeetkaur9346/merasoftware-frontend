import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { useSelector } from 'react-redux';
import { IoCartOutline } from "react-icons/io5";
import { IoWalletOutline } from "react-icons/io5";
import Context from '../context';

const Footer = () => {
  const user = useSelector(state => state?.user?.user)
  const [menuDisplay, setMenuDisplay] = useState(false)
  const context = useContext(Context)

  return (
    <div className='mt-32'>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t">
        <div className="flex justify-around py-2">
          <Link to={"/"}>
            <div className="flex flex-col text-white items-center">
              <FaHome className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </div>
          </Link>
         
          {/* Cart Link */}
      <Link to={"/cart"}>
        <div className="flex flex-col text-white items-center relative">
          <IoCartOutline className="w-6 h-6" />
          {user?._id && context?.cartProductCount > 0 && ( // user?._id का check add करें
            <div className="absolute -top-2 -right-2 bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center">
              <p className="text-xs">{context?.cartProductCount}</p>
            </div>
          )}
          <span className="text-xs">Cart</span>
        </div>
      </Link>

      <Link to={user?._id ? "/wallet" : "/login"}>
            <div className="flex flex-col text-white items-center cursor-pointer">
              <IoWalletOutline className="w-6 h-6" />
              {user?._id ? (
                <div className="flex flex-col items-center">
                  <span className="text-xs text-white">
                    ₹{context?.walletBalance || 0}
                  </span>
                </div>
              ) : (
                <span className="text-xs">Wallet</span>
              )}
            </div>
          </Link>

          <Link to={user?._id ? "/profile" : "/login"}>
            {user?._id ? (
              <div className='cursor-pointer relative flex justify-center' onClick={() => setMenuDisplay(prev => !prev)}>
                {user?.profilePic ? (
                  <div className='flex flex-col text-white items-center'>
                    <img src={user?.profilePic} className='w-6 h-6 rounded-full' alt={user?.name} />
                    <span className="text-xs">You</span>
                  </div>
                ) : (
                  <div className="flex flex-col text-white items-center">
                    <FiUser className="w-6 h-6" />
                    <span className="text-xs">You</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col text-white items-center">
                <FiUser className="w-6 h-6" />
                <span className="text-xs">Login</span>
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Footer