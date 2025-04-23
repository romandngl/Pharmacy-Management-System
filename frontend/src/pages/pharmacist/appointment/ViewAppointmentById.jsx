import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../../../configuration/Api';
import { toast } from 'react-toastify';
import Toast from '../../../../components/toast/Toast';
import { Calendar, Clock, User, Mail, CheckCircle, AlertCircle } from 'lucide-react';

export const ViewAppointmentById = () => {
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointment = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/appointments/${id}`);
                setAppointment(response.data);
            } catch (err) {
                setError('Failed to fetch appointment details.');
                toast.error('Failed to fetch appointment details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAppointment();
        } else {
            setError('Invalid appointment ID.');
            toast.error('Invalid appointment ID.');
            setLoading(false);
        }
    }, [id]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex justify-center items-center">
            <Toast />
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Calendar className="text-blue-600" size={28} />
                    <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 p-6">
                        <AlertCircle className="mx-auto mb-2 text-red-400" size={24} />
                        <p>{error}</p>
                    </div>
                ) : appointment ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <User className="text-blue-600" size={24} />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Patient Name</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {appointment.patient?.name || 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Mail className="text-blue-600" size={24} />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Email</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {appointment.patient?.email || 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Calendar className="text-blue-600" size={24} />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Date</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {appointment.date
                                        ? new Date(appointment.date).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'short',
                                              day: 'numeric',
                                          })
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Clock className="text-blue-600" size={24} />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Time</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {appointment.time || 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <CheckCircle className="text-blue-600" size={24} />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Status</p>
                                <p className="text-lg font-semibold text-gray-800 capitalize">
                                    {appointment.status || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 p-6">
                        <AlertCircle className="mx-auto mb-2 text-gray-400" size={24} />
                        <p>No appointment data available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};