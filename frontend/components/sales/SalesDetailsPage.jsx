import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../configuration/Api';
import { toast } from 'react-toastify';
import Toast from '../toast/Toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, ArrowLeft, Pill } from 'lucide-react';

const SalesDetailsPage = () => {
    const { id } = useParams();
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSale = async () => {
            try {
                const res = await axios.get(`${API_URL}/sales/${id}`);
                setSale(res?.data.sale);
            } catch (err) {
                setError('Failed to fetch sale details.');
                toast.error('Failed to fetch sale details.');
            } finally {
                setLoading(false);
            }
        };
        fetchSale();
    }, [id]);

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Sale Details', 14, 20);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.setFontSize(10);
        doc.text(`Sale ID: ${sale?._id || 'N/A'}`, 14, 38);

        autoTable(doc, {
            startY: 46,
            head: [['Field', 'Value']],
            body: [
                ['Medicine Name', sale?.medicineName || 'N/A'],
                ['Category', sale?.category || 'N/A'],
                ['Quantity Sold', sale?.quantitySold || 'N/A'],
                ['Total Price', `Rs ${sale?.totalPrice || 'N/A'}`],
                ['Sale Date', sale?.saleDate ? new Date(sale.saleDate).toLocaleString() : 'N/A'],
                ['Expiry Date', sale?.expiryDate ? new Date(sale.expiryDate).toLocaleDateString() : 'N/A'],
                ['Remaining Stock', sale?.inventoryId?.quantity || 'N/A'],
            ],
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { top: 46 },
        });

        doc.save(`sale-${sale?._id || 'details'}.pdf`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex justify-center items-center">
            <Toast />
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Pill className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-800">Sale Details</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 p-4">{error}</div>
                ) : (
                    <>
                        <div className="space-y-4">
                            <div className="border-b pb-3">
                                <span className="text-gray-600 font-medium">Medicine Name:</span>
                                <span className="block text-gray-800 font-semibold">{sale?.medicineName || 'N/A'}</span>
                            </div>
                            <div className="border-b pb-3">
                                <span className="text-gray-600 font-medium">Category:</span>
                                <span className="block text-gray-800 font-semibold">{sale?.category || 'N/A'}</span>
                            </div>
                            <div className="border-b pb-3">
                                <span className="text-gray-600 font-medium">Quantity Sold:</span>
                                <span className="block text-gray-800 font-semibold">{sale?.quantitySold || 'N/A'}</span>
                            </div>
                            <div className="border-b pb-3">
                                <span className="text-gray-600 font-medium">Total Price:</span>
                                <span className="block text-gray-800 font-semibold">Rs {sale?.totalPrice || 'N/A'}</span>
                            </div>
                            <div className="border-b pb-3">
                                <span className="text-gray-600 font-medium">Sale Date:</span>
                                <span className="block text-gray-800 font-semibold">
                                    {sale?.saleDate ? new Date(sale.saleDate).toLocaleString() : 'N/A'}
                                </span>
                            </div>
                            <div className="border-b pb-3">
                                <span className="text-gray-600 font-medium">Expiry Date:</span>
                                <span className="block text-gray-800 font-semibold">
                                    {sale?.expiryDate ? new Date(sale.expiryDate).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            <div className="border-b pb-3">
                                <span className="text-gray-600 font-medium">Remaining Stock:</span>
                                <span className="block text-gray-800 font-semibold">{sale?.inventoryId?.quantity || 'N/A'}</span>
                            </div>
                            <div className="pt-3">
                                <span className="text-gray-600 font-medium">Sale ID:</span>
                                <span className="block text-gray-800 font-semibold text-sm break-all">{sale?._id || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-between items-center gap-4">
                            <Link
                                to="/admin/sales" // Adjust the route as needed
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                                <ArrowLeft size={18} />
                                Back to Sales
                            </Link>
                            <button
                                onClick={downloadPDF}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                                <Download size={18} />
                                Download PDF
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SalesDetailsPage;