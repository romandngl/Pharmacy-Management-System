import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../../../configuration/Api';
import { toast } from 'react-toastify';
import Toast from '../../../../components/toast/Toast';

export const AddMedicine = () => {
    
    const [data, setData] = useState({
        name: '',
        category: '',
        reorderLevel: '',
        price:''
    });

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axios.get(API_URL + '/categories')
            .then((res) => {
                setCategories(res.data.categories)
            }).catch((err) => console.log(err))
    }, [])

    const [error, setError] = useState({
        errorName: "",
        errorCategory: "",
        errorReorderLevel: "",
        errorPrice:"",
        errorServer: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
        setError({
            ...error,
            [name === "name" ? "errorName" : name === "category" ? "errorCategory" : "errorReorderLevel"]: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, category, reorderLevel } = data;

        let errors = {
            errorName: "",
            errorCategory: "",
            errorReorderLevel: "",
            errorServer: ""
        };

        if (name === "") {
            errors.errorName = "Name is required";
        }

        if (category === "") {
            errors.errorCategory = "Category is required";
        }

        if (reorderLevel === "") {
            errors.errorReorderLevel = "Reorder level is required";
        }

        if (errors.errorName || errors.errorCategory || errors.errorReorderLevel) {
            setError(errors);
            return;
        }

        setError(errors);
        try {
            const res = await axios.post(API_URL + '/medicine/add', data);
            const res_data = await res.data;
            toast.success(res_data.message);
            // navigate("/admin/medicine"); // Redirect to the list page after successful submission
            setData({
                name: '',
                category: '',
                reorderLevel: '',
                price:''
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
          
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="container min-h-screen w-auto bg-slate-100 rounded-xl p-6 flex flex-col items-center">
          <Toast/>
            <div className="mt-6 w-full max-w-md p-6 shadow-lg border rounded-lg">
                <h1 className="text-3xl font-bold">Add Medicine</h1>
                <p className="text-gray-600 mt-2">Fill out the form to add a new medicine to the inventory.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Medicine Name"
                        name="name"
                        className="border p-2 w-full mt-2 rounded-md"
                        onChange={handleChange}
                        value={data.name}
                    />
                    <span className="text-red-500 text-xs font-bold">{error.errorName}</span>

                    <select
                        name="category"
                        className="border p-2 w-full mt-2 rounded-md"
                        onChange={handleChange}
                        value={data.category}
                    >
                        <option disabled selected value="">Select Category</option>
                        {
                            categories.map((categorie, i) => (
                                <option value={categorie._id}>{categorie.name}</option>
                            ))
                        }
                    </select>
                    <span className="text-red-500 text-xs font-bold">{error.errorCategory}</span>

                    <input
                        type="number"
                        placeholder="Reorder Level"
                        name="reorderLevel"
                        className="border p-2 w-full mt-2 rounded-md"
                        onChange={handleChange}
                        min={0}
                        value={data.reorderLevel}
                    />
                    <span className="text-red-500 text-xs font-bold">{error.errorReorderLevel}</span>
                    <input
                        type="number"
                        placeholder="Price"
                        name="price"
                        className="border p-2 w-full mt-2 rounded-md"
                        onChange={handleChange}
                        min={0}
                        value={data.price}
                    />
                    <span className="text-red-500 text-xs font-bold">{error.errorPrice}</span>

                    <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded w-full hover:bg-blue-700">
                        Add Medicine
                    </button>
                </form>

                <div className="w-full flex-col items-center flex justify-center py-4">
                    <p>Want to go back? <Link to="/admin/medicine"> <span className="text-blue-500">Medicine List</span></Link></p>
                </div>
            </div>
        </div>
    );
};
