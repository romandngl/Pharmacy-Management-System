import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../configuration/Api';


export const SalesAdd = () => {
  const navigate = useNavigate();
  
  const [data, setData] = useState({
    medicineId: '',
    inventoryId: '',
    quantitySold: ''
  });

  const [medicines, setMedicines] = useState([]);
  const [inventories, setInventories] = useState([]);
  
  useEffect(() => {
    // Fetch medicines
    axios.get(`${API_URL}/medicine`)
      .then((res) => {
        setMedicines(res.data.medicines || []);
      })
      .catch((err) => console.log(err));

    // Fetch inventories
    axios.get(`${API_URL}/inventory`)
      .then((res) => {
        setInventories(res.data.inventories || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const [error, setError] = useState({
    errorMedicineId: '',
    errorInventoryId: '',
    errorQuantitySold: '',
    errorServer: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
    setError({
      ...error,
      [name === 'medicineId' ? 'errorMedicineId' : 
       name === 'inventoryId' ? 'errorInventoryId' : 
       'errorQuantitySold']: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { medicineId, inventoryId, quantitySold } = data;

    let errors = {
      errorMedicineId: '',
      errorInventoryId: '',
      errorQuantitySold: '',
      errorServer: ''
    };

    if (!medicineId) {
      errors.errorMedicineId = 'Medicine is required';
    }

    if (!inventoryId) {
      errors.errorInventoryId = 'Inventory is required';
    }

    if (!quantitySold) {
      errors.errorQuantitySold = 'Quantity sold is required';
    } else if (parseInt(quantitySold) <= 0) {
      errors.errorQuantitySold = 'Quantity must be greater than 0';
    }

    if (errors.errorMedicineId || errors.errorInventoryId || errors.errorQuantitySold) {
      setError(errors);
      return;
    }

    setError(errors);
    try {
      const res = await axios.post(`${API_URL}/sales/add`, data); // Adjust endpoint as needed
      const res_data = await res.data;
      alert(res_data.message);
      setData({
        medicineId: '',
        inventoryId: '',
        quantitySold: ''
      });
      // Optionally navigate to sales list page
      // navigate('/admin/sales');
    } catch (error) {
      console.log(error);
      setError({
        ...errors,
        errorServer: error.response?.data?.message || 'Server error occurred'
      });
    }
  };

  return (
    <div className="container min-h-screen w-auto bg-slate-100 rounded-xl p-6 flex flex-col items-center">
      <div className="mt-6 w-full max-w-md p-6 shadow-lg border rounded-lg bg-white">
        <h1 className="text-3xl font-bold text-gray-800">Add Sale</h1>
        <p className="text-gray-600 mt-2 mb-6">Fill out the form to record a new sale.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <select
              name="medicineId"
              className="border p-2 w-full rounded-md"
              onChange={handleChange}
              value={data.medicineId}
            >
              <option disabled value="">Select Medicine</option>
              {medicines.map((medicine) => (
                <option key={medicine._id} value={medicine._id}>
                  {medicine.name}
                </option>
              ))}
            </select>
            <span className="text-red-500 text-xs font-bold">{error.errorMedicineId}</span>
          </div>

          <div className="mb-4">
            <select
              name="inventoryId"
              className="border p-2 w-full rounded-md"
              onChange={handleChange}
              value={data.inventoryId}
            >
              <option disabled value="">Select Inventory</option>
              {inventories.map((inventory) => (
                <option key={inventory._id} value={inventory._id}>
                  {inventory._id} (Qty: {inventory.quantity})
                </option>
              ))}
            </select>
            <span className="text-red-500 text-xs font-bold">{error.errorInventoryId}</span>
          </div>

          <div className="mb-4">
            <input
              type="number"
              placeholder="Quantity Sold"
              name="quantitySold"
              className="border p-2 w-full rounded-md"
              onChange={handleChange}
              min={1}
              value={data.quantitySold}
            />
            <span className="text-red-500 text-xs font-bold">{error.errorQuantitySold}</span>
          </div>

          {error.errorServer && (
            <div className="mb-4 text-red-500 text-sm">{error.errorServer}</div>
          )}

          <button 
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded w-full hover:bg-blue-700 transition-colors duration-300"
          >
            Add Sale
          </button>
        </form>

        <div className="w-full flex flex-col items-center justify-center py-4">
          <p>Want to go back? 
            <Link to="/admin/sales"> 
              <span className="text-blue-500"> Sales List</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesAdd;