import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, MessageSquare, Activity, CheckCircle, XCircle, ChevronRight, FileText, Download } from 'lucide-react';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/appointments/my`, {
        withCredentials: true
      });
      setAppointments(data);
    } catch (err) {
      setError('Failed to load your appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/appointments/${id}/status`, { status: 'CANCELLED' }, {
        withCredentials: true
      });
      fetchAppointments();
    } catch (err) {
      alert('Failed to cancel appointment');
    }
  };

  // Helper to render tracking progress bar
  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewAppt, setReviewAppt] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleOpenReview = (apt) => {
    setReviewAppt(apt);
    setRating(5);
    setComment('');
    setReviewModalOpen(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/reviews`, {
        appointmentId: reviewAppt._id,
        rating,
        comment
      }, { withCredentials: true });
      alert('Review submitted successfully!');
      setReviewModalOpen(false);
      // Ideally, mark it as reviewed in the UI so they don't review again
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const renderProgressBar = (status) => {
    const states = ['BOOKED', 'ACCEPTED', 'COMPLETED'];
    let currentIndex = 0;
    if (status === 'ACCEPTED' || status === 'IN_PROGRESS') currentIndex = 1;
    if (status === 'COMPLETED') currentIndex = 2;
    if (status === 'REJECTED' || status === 'CANCELLED') currentIndex = -1;

    if (currentIndex === -1) {
      return (
        <div className="flex items-center space-x-2 text-red-600 mt-4">
          <XCircle className="w-5 h-5" />
          <span className="font-medium text-sm">Appointment {status.toLowerCase()}</span>
        </div>
      );
    }

    return (
      <div className="mt-6">
        <div className="relative">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-100">
            <div style={{ width: `${(currentIndex / (states.length - 1)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-500"></div>
          </div>
          <div className="flex justify-between text-xs font-medium text-slate-400 px-1">
            <span className={currentIndex >= 0 ? "text-primary-600 font-bold" : ""}>Requested</span>
            <span className={currentIndex >= 1 ? "text-primary-600 font-bold" : ""}>Approved</span>
            <span className={currentIndex >= 2 ? "text-success font-bold" : ""}>Completed</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded w-1/4"></div>
        <div className="h-48 bg-slate-200 rounded-2xl"></div>
        <div className="h-48 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  const upcoming = appointments.filter(a => a.status === 'BOOKED' || a.status === 'ACCEPTED' || a.status === 'PENDING_PAYMENT');
  const past = appointments.filter(a => a.status === 'COMPLETED' || a.status === 'REJECTED' || a.status === 'CANCELLED');

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Health Hub</h1>
            <p className="text-slate-500 mt-1">Track appointments and access your prescriptions.</p>
          </div>
          <Link to="/doctors" className="mt-4 sm:mt-0 btn-primary shadow-sm hover:shadow-md">
            Find a Doctor
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-8">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Feed: Active Appointments */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary-600" /> Active Tracking
            </h2>

            {upcoming.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No active appointments</h3>
                <p className="text-slate-500 mt-2">Book a consultation to track your progress here.</p>
              </div>
            ) : (
              upcoming.map(apt => (
                <div key={apt._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg flex-shrink-0">
                          {apt.doctor?.profile?.fullName?.charAt(0) || 'D'}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{apt.doctor?.profile?.fullName || 'Dr. ' + apt.doctor?.email}</h3>
                          <p className="text-sm text-slate-500">{apt.doctor?.profile?.specialization || 'General Physician'}</p>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-right">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</div>
                        <div className="text-sm font-bold text-slate-800 mt-0.5">{new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}</div>
                      </div>
                    </div>

                    {renderProgressBar(apt.status)}
                  </div>
                  
                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-center text-sm font-medium text-slate-600">
                      {apt.consultationType === 'Video' ? <Video className="w-4 h-4 mr-2 text-blue-500" /> : <MessageSquare className="w-4 h-4 mr-2 text-purple-500" />}
                      {apt.consultationType} Consultation
                    </div>
                    
                    <div className="flex space-x-3">
                      {apt.status === 'ACCEPTED' && (
                        <Link to={`/consultation/${apt.consultationType === 'Video' ? 'video' : 'chat'}/${apt._id}`} className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                          {apt.consultationType === 'Video' ? 'Join Call' : 'Open Chat'}
                        </Link>
                      )}
                      <button onClick={() => cancelAppointment(apt._id)} className="text-slate-400 hover:text-red-500 text-sm font-medium px-2 py-2 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar: History & Prescriptions */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-slate-500" /> Medical History
            </h2>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {past.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">No past consultations yet.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {past.map(apt => (
                    <div key={apt._id} className="p-5 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-slate-900 text-sm">{apt.doctor?.profile?.fullName || 'Doctor'}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">{new Date(apt.date).toLocaleDateString()}</p>
                      
                      {apt.status === 'COMPLETED' && (
                        <div className="flex flex-col space-y-2 mt-3 pt-3 border-t border-slate-100">
                          <button className="w-full flex items-center justify-center space-x-2 py-1.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-lg hover:bg-primary-100 transition-colors">
                            <Download className="w-3.5 h-3.5" />
                            <span>View Rx</span>
                          </button>
                          <button onClick={() => handleOpenReview(apt)} className="w-full flex items-center justify-center space-x-2 py-1.5 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">
                            Leave Review
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && reviewAppt && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900">Rate your consultation</h3>
              <button onClick={() => setReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={submitReview} className="p-6 space-y-4">
              <div className="text-center mb-6">
                <div className="font-medium text-slate-900">{reviewAppt.doctor?.profile?.fullName || 'Doctor'}</div>
                <div className="text-sm text-slate-500">{new Date(reviewAppt.date).toLocaleDateString()}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 text-center">How many stars?</label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setRating(star)}
                      className={`text-3xl ${rating >= star ? 'text-yellow-400' : 'text-slate-200'} hover:scale-110 transition-transform`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Write a review (optional)</label>
                <textarea 
                  rows="3" 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                  className="input-field" 
                  placeholder="Share your experience..."
                ></textarea>
              </div>
              
              <button type="submit" className="btn-primary w-full mt-2">Submit Review</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
