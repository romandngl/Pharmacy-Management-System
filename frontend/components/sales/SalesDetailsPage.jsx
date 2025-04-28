import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';  // Base jsPDF
import autoTable from 'jspdf-autotable';  // Explicit autoTable import
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../configuration/Api';

const SalesDetailsPage = () => {
  const param = useParams();
  const id = param?.id

  const [sale, setSale] = useState();
  useEffect(() => {
    axios.get(API_URL + "/sales/" + id)
      .then((res) => {
        setSale(res?.data.sale)
      }).catch((err) => console.log(err))
  }, [])

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Sale Details', 14, 20);

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Use autoTable as a standalone function, passing doc as first argument
    autoTable(doc, {
      startY: 40,
      head: [['Field', 'Value']],
      body: [
        ['Medicine Name', sale?.medicineName],
        ['Category',sale?.category],
        ['Quantity Sold', sale?.quantitySold],
        ['Total Price', `RS ${sale?.totalPrice}`],
        ['Sale Date', new Date(sale?.saleDate).toLocaleString()],
        ['Expiry Date', new Date(sale?.expiryDate).toLocaleDateString()],
        ['Remaining Stock', sale?.inventoryId.quantity],
        ['Sale ID', sale?._id],
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    doc.save(`sale-${sale?._id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sale Details</h2>
          <button
            onClick={downloadPDF}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Download PDF
          </button>
        </div>

        <div className="space-y-4">
          <div className="border-b pb-2">
            <span className="text-gray-600 font-medium">Medicine Name:</span>
            <span className="block text-gray-800">{sale?.medicineName ?? "N/A"}</span>
          </div>

          <div className="border-b pb-2">
            <span className="text-gray-600 font-medium">Category Name:</span>
            <span className="block text-gray-800">{sale?.category ?? "N/A"}</span>
          </div>

          <div className="border-b pb-2">
            <span className="text-gray-600 font-medium">Quantity Sold:</span>
            <span className="block text-gray-800">{sale?.quantitySold ?? "N/A"}</span>
          </div>

          <div className="border-b pb-2">
            <span className="text-gray-600 font-medium">Total Price:</span>
            <span className="block text-gray-800">Rs{sale?.totalPrice ?? "N/A"}</span>
          </div>

          <div className="border-b pb-2">
            <span className="text-gray-600 font-medium">Sale Date:</span>
            <span className="block text-gray-800">
              {new Date(sale?.saleDate).toLocaleString() ?? "N/A"}
            </span>
          </div>

          <div className="border-b pb-2">
            <span className="text-gray-600 font-medium">Expiry Date:</span>
            <span className="block text-gray-800">
              {new Date(sale?.expiryDate).toLocaleDateString() ?? "N/A"}
            </span>
          </div>

          <div className="border-b pb-2">
            <span className="text-gray-600 font-medium">Remaining Stock:</span>
            <span className="block text-gray-800">{sale?.inventoryId?.quantity ?? "N/A"}</span>
          </div>

          <div className="pt-2">
            <span className="text-gray-600 font-medium">Sale ID:</span>
            <span className="block text-gray-800 text-sm break-all">{sale?._id ?? "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDetailsPage;