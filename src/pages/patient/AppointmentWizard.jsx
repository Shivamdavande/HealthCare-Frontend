import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const AppointmentWizard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Assume state is passed via Link from doctor search page: { doctorId, departmentId, doctorName, fees }
  const state = location.state || {};
  
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [consultationType, setConsultationType] = useState('Chat');
  const [error, setError] = useState('');

  // Dummy slots for demonstration
  const availableSlots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM'];

  const handleBook = async () => {
    try {
      const fee = consultationType === 'Chat' ? state.fees?.chat || 499 : state.fees?.video || 799;
      
      const res = await axios.post('http://localhost:5001/api/appointments', {
        doctor: state.doctorId,
        department: state.departmentId,
        date,
        timeSlot,
        consultationType,
        fee
      }, { withCredentials: true });

      // After booking (status PENDING_PAYMENT), redirect to a payment placeholder
      // For now, redirect to patient dashboard
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  if (!state.doctorId) {
    return <div className="text-center py-12 text-slate-500">Please select a doctor first.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Book Appointment</h2>
      
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-6 pb-6 border-b border-slate-100">
          <h3 className="text-xl font-semibold text-slate-800">Booking with Dr. {state.doctorName}</h3>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
            </div>

            {date && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Available Slots</label>
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.map(slot => (
                    <button 
                      key={slot} 
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2 px-4 rounded-md text-sm font-medium border ${timeSlot === slot ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={() => setStep(2)} 
              disabled={!date || !timeSlot}
              className="w-full py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-4">Select Consultation Type</label>
              <div className="space-y-3">
                <label className={`block border p-4 rounded-lg cursor-pointer ${consultationType === 'Chat' ? 'border-primary-600 bg-primary-50' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input type="radio" name="type" value="Chat" checked={consultationType === 'Chat'} onChange={() => setConsultationType('Chat')} className="mr-3" />
                      <span className="font-medium">Chat Consultation</span>
                    </div>
                    <span className="font-bold text-slate-900">₹{state.fees?.chat || 499}</span>
                  </div>
                </label>
                
                <label className={`block border p-4 rounded-lg cursor-pointer ${consultationType === 'Video' ? 'border-primary-600 bg-primary-50' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input type="radio" name="type" value="Video" checked={consultationType === 'Video'} onChange={() => setConsultationType('Video')} className="mr-3" />
                      <span className="font-medium">Video Consultation (Google Meet)</span>
                    </div>
                    <span className="font-bold text-slate-900">₹{state.fees?.video || 799}</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <button onClick={() => setStep(1)} className="w-1/3 py-3 border border-slate-300 text-slate-700 font-medium rounded-md hover:bg-slate-50">Back</button>
              <button onClick={handleBook} className="w-2/3 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700">Confirm Booking</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentWizard;
