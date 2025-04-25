import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API_URL from '../../../../configuration/Api'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import Toast from '../../../../components/toast/Toast'

export const AdminMedicine = () => {
    const [medicine, setMedicine] = React.useState([])
    const [defaultPagination, setDefaultPagination] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const navigate = useNavigate();
    const [totalPage, setTotalPage] = useState(0)

    useEffect(() => {
        getAllMedicine(defaultPagination).then(data => setMedicine(data)).catch((error) => console.log(error))
    }, [])

    function getNextMedicine() {
        setDefaultPagination(defaultPagination + 1);
        getAllMedicine(defaultPagination + 1).then(data => setMedicine(data)).catch((error) => console.log(error))
    }

    function getPrevMedicine() {
        if (defaultPagination > 1) {
            setDefaultPagination(defaultPagination - 1);
            getAllMedicine(defaultPagination - 1).then(data => setMedicine(data)).catch((error) => console.log(error))
        } else {
            return
        }
        return
    }

    async function getAllMedicine(defaultPagination) {
        try {
            console.log(defaultPagination)
            const res = await axios.get(API_URL + `/medicine?page=${defaultPagination}`);
            const data = res.data.medicines;
            setTotalPage(res.data.totalPages)
            return data;
        } catch (error) {
            console.log(error)
        }
    }

    function handleDelete(id) {
        if (!id) {
            toast.error("Invalid ID")
        }
        const confirm = window.confirm("Are you sure you want to delete this medicine?")
        if (!confirm) {
            return;
        }
        axios.delete(API_URL + "/medicine/" + id)
            .then(res => {
                toast.success("Medicine deleted successfully")
                setMedicine(medicine.filter(med => med._id !== id))
            }).catch(err => {
                console.log(err)
            })
    }

    function handleEdit(id) {
        if (!id) {
            toast.error("Invalid ID")
            return
        }
        // Redirect to edit page
        navigate("/admin/medicine/edit/" + id)
    }

    return (
        <div className='w-full min-h-screen bg-gray-100'>
            <Toast />
            <div className="p-6">
                {/* Cards Section */}
                <div className="w-full bg-blue-500 flex justify-center items-center gap-6 mb-8">
                    <div className="flex   gap-5 items-center  text-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold">Total Medicine</h3>
                        <p className="text-xl">{medicine?.length ?? 'N/A'}</p> {/* Replace with dynamic data */}
                    </div>
                </div>

                {/* Table Section */}
                <div>
                    <h3 className="flex px-5 justify-between items-center text-2xl font-semibold mb-4">
                        <div>Medicine List</div>
                        <div className='text-xl'><Link to={"/admin/medicine/add"}><Plus /></Link></div>
                    </h3>
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Category</th>

                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Reorder Level</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicine.length > 0 ? (
                                    medicine.map((medicine, index) => (
                                        <tr key={medicine._id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-3 text-sm text-gray-700">{index + 1}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{medicine?.name ?? "N/A"}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{medicine?.category?.name ?? ""}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{medicine?.reorderLevel ?? "N/A"}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700 space-x-4">
                                                <button onClick={e => handleEdit(medicine?._id)}><Pencil size={20} /></button>
                                                <button onClick={e => handleDelete(medicine?._id)}><Trash2 /></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-3 text-sm text-gray-700 text-center">
                                            No medicine found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="relative w-full py-20 px-4">
                            <div className="absolute right-20 flex justify-center items-center gap-10 space-x-4">


                                <button onClick={e => getPrevMedicine()} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 shadow">
                                    Prev
                                </button>
                                {defaultPagination} of {totalPage}
                                <button onClick={e => (getNextMedicine())} disabled={defaultPagination == totalPage ? true : false} className=" px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow">
                                    Next
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
