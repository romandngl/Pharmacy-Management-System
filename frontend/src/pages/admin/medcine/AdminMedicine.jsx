import axios from 'axios'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import API_URL from '../../../../configuration/Api'
import { getDateString } from "../../../../utils/ModifyDate"

export const AdminMedicine = () => {
    const [medicine, setMedicine] = React.useState([])

    useEffect(() => {
        getAllMedicine().then(data => setMedicine(data)).catch((error) => console.log(error))
    }, [])

    async function getAllMedicine() {
        try {
            const res = await axios.get(API_URL + "/medicine");
            const data = res.data.medicines;
            return data;
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='w-full min-h-screen bg-gray-100'>
            <div className="p-6">
                {/* Cards Section */}
                <div className="w-full bg-blue-500 flex justify-center items-center gap-6 mb-8">
                    <div className="flex   gap-5 items-center  text-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold">Total Medicine</h3>
                        <p className="text-xl">150</p> {/* Replace with dynamic data */}
                    </div>
                </div>

                {/* Table Section */}
                <div>
                    <h3 className="flex px-5 justify-between items-center text-2xl font-semibold mb-4">
                        <div>Medicine List</div>
                        <div className='text-xl'><Link to={"/admin/medicine/add"}>Add</Link></div>
                    </h3>
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Expiry Date</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Stock Level</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Reorder Level</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicine.length > 0 ? (
                                    medicine.map((medicine, index) => (
                                        <tr key={medicine.id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-3 text-sm text-gray-700">{index + 1}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{medicine.name}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{medicine.category}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700"> {getDateString(medicine.expiryDate)}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{medicine.stockLevel}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{medicine.reorderLevel}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700 space-x-4">
                                                <button>Edit</button>
                                                <button>Delete</button>
                                            </td>



                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-3 text-sm text-gray-700 text-center">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
