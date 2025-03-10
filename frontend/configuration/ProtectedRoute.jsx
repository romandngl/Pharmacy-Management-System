import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, isPublic = false, isProtected = false }) => {
   

    const { user, loading } = useAuth();

    if(isPublic && loading){
        return children
    }

    if (loading) return <div>Loading...</div>;

    const userRole = user?.user?.role;
    console.log("User role ",userRole)

    // Define role-based redirects
    const roleRedirects = {
        patient: "/patient/dashboard",
        admin: "/admin/dashboard",
        pharmacist: "/pharmacist/dashboard",
    };

    // If it's a public page & user has a role -> Redirect to respective dashboard
    if (isPublic && userRole) {
        return <Navigate to={roleRedirects[userRole] || "/"} />;
    }

    // If it's a protected page & user is not authenticated -> Redirect to home
    if (isProtected && !userRole) {
        return <Navigate to="/" />;
    }

    return children;
};
