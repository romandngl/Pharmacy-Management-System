import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../configuration/Api';
import { toast } from 'react-toastify';
import Toast from '../toast/Toast';
import { Pill, ArrowLeft, X } from 'lucide-react';

export const SalesAdd = () => {
  const navigate = useNavigate();
  const [sale, setSale] = useState({ medicineId: '', inventoryId: '', quantitySold: '' });
  const [medicines, setMedicines] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [medicinesRes, inventoriesRes] = await Promise.all([
          axios.get(`${API_URL}/medicines`),
          axios.get(`${API_URL}/inventory/report`),
        ]);
        setMedicines(medicinesRes.data.medicines || []);
        setInventories(inventoriesRes.data.inventory || []);
      } catch (err) {
        setError('Failed to fetch data.');
        toast.error('Failed to fetch medicines or inventory data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSale((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'medicineId' ? { inventoryId: '' } : {}), // Reset inventoryId when medicine changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sale.medicineId || !sale.inventoryId || !sale.quantitySold || sale.quantitySold <= 0) {
      toast.error('Please fill in all fields with a valid quantity.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedSale = {
        medicineId: sale.medicineId,
        inventoryId: sale.inventoryId,
        quantitySold: parseInt(sale.quantitySold, 10),
      };

      const res = await axios.post(`${API_URL}/sales/add`, { sales: [formattedSale] });
      toast.success(res.data.message);
      setSale({ medicineId: '', inventoryId: '', quantitySold: '' });
      setTimeout(() => {
        navigate('/admin/sales');
      }, 1500);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add sale.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex justify-center items-center">
      <Toast />
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Pill className="text-blue-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Add Sale</h1>
        </div>
        <p className="text-gray-600 mb-6">Fill out the form to record a new sale.</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="medicineId" className="block text-sm font-medium text-gray-600 mb-1">
                  Medicine
                </label>
                <select
                  id="medicineId"
                  name="medicineId"
                  onChange={handleChange}
                  value={sale.medicineId}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Medicine</option>
                  {medicines.map((medicine) => (
                    <option key={medicine._id} value={medicine._id}>
                      {medicine.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="inventoryId" className="block text-sm font-medium text-gray-600 mb-1">
                  Inventory
                </label>
                <select
                  id="inventoryId"
                  name="inventoryId"
                  onChange={handleChange}
                  value={sale.inventoryId}
                  disabled={isSubmitting || !sale.medicineId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Inventory</option>
                  {inventories
                    .filter((inventory) => inventory.medicine._id === sale.medicineId)
                    .map((inventory) => (
                      <option key={inventory._id} value={inventory._id}>
                        Expiry: {new Date(inventory.expiryDate).toISOString().split('T')[0]} (Qty: {inventory.quantity})
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="quantitySold" className="block text-sm font-medium text-gray-600 mb-1">
                  Quantity Sold
                </label>
                <input
                  id="quantitySold"
                  type="number"
                  name="quantitySold"
                  placeholder="Enter quantity sold"
                  onChange={handleChange}
                  value={sale.quantitySold}
                  min="1"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-6 rounded-lg text-white font-medium transition-colors duration-200 ${isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Sale'}
              </button>
            </form>


          </>
        )}
      </div>
    </div>
  );
};

export default SalesAdd;