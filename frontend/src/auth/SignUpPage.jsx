import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from "../../configuration/Api";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Toast from '../../components/toast/Toast';

export const SignUpPage = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient'
  });

  const [error, setError] = useState({
    errorName: "",
    errorEmail: "",
    errorPassword: "",
    errorServer: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });

    setError({
      ...error,
      [name === "name" ? "errorName" :
        name === "email" ? "errorEmail" :
          "errorPassword"]: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = data;

    let errors = {
      errorName: "",
      errorEmail: "",
      errorPassword: "",
      errorServer: ""
    };

    if (name.trim() === "") {
      errors.errorName = "Name is required";
    }

    if (email.trim() === "") {
      errors.errorEmail = "Email is required";
    }

    if (password.trim() === "") {
      errors.errorPassword = "Password is required";
    }

    if (errors.errorName || errors.errorEmail || errors.errorPassword) {
      setError(errors);
      return;
    }

    setError(errors);

    try {
      const res = await axios.post(`${API_URL}/auth/register`, data);
      const res_data = await res.data;
      toast.success(res_data.message)
      setData({
        name: "",
        email: "",
        password: ""
      })
      setError({
        errorName: "",
        errorEmail: "",
        errorPassword: "",
        errorServer: ""
      })
   
    } catch (error) {
      console.log(error?.response?.data.message);
      setError({
        ...error,
        errorServer: error?.response?.data.message
      });
    }
  };

  return (
    <div className="container w-auto bg-slate-100 rounded-xl p-6 flex flex-col items-center">
      <Toast/>
      <div className="mt-6 w-full max-w-md p-6 shadow-lg border rounded-lg">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-gray-600 mt-2">Create an account as patient.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            name="name"
            className="border p-2 w-full mt-2 rounded-md"
            onChange={handleChange}
            value={data.name}
          />
          <span className="text-red-500 text-xs font-bold">{error.errorName}</span>

          <input
            type="email"
            placeholder="Email"
            name="email"
            className="border p-2 w-full mt-2 rounded-md"
            value={data.email}
            onChange={handleChange}
          />
          <span className="text-red-500 text-xs font-bold">{error.errorEmail}</span>

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={data.password}
            className="border p-2 w-full mt-2 rounded-md"
            onChange={handleChange}
          />
          <span className="text-red-500 text-xs font-bold">{error.errorPassword}</span>

          <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded w-full hover:bg-green-700">
            Sign Up
          </button>
          <div className="text-red-500 text-sm py-2 text-center font-bold">{error.errorServer}</div>
        </form>

        <div className='w-full flex-col items-center flex justify-center py-4'>
          <p>Already have an account? <Link to={"/auth/signin"}> <span className='text-blue-500'>Sign In</span></Link></p>
          <Link to="/"><span className='font-bold'>Go back</span></Link>
        </div>
      </div>
    </div>
  );
};
