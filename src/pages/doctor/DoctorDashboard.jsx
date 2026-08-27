import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Video, MessageSquare, IndianRupee, FileText, CheckCircle, XCircle } from 'lucide-react';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/appointments/doctor', {
        withCredentials: true
      });
      setAppointments(data);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5001/api/appointments/${id}/status`, { status }, {
        withCredentials: true
      });
      fetchAppointments();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-32 bg-slate-200 rounded-2xl"></div>
          <div className="h-32 bg-slate-200 rounded-2xl"></div>
          <div className="h-32 bg-slate-200 rounded-2xl"></div>
          <div className="h-32 bg-slate-200 rounded-2xl"></div>
        </div>
        <div className="h-96 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  // Calculate metrics
  const today = new Date().toLocaleDateString();
  const todaysAppointments = appointments.filter(a => new Date(a.date).toLocaleDateString() === today);
  const pendingRequests = appointments.filter(a => a.status === 'BOOKED' || a.status === 'PENDING_PAYMENT');
  const completedCount = appointments.filter(a => a.status === 'COMPLETED').length;
  // Dummy earnings calc for now (assume 500 per completed)
  const earnings = completedCount * 500;

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Doctor Workspace</h1>
            <p className="text-slate-500 mt-1">Manage your schedule and consultations.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/doctor/availability" className="btn-secondary">
              <CalendarIcon className="w-5 h-5 mr-2 text-slate-400" />
              Manage Availability
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-8 border border-red-100">{error}</div>}

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><CalendarIcon className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Today's Schedule</p>
              <h3 className="text-2xl font-bold text-slate-900">{todaysAppointments.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><Clock className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Requests</p>
              <h3 className="text-2xl font-bold text-slate-900">{pendingRequests.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <h3 className="text-2xl font-bold text-slate-900">{completedCount}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-xl"><IndianRupee className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Earnings</p>
              <h3 className="text-2xl font-bold text-slate-900">₹{earnings}</h3>
            </div>
          </div>
        </div>

        {/* Appointment Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">All Appointments</h2>
          </div>
          
          {appointments.length === 0 ? (
            <div className="p-12 text-center">
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-900">No appointments yet</h3>
              <p className="text-slate-500 mt-2">When patients book you, they will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {appointments.map(apt => (
                <div key={apt._id} className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between hover:bg-slate-50/50 transition-colors">
                  
                  {/* Info */}
                  <div className="flex items-start space-x-4 mb-4 lg:mb-0 w-full lg:w-auto">
                    <div className="mt-1">
                      {apt.consultationType === 'Video' ? 
                        <div className="bg-blue-100 p-2 rounded-full"><Video className="w-5 h-5 text-blue-600" /></div> : 
                        <div className="bg-purple-100 p-2 rounded-full"><MessageSquare className="w-5 h-5 text-purple-600" /></div>
                      }
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">
                        {apt.patient?.profile?.fullName || apt.patient?.email || 'Patient'}
                      </h3>
                      <div className="text-sm text-slate-500 flex flex-wrap gap-x-4 gap-y-1 mt-1 font-medium">
                        <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1" /> {new Date(apt.date).toLocaleDateString()}</span>
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {apt.timeSlot}</span>
                      </div>
                      
                      <div className="mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                          ${(apt.status === 'BOOKED' || apt.status === 'PENDING_PAYMENT') ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${(apt.status === 'ACCEPTED' || apt.status === 'IN_PROGRESS') ? 'bg-blue-100 text-blue-800' : ''}
                          ${apt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                          ${(apt.status === 'REJECTED' || apt.status === 'CANCELLED') ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    {(apt.status === 'BOOKED' || apt.status === 'PENDING_PAYMENT') && (
                      <>
                        <button onClick={() => updateStatus(apt._id, 'ACCEPTED')} className="btn-primary flex-1 lg:flex-none">
                          <CheckCircle className="w-4 h-4 mr-2" /> Accept
                        </button>
                        <button onClick={() => updateStatus(apt._id, 'REJECTED')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium flex items-center justify-center flex-1 lg:flex-none">
                          <XCircle className="w-4 h-4 mr-2 text-slate-400" /> Reject
                        </button>
                      </>
                    )}
                    
                    {apt.status === 'ACCEPTED' && (
                      <>
                        {apt.consultationType === 'Video' ? (
                          <Link to={`/consultation/video/${apt._id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center flex-1 lg:flex-none justify-center">
                            <Video className="w-4 h-4 mr-2" /> Join Video
                          </Link>
                        ) : (
                          <Link to={`/consultation/chat/${apt._id}`} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center flex-1 lg:flex-none justify-center">
                            <MessageSquare className="w-4 h-4 mr-2" /> Open Chat
                          </Link>
                        )}
                        <Link to={`/doctor/prescription/${apt._id}`} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center flex-1 lg:flex-none justify-center">
                          <FileText className="w-4 h-4 mr-2" /> Prescribe & Complete
                        </Link>
                      </>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
