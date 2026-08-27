import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AvailabilityManager = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example state for a single day form
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [isAvailable, setIsAvailable] = useState(true);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState(30);
  const [message, setMessage] = useState('');

  // Fetch doctor's availability (assuming doctorId is obtained from auth context in a real app)
  // For now, we rely on the backend token to identify the doctor when saving.
  // To fetch, we'd ideally have an endpoint like GET /api/availability/me. 
  // Let's assume we can fetch it when needed, or just let them save.

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/availability', {
        dayOfWeek, isAvailable, startTime, endTime, slotDuration
      }, { withCredentials: true });
      setMessage('Availability updated successfully!');
    } catch (err) {
      setMessage('Failed to update availability.');
    }
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Manage Availability</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4">Set Working Hours</h2>
        {message && <p className="mb-4 text-sm text-primary-600">{message}</p>}
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Day of the week</label>
            <select value={dayOfWeek} onChange={(e) => setDayOfWeek(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 border rounded-md">
              {days.map((day, index) => (
                <option key={index} value={index}>{day}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
            <label className="ml-2 block text-sm text-slate-900">Available on this day</label>
          </div>

          {isAvailable && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Start Time</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">End Time</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700">Slot Duration (minutes)</label>
            <select value={slotDuration} onChange={(e) => setSlotDuration(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 border rounded-md">
              <option value={15}>15 mins</option>
              <option value={30}>30 mins</option>
              <option value={60}>60 mins</option>
            </select>
          </div>

          <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Save Availability
          </button>
        </form>
      </div>
    </div>
  );
};

export default AvailabilityManager;
