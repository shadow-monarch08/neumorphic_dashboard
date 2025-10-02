import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/auth.store";
import axios from "axios";
import { getUser } from "../api/user";
import LoadingScreen from "../components/LoadingOverlay/LoadingScreen";

const ProtectedRoute = () => {
  const { token, clearAuth, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }

      try {
        // Call backend to verify token and fetch user
        const res = await getUser();

        if (res.success) {
          setAuth(token, res.data); // update store with user
          setIsAuthenticated(true);
        } else {
          clearAuth();
          setIsAuthenticated(false);
        }
      } catch (err: any) {
        clearAuth();
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token, setAuth, clearAuth]);

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ If authenticated, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
