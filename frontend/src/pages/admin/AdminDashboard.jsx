import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API_URL from '../../../configuration/Api'

export const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [totalCount, setTotalCount] = useState({
        users: 0,
        medicine: 0,
        sales: 0,
    });

    
    useEffect(() => {
        async function fetchAllUsers() {
            const res = await axios.get(API_URL + `/auth/users`);
            const data = res.data;
            setUsers(data?.patients);
            setTotalCount((prev) => ({ ...prev, users: data?.patients.length }));
        }

        async function fetchAllSales() {
            const res = await axios.get(API_URL + `/sales`);
            const data = res.data;
            console.log(data?.sales?.length)
            setTotalCount((prev) => ({ ...prev, sales: data.sales.length ?? 0 }));
        }

        async function fetchAllMedicine() {
            const res = await axios.get(API_URL + `/medicines`);
            const data = res.data;
            console.log("medicines total",data?.medicines?.length)
            setTotalCount((prev) => ({ ...prev, medicine: data?.medicines?.length ?? 0 }));
        }

        fetchAllUsers();
        fetchAllSales();
        fetchAllMedicine();
    }, [])

    return (
        <div className='w-full min-h-screen bg-gray-100'>
            <div className="p-6">
                {/* Cards Section */}
                <div className="flex gap-6 mb-8">
                    <div className="flex-1 bg-blue-500 text-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold">Total Users</h3>
                        <p className="text-2xl">{totalCount?.users ?? 'N/A'}</p> {/* Replace with dynamic data */}
                    </div>
                    <Link to={"/admin/medicine"} className="flex-1 bg-green-500 text-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold">Total Medicine</h3>
                        <p className="text-2xl">{totalCount?.medicine ?? "N/A"}</p> {/* Replace with dynamic data */}
                    </Link>
                    <Link to={"/admin/sales"} className="flex-1 bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold">Total Sales</h3>
                        <p className="text-2xl">{totalCount?.sales ?? "N/A"}</p> {/* Replace with dynamic data */}
                    </Link>
                </div>

                {/* Table Section */}
                <div>
                    <h3 className="text-2xl font-semibold mb-4">Patient List</h3>
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-3 text-sm text-gray-700">{index + 1}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{user.name}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{user.email}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{user.role}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-3 text-sm text-gray-700 text-center">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
