import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import API_URL from '../../configuration/Api';
import { fetchUser } from '../../configuration/ProtectedRoute';
import { toast } from 'react-toastify';
import {
    Bell,
    DollarSign,
    Gauge,
    ListCollapse,
    Pill,
    ShoppingBasket,
    LogOut,
    X,
    User,
    Group,
} from 'lucide-react';
import Toast from '../../components/toast/Toast';

export const AdminLayout = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            if (token) {
                try {
                    const userData = await fetchUser(token);
                    setUser(userData);
                    if (userData?.user?.role !== "admin") {
                        toast.error('You are not authorized to access this page.');
                        navigate('/');
                    }
                    const res = await axios.get(`${API_URL}/notifications/admin`);
                    setNotification(res.data.notifications || []);
                } catch (err) {
                    toast.error('Failed to fetch user data or notifications.');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, [token]);

    const handleLogout = () => {
        Cookies.remove('token');
        window.location.href = '/'; // Adjust to your login route
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Toast />

            {/* Sidebar */}
            <aside className="fixed top-0 left-0 w-64 h-screen bg-white shadow-xl border-r border-gray-200">
                <div className="flex flex-col h-full p-4">
                    <div className="flex items-center gap-2 mb-6 p-2">
                        <Pill className="text-blue-600" size={28} />
                        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                    </div>

                    <nav className="flex-1">
                        <ul className="space-y-1">
                            <li>
                                <button
                                    onClick={() => setShowPopup(true)}
                                    className="flex items-center w-full p-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                >
                                    <Bell size={20} />
                                    <span className="ml-3">Notifications</span>
                                    {notification.length > 0 && (
                                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                            {notification.length}
                                        </span>
                                    )}
                                </button>
                            </li>
                            <li>
                                <Link
                                    to="/admin/dashboard"
                                    className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                >
                                    <Gauge size={20} />
                                    <span className="ml-3">Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/medicine"
                                    className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                >
                                    <Pill size={20} />
                                    <span className="ml-3">Medicine</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/inventory"
                                    className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                >
                                    <ShoppingBasket size={20} />
                                    <span className="ml-3">Inventory</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/category"
                                    className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                >
                                    <Group size={20}/>
                                    <span className="ml-3">Category</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/pharmacist/view"
                                    className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                >
                                    <User size={20} />
                                    <span className="ml-3">Pharmacist</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/sales"
                                    className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                >
                                    <DollarSign size={20} />
                                    <span className="ml-3">Sales</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                        <LogOut size={20} />
                        <span className="ml-3">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Notification Popup */}
            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {notification.length === 0 ? (
                            <div className="text-center text-gray-500 py-4">
                                <Bell size={24} className="mx-auto mb-2 text-gray-400" />
                                <p>No notifications found.</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {notification.map((item) => (
                                    <li
                                        key={item.id}
                                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        <span className="font-semibold text-gray-800">{item.title}</span>
                                        <p className="text-gray-600">{item.message}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="ml-64 w-full p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
};