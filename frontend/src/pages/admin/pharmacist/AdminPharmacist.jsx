import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Pencil, Plus, Trash2, Tag, Users } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:3000/api/auth';

const ViewPharmacists = () => {
    const [defaultPagination, setDefaultPagination] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [pharmacists, setPharmacists] = useState([]);
    const [totalPharmacists, setTotalPharmacists] = useState(0);
    const [role, setRole] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const pharmacistsData = await getAllPharmacists(defaultPagination);
                setPharmacists(pharmacistsData.pharmacists || []);
                setTotalPage(pharmacistsData.totalPages || 0);
                setTotalPharmacists(pharmacistsData.totalPharmacists || 0);
                await fetchRole();
            } catch (err) {
                toast.error('Failed to fetch pharmacists.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [defaultPagination]);

    const getAllPharmacists = async (page) => {
        try {
            const res = await axios.get(`${API_URL}/users/pharmacist?page=${page}&limit=10`);
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    const fetchRole = async () => {
        const token = Cookies.get('token');
        if (!token) return;
        try {
            const res = await axios.get(`${API_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRole(res.data.user.role);
        } catch (err) {
            console.error('Error fetching role:', err);
        }
    };

    const getNextPharmacist = () => {
        if (defaultPagination < totalPage) {
            setDefaultPagination((prev) => prev + 1);
        }
    };

    const getPrevPharmacist = () => {
        if (defaultPagination > 1) {
            setDefaultPagination((prev) => prev - 1);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <ToastContainer />
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Pharmacist Management</h2>

                {/* Card Section */}
                <div className="mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Users className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-600">Total Pharmacists</h3>
                            <p className="text-2xl font-bold text-gray-800">{totalPharmacists}</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">Pharmacist List</h3>
                        <Link
                            to={`/${role}/pharmacist/add/`}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <Plus size={20} />
                            Add Pharmacist
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
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
                                        {pharmacists.length > 0 ? (
                                            pharmacists.map((pharm, index) => (
                                                <tr
                                                    key={pharm._id}
                                                    className="border-b hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                        {pharm.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{pharm.email || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{pharm.role || 'N/A'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Tag size={24} className="text-gray-400" />
                                                        <span>No pharmacists found</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPage >= 1 && (
                                <div className="p-6 flex justify-between items-center border-t border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        Page {defaultPagination} of {totalPage}
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={getPrevPharmacist}
                                            disabled={defaultPagination === 1}
                                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={getNextPharmacist}
                                            disabled={defaultPagination === totalPage}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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

export default ViewPharmacists;