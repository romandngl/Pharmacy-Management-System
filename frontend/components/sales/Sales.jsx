import axios from 'axios';
import { CirclePlus, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../configuration/Api';
import Toast from '../toast/Toast';

const Sales = () => {
    const navigate = useNavigate();
    const [sales, setSales] = useState([])


    useEffect(() => {
        axios.get(API_URL + "/sales")
            .then((res) => {
                console.log(res?.data.sales)
                setSales(res?.data.sales)
            }).catch((err) => console.log(err))
    }, [])

    return (
        <div className='w-full min-h-screen bg-gray-100 p-6'>
             <Toast/>
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
            </div>
        </div>
    );
};

export default Sales;