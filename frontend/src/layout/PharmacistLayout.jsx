import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Logout from '../../utils/Logout'
import { Bell, DollarSign, Gauge, ListCollapse, Pill, ShoppingBasket } from 'lucide-react';
import Cookies from 'js-cookie';
import { fetchUser } from '../../configuration/ProtectedRoute';
import API_URL from '../../configuration/Api';
import axios from 'axios';
export const PharmacistLayout = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = Cookies.get('token');
    const [notification, setNotification] = useState([]);
    const [showPopup, setShowPopup] = useState(false); // popup state

    useEffect(() => {
        const checkUser = async () => {
            if (token) {
                const userData = await fetchUser(token);
                setUser(userData);
                const getNotification = await axios.get(API_URL + `/notifications/${userData?.user?.userId}`)
                const getData = getNotification.data;
                setNotification(getData)
            }
            setLoading(false);
        };
        checkUser();
    }, [token]);



    return (
        <div className='w-full min-h-screen flex bg-slate-300'>
            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                    <div className="bg-white h-[500px] overflow-y-auto  p-6 rounded-xl shadow-xl w-11/12 max-w-2xl relative">
                        <button className="absolute top-4 right-4 text-gray-500 hover:text-black" onClick={() => setShowPopup(false)}>
                            ✖
                        </button>
                        <h2 className="text-xl font-bold mb-4">Notifications</h2>
                        {notification.length === 0 ? (
                            <p>No notifications found.</p>
                        ) : (
                            <ul className="list-disc  overflow-y-auto pl-5">
                                {notification?.notifications.length !== 0 ? notification?.notifications?.map((item) => (
                                    <li key={item.id} className="mb-2">
                                        <span className="font-semibold">{item.title}</span> {item.message}
                                    </li>
                                )) : "No notifications found."}
                            </ul>
                        )}
                    </div>
                </div>
            )}
            {/* Sidebar */}
            <aside className="w-64 h-screen fixed top-0 left-0 bg-gray-50 dark:bg-gray-800 shadow-md">
                <div className="h-full flex flex-col justify-between px-3 py-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        <li className='flex justify-center items-center w-full px-2 py-2 '>
                            <span onClick={e => setShowPopup(!showPopup)}>
                                <Bell color='white' />
                            </span>
                        </li>
                        <li>
                            <Link
                                to="/pharmacist/dashboard"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <Gauge />
                                <span className="ms-3">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/pharmacist/medicine"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <Pill />
                                <span className="ms-3">Medicine</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/pharmacist/inventory"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <ShoppingBasket />
                                <span className="ms-3">Inventory</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/pharmacist/category"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <ListCollapse />
                                <span className="ms-3">Category</span>
                            </Link>
                        </li>
                        {/* <li>
                            <Link
                                to="/pharmacist/sales"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <DollarSign />
                                <span className="ms-3">Sales</span>
                            </Link>
                        </li> */}

                    </ul>

                    {/* Logout Button */}
                    <div className="w-full py-4">
                        <button
                            onClick={Logout}
                            className="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <span className="flex-1 ms-3 whitespace-nowrap">Log Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="ml-64 w-full min-h-screen p-6 ">
                <Outlet />
            </div>
        </div>
    )
}
