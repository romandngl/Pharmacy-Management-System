import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../../../configuration/Api';
import { toast } from 'react-toastify';
import Toast from '../../../../components/toast/Toast';
import { Pencil, Plus, ShoppingBasket, X } from 'lucide-react';

const PharmacistInventory = () => {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [reset, setReset] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ medicineId: '', quantity: '', medicineName: '', inventoryId: '' });

    useEffect(() => {
        const fetchInventory = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/inventory/report`);
                setInventory(response.data.inventory || []);
            } catch (err) {
                setError('Failed to fetch inventory data.');
                toast.error('Failed to fetch inventory data.');
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, [reset]);

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
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.quantity || formData.quantity <= 0) {
            toast.error('Please enter a valid quantity.');
            return;
        }
        try {
            const sendData = {
                medicineId: formData.medicineId,
                quantity: Number(formData.quantity),
            };
            const res = await axios.put(`${API_URL}/inventory/${formData.inventoryId}`, sendData);
            toast.success(res.data.message);
            setShowModal(false);
            setReset((prev) => !prev);
            setFormData({ medicineId: '', quantity: '', medicineName: '', inventoryId: '' });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update inventory.');
        }
    };

    const handleAdd = () => {
        navigate('/pharmacist/inventory/add');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <Toast />
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Inventory Management</h2>

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
                                    <ShoppingBasket className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-600">Total Inventory Items</h3>
                                    <p className="text-2xl font-bold text-gray-800">{inventory.length}</p>
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
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Updated At</th>
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
                                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                        {item?.medicine?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {item?.medicine?.category?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {item?.expiryDate
                                                            ? new Date(item.expiryDate).toISOString().split('T')[0]
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{item?.quantity || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {item?.medicine?.reorderLevel || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {item?.createdAt
                                                            ? new Date(item.createdAt).toISOString().split('T')[0]
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {item?.updatedAt
                                                            ? new Date(item.updatedAt).toISOString().split('T')[0]
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                                                            title="Edit Inventory"
                                                        >
                                                            <Pencil size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <ShoppingBasket size={24} className="text-gray-400" />
                                                        <span>No inventory items found</span>
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

                {/* Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Edit Inventory</h2>
                                <button
                                    onClick={handleClose}
                                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="medicineName" className="block text-sm font-medium text-gray-600 mb-1">
                                        Medicine Name
                                    </label>
                                    <input
                                        id="medicineName"
                                        type="text"
                                        name="medicineName"
                                        value={formData.medicineName}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-600 mb-1">
                                        Quantity
                                    </label>
                                    <input
                                        id="quantity"
                                        type="number"
                                        name="quantity"
                                        placeholder="Enter quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
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

export default PharmacistInventory;