import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../../../configuration/Api';
import { toast } from 'react-toastify';
import Toast from '../../../../components/toast/Toast';
import { Pill, ArrowLeft } from 'lucide-react';

export const AddInventory = () => {
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState([]);
    const [data, setData] = useState({
        medicineId: '',
        quantity: '',
        expiryDate: '',
    });
    const [error, setError] = useState({
        errorMedicineId: '',
        errorQuantity: '',
        errorExpiryDate: '',
        errorServer: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await axios.get(`${API_URL}/medicines`);
                setMedicines(response?.data.medicines || []);
            } catch (err) {
                toast.error('Failed to fetch medicines data.');
            }
        };
        fetchMedicines();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
        setError({ ...error, [name === 'medicineId' ? 'errorMedicineId' : name === 'quantity' ? 'errorQuantity' : 'errorExpiryDate']: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { medicineId, quantity, expiryDate } = data;

        let errors = {
            errorMedicineId: '',
            errorQuantity: '',
            errorExpiryDate: '',
            errorServer: '',
        };

        if (!medicineId) errors.errorMedicineId = 'Medicine is required';
        if (!quantity) errors.errorQuantity = 'Quantity is required';
        if (!expiryDate) errors.errorExpiryDate = 'Expiry date is required';

        if (errors.errorMedicineId || errors.errorQuantity || errors.errorExpiryDate) {
            setError(errors);
            return;
        }

        setError(errors);
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/inventory`, {
                ...data,
                quantity: Number(quantity),
            });
            toast.success(res.data.message);
            setData({ medicineId: '', quantity: '', expiryDate: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add inventory');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex justify-center items-center">
            <Toast />
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Pill className="text-blue-600" size={24} />
                    <h1 className="text-2xl font-bold text-gray-800">Add Inventory</h1>
                </div>
                <p className="text-gray-600 mb-6">Fill out the form to add a new inventory item.</p>

                <form onSubmit={handleSubmit}>
                    {/* Medicine Dropdown */}
                    <div className="mb-4">
                        <label htmlFor="medicineId" className="block text-sm font-medium text-gray-600 mb-1">
                            Medicine
                        </label>
                        <select
                            id="medicineId"
                            name="medicineId"
                            onChange={handleChange}
                            value={data.medicineId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a medicine</option>
                            {medicines.map((medicine) => (
                                <option key={medicine._id} value={medicine._id}>
                                    {medicine.name}
                                </option>
                            ))}
                        </select>
                        {error.errorMedicineId && (
                            <span className="text-red-500 text-xs mt-1">{error.errorMedicineId}</span>
                        )}
                    </div>

                    {/* Quantity Input */}
                    <div className="mb-4">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-600 mb-1">
                            Quantity
                        </label>
                        <input
                            id="quantity"
                            type="number"
                            name="quantity"
                            onChange={handleChange}
                            value={data.quantity}
                            placeholder="Enter quantity"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {error.errorQuantity && (
                            <span className="text-red-500 text-xs mt-1">{error.errorQuantity}</span>
                        )}
                    </div>

                    {/* Expiry Date Input */}
                    <div className="mb-6">
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-600 mb-1">
                            Expiry Date
                        </label>
                        <input
                            id="expiryDate"
                            type="date"
                            name="expiryDate"
                            onChange={handleChange}
                            value={data.expiryDate}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {error.errorExpiryDate && (
                            <span className="text-red-500 text-xs mt-1">{error.errorExpiryDate}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-6 rounded-lg text-white font-medium transition-colors duration-200 ${loading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Adding...' : 'Add Inventory'}
                    </button>
                </form>


            </div>
        </div>
    );
};

export default AddInventory;