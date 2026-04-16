import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function ProtectedRoute() {
  const { isAuthenticated } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  // Allow the component (Login/Signup) to handle its own "Already logged in" reflection state.
  return <Outlet />;
}
