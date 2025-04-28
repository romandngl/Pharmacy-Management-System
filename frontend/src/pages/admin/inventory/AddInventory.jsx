import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../../../configuration/Api';
import { toast } from 'react-toastify';
import Toast from '../../../../components/toast/Toast';

export const AddInventory = () => {
    const navigate = useNavigate();
    const [medicineIds, setMedicineIds] = useState('');
    const [data, setData] = useState({
        medicineId: '',
        quantity: '',
        expiryDate: ''
    });

    const [error, setError] = useState({
        errorMedicineId: "",
        errorQuantity: "",
        errorExpiryDate: "",
        errorServer: ""
    });

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await axios.get(`${API_URL}/medicines`);
                setMedicineIds(response?.data.medicines);
            } catch (err) {
                setError('Failed to fetch medicines data.');
            }
        };
        fetchMedicines();
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
        setError({
            ...error,
            [name === "medicineId" ? "errorMedicineId" : name === "quantity" ? "errorQuantity" : "errorExpiryDate"]: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { medicineId, quantity, expiryDate } = data;

        let errors = {
            errorMedicineId: "",
            errorQuantity: "",
            errorExpiryDate: "",
            errorServer: ""
        };

        if (medicineId === "") {
            errors.errorMedicineId = "Medicine is required";
        }

        if (quantity === "") {
            errors.errorQuantity = "Quantity is required";
        }

        if (expiryDate === "") {
            errors.errorExpiryDate = "Expiry date is required";
        }

        if (errors.errorMedicineId || errors.errorQuantity || errors.errorExpiryDate) {
            setError(errors);
            return;
        }

        setError(errors);
        try {
            const res = await axios.post(API_URL + '/inventory', data);
            const res_data = await res.data;
            toast.success(res_data.message);
            // navigate("/admin/inventory"); // Redirect to the inventory list page after successful submission
            setData({
                medicineId: '',
                quantity: '',
                expiryDate: ''
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
            <Toast />
            <div className="mt-6 w-full max-w-md p-6 shadow-lg border rounded-lg">
                <h1 className="text-3xl font-bold">Add Inventory</h1>
                <p className="text-gray-600 mt-2">Fill out the form to add a new inventory item.</p>
                <form onSubmit={handleSubmit}>

                    {/* Medicine Dropdown */}
                    <label htmlFor="medicineId" className="block mt-4 font-medium">Medicine</label>
                    <select
                        id="medicineId"
                        name="medicineId"
                        onChange={handleChange}
                        className="border p-2 w-full mt-2 rounded-md"
                        value={data.medicineId}
                    >
                        <option value="">Select a medicine</option>
                        {medicineIds && medicineIds.map((medicine, index) => (
                            <option key={index} value={medicine._id}>{medicine.name}</option>
                        ))}
                    </select>
                    <span className="text-red-500 text-xs font-bold">{error.errorMedicineId}</span>

                    {/* Quantity Input */}
                    <label htmlFor="quantity" className="block mt-4 font-medium">Quantity</label>
                    <input
                        id="quantity"
                        type="number"
                        name="quantity"
                        className="border p-2 w-full mt-2 rounded-md"
                        onChange={handleChange}
                        value={data.quantity}
                        placeholder="Enter quantity"
                    />
                    <span className="text-red-500 text-xs font-bold">{error.errorQuantity}</span>

                    {/* Expiry Date Input */}
                    <label htmlFor="expiryDate" className="block mt-4 font-medium">Expiry Date</label>
                    <input
                        id="expiryDate"
                        type="date"
                        name="expiryDate"
                        className="border p-2 w-full mt-2 rounded-md"
                        onChange={handleChange}
                        value={data.expiryDate}
                    />
                    <span className="text-red-500 text-xs font-bold">{error.errorExpiryDate}</span>


                    <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded w-full hover:bg-blue-700">
                        Add Inventory
                    </button>
                </form>

                <div className="w-full flex-col items-center flex justify-center py-4">
                    <p>Want to go back? <Link to="/admin/inventory"> <span className="text-blue-500">Inventory List</span></Link></p>
                </div>
            </div>
        </div>
    );
};
