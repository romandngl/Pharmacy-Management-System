import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import API_URL from '../configuration/Api';
import Cookies from 'js-cookie';

export const fetchUser = async (token) => {
    try {
        const res = await axios.get(API_URL + "/auth/profile", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data; // Return the user data
    } catch (error) {
        console.error("Error fetching user", error);
        Cookies.remove('token');
        return null;  // Reset user on failure
    }
};

export const ProtectedRoute = ({ children, isPublic = false, isProtected = false }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = Cookies.get('token');

    useEffect(() => {
        const checkUser = async () => {
            if (token) {
                const userData = await fetchUser(token);
                setUser(userData);
            }
            setLoading(false);
        };

        checkUser();
    }, [token]);

    // Handle redirection for public routes (user with token should be redirected to the appropriate dashboard)
    if (isPublic && token && user) {
        const roleRedirects = {
            patient: "/patient/dashboard",
            admin: "/admin/dashboard",
            pharmacist: "/pharmacist/dashboard",
        };

        const userRole = user?.user?.role;
        if (userRole) {
            return <Navigate to={roleRedirects[userRole] || "/"} />;
        }
    }

    // Handle redirection for protected routes (redirect to home if no token)
    if (isProtected && !token) {
        return <Navigate to="/" />;
    }

    // If no user or loading, show a loading state or allow to render children
    if (loading) {
        return <div>Loading...</div>;
    }

    return children;
};
