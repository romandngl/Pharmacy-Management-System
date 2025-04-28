import axios from 'axios';
import { CirclePlus, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configuration/Api';
import Toast from '../toast/Toast';

const Sales = () => {
    const navigate = useNavigate();
    const [sales, setSales] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    // alert(totalPagess)

    useEffect(() => {
        getAllSales(page)
            .then(data => {
                setSales(data?.sales)
                setTotalPages(data?.totalPages)
            })
            .catch((error) => console.log(error))
    }, [])

    async function getAllSales(page) {
        try {
            const res = await axios.get(API_URL + "/sales" + `?page=${page}`);
            const data = res?.data;
            return data;
        } catch (error) {
            console.log(error)
        }
    }

    function getPrevMedicine() {
        if (page > 1) {
            setDefaultPagination(page - 1);
            getAllSales(page - 1).then(data => setSales(data)).catch((error) => console.log(error))
        } else {
            return
        }
        return
    }

    function getNextMedicine() {
        setPage(page + 1);
        getAllSales(page + 1).then(data => setSales(data)).catch((error) => console.log(error))

    }

    return (
        <div className='w-full min-h-screen bg-gray-100 p-6'>
            <Toast />
            <div className='flex w-full justify-between px-5'>
                <h1 className='text-2xl font-semibold mb-4'>Total Sales</h1>
                <div>
                    <CirclePlus onClick={e => navigate("/admin/sales/add")} />
                </div>
            </div>
            <div className='overflow-x-auto bg-white shadow-md rounded-lg'>
                <table className='min-w-full table-auto'>
                    <thead className='bg-gray-100'>
                        <tr>
                            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-600'>#</th>
                            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-600'>Medicine Name</th>
                            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-600'>Quantity Sold</th>
                            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-600'>Total Price</th>
                            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-600'>Expiry Date</th>
                            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-600'>Sale Date</th>
                            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-600'>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length > 0 ? (
                            sales.map((sale, index) => (
                                <tr key={sale._id} className='border-b hover:bg-gray-50'>
                                    <td className='px-6 py-3 text-sm text-gray-700'>{index + 1}</td>
                                    <td className='px-6 py-3 text-sm text-gray-700'>{sale.medicineName}</td>
                                    <td className='px-6 py-3 text-sm text-gray-700'>{sale.quantitySold}</td>
                                    <td className='px-6 py-3 text-sm text-gray-700'>{sale.totalPrice}</td>
                                    <td className='px-6 py-3 text-sm text-gray-700'>{new Date(sale.expiryDate).toLocaleDateString()}</td>
                                    <td className='px-6 py-3 text-sm text-gray-700'>{new Date(sale.saleDate).toLocaleDateString()}</td>
                                    <td className='px-6 cursor-pointer py-3 text-sm text-gray-700'><Eye onClick={e => navigate(`/admin/sales/${sale?._id}`)} /></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan='6' className='px-6 py-3 text-sm text-gray-700 text-center'>
                                    No sales found
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
                        {page} of {totalPages}
                        <button onClick={e => (getNextMedicine())} disabled={page == totalPages ? true : false} className=" px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sales;