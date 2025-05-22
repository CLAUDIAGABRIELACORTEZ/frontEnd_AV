// // routes/RoleProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

interface RoleProtectedRouteProps {
  role: "director" | "docente";
}

const RoleProtectedRoute = ({ role }: RoleProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const rolUsuario = localStorage.getItem("rol");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (rolUsuario !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
