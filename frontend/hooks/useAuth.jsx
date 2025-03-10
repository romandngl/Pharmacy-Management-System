import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import API_URL from '../configuration/Api';
import Cookies from 'js-cookie';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            navigate("/");
            return
        }
        const fetchUser = async () => {
            try {
                const res = await axios.get(API_URL + "/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setUser(res.data);
            } catch (error) {
                console.log("Error fetching user", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        }
        fetchUser()
    }, [])
    return { user, loading }
}
