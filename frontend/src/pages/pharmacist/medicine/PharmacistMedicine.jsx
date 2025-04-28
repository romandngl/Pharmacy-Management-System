import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../../../configuration/Api';
import { Pencil, Plus, Trash2, Pill } from 'lucide-react';
import { toast } from 'react-toastify';
import Toast from '../../../../components/toast/Toast';

export const PharmacistMedicine = () => {
    const [medicine, setMedicine] = useState([]);
    const [defaultPagination, setDefaultPagination] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [totalMedicine, setTotalMedicine] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getAllMedicine(defaultPagination)
            .then(data => {
                setMedicine(data.medicines || []);
                setTotalMedicine(data.totalRecords || 0);
                setTotalPage(data.totalPages || 0);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, [defaultPagination]);

    async function getAllMedicine(page) {
        try {
            const res = await axios.get(`${API_URL}/medicine?page=${page}`);
            return res.data;
        } catch (error) {
            console.error("Error fetching medicines:", error);
            throw error;
        }
    }

    function getNextMedicine() {
        if (defaultPagination < totalPage) {
            setDefaultPagination(prev => prev + 1);
        }
    }

    function getPrevMedicine() {
        if (defaultPagination > 1) {
            setDefaultPagination(prev => prev - 1);
        }
    }

    function handleDelete(id) {
        if (!id) {
            toast.error("Invalid ID");
            return;
        }
        const confirm = window.confirm("Are you sure you want to delete this medicine?");
        if (!confirm) return;

        axios.delete(`${API_URL}/medicine/${id}`)
            .then(() => {
                toast.success("Medicine deleted successfully");
                setMedicine(prev => prev.filter(med => med._id !== id));
            })
            .catch(err => {
                console.error(err);
                toast.error("Failed to delete medicine");
            });
    }

    function handleEdit(id) {
        if (!id) {
            toast.error("Invalid ID");
            return;
        }
        navigate(`/pharmacist/medicine/edit/${id}`);
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <Toast />
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Medicine Management</h2>

                {/* Card Section */}
                <div className="mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full">
                            <Pill className="text-green-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-600">Total Medicines</h3>
                            <p className="text-2xl font-bold text-gray-800">{totalMedicine}</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">Medicine List</h3>
                        <Link
                            to="/pharmacist/medicine/add"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <Plus size={20} />
                            Add Medicine
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
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Reorder Level</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {medicine.length > 0 ? (
                                            medicine.map((med, index) => (
                                                <tr
                                                    key={med._id}
                                                    className="border-b hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{med.name || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{med.category?.name || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{med.reorderLevel || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{med.price || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(med._id)}
                                                            className="p-2 text-blue-600 hover:text-blue-800 transition-colors duration-150"
                                                            title="Edit Medicine"
                                                        >
                                                            <Pencil size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(med._id)}
                                                            className="p-2 text-red-600 hover:text-red-800 transition-colors duration-150"
                                                            title="Delete Medicine"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Pill size={24} className="text-gray-400" />
                                                        <span>No medicines found</span>
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
                                            onClick={getPrevMedicine}
                                            disabled={defaultPagination === 1}
                                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={getNextMedicine}
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

export default PharmacistMedicine;