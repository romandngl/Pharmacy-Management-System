import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../../../configuration/Api';
import CustomPieChart from '../../../utils/custom/CustomPieChart';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip
} from 'recharts';
import { Calendar, CheckCircle, Clock, Pill, ShoppingCart, Users, XCircle } from 'lucide-react';


export const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [defaultPagination, setDefaultPagination] = useState(1)
    const [totalPage, setTotalPage] = useState(0);

    const [totalCount, setTotalCount] = useState({
        users: 0,
        medicine: 0,
        sales: 0,
    });
    const [appoinementsTotal, setAppoinementsTotal] = useState({
        completedAppointments: 0,
        canceledAppointments: 0,
        scheduledAppointments: 0,
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log(chartData)

    async function getInvetoryByMedicine() {
        try {
            const res = await axios.get(`${API_URL}/inventory/details`);
            return res.data.report;
        } catch (error) {
            console.error("Error fetching inventory by medicine", error);
            return [];
        }
    }


    function getNextInventory() {
        if (defaultPagination < totalPage) {
            setDefaultPagination(prev => prev + 1);
        }
    }

    function getPrevInventory() {
        if (defaultPagination > 1) {
            setDefaultPagination(prev => prev - 1);
        }
    }


    useEffect(() => {
        getInvetoryByMedicine().then((res) => {
            const formatData = res.map((item) => ({
                name: item._id.name,
                unit: item.totalQuantity,
            }));
            setChartData(formatData);
        }).catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Fetch Users

                // Fetch Sales
                const salesRes = await axios.get(`${API_URL}/sales`);
                setTotalCount((prev) => ({ ...prev, sales: salesRes.data.totalSales || 0 }));

                // Fetch Medicines
                const medicinesRes = await axios.get(`${API_URL}/medicines`);
                setTotalCount((prev) => ({ ...prev, medicine: medicinesRes.data?.medicines?.length || 0 }));

                // Fetch Appointments
                const [completed, scheduled, canceled] = await Promise.all([
                    axios.get(`${API_URL}/appointments/status/completed`).then(res => res.data.totalAppointments || 0),
                    axios.get(`${API_URL}/appointments/status/scheduled`).then(res => res.data.totalAppointments || 0),
                    axios.get(`${API_URL}/appointments/status/canceled`).then(res => res.data.totalAppointments || 0),
                ]);
                setAppoinementsTotal({ completedAppointments: completed, scheduledAppointments: scheduled, canceledAppointments: canceled });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);


    useEffect(() => {
        fetchUsers(defaultPagination)
            .then((usersRes) => {
                setUsers(usersRes?.patients || []);
                setTotalCount((prev) => ({ ...prev, users: usersRes?.totalPatients || 0 }));
                setTotalPage(usersRes?.totalPages)
            }).catch((err) => console.log("Error when fetching user", err))
    }, [defaultPagination])

    async function fetchUsers(defaultPagination) {
        try {
            const usersRes = await axios.get(`${API_URL}/auth/users/patients?page=${defaultPagination}`);
            const data = await usersRes.data
            return data
        } catch (error) {
            console.log("Error when fetching users", error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

                {/* Cards Section */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow duration-200">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Users className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
                                    <p className="text-2xl font-bold text-gray-800">{totalCount.users}</p>
                                </div>
                            </div>
                            <Link to="/admin/medicine" className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow duration-200">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <Pill className="text-green-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-600">Total Medicines</h3>
                                    <p className="text-2xl font-bold text-gray-800">{totalCount.medicine}</p>
                                </div>
                            </Link>
                            <Link to="/admin/sales" className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow duration-200">
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <ShoppingCart className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-600">Total Sales</h3>
                                    <p className="text-2xl font-bold text-gray-800">{totalCount.sales}</p>
                                </div>
                            </Link>
                        </div>

                        {/* Appointment Stats and Pie Chart */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Appointment Stats */}
                            <div className="bg-white p-6 rounded-2xl shadow-lg">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <Calendar size={24} /> Appointment Status
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                                        <CheckCircle className="text-green-500" size={24} />
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-600">Completed</h4>
                                            <p className="text-lg font-bold text-gray-800">{appoinementsTotal.completedAppointments}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                                        <Clock className="text-yellow-500" size={24} />
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-600">Scheduled</h4>
                                            <p className="text-lg font-bold text-gray-800">{appoinementsTotal.scheduledAppointments}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg">
                                        <XCircle className="text-red-500" size={24} />
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-600">Canceled</h4>
                                            <p className="text-lg font-bold text-gray-800">{appoinementsTotal.canceledAppointments}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pie Chart */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Inventory Distribution</h3>
                                <div className="h-[300px]">
                                    {chartData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={chartData}>
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="unit" fill="#8884d8" />
                                            </BarChart>
                                        </ResponsiveContainer>

                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                            <Pill size={24} className="mb-2" />
                                            <span>No inventory data available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Patients Table */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <h3 className="text-xl font-bold text-gray-800 p-6">Patients List</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">#</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? (
                                            users.map((user, index) => (
                                                <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors duration-150">
                                                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{user.name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{user.role}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Users size={24} className="text-gray-400" />
                                                        <span>No patients found</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {totalPage >= 1 && (
                                <div className="p-6 flex justify-between items-center border-t border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        Page {defaultPagination} of {totalPage}
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={getPrevInventory}
                                            disabled={defaultPagination === 1}
                                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={getNextInventory}
                                            disabled={defaultPagination === totalPage}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;