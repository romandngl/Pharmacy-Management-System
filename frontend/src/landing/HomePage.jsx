import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="container mx-auto p-6">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl shadow-lg">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Welcome to Kushal Drug D</h1>
        <p className="text-gray-700 mt-4 text-xl max-w-2xl mx-auto leading-relaxed">
          Your trusted pharmacy in Kathmandu, delivering top-quality medicines and exceptional healthcare services.
        </p>
        <button className="mt-8 bg-indigo-700 text-white px-10 py-3 rounded-full hover:bg-indigo-800 transition-all duration-300 text-lg font-semibold">
          <Link to="/get-started">Book Appointment</Link>
        </button>
      </section>

      {/* Aim Section - Enhanced Design */}
      <section className="mt-16 relative">
        <div className="bg-blue-600 text-white p-8 rounded-lg shadow-md max-w-4xl mx-auto transform -rotate-1">
          <h2 className="text-3xl font-bold text-center">Our Commitment</h2>
          <p className="mt-4 text-lg leading-relaxed text-center">
            At Kushal Drug D, we are dedicated to providing reliable, high-quality medicines and personalized care to ensure your health and well-being.
          </p>
        </div>
        <div className="absolute inset-0 bg-blue-200 rounded-lg -z-10 transform rotate-1"></div>
      </section>

      {/* Key Features Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-semibold text-center text-gray-800">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition transform hover:-translate-y-1">
            <h3 className="font-bold text-xl text-indigo-600">Quality Medicines</h3>
            <p className="text-gray-600 mt-2">
              Access a wide range of authentic, carefully sourced medications for all your needs.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition transform hover:-translate-y-1">
            <h3 className="font-bold text-xl text-indigo-600">Expert Consultations</h3>
            <p className="text-gray-600 mt-2">
              Receive professional advice from our skilled pharmacists to support your health.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition transform hover:-translate-y-1">
            <h3 className="font-bold text-xl text-indigo-600">Convenient Appointments</h3>
            <p className="text-gray-600 mt-2">
              Book clinic visits easily with flexible scheduling and timely reminders.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Enhanced Design */}
      <section className="mt-16 text-center py-12 bg-gradient-to-l from-indigo-50 to-blue-50 rounded-xl">
        <h2 className="text-4xl font-bold text-gray-800 relative inline-block">
          Why Choose Kushal Drug D?
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-indigo-600 rounded"></span>
        </h2>
        <p className="text-gray-600 mt-6 max-w-3xl mx-auto text-lg leading-relaxed">
          We pride ourselves on offering dependable service, premium medicines, and a caring approach, making us your go-to pharmacy in Kathmandu.
        </p>
      </section>

      {/* Conclusion Section - Enhanced Design */}
      <section className="mt-16 bg-indigo-700 text-white p-10 rounded-xl text-center relative overflow-hidden">
        <h2 className="text-3xl font-semibold">Your Health, Our Priority</h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg leading-relaxed">
          Kushal Drug D is here to serve you with excellence, ensuring access to the best healthcare solutions and a seamless pharmacy experience.
        </p>
        <div className="absolute inset-0 bg-indigo-900 opacity-20 rounded-xl -z-10"></div>
      </section>
    </div>
  );
};