import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../configuration/Api';
import { toast } from 'react-toastify';

export const SalesAdd = () => {
  const navigate = useNavigate();
  
  const [sales, setSales] = useState([
    { medicineId: '', inventoryId: '', quantitySold: '' }
  ]);
  
  const [medicines, setMedicines] = useState([]);
  const [inventories, setInventories] = useState([]);
  
  useEffect(() => {
    axios.get(`${API_URL}/medicine`)
      .then((res) => setMedicines(res.data.medicines || []))
      .catch((err) => console.log(err));

    axios.get(`${API_URL}/inventory/report`)
      .then((res) => setInventories(res.data.inventory || []))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSales = [...sales];
    updatedSales[index][name] = value;
    setSales(updatedSales);
  };

  const addSaleForm = () => {
    setSales([...sales, { medicineId: '', inventoryId: '', quantitySold: '' }]);
  };

  const removeSaleForm = (index) => {
    const updatedSales = sales.filter((_, i) => i !== index);
    setSales(updatedSales);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sales.some(sale => !sale.medicineId || !sale.inventoryId || !sale.quantitySold)) {
      toast.error('Please fill in all fields before submitting.');
      return;
    }
    try {
      const formattedSales = sales.map(sale => ({
        medicineId: sale.medicineId,
        inventoryId: sale.inventoryId,
        quantitySold: parseInt(sale.quantitySold, 10) 
      }));

      const res = await axios.post(`${API_URL}/sales/add`, { sales: formattedSales });
      toast.success(res.data.message);
      setSales([{ medicineId: '', inventoryId: '', quantitySold: '' }]);
      navigate("/admin/sales");
    } catch (error) {
      console.error('Error submitting sales:', error);
      toast.error(error?.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="container min-h-screen w-auto bg-slate-100 rounded-xl p-6 flex flex-col items-center">
      <div className="mt-6 w-full max-w-md p-6 shadow-lg border rounded-lg bg-white">
        <h1 className="text-3xl font-bold text-gray-800">Add Sale</h1>
        <p className="text-gray-600 mt-2 mb-6">Fill out the form to record new sales.</p>
        
        <form onSubmit={handleSubmit}>
          {sales.map((sale, index) => (
            <div key={index} className="mb-4 border p-4 rounded-lg relative">
              <select name="medicineId" className="border p-2 w-full rounded-md" onChange={(e) => handleChange(index, e)} value={sale.medicineId}>
                <option disabled value="">Select Medicine</option>
                {medicines.map((medicine) => (
                  <option key={medicine._id} value={medicine._id}>{medicine.name}</option>
                ))}
              </select>
              
              <select name="inventoryId" className="border p-2 w-full rounded-md mt-2" onChange={(e) => handleChange(index, e)} value={sale.inventoryId}>
                <option disabled value="">Select Inventory</option>
                {inventories.filter(inventory => inventory.medicine._id === sale.medicineId).map((inventory) => (
                  <option key={inventory._id} value={inventory._id}>
                    {inventory._id} (Qty: {inventory.quantity})
                  </option>
                ))}
              </select>
              
              <input type="number" placeholder="Quantity Sold" name="quantitySold" className="border p-2 w-full rounded-md mt-2" onChange={(e) => handleChange(index, e)} min={1} value={sale.quantitySold} />
              
              {sales.length > 1 && (
                <button type="button" onClick={() => removeSaleForm(index)} className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs hover:bg-red-700">X</button>
              )}
            </div>
          ))}

          <button type="button" onClick={addSaleForm} className="mt-2 bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition-colors duration-300">
            + Add Another Sale
          </button>

          <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded w-full hover:bg-blue-700 transition-colors duration-300">
            Submit Sales
          </button>
        </form>

        <div className="w-full flex flex-col items-center justify-center py-4">
          <p>Want to go back? 
            <Link to="/admin/sales"> <span className="text-blue-500"> Sales List</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesAdd;