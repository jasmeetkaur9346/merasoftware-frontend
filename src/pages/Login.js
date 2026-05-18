import React, { useContext, useState } from "react";
import loginIcons from "../assest/signin.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import Context from "../context";
import CookieManager from "../utils/cookieManager";

const STAFF_ROLES = ["admin", "manager", "developer", "partner"];

const Login = ({ loginType = "customer" }) => {
  const isStaffLogin = loginType === "staff";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    role: "admin",
  });

  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = SummaryApi.signIn;
    const payload = isStaffLogin
      ? { email: data.email, password: data.password, role: data.role }
      : { email: data.email, password: data.password, role: "customer" };

    try {
      const dataResponse = await fetch(endpoint.url, {
        method: endpoint.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const dataApi = await dataResponse.json();

      if (!dataApi.success) {
        toast.error(dataApi.message || "Login failed");
        return;
      }

      const role = dataApi?.data?.user?.role;
      if (isStaffLogin && !STAFF_ROLES.includes((role || "").toLowerCase())) {
        toast.error("Invalid staff account. Please use customer login.");
        return;
      }

      if (!isStaffLogin && STAFF_ROLES.includes((role || "").toLowerCase())) {
        toast.error("Staff account detected. Please use staff login.");
        return;
      }

      CookieManager.setUserDetails({
        _id: dataApi.data.user._id,
        name: dataApi.data.user.name,
        email: dataApi.data.user.email,
        role: dataApi.data.user.role,
        isDetailsCompleted: dataApi.data.isDetailsCompleted || false,
      });

      await fetchUserDetails();
      await fetchUserAddToCart();
      toast.success(dataApi.message);

      if (role === "admin") navigate("/admin-panel/all-products");
      else if (role === "manager") navigate("/manager-panel/dashboard");
      else if (role === "partner") navigate("/partner-panel/dashboard");
      else if (role === "developer") navigate("/developer-panel");
      else navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="login">
      <div className="max-auto container p-4">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto">
            <img src={loginIcons} alt="login icon" />
          </div>

          <h2 className="text-center text-lg font-semibold mt-3">
            {isStaffLogin ? "Staff Login" : "Customer Login"}
          </h2>
          <p className="text-center text-sm text-slate-600 mt-1">
            {isStaffLogin ? (
              <>
                Customer account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Go to customer login
                </Link>
              </>
            ) : (
              <>
                Staff member?{" "}
                <Link to="/staff/login" className="text-blue-600 hover:underline">
                  Go to staff login
                </Link>
              </>
            )}
          </p>

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
                  value={data.password}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <span>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
            </div>

            {isStaffLogin && (
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
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[180px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 disabled:opacity-50"
            >
              {loading ? "Please wait..." : isStaffLogin ? "Staff Login" : "Customer Login"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
