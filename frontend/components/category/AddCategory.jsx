import axios from 'axios';
import React, { useState, useCallback } from 'react';
import API_URL from '../../configuration/Api';
import { toast } from 'react-toastify';
import Toast from '../toast/Toast';

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize handleChange to prevent unnecessary re-renders
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  // Validate form fields
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
      // Reset form
      setFormData({ name: '', description: '' });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setErrors({});
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add category';
      setErrors({ submit: errorMessage });
      console.error('Error adding category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex justify-center items-center">
      <Toast />
      <div className="w-full max-w-md bg-white p-6 shadow-lg border rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Add Category</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Category Name"
              name="name"
              className={`border p-2 w-full rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              onChange={handleChange}
              value={formData.name}
              disabled={isSubmitting}
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1">{errors.name}</span>
            )}
          </div>

          <div className="mb-4">
            <textarea
              placeholder="Enter Description"
              name="description"
              className={`border p-2 w-full rounded-md resize-y ${errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              rows={5}
              onChange={handleChange}
              value={formData.description}
              disabled={isSubmitting}
            />
            {errors.description && (
              <span className="text-red-500 text-xs mt-1">{errors.description}</span>
            )}
          </div>

          {errors.submit && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;