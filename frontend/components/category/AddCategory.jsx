import axios from 'axios';
import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../configuration/Api';
import { toast } from 'react-toastify';
import Toast from '../toast/Toast';
import { Tag, ArrowLeft } from 'lucide-react';

const AddCategory = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Category name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await axios.post(`${API_URL}/categories`, formData);
            toast.success(response.data.message);
            setFormData({ name: '', description: '' });
            setErrors({});
            setTimeout(() => {
                navigate('/admin/categories'); // Adjust the route as needed
            }, 1500);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to add category';
            setErrors({ submit: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex justify-center items-center">
            <Toast />
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Tag className="text-blue-600" size={24} />
                    <h1 className="text-2xl font-bold text-gray-800">Add Category</h1>
                </div>
                <p className="text-gray-600 mb-6">Fill out the form to add a new category.</p>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
                            Category Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter category name"
                            onChange={handleChange}
                            value={formData.name}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.name && (
                            <span className="text-red-500 text-xs mt-1">{errors.name}</span>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Enter description"
                            rows="4"
                            onChange={handleChange}
                            value={formData.description}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.description ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.description && (
                            <span className="text-red-500 text-xs mt-1">{errors.description}</span>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="mb-4 text-red-500 text-sm text-center">{errors.submit}</div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-6 rounded-lg text-white font-medium transition-colors duration-200 ${
                            isSubmitting
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Category'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                   
                </div>
            </div>
        </div>
    );
};

export default AddCategory;