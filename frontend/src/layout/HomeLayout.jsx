import React from 'react'
import { Outlet } from 'react-router-dom'
import InfoNavbar from '../../components/Navbar/InfoNav/InfoNavbar'

export const HomeLayout = () => {
    return (
        <div>
            <InfoNavbar />
            <Outlet />
        </div>
    )
}
