import React, { useState } from 'react';
import axios from 'axios';

const PrescriptionForm = ({ appointmentId, onSuccess }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5001/api/prescriptions', {
        appointmentId,
        diagnosis,
        medicines,
        instructions
      }, { withCredentials: true });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">Generate Prescription</h3>
      {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis</label>
          <input type="text" required value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Medicines</label>
          {medicines.map((med, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 mb-2 items-center">
              <input type="text" placeholder="Name" required value={med.name} onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)} className="px-3 py-2 border rounded-md text-sm" />
              <input type="text" placeholder="Dosage" required value={med.dosage} onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)} className="px-3 py-2 border rounded-md text-sm" />
              <input type="text" placeholder="Frequency" required value={med.frequency} onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)} className="px-3 py-2 border rounded-md text-sm" />
              <input type="text" placeholder="Duration" required value={med.duration} onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)} className="px-3 py-2 border rounded-md text-sm" />
            </div>
          ))}
          <button type="button" onClick={addMedicine} className="text-sm text-primary-600 font-medium hover:text-primary-700 mt-2">
            + Add another medicine
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">General Instructions</label>
          <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} className="w-full px-3 py-2 border rounded-md" rows="3"></textarea>
        </div>

        <button type="submit" disabled={loading} className="w-full py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 disabled:opacity-50">
          {loading ? 'Submitting...' : 'Complete Consultation & Upload'}
        </button>
      </form>
    </div>
  );
};

export default PrescriptionForm;
