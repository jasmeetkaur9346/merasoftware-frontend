import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from "react-toastify";
import moment from 'moment'
import { MdModeEdit } from "react-icons/md";
import ChangeUserRole from '../components/ChangeUserRole';
import SignUp from './SignUp';
import AddRoleToUserModal from '../components/AddRoleToUserModal';

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([])
  const [openUpdateRole, setOpenUpdateRole] = useState(false)
  const [openAddUserModal, setOpenAddUserModal] = useState(false)
  const [openAddRoleModal, setOpenAddRoleModal] = useState(false)

  const [updateUserDetails, setUpdateUserDetails] = useState({
        email : "",
        name: "",
        role: "",
        _id : ""
    })  

  const fetchAllUsers = async()=> {
    const fetchData = await fetch(SummaryApi.allUser.url,{
      method : SummaryApi.allUser.method,
      credentials : 'include'
    })

    const dataResponse = await fetchData.json()

    if(dataResponse.success){
      setAllUsers(dataResponse.data)
    }

    if(dataResponse.error){
      toast.error(dataResponse.message)
    }
    
  }

  useEffect(()=>{
  fetchAllUsers()
},[])


  return (
    <div>
      <div className="mb-4 flex gap-4">
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setOpenAddUserModal(true)}
        >
          Add New User
        </button>
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => {
            setOpenAddRoleModal(true);
          }}
        >
          Add New Role to Existing User
        </button>
      </div>

      <table className='w-full userTable'>
      <thead>
          <tr className='bg-black text-white'>
            <th>Sr.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            allUser.map((el,index) => {
              return(
                  <tr key={el._id || index}>
                    <td>{index+1}</td>
                    <td>{el?.name}</td>
                    <td>{el?.email}</td>
                    <td>{el?.roles ? el.roles.join(", ") : ""}</td>
                    <td>{moment(el?.createdAt).format('LL')}</td>
                    <td>
                      <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white' 
                      onClick={()=>{
                        setUpdateUserDetails(el)
                        setOpenUpdateRole(true)
                        }}>
                        <MdModeEdit/>
                      </button>
                    </td>
                  </tr>
              )
            })
          }
        </tbody>
      </table>

      {
            openUpdateRole && (
              <ChangeUserRole 
              onClose={()=>setOpenUpdateRole(false)}
              name={updateUserDetails.name}
              email={updateUserDetails.email}
              role={updateUserDetails.role}
              userId={updateUserDetails._id}
              callFunc={fetchAllUsers}
              /> 
            )
          }

      {
        openAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
              <button 
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={() => setOpenAddUserModal(false)}
              >
                &times;
              </button>
              <SignUp onClose={() => setOpenAddUserModal(false)} callFunc={fetchAllUsers} />
            </div>
          </div>
        )
      }

      {
        openAddRoleModal && (
          <AddRoleToUserModal 
            onClose={() => setOpenAddRoleModal(false)} 
            callFunc={fetchAllUsers} 
          />
        )
      }
    </div>
  )
}

export default AllUsers
