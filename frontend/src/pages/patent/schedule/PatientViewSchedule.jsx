import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../../../configuration/Api';
import { toast } from 'react-toastify';
import Toast from '../../../../components/toast/Toast';
import { Calendar, AlertCircle } from 'lucide-react';

export const PatientViewSchedule = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${API_URL}/appointments`);
                setAppointments(response.data.appointments || []);
            } catch (err) {
                setError('Failed to fetch appointments.');
                toast.error('Failed to fetch appointments.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <Toast />
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <Calendar className="text-blue-600" size={28} />
                    <h2 className="text-3xl font-bold text-gray-800">Your Appointments</h2>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 p-6">
                            <AlertCircle className="mx-auto mb-2 text-red-400" size={24} />
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Time</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Patient Name</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {appointments.length > 0 ? (
                                        appointments.map((appt) => (
                                            <tr
                                                key={appt._id}
                                                className="hover:bg-gray-50 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                    {new Date(appt.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{appt.time || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                                                    {appt.status || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {appt.patient?.name || 'N/A'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Calendar size={24} className="text-gray-400" />
                                                    <span>No appointments found</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};