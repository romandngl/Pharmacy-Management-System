import React, { use, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../../../configuration/Api';
import { getDateString } from '../../../../utils/ModifyDate';


export const AdminInventory = () => {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ medicineId: '', quantity: '',medicineName:'' });
    console.log(inventory)
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get(`${API_URL}/inventory/report`);
                setInventory(response.data.inventory);
                console.log(response.data.inventory);
            } catch (err) {
                setError('Failed to fetch inventory data.');
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    function handleAdd() {
        navigate("/admin/inventory/add")
    }

    const handleEdit = (item) => {
        setFormData({ medicineId: item.medicine._id, quantity: Number(item.quantity),medicineName:item.medicine.name });
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setFormData({ medicineId: '', quantity: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const sendData = {
                medicineId: formData.medicineId,
                quantity: formData.quantity
            }
            const res = await axios.put(`${API_URL}/inventory/${formData.medicineId}`,sendData);
            alert(res.data.message);
            setShowModal(false);
            setFormData({ medicineId: '', quantity: '' });
        } catch (error) {
            alert(error.response.data.message);
        }
    };


    

    return (
        <div className='w-full min-h-screen bg-gray-100'>
            <div className="p-6">
                {/* Cards Section */}
                <div className="w-full bg-blue-500 flex justify-center items-center gap-6 mb-8 p-6 text-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold">Total Inventory</h3>
                    <p className="text-xl">{inventory.length}</p>
                </div>

                {/* Table Section */}
                <div className='flex justify-between items-center'>
                    <h3 className="text-2xl font-semibold mb-4">Inventory List</h3>
                    <button className='text-xl' onClick={handleAdd}>Add</button>
                </div>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    {loading ? (
                        <p className="text-center p-4">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-500 p-4">{error}</p>
                    ) : (
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Item Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">ExpiryDate</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Quantity</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">StockLevel</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">ReorderLevel</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">CreatedAt</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">UpdatedAt</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.length > 0 ? (
                                    inventory.map((item, index) => (
                                        <tr key={item._id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-3 text-sm text-gray-700">{index + 1}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{item.medicine.name ?? "N/A"}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{item.medicine.category ?? "N/A"}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{getDateString(item.medicine.expiryDate) ?? "N/A"}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{item.quantity ?? "N/A"}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{item.medicine.stockLevel ?? "N/A"}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{item.medicine.reorderLevel ?? "N/A"}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{getDateString(item.medicine.createdAt) ?? "N/A"}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{getDateString(item.medicine.updatedAt) ?? "N/A"}</td>
                                            <td  className=" px-6 py-3 text-sm text-gray-700">
                                                <button onClick={e=>handleEdit(item)} className="text-blue-500 hover:text-blue-700">
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-3 text-sm text-gray-700 text-center">
                                            No inventory items found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-xl font-bold mb-4">Edit Inventory</h2>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="medicineId"
                                    placeholder="Medicine ID"
                                    className="border p-2 w-full mb-2 rounded"
                                    value={formData.medicineName}
                                    disabled
                                />
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="Quantity"
                                    className="border p-2 w-full mb-2 rounded"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                />
                                <div className="flex justify-end space-x-2">
                                    <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={handleClose}>Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
