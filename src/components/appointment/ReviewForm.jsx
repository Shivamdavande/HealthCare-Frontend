import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ appointmentId, doctorName, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/reviews`, {
        appointmentId, rating, comment
      }, { withCredentials: true });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-900 mb-2">Rate your consultation</h3>
      <p className="text-sm text-slate-500 mb-4">How was your experience with Dr. {doctorName}?</p>
      
      {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Rating (1-5)</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md">
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Very Good</option>
            <option value={3}>3 - Good</option>
            <option value={2}>2 - Fair</option>
            <option value={1}>1 - Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Review (Optional)</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full px-3 py-2 border rounded-md" rows="3" placeholder="Share your experience..."></textarea>
        </div>

        <button type="submit" disabled={loading} className="w-full py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
