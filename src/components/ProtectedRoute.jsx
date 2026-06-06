import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// ARCHITECTURAL NOTES FOR ROUTE SECURITY:
// This wrapper component checks whether current customer credentials are in context.
// If the visitor is not logged in (isLoggedIn = false), we push them straight to the Login page.
// We also pack their previous attempted destination route in State to easily redirect them back after they sign in.
export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loadingUser } = useCart();
  const location = useLocation();

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col justify-center items-center py-24 select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">Hydrating secure session...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Redirect clean and save original location to perform post-login router navigation
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
