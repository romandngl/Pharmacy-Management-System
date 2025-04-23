import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../../../configuration/Api';
import { toast } from 'react-toastify';
import Toast from '../../../../components/toast/Toast';
import { Pencil, Plus, Trash2, Pill } from 'lucide-react';

const PharmacistMedicine = () => {
    const [medicine, setMedicine] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMedicines = async () => {
            setLoading(true);
            try {
                const data = await getAllMedicine();
                setMedicine(data || []);
            } catch (err) {
                setError('Failed to fetch medicines.');
                toast.error('Failed to fetch medicines.');
            } finally {
                setLoading(false);
            }
        };
        fetchMedicines();
    }, []);

    const getAllMedicine = async () => {
        const res = await axios.get(`${API_URL}/medicine`);
        return res.data.medicines;
    };

    const handleDelete = async (id) => {
        if (!id) {
            toast.error('Invalid ID');
            return;
        }
        const confirm = window.confirm('Are you sure you want to delete this medicine?');
        if (!confirm) return;

        try {
            await axios.delete(`${API_URL}/medicine/${id}`);
            toast.success('Medicine deleted successfully');
            setMedicine(medicine.filter((med) => med._id !== id));
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to delete medicine.');
        }
    };

    const handleEdit = (id) => {
        if (!id) {
            toast.error('Invalid ID');
            return;
        }
        navigate(`/pharmacist/medicine/edit/${id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <Toast />
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Medicine Management</h2>

                {/* Card Section */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 p-4">{error}</div>
                ) : (
                    <>
                        <div className="mb-8">
                            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Pill className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    
                                    <h3 className="text-lg font-semibold text-gray-600">Total Medicines</h3>
                                    <p className="text-2xl font-bold text-gray-800">{medicine.length}</p>
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
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">#</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Reorder Level</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {medicine.length > 0 ? (
                                            medicine.map((medicine, index) => (
                                                <tr
                                                    key={medicine._id}
                                                    className="border-b hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                        {medicine?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {medicine?.category?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {medicine?.reorderLevel || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 space-x-4">
                                                        <button
                                                            onClick={() => handleEdit(medicine._id)}
                                                            className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                                                            title="Edit Medicine"
                                                        >
                                                            <Pencil size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(medicine._id)}
                                                            className="text-red-600 hover:text-red-800 transition-colors duration-150"
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
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PharmacistMedicine;