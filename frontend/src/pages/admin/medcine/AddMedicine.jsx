import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../../../configuration/Api';

export const AddMedicine = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        category: '',
        reorderLevel: ''
    });

    const [error, setError] = useState({
        errorName: "",
        errorCategory: "",
        errorReorderLevel: "",
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
        console.log(data);
        try {
            const res = await axios.post(API_URL + '/medicine/add', data);
            const res_data = await res.data;
            console.log(res_data);
            alert(res_data.message);
            navigate("/admin/medicine-list"); // Redirect to the list page after successful submission
            setData({
                name: '',
                category: '',
                reorderLevel: ''
            });
        } catch (error) {
            console.log(error);
            alert(error.response.data.message);
        }
    };

    return (
        <div className="container min-h-screen w-auto bg-slate-100 rounded-xl p-6 flex flex-col items-center">
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

                    <input
                        type="text"
                        placeholder="Category"
                        name="category"
                        className="border p-2 w-full mt-2 rounded-md"
                        onChange={handleChange}
                        value={data.category}
                    />
                    <span className="text-red-500 text-xs font-bold">{error.errorCategory}</span>

                    <input
                        type="number"
                        placeholder="Reorder Level"
                        name="reorderLevel"
                        className="border p-2 w-full mt-2 rounded-md"
                        onChange={handleChange}
                        value={data.reorderLevel}
                    />
                    <span className="text-red-500 text-xs font-bold">{error.errorReorderLevel}</span>

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
