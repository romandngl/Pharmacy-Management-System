import React from 'react'
import { Outlet } from 'react-router-dom'

export const AuthLayout = () => {
    return (
        <div className='w-full min-h-screen flex justify-center items-center bg-slate-300'><Outlet /></div>
    )
}
