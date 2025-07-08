// components/RoleBasedHome.js
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const RoleBasedHome = () => {
  const user = useSelector(state => state?.user?.user);
  
  // Agar user logged in nahi hai to login page par bhej do
  if (!user?._id) {
    return <Navigate to="/home" replace />;
  }
  
  // Role ke according redirect karo
  switch(user.role) {
    case 'admin':
      return <Navigate to="/admin-panel/all-products" replace />;
      case 'manager':
      return <Navigate to="/manager-panel/all-products" replace />;
    case 'developer':
      return <Navigate to="/developer-panel/developer-update-requests" replace />;
    case 'partner':
      return <Navigate to="/dashboard" replace />;
    case 'customer':
    case 'USER':
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

export default RoleBasedHome;