import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configuration/Api';
import { toast } from 'react-toastify';
import Toast from '../toast/Toast';
import { CirclePlus, Eye, Pill } from 'lucide-react';
import Cookies from 'js-cookie';
const Sales = () => {
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const user = localStorage.getItem('user');
    useEffect(() => {
        const fetchSales = async () => {
            setLoading(true);
            try {
                const data = await getAllSales(page);
                setSales(data?.sales || []);
                setTotalPages(data?.totalPages || 0);
            } catch (error) {
                setError('Failed to fetch sales data.');
                toast.error('Failed to fetch sales data.');
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
        (async () => {
            await fetchRole();
            await getTotalRevenue()
        })()


    }, [page]);

    const fetchRole = async () => {
        const token = Cookies.get('token');
        if (!token) return;
        try {
            const res = await axios.get(`${API_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRole(res.data.user.role);
        } catch (err) {
            console.error('Error fetching role:', err);
        }
    };

    const getAllSales = async (page) => {
        try {
            const res = await axios.get(`${API_URL}/sales?page=${page}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const getTotalRevenue = async () => {
        try {
            const res = await axios.get(`${API_URL}/sales/all`);
            setTotalRevenue(res?.data.totalRevenue)
        } catch (error) {
            console.log("Error when fetching total revenue", error)
        }
    }

    const getPrevSales = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    };

    const getNextSales = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    };

    const handleNaviage = (id) => {
        const { role } = JSON.parse(user)
        if (role === 'admin') {
            navigate(`/admin/sales/${id}`);
        } else if (role === 'pharmacist') {
            navigate(`/pharmacist/sales/${id}`);
        }
        else {
            toast.error("Invalid role")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <Toast />
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Sales Management</h2>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">Sales List</h3>
                        <button
                            onClick={() => navigate(`/${role}/sales/add`)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <CirclePlus size={20} />
                            Add Sale
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="p-6 text-center text-red-500">{error}</div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">#</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Medicine Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Quantity Sold</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Total Price</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Expiry Date</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Sale Date</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales.length > 0 ? (
                                            sales.map((sale, index) => (
                                                <tr
                                                    key={sale._id}
                                                    className="border-b hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{sale.medicineName || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{sale.quantitySold || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">Rs {sale.totalPrice || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {sale.expiryDate ? new Date(sale.expiryDate).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        <button
                                                            onClick={() => handleNaviage(sale._id)}
                                                            className="p-2 text-blue-600 hover:text-blue-800 transition-colors duration-150"
                                                            title="View Sale Details"
                                                        >
                                                            <Eye size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Pill size={24} className="text-gray-400" />
                                                        <span>No sales found</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages >= 1 && (
                                <div className="flex items-center justify-between p-6 bg-white border-t border-gray-100 shadow-sm">
                                    <div className="text-base text-gray-500">
                                        Page {page} of {totalPages}
                                    </div>
                                    <div className="text-base font-semibold">
                                        Total Revenue: <span className="text-green-600">Rs {totalRevenue}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={getPrevSales}
                                            disabled={page === 1}
                                            className="px-3 py-1.5 text-base bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={getNextSales}
                                            disabled={page === totalPages}
                                            className="px-3 py-1.5 text-base bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sales;