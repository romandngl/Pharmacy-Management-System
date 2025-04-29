import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import API_URL from '../../../../configuration/Api';
import { toast } from 'react-toastify';
import Toast from '../../../../components/toast/Toast';
import { Calendar, Clock } from 'lucide-react';

export const PatientSchedule = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = Cookies.get('token');

    useEffect(() => {
        const checkUser = async () => {
            if (token) {
                try {
                    const userData = await fetchUser(token);
                    setUser(userData?.user);
                } catch (err) {
                    toast.error('Failed to fetch user data.');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, [token]);

    const fetchUser = async (token) => {
        try {
            const res = await axios.get(`${API_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            toast.error('Error fetching user data.');
            Cookies.remove('token');
            return null;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setIsLoading(true);

        if (!user) {
            toast.error('Cannot schedule appointment without a patient ID.');
            setIsLoading(false);
            return;
        }

        if (!date || !time) {
            toast.error('Please select both a date and a time.');
            setIsLoading(false);
            return;
        }

        const appointmentData = {
            patient: user.userId,
            date: date,
            time: time,
        };

        try {
            const response = await axios.post(`${API_URL}/appointments`, appointmentData, {
                headers: { 'Content-Type': 'application/json' },
            });
            toast.success('Appointment scheduled successfully!');
            setDate('');
            setTime('');
            location.reload();
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to schedule appointment. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const timeOptions = [
        '9:00 AM',
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex justify-center items-center">
            <Toast />
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Calendar className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-800">Schedule New Appointment</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                ) : !user ? (
                    <div className="text-center text-red-500 p-4">
                        Error: Please log in to schedule an appointment.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-600 mb-1">
                                Select Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={getTodayDate()}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                                    disabled={isLoading}
                                />
                                <Calendar
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-600 mb-1">
                                Select Time
                            </label>
                            <div className="relative">
                                <select
                                    id="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 appearance-none"
                                    disabled={isLoading}
                                >
                                    <option value="">Select Time</option>
                                    {timeOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <Clock
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Available times: 9:00 AM - 12:00 AM
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors duration-200 ${
                                isLoading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                        >
                            {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};