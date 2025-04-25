import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useFetcher, useNavigate, useParams } from 'react-router-dom';
import API_URL from '../../../../configuration/Api';
import { toast } from 'react-toastify';
import Toast from '../../../../components/toast/Toast';

export const EditMedicine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentCategory, setCurrentCategory] = useState("")
    const [data, setData] = useState({
        name: '',
        reorderLevel: ''
    });

    const [categories, setCategories] = useState([])

    useEffect(() => {
        axios.get(API_URL + "/categories")
            .then((res) => {
                setCategories(res.data.categories)
                console.log(res.data.categories)
            }).catch((error) => console.log("Error when fetching categories", error))
    }, [])


    const [error, setError] = useState({
        errorName: "",
        errorCategory: "",
        errorReorderLevel: "",
        errorServer: ""
    });

    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                const res = await axios.get(`${API_URL}/medicine/${id}`);
                setData(res?.data.medicine);
                console.log(res?.data.medicine)
                setCurrentCategory(res?.data.medicine.category.name)
            } catch (error) {
                console.log(error);
                toast.success("Failed to fetch medicine details");
            }
        };
        fetchMedicine();
    }, [id]);

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

    const handleChangeCategory = (e) => {
        const { name, value } = e.target
        axios.put(API_URL + "/medicine/" + id + "/category", {
            "categoryId": value
        })
            .then((res) => {
                console.log(res)
                toast.success("Updated category for medicine")
            }).catch((err) => console.log(err))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, category, reorderLevel } = data;

        let errors = {
            errorName: "",
            errorCategory: "",
            errorReorderLevel: "",
            errorServer: ""
        };

        if (name === "") errors.errorName = "Name is required";
        if (category === "") errors.errorCategory = "Category is required";
        if (reorderLevel === "") errors.errorReorderLevel = "Reorder level is required";

        if (errors.errorName || errors.errorCategory || errors.errorReorderLevel) {
            setError(errors);
            return;
        }

        try {
            const res = await axios.put(`${API_URL}/medicine/${id}`, data);
            toast.success(res.data.message);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            // navigate("/admin/medicine");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="container min-h-screen w-auto bg-slate-100 rounded-xl p-6 flex flex-col items-center">
           <Toast/>
           <div className="mt-6 w-full max-w-md p-6 shadow-lg border rounded-lg">
                <h1 className="text-3xl font-bold">Edit Medicine</h1>
                <p className="text-gray-600 mt-2">Modify the medicine details.</p>

                {data?.name !== undefined ? ( // Render form only when data is loaded
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Medicine Name"
                            name="name"
                            className="border p-2 w-full mt-2 rounded-md"
                            onChange={handleChange}
                            value={data.name || ''}
                        />
                        <span className="text-red-500 text-xs font-bold">{error.errorName}</span>

                        <select

                            placeholder="Category"
                            name="category"
                            className="border p-2 w-full mt-2 rounded-md"
                            onChange={handleChangeCategory}
                        >
                            <option value={currentCategory}>{currentCategory}</option>
                            {
                                categories && categories.map((c, i) => (
                                    <option key={i} value={c._id}>{c.name}</option>
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
                            value={data.reorderLevel || ''}
                        />
                        <span className="text-red-500 text-xs font-bold">{error.errorReorderLevel}</span>

                        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded w-full hover:bg-blue-700">
                            Update Medicine
                        </button>
                    </form>
                ) : (
                    <p>Loading...</p> // Show loading message until data is available
                )}

                <div className="w-full flex-col items-center flex justify-center py-4">
                    <p>Want to go back? <Link to="/admin/medicine"> <span className="text-blue-500">Medicine List</span></Link></p>
                </div>
            </div>
        </div>
    );

};
