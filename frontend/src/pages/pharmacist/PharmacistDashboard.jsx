import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../../configuration/Api';
import { toast } from 'react-toastify';
import { Pill, ShoppingBasket, DollarSign } from 'lucide-react';
import Toast from '../../../components/toast/Toast';

export const PharmacistDashboard = () => {
    const [expired, setExpired] = useState([]);
    const [totalPatients, setTotalPatients] = useState(0);
    const [totalMedicines, setTotalMedicines] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [expiredRes, medicinesRes, salesRes] = await Promise.all([
                    axios.get(`${API_URL}/inventory/report/expired`),
                    axios.get(`${API_URL}/medicines`),
                    axios.get(`${API_URL}/sales`),
                ]);
                setExpired(expiredRes.data.inventory || []);
                setTotalMedicines(medicinesRes.data.medicines?.length || 0);
                setTotalSales(salesRes.data.totalRecords || 0);
                // Note: Total Patients is not fetched as no API endpoint is provided.
                // Assuming expired inventory length as a placeholder for total patients.
                setTotalPatients(expiredRes.data.inventory?.length || 0);
            } catch (err) {
                setError('Failed to fetch dashboard data.');
                toast.error('Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <Toast />
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Pharmacist Dashboard</h2>

                {/* Cards Section */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 p-4">{error}</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Pill className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-600">Total Patients</h3>
                                    <p className="text-2xl font-bold text-gray-800">{totalPatients}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <ShoppingBasket className="text-green-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-600">Total Medicines</h3>
                                    <p className="text-2xl font-bold text-gray-800">{totalMedicines}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <DollarSign className="text-yellow-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-600">Total Sales</h3>
                                    <p className="text-2xl font-bold text-gray-800">{totalSales}</p>
                                </div>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Expired Medicine List</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">#</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Medicine Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Quantity</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Unit Price</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Expiry Date</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expired.length > 0 ? (
                                            expired.map((item, index) => (
                                                <tr
                                                    key={item._id}
                                                    className="border-b hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                        {item?.medicine?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {item?.medicine?.category?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{item?.quantity || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        Rs {item?.medicine?.price || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {item?.expiryDate
                                                            ? new Date(item.expiryDate).toISOString().split('T')[0]
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {item?.createdAt
                                                            ? new Date(item.createdAt).toISOString().split('T')[0]
                                                            : 'N/A'}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Pill size={24} className="text-gray-400" />
                                                        <span>No expired medicines found</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};