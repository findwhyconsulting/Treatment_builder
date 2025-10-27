import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function ProtectedOutlet() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  if (isLoggedIn) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
}

export function PublicOutlet() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    // Check if the current path matches the dynamic clinic route pattern /:username/:part
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const isDynamicClinicRoute = pathSegments.length === 2 && (pathSegments[1] === 'face' || pathSegments[1] === 'body');
    
    if (isLoggedIn && !isDynamicClinicRoute) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate, location.pathname]);

  // Allow access to dynamic clinic routes even when logged in
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const isDynamicClinicRoute = pathSegments.length === 2 && (pathSegments[1] === 'face' || pathSegments[1] === 'body');
  
  return !isLoggedIn || isDynamicClinicRoute ? <Outlet /> : null;
}
