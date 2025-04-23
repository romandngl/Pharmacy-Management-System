import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API_URL from '../../../../configuration/Api';
import { toast } from 'react-toastify';
import Toast from '../../../../components/toast/Toast';
import { Pill, ArrowLeft } from 'lucide-react';

export const EditMedicine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        category: '',
        reorderLevel: '',
        price: '',
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState({
        errorName: '',
        errorCategory: '',
        errorReorderLevel: '',
        errorPrice: '',
        errorServer: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/categories`);
                setCategories(res.data.categories || []);
            } catch (err) {
                toast.error('Failed to fetch categories.');
            }
        };

        const fetchMedicine = async () => {
            try {
                const res = await axios.get(`${API_URL}/medicine/${id}`);
                const medicine = res.data.medicine;
                setData({
                    name: medicine.name || '',
                    category: medicine.category?._id || '',
                    reorderLevel: medicine.reorderLevel || '',
                    price: medicine.price || '',
                });
            } catch (error) {
                toast.error('Failed to fetch medicine details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        fetchMedicine();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
        setError({ ...error, [name === 'name' ? 'errorName' : name === 'category' ? 'errorCategory' : name === 'reorderLevel' ? 'errorReorderLevel' : 'errorPrice']: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, category, reorderLevel, price } = data;

        let errors = {
            errorName: '',
            errorCategory: '',
            errorReorderLevel: '',
            errorPrice: '',
            errorServer: '',
        };

        if (!name) errors.errorName = 'Medicine name is required';
        if (!category) errors.errorCategory = 'Category is required';
        if (!reorderLevel) errors.errorReorderLevel = 'Reorder level is required';
        if (!price) errors.errorPrice = 'Price is required';

        if (errors.errorName || errors.errorCategory || errors.errorReorderLevel || errors.errorPrice) {
            setError(errors);
            return;
        }

        setLoading(true);
        try {
            const res = await axios.put(`${API_URL}/medicine/${id}`, {
                name,
                category,
                reorderLevel: Number(reorderLevel),
                price: Number(price),
            });
            toast.success(res.data.message);
            setTimeout(() => {
                navigate('/admin/medicine');
            }, 1500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update medicine');
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
                    <h1 className="text-2xl font-bold text-gray-800">Edit Medicine</h1>
                </div>
                <p className="text-gray-600 mb-6">Modify the medicine details below.</p>

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Medicine Name Input */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
                                Medicine Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                onChange={handleChange}
                                value={data.name}
                                placeholder="Enter medicine name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {error.errorName && (
                                <span className="text-red-500 text-xs mt-1">{error.errorName}</span>
                            )}
                        </div>

                        {/* Category Dropdown */}
                        <div className="mb-4">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-600 mb-1">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                onChange={handleChange}
                                value={data.category}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {error.errorCategory && (
                                <span className="text-red-500 text-xs mt-1">{error.errorCategory}</span>
                            )}
                        </div>

                        {/* Reorder Level Input */}
                        <div className="mb-4">
                            <label htmlFor="reorderLevel" className="block text-sm font-medium text-gray-600 mb-1">
                                Reorder Level
                            </label>
                            <input
                                type="number"
                                id="reorderLevel"
                                name="reorderLevel"
                                onChange={handleChange}
                                value={data.reorderLevel}
                                min="0"
                                placeholder="Enter reorder level"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {error.errorReorderLevel && (
                                <span className="text-red-500 text-xs mt-1">{error.errorReorderLevel}</span>
                            )}
                        </div>

                        {/* Price Input */}
                        <div className="mb-6">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-600 mb-1">
                                Price
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                onChange={handleChange}
                                value={data.price}
                                min="0"
                                step="0.01"
                                placeholder="Enter price"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {error.errorPrice && (
                                <span className="text-red-500 text-xs mt-1">{error.errorPrice}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-6 rounded-lg text-white font-medium transition-colors duration-200 ${
                                loading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {loading ? 'Updating...' : 'Update Medicine'}
                        </button>
                    </form>
                )}

                <div className="mt-4 text-center">
                    <Link
                        to="/admin/medicine"
                        className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                        <ArrowLeft size={16} />
                        Back to Medicine List
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EditMedicine;