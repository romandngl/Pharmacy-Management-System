import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../../../configuration/Api';
import { getDateString } from '../../../../utils/ModifyDate';
import { Pencil, Plus, Pill } from 'lucide-react';
import { toast } from 'react-toastify';
import Toast from '../../../../components/toast/Toast';

export const AdminInventory = () => {
    const navigate = useNavigate();
    const [defaultPagination, setDefaultPagination] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [totalInventory, setTotalInventory] = useState(0);
    const [inventory, setInventory] = useState([]);
    const [reset, setReset] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ medicineId: '', quantity: '', medicineName: '', inventoryId: '' });

    useEffect(() => {
        fetchInventory(defaultPagination)
            .then((res) => {
                setInventory(res.inventory || []);
                setTotalPage(res.totalPages || 0);
                setTotalInventory(res.totalRecords || 0);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to fetch inventory data.');
                setLoading(false);
            });
    }, [defaultPagination, reset]);

    const fetchInventory = async (page) => {
        try {
            const response = await axios.get(`${API_URL}/inventory/report?page=${page}`);
            return response.data;
        } catch (err) {
            throw err;
        }
    };

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

    const handleEdit = (item) => {
        setFormData({
            medicineId: item.medicine._id,
            quantity: Number(item.quantity),
            medicineName: item.medicine.name,
            inventoryId: item._id,
        });
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setFormData({ medicineId: '', quantity: '', medicineName: '', inventoryId: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const sendData = {
                medicineId: formData.medicineId,
                quantity: Number(formData.quantity),
            };
            const res = await axios.put(`${API_URL}/inventory/${formData.inventoryId}`, sendData);
            toast.success(res.data.message);
            setShowModal(false);
            setReset(prev => !prev);
            setFormData({ medicineId: '', quantity: '', medicineName: '', inventoryId: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update inventory');
        }
    };

    function handleAdd() {
        navigate('/admin/inventory/add');
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <Toast />
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Inventory Management</h2>

                {/* Card Section */}
                <div className="mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full">
                            <Pill className="text-green-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-600">Total Inventory</h3>
                            <p className="text-2xl font-bold text-gray-800">{totalInventory}</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">Inventory List</h3>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <Plus size={20} />
                            Add Inventory
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
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Item Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Expiry Date</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Quantity</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Reorder Level</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Created At</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventory.length > 0 ? (
                                            inventory.map((item, index) => (
                                                <tr
                                                    key={item._id}
                                                    className="border-b hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{item.medicine?.name || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{item.medicine?.category?.name || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{getDateString(item.expiryDate) || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{item.quantity || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{item.medicine?.reorderLevel || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{getDateString(item.medicine?.createdAt) || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="p-2 text-blue-600 hover:text-blue-800 transition-colors duration-150"
                                                            title="Edit Inventory"
                                                        >
                                                            <Pencil size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Pill size={24} className="text-gray-400" />
                                                        <span>No inventory items found</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPage > 1 && (
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
                        </>
                    )}
                </div>

                {/* Modal for Editing Inventory */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Inventory</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Medicine Name</label>
                                    <input
                                        type="text"
                                        name="medicineName"
                                        value={formData.medicineName}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter quantity"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminInventory;