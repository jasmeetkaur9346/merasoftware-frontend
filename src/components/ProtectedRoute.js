import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useSelector(state => state?.user?.user);
  const initialized = useSelector(state => state?.user?.initialized);

  console.log("🛡️ [ProtectedRoute] Render - user:", user?.name || "NULL", "initialized:", initialized, "allowedRoles:", allowedRoles);

  if (!initialized) {
    console.log("🛡️ [ProtectedRoute] NOT initialized, returning null (loading)");
    return null;
  }

  if (!user?._id) {
    console.log("❌ [ProtectedRoute] No user found, redirecting to /home");
    return <Navigate to="/home" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("❌ [ProtectedRoute] User role", user.role, "not in allowed roles", allowedRoles, "redirecting to /unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ [ProtectedRoute] User authorized, rendering children");
  return children;
};

export default ProtectedRoute;
