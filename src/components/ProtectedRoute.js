import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useSelector(state => state?.user?.user);
  const initialized = useSelector(state => state?.user?.initialized);

  // console.log("ProtectedRoute render - user.role:", user?.role, "allowedRoles:", allowedRoles);

  if (!initialized) {
    // Optionally, show a loading spinner or null while initializing
    return null;
  }

  if (!user?._id) {
    return <Navigate to="/home" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
