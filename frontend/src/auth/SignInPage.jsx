import React from 'react'
import { Link } from 'react-router-dom'

export const SignInPage = () => {
    return (
        <div className="container w-auto bg-slate-100 rounded-xl p-6 flex flex-col items-center">
            <div className="mt-6 w-full max-w-md p-6 shadow-lg border rounded-lg">
                <h1 className="text-3xl font-bold">Sign In</h1>
                <p className="text-gray-600 mt-2">Access your account to manage your pharmacy system.</p>
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 w-full mt-2 rounded-md"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 w-full mt-2 rounded-md"
                />
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded w-full hover:bg-blue-700">
                    Sign In
                </button>
                <div className='w-full flex-col items-center flex justify-center py-4'>
                    <p>Do not have account? <Link to={"/"}> <span className='text-blue-500'>Sign Up</span></Link></p>
                    <Link to="/"><span className='font-bold'>Go back</span></Link> 
                </div>
            </div>
        </div>
    )
}
