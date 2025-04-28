import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../../../configuration/Api';
import { getDateString } from '../../../../utils/ModifyDate';
import Toast from '../../../../components/toast/Toast';
import { CircleCheck, CircleX, Calendar, Clock, User, Mail, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const fetchAppointments = async (page=1) => {
    try {
        const response = await axios.get(`${API_URL}/appointments?page=${page}`);
        console.log("Response", response)
        return response.data
    } catch (err) {
        setError('Failed to fetch appointments.');
    }
};
fetchAppointments();


const PharmacistAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [defaultPagination, setDefaultPagination] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    const navigate = useNavigate();

    console.log("Appointment ", appointments)

    useEffect(() => {
        setLoading(true);
        fetchAppointments(defaultPagination)
            .then((data) => {
                setAppointments(data?.appointments || []);
                setTotalPage(data?.totalPages || 1);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setError('Failed to fetch appointments.');
                setLoading(false);
            });
    }, [defaultPagination]); // <-- add defaultPagination here



    const handleViwe = async (id) => {
        navigate(`/pharmacist/appointments/view/${id}`)
    }

    const handleComplete = async (id) => {
        try {
            await axios.put(`${API_URL}/appointments/${id}/complete`);
            setAppointments(prev => prev.map(app =>
                app._id === id ? { ...app, status: 'completed' } : app
            ));
        } catch (error) {
            alert('Failed to complete appointment.');
        }
    };

    const handleCancel = async (id) => {
        try {
            await axios.put(`${API_URL}/appointments/${id}/cancel`);
            setAppointments(prev => prev.map(app =>
                app._id === id ? { ...app, status: 'canceled' } : app
            ));
        } catch (error) {
            alert('Failed to cancel appointment.');
        }
    };



    const getStatusStyles = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'scheduled':
                return 'bg-yellow-100 text-yellow-800';
            case 'canceled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    function getNextInventory() {
        if (defaultPagination < totalPage) {
            setDefaultPagination(prev => prev + 1);
        }
    }

    function getPrevInventory() {
        if (defaultPagination > 1) {
            setDefaultPagination(prev => prev - 1);
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <Toast />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-3xl font-bold text-gray-800">Appointments Dashboard</h3>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="p-6 text-center text-red-500">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">#</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <User size={16} /> Patient
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Mail size={16} /> Email
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} /> Date
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} /> Time
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Created</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.length > 0 ? (
                                        appointments.map((appointment, index) => (
                                            <tr
                                                key={appointment._id}
                                                className="border-b hover:bg-gray-50 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                    {appointment.patient.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {appointment.patient.email}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {getDateString(appointment.date)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {appointment.time}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusStyles(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {getDateString(appointment.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 flex gap-2">
                                                    <button
                                                        onClick={() => handleViwe(appointment._id)}
                                                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150"
                                                        title="Complete Appointment"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleComplete(appointment._id)}
                                                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-150"
                                                        title="Complete Appointment"
                                                    >
                                                        <CircleCheck size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(appointment._id)}
                                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-150"
                                                        title="Cancel Appointment"
                                                    >
                                                        <CircleX size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
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
                    {totalPage >= 1 && (
                        <div className="p-6 flex justify-between items-center border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                Page {defaultPagination} of {totalPage}
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={getPrevInventory}
                                    disabled={defaultPagination === 1}
                                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={getNextInventory}
                                    disabled={defaultPagination === totalPage}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PharmacistAppointments;