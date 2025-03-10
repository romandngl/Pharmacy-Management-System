import React from 'react'

export const HomePage = () => {

  return (
    <div className="container mx-auto p-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold">Effortless Pharmacy Management</h1>
        <p className="text-gray-600 mt-2">Optimize inventory, track sales, and schedule appointments with ease.</p>
        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded">Get Started</button>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <div className="p-4 shadow-md border rounded">
            <h3 className="font-bold">Real-time Inventory Tracking</h3>
            <p className="text-gray-600">Stay updated on stock levels with automated alerts.</p>
          </div>
          <div className="p-4 shadow-md border rounded">
            <h3 className="font-bold">Sales & Billing</h3>
            <p className="text-gray-600">Generate invoices and track revenue seamlessly.</p>
          </div>
          <div className="p-4 shadow-md border rounded">
            <h3 className="font-bold">Appointment Scheduling</h3>
            <p className="text-gray-600">Allow customers to book and manage clinic visits easily.</p>
          </div>
        </div>
      </section>

      <section className="mt-10 text-center">
        <h2 className="text-2xl font-semibold">Why Choose Us?</h2>
        <p className="text-gray-600 mt-2">Trusted by pharmacy professionals for secure and efficient operations.</p>
      </section>
    </div>
  )
}
