import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../../configuration/Api';
import Cookies from 'js-cookie';
import { Pencil, Plus, Trash2 } from 'lucide-react';

const ReadCategory = () => {
    const [category, setCategory] = useState([]);
    const [role, setRole] = useState('');
    const [editModal, setEditModal] = useState({
        isOpen: false,
        categoryId: null,
        formData: { name: '', description: '' }
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        getAllCategories();
        fetchRole();
    }, []);

    const fetchRole = async () => {
        const token = Cookies.get('token');
        if (!token) {
            console.log("No token found");
            return;
        }
        try {
            const res = await axios.get(`${API_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRole(res.data.user.role);
        } catch (err) {
            console.error('Error fetching role:', err);
        }
    };

    const getAllCategories = async () => {
        try {
            const res = await axios.get(`${API_URL}/categories`);
            setCategory(res.data.categories);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleDelete = useCallback((id) => {
        if (!id) {
            alert("Invalid ID");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this category?")) {
            return;
        }
        axios.delete(`${API_URL}/categories/${id}`)
            .then(() => {
                alert("Category deleted successfully");
                setCategory(prev => prev.filter(cat => cat._id !== id));
            })
            .catch(err => console.error('Error deleting category:', err));
    }, []);

    const openEditModal = useCallback((cat) => {
        setEditModal({
            isOpen: true,
            categoryId: cat._id,
            formData: { name: cat.name || '', description: cat.description || '' }
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
            formData: { ...prev.formData, [name]: value }
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
            const res = await axios.put(
                `http://localhost:3000/api/categories/${editModal.categoryId}`,
                editModal.formData
            );
            alert("Category updated successfully");
            setCategory(prev => prev.map(cat => 
                cat._id === editModal.categoryId ? { ...cat, ...editModal.formData } : cat
            ));
            closeEditModal();
        } catch (err) {
            setErrors({ submit: err.response?.data?.message || 'Failed to update category' });
            console.error('Error updating category:', err);
        }
    };

    return (
        <div className='w-full min-h-screen bg-gray-100'>
            <div className="p-6">
                <div className="w-full bg-blue-500 flex justify-center items-center gap-6 mb-8">
                    <div className="flex gap-5 items-center text-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold">Total Categories</h3>
                        <p className="text-xl">{category.length}</p>
                    </div>
                </div>

                <div>
                    <h3 className="flex px-5 justify-between items-center text-2xl font-semibold mb-4">
                        <div>Category List</div>
                        <div className='text-xl'>
                            <Link to={`/${role}/add/category`}><Plus /></Link>
                        </div>
                    </h3>
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category.length > 0 ? (
                                    category.map((cat, index) => (
                                        <tr key={cat._id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-3 text-sm text-gray-700">{index + 1}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{cat.name ?? "N/A"}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{cat.description ?? "N/A"}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700 space-x-4">
                                                <button onClick={() => openEditModal(cat)} className="text-blue-600 hover:underline"><Pencil size={20}/></button>
                                                <button onClick={() => handleDelete(cat?._id)} className="text-red-600 hover:underline"><Trash2 size={20}/></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-3 text-sm text-gray-700 text-center">
                                            No categories found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">Edit Category</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={editModal.formData.name}
                                    onChange={handleEditChange}
                                    placeholder="Category Name"
                                    className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
                            </div>
                            <div className="mb-4">
                                <textarea
                                    name="description"
                                    value={editModal.formData.description}
                                    onChange={handleEditChange}
                                    placeholder="Description"
                                    rows="4"
                                    className={`w-full p-2 border rounded-md resize-y ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description}</span>}
                            </div>
                            {errors.submit && <div className="text-red-500 text-sm mb-4">{errors.submit}</div>}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReadCategory;