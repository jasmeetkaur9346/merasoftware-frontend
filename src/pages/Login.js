import React, { useContext, useState } from 'react'
import loginIcons from "../assest/signin.gif";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import SummaryApi from "../common";
import Context from "../context";
import CookieManager from '../utils/cookieManager';
import OtpVerification from './OtpVerification';
import { useDispatch } from 'react-redux';

const Login = () => {
   const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({
       email: "",
       password: "",
       role: "customer"
     })
    //  const [requireOtp, setRequireOtp] = useState(false);
    //  const [userData, setUserData] = useState(null);
     const [loading, setLoading] = useState(false);
     const [isStaffLogin, setIsStaffLogin] = useState(false);
     const navigate = useNavigate();
     const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);
     const dispatch = useDispatch();

     const handleOnChange = (e) => {
      const {name, value} = e.target
  
      setData((preve)=>{
        return {
          ...preve,
          [name] : value
        }
      })
    }
    const handleSubmit = async (e) =>{
      e.preventDefault ()

      console.log("🚀 Payload being sent to backend:", data);

      try {
        const dataResponse = await fetch(SummaryApi.signIn.url, {
          method: SummaryApi.signIn.method,
          credentials: "include",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(data)
        });
  
        const dataApi = await dataResponse.json();
        
               if (dataApi.success) {
            // OTP bypass: Direct login flow
            CookieManager.setUserDetails({
              _id: dataApi.data.user._id,
              name: dataApi.data.user.name,
              email: dataApi.data.user.email,
              role: dataApi.data.user.role,
              isDetailsCompleted: dataApi.data.isDetailsCompleted || false
            });
  
            await fetchUserDetails();
            await fetchUserAddToCart();
  
            toast.success(dataApi.message);

            const isDetailsCompleted = dataApi.data.isDetailsCompleted || false;
            const role = dataApi.data.user.role;
            if (!isDetailsCompleted && role !== "customer") {
              navigate("/complete-profile");
            } else {
              if (role === "admin") {
                navigate("/admin-panel/all-products");
              } else if (role === "manager") {
                navigate("/manager-panel/dashboard");
              } else if (role === "partner") {
                navigate("/partner-panel/dashboard");
              } else {
                navigate("/");
              }
            }
        } else if (dataApi.error) {
          toast.error(dataApi.message);
        }
    
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // const handleBackToLogin = () => {
    //   setRequireOtp(false);
    //   setUserData(null);
    // };

    const switchToStaffLogin = () => {
      setIsStaffLogin(true);
      setData({
        email: "",
        password: "",
        role: "admin"
      });
    };

    const switchToCustomerLogin = () => {
      setIsStaffLogin(false);
      setData({
        email: "",
        password: "",
        role: "customer"
      });
    };
  
    // Render OTP verification component if required
    // if (requireOtp && userData) {
    //   return (
    //     <OtpVerification 
    //       userData={userData} 
    //       onBackToLogin={handleBackToLogin}
    //       contextData={{ fetchUserDetails, fetchUserAddToCart }} 
    //       dispatch={dispatch}
    //     />
    //   );
    // }

  return (
    <section id="login">
      <div className="max-auto container p-4">

      <div className="bg-white p-5 w-full max-w-sm mx-auto">
        <div className="w-20 h-20 mx-auto">
            <img src={loginIcons} alt="login icon" />
              </div>

              <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
              <div className="grid">
              <label>Email: </label>
              <div className="bg-slate-200 p-2">
                <input
                  type="email"
                  placeholder="enter email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
              </div>

              <div>
              <label>Password: </label>
              <div className="bg-slate-200 p-2 flex">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="enter password"
                  value= {data.password}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
                 <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((preve) => !preve)}
                >
                  <span>{showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )
                  }
                  </span>
                </div>
              </div>
              {/*<Link
                to={"/forgot-password"}
                className="block w-fit ml-auto hover:underline hover:text-red-600"
              >
                Forgot password ?
              </Link>
              */}
          </div>

          {!isStaffLogin && (
            <>
              {/* <div>
                <label>Role: </label>
                <div className="bg-slate-200 p-2">
                  <input
                    type="text"
                    name="role"
                    value="customer"
                    readOnly
                    className="w-full h-full outline-none bg-transparent cursor-not-allowed"
                  />
                </div>
              </div> */}

              <button 
                type="submit" 
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 disabled:opacity-50"
              >
                {loading ? "Please wait..." : "Login"}
              </button>

              <p className="text-center mt-4">
                Are you a staff member?{" "}
                <button
                  type="button"
                  onClick={switchToStaffLogin}
                  className="text-blue-600 hover:underline"
                >
                  Staff login
                </button>
              </p>
            </>
          )}

          {isStaffLogin && (
            <>
              <div>
                <label>Role: </label>
                <div className="bg-slate-200 p-2">
                  <select
                    name="role"
                    value={data.role}
                    onChange={handleOnChange}
                    className="w-full h-full outline-none bg-transparent"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="developer">Developer</option>
                    <option value="partner">Partner</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full hover:scale-110 transition-all disabled:opacity-50"
                >
                  {loading ? "Please wait..." : "Login"}
                </button>
                <button
                  type="button"
                  onClick={switchToCustomerLogin}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-full hover:scale-110 transition-all"
                >
                  Back to customer login
                </button>
              </div>
            </>
          )}
          
              </form>

        </div>
      </div>
    </section>
  )
}

export default Login;