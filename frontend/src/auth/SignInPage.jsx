import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API_URL from "../../configuration/Api"
import Cookies from 'js-cookie'

export const SignInPage = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const [error, setError] = useState({
        errorEmail: "",
        errorPassword: "",
        errorServer: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setData({
            ...data,
            [name]: value
        })
        setError({
            ...error,
            [name === "email" ? "errorEmail" : "errorPassword"]: ""
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = data;

        let errors = {
            errorEmail: "",
            errorPassword: "",
            errorServer: ""
        };

        if (email === "") {
            errors.errorEmail = "Email is required";
        }

        if (password === "") {
            errors.errorPassword = "Password is required";
        }

        if (errors.errorEmail || errors.errorPassword) {
            setError(errors);
            return;
        }

        setError(errors);
        try {
            const res = await axios.post(API_URL + '/auth/login', data);
            const res_data = await res.data;
            alert(res_data.message);
            Cookies.set('token', res_data.token);
            const token = res_data.token
            const userProfile = await axios.get(API_URL + "/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("User Profile", userProfile.data.user)
            const redirect_to = redirect(userProfile?.data?.user?.role)
            navigate(redirect_to);

            setData({
                email: '',
                password: ''
            })
        } catch (error) {
            console.log(error)
            alert(error.response.data.message);
        }
    };

    function redirect(user_role) {
        if (user_role === "patient") {
            return "/patient/dashboard";
        } else if (user_role === "admin") {
            return "/admin/dashboard";
        }
        else if (user_role === "pharmacist") {
            return "/pharmacist/dashboard";
        }
    }

    return (
        <div className="container w-auto bg-slate-100 rounded-xl p-6 flex flex-col items-center">
            <div className="mt-6 w-full max-w-md p-6 shadow-lg border rounded-lg">
                <h1 className="text-3xl font-bold">Sign In</h1>
                <p className="text-gray-600 mt-2">Access your account to manage your pharmacy system.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        name='email'
                        className="border p-2 w-full mt-2 rounded-md"
                        onChange={handleChange}
                        value={data.email}
                    />
                    <span className="text-red-500 text-xs font-bold">{error.errorEmail}</span>
                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-2 w-full mt-2 rounded-md"
                        name='password'
                        onChange={handleChange}
                        value={data.password}

                    />
                    <span className="text-red-500 text-xs font-bold">{error.errorPassword}</span>
                    <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded w-full hover:bg-blue-700">
                        Sign In
                    </button>
                </form>
                <div className='w-full flex-col items-center flex justify-center py-4'>
                    <p>Do not have account? <Link to={"/"}> <span className='text-blue-500'>Sign Up</span></Link></p>
                    <Link to="/"><span className='font-bold'>Go back</span></Link>
                </div>
            </div>
        </div>
    )
}
