import React from 'react'
import { Outlet } from 'react-router-dom'

export const PatientLayout = () => {
    return (
        <div className='w-full min-h-screen flex justify-center items-center bg-slate-300'>
            <h1>Patient Dashboard</h1>
            <Outlet /></div>
    )
}
