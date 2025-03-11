import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import InfoNavbar from '../../components/Navbar/InfoNav/InfoNavbar';

export const HomeLayout = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-extrabold text-white">Kushal Drug D</div>
          <ul className="flex space-x-8">
            <li className="px-2">
              <Link
                to="/"
                className="text-white font-semibold hover:text-indigo-100 transition duration-300 ease-in-out"
              >
                Home
              </Link>
            </li>
            <li className="px-2">
              <Link
                to="/about"
                className="text-white font-semibold hover:text-indigo-100 transition duration-300 ease-in-out"
              >
                About
              </Link>
            </li>
            <li className="px-2">
              <Link
                to="/contact"
                className="text-white font-semibold hover:text-indigo-100 transition duration-300 ease-in-out"
              >
                Contact
              </Link>
            </li>
            <li className="px-2">
              <Link
                to="/get-started"
                className="text-white font-semibold hover:text-indigo-100 transition duration-300 ease-in-out"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};