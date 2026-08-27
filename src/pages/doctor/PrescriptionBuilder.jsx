import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Trash2, FileText, CheckCircle } from 'lucide-react';

const PrescriptionBuilder = () => {
  const { id } = useParams(); // appointment ID
  const navigate = useNavigate();
  
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handleRemoveMedicine = (index) => {
    const updated = [...medicines];
    updated.splice(index, 1);
    setMedicines(updated);
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('http://localhost:5001/api/prescriptions', {
        appointmentId: id,
        diagnosis,
        medicines,
        instructions: '',
        additionalNotes: notes
      }, {
        withCredentials: true
      });
      
      setSuccess(true);
      setTimeout(() => navigate(-1), 2000); // Navigate back to where they came from, like ChatRoom
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save prescription');
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Prescription Saved!</h2>
          <p className="text-slate-500 mb-6">The appointment has been marked as completed. The patient will be notified.</p>
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-success animate-pulse w-full"></div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 sticky top-20 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="mr-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" /> Digital Prescription
            </h1>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Saving...' : 'Sign & Complete'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Clinical Notes */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Clinical Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis</label>
                <input type="text" required value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="input-field" placeholder="e.g. Viral Fever, Hypertension" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Symptoms & Clinical Notes</label>
                <textarea rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field" placeholder="Patient presented with..."></textarea>
              </div>
            </div>
          </div>

          {/* Rx Medicines */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <span className="text-2xl font-serif italic mr-2 text-primary-600">Rx</span> Medicines
              </h2>
            </div>
            
            <div className="space-y-6">
              {medicines.map((med, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group">
                  <div className="absolute -top-3 -right-3">
                    {medicines.length > 1 && (
                      <button type="button" onClick={() => handleRemoveMedicine(index)} className="bg-white text-red-500 p-1.5 rounded-full shadow border border-slate-200 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Medicine Name</label>
                      <input type="text" required value={med.name} onChange={(e) => handleMedicineChange(index, 'name', e.target.value)} className="input-field bg-white" placeholder="e.g. Paracetamol 500mg" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Dosage</label>
                      <input type="text" required value={med.dosage} onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)} className="input-field bg-white" placeholder="e.g. 1 Tablet" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Frequency</label>
                      <input type="text" required value={med.frequency} onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)} className="input-field bg-white" placeholder="e.g. 1-0-1 (Morning & Night)" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Duration</label>
                      <input type="text" required value={med.duration} onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)} className="input-field bg-white" placeholder="e.g. 5 days" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Instructions</label>
                      <input type="text" value={med.instructions} onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)} className="input-field bg-white" placeholder="e.g. After meals" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button type="button" onClick={handleAddMedicine} className="mt-4 flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
              <Plus className="w-4 h-4 mr-1" /> Add Another Medicine
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PrescriptionBuilder;
