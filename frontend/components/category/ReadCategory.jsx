import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../../configuration/Api';
import Cookies from 'js-cookie';
import { Pencil, Plus, Trash2, Tag, Group } from 'lucide-react';
import { toast } from 'react-toastify';
import Toast from '../toast/Toast';

const ReadCategory = () => {
    const [defaultPagination, setDefaultPagination] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [category, setCategory] = useState([]);
    const [totalCategories, setTotalCategories] = useState(0);
    const [role, setRole] = useState('');
    const [editModal, setEditModal] = useState({
        isOpen: false,
        categoryId: null,
        formData: { name: '', description: '' },
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const categoriesData = await getAllCategories(defaultPagination);
                setCategory(categoriesData.categories || []);
                setTotalPage(categoriesData.totalPages || 0);
                setTotalCategories(categoriesData.totalRecords || 0);
                await fetchRole();
            } catch (err) {
                toast.error('Failed to fetch categories.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [defaultPagination]);

    const getAllCategories = async (page) => {
        try {
            const res = await axios.get(`${API_URL}/categories/paginated?page=${page}`);
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    const fetchRole = async () => {
        const token = Cookies.get('token');
        if (!token) return;
        try {
            const res = await axios.get(`${API_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRole(res.data.user.role);
        } catch (err) {
            console.error('Error fetching role:', err);
        }
    };

    const getNextCategory = () => {
        if (defaultPagination < totalPage) {
            setDefaultPagination(prev => prev + 1);
        }
    };

    const getPrevCategory = () => {
        if (defaultPagination > 1) {
            setDefaultPagination(prev => prev - 1);
        }
    };

    const handleDelete = useCallback(
        (id) => {
            if (!id) {
                toast.error('Invalid ID');
                return;
            }
            if (!window.confirm('Are you sure you want to delete this category?')) return;

            axios
                .delete(`${API_URL}/categories/${id}`)
                .then(() => {
                    toast.success('Category deleted successfully');
                    setCategory(prev => prev.filter(cat => cat._id !== id));
                })
                .catch(err => {
                    toast.error(err.response?.data?.message || 'Failed to delete category');
                });
        },
        []
    );

    const openEditModal = useCallback((cat) => {
        setEditModal({
            isOpen: true,
            categoryId: cat._id,
            formData: { name: cat.name || '', description: cat.description || '' },
        });
    }, []);

    const closeEditModal = () => {
        setEditModal({ isOpen: false, categoryId: null, formData: { name: '', description: '' } });
        setErrors({});
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditModal(prev => ({
            ...prev,
            formData: { ...prev.formData, [name]: value },
        }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!editModal.formData.name.trim()) newErrors.name = 'Name is required';
        if (!editModal.formData.description.trim()) newErrors.description = 'Description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const res = await axios.put(`${API_URL}/categories/${editModal.categoryId}`, editModal.formData);
            toast.success('Category updated successfully');
            setCategory(prev =>
                prev.map(cat =>
                    cat._id === editModal.categoryId ? { ...cat, ...editModal.formData } : cat
                )
            );
            closeEditModal();
        } catch (err) {
            setErrors({ submit: err.response?.data?.message || 'Failed to update category' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <Toast />
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Category Management</h2>

                {/* Card Section */}
                <div className="mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Group  className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-600">Total Categories</h3>
                            <p className="text-2xl font-bold text-gray-800">{totalCategories}</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">Category List</h3>

                        <Link
                            to={`/${role}/add/category`}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <Plus size={20} />
                            Add Category
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
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Description</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {category.length > 0 ? (
                                            category.map((cat, index) => (
                                                <tr
                                                    key={cat._id}
                                                    className="border-b hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{cat.name || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{cat.description || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 flex gap-2">
                                                        <button
                                                            onClick={() => openEditModal(cat)}
                                                            className="p-2 text-blue-600 hover:text-blue-800 transition-colors duration-150"
                                                            title="Edit Category"
                                                        >
                                                            <Pencil size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(cat._id)}
                                                            className="p-2 text-red-600 hover:text-red-800 transition-colors duration-150"
                                                            title="Delete Category"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Tag size={24} className="text-gray-400" />
                                                        <span>No categories found</span>
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
                                            onClick={getPrevCategory}
                                            disabled={defaultPagination === 1}
                                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={getNextCategory}
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

                {/* Edit Modal */}
                {editModal.isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Category</h2>
                            <form onSubmit={handleEditSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Category Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editModal.formData.name}
                                        onChange={handleEditChange}
                                        placeholder="Enter category name"
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.name && (
                                        <span className="text-red-500 text-xs mt-1">{errors.name}</span>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={editModal.formData.description}
                                        onChange={handleEditChange}
                                        placeholder="Enter description"
                                        rows="4"
                                        className={`w-full px-3 py-2 border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.description && (
                                        <span className="text-red-500 text-xs mt-1">{errors.description}</span>
                                    )}
                                </div>
                                {errors.submit && (
                                    <div className="text-red-500 text-sm mb-4">{errors.submit}</div>
                                )}
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={closeEditModal}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Save
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

export default ReadCategory;