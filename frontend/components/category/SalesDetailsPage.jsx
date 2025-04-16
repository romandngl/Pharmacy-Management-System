import React from 'react';
import jsPDF from 'jspdf';  // Base jsPDF
import autoTable from 'jspdf-autotable';  // Explicit autoTable import

const SalesDetailsPage = () => {
  const salesData = {
    "_id": "67d2f3f98f9ff588c4250659",
    "medicine": {
      "_id": "67d2f34a8f9ff588c425064a",
      "name": "Aspirin"
    },
    "medicineName": "Aspirin",
    "category": "67d2f2e58f9ff588c4250642",
    "inventoryId": {
      "_id": "67d2f3b68f9ff588c4250650",
      "quantity": 190,
      "expiryDate": "2025-12-31T00:00:00.000Z"
    },
    "expiryDate": "2025-12-31T00:00:00.000Z",
    "quantitySold": 10,
    "totalPrice": 100,
    "saleDate": "2025-03-13T15:04:25.680Z",
    "createdAt": "2025-03-13T15:04:25.684Z",
    "updatedAt": "2025-03-13T15:04:25.684Z",
    "__v": 0
  };

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
        ['Medicine Name', salesData.medicineName],
        ['Quantity Sold', salesData.quantitySold],
        ['Total Price', `$${salesData.totalPrice}`],
        ['Sale Date', new Date(salesData.saleDate).toLocaleString()],
        ['Expiry Date', new Date(salesData.expiryDate).toLocaleDateString()],
        ['Remaining Stock', salesData.inventoryId.quantity],
        ['Sale ID', salesData._id],
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    doc.save(`sale-${salesData._id}.pdf`);
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
            <span className="block text-gray-800">{salesData.medicineName}</span>
          </div>

          <div className="border-b pb-2">
            <span className="text-gray-600 font-medium">Quantity Sold:</span>
            <span className="block text-gray-800">{salesData.quantitySold}</span>
          </div>

          <div className="border-b pb-2">
            <span className="text-gray-600 font-medium">Total Price:</span>
            <span className="block text-gray-800">${salesData.totalPrice}</span>
          </div>

          <div className="border-b pb-2">
            <span className="text-gray-600 font-medium">Sale Date:</span>
            <span className="block text-gray-800">
              {new Date(salesData.saleDate).toLocaleString()}
            </span>
          </div>

          <div className="border-b pb-2">
            <span className="text-gray-600 font-medium">Expiry Date:</span>
            <span className="block text-gray-800">
              {new Date(salesData.expiryDate).toLocaleDateString()}
            </span>
          </div>

          <div className="border-b pb-2">
            <span className="text-gray-600 font-medium">Remaining Stock:</span>
            <span className="block text-gray-800">{salesData.inventoryId.quantity}</span>
          </div>

          <div className="pt-2">
            <span className="text-gray-600 font-medium">Sale ID:</span>
            <span className="block text-gray-800 text-sm break-all">{salesData._id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDetailsPage;