import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HeartPulse, UserPlus, Stethoscope, BriefcaseMedical } from 'lucide-react';

const RegisterDoctor = () => {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', 
    gender: 'Male', dateOfBirth: '',
    medicalRegistrationNumber: '', qualification: '', specialization: '', 
    department: '', yearsOfExperience: '',
    consultationFeeChat: '', consultationFeeVideo: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/departments');
        setDepartments(res.data);
      } catch (err) {
        console.error('Failed to fetch departments');
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const nextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5001/api/auth/register/doctor', formData, { withCredentials: true });
      localStorage.setItem('user', JSON.stringify(res.data));
      window.dispatchEvent(new Event('storage'));
      navigate('/doctor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* Left side - Visuals */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-slate-850 flex-col">
        <div className="p-16 relative z-10 flex-grow">
          <Link to="/" className="flex items-center space-x-2 text-white hover:opacity-80 transition-opacity mb-20">
            <HeartPulse className="h-8 w-8 text-primary-400" />
            <span className="text-2xl font-extrabold tracking-tight">Preamganga<span className="text-primary-400">Health</span></span>
          </Link>
          
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Grow your practice, digitally.</h2>
          <p className="text-slate-300 text-lg mb-12 leading-relaxed">Join India's most trusted network of medical professionals. Manage consultations, prescriptions, and patients seamlessly.</p>
          
          <div className="space-y-8">
            <div className="flex space-x-4 items-start">
              <div className="bg-slate-700 p-3 rounded-lg"><UserPlus className="h-6 w-6 text-primary-400" /></div>
              <div>
                <h4 className="text-white font-semibold mb-1">Global Reach</h4>
                <p className="text-slate-400 text-sm">Connect with patients across the country effortlessly.</p>
              </div>
            </div>
            <div className="flex space-x-4 items-start">
              <div className="bg-slate-700 p-3 rounded-lg"><Stethoscope className="h-6 w-6 text-primary-400" /></div>
              <div>
                <h4 className="text-white font-semibold mb-1">Smart Digital Clinic</h4>
                <p className="text-slate-400 text-sm">Automated scheduling, digital prescriptions, and secure payments.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-primary-900/20 to-transparent pointer-events-none"></div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-7/12 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12 relative overflow-y-auto">
        <div className="lg:hidden absolute top-8 left-6">
          <Link to="/" className="flex items-center space-x-2">
            <HeartPulse className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">Preamganga<span className="text-primary-600">Health</span></span>
          </Link>
        </div>

        <div className="max-w-2xl w-full mx-auto mt-12 lg:mt-0 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Doctor Registration</h1>
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex flex-col">
                <span className={`text-xs font-bold uppercase tracking-wider ${step >= 1 ? 'text-primary-600' : 'text-slate-400'}`}>Step 1</span>
                <span className={`text-sm font-medium ${step >= 1 ? 'text-slate-900' : 'text-slate-500'}`}>Personal Details</span>
              </div>
              <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-slate-100'}`}></div>
              <div className="flex flex-col text-center">
                <span className={`text-xs font-bold uppercase tracking-wider ${step >= 2 ? 'text-primary-600' : 'text-slate-400'}`}>Step 2</span>
                <span className={`text-sm font-medium ${step >= 2 ? 'text-slate-900' : 'text-slate-500'}`}>Professional Info</span>
              </div>
              <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 3 ? 'bg-primary-600' : 'bg-slate-100'}`}></div>
              <div className="flex flex-col text-right">
                <span className={`text-xs font-bold uppercase tracking-wider ${step >= 3 ? 'text-primary-600' : 'text-slate-400'}`}>Step 3</span>
                <span className={`text-sm font-medium ${step >= 3 ? 'text-slate-900' : 'text-slate-500'}`}>Consultation Fees</span>
              </div>
            </div>
          </div>

          <form onSubmit={step === 3 ? handleSubmit : nextStep} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="input-field" placeholder="Dr. John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input-field" placeholder="doctor@example.com" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="input-field" placeholder="9876543210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input type="password" name="password" required minLength={6} value={formData.password} onChange={handleChange} className="input-field" placeholder="••••••••" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <select name="gender" required value={formData.gender} onChange={handleChange} className="input-field">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                    <input type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} className="input-field" />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button type="submit" className="btn-primary w-full sm:w-auto px-8">Next Step</button>
                </div>
              </div>
            )}

            {/* Step 2: Professional Details */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Medical Registration Number</label>
                  <input type="text" name="medicalRegistrationNumber" required value={formData.medicalRegistrationNumber} onChange={handleChange} className="input-field" placeholder="e.g. MED-12345" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Highest Qualification</label>
                    <input type="text" name="qualification" required value={formData.qualification} onChange={handleChange} className="input-field" placeholder="e.g. MBBS, MD" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                    <input type="text" name="specialization" required value={formData.specialization} onChange={handleChange} className="input-field" placeholder="e.g. Cardiologist" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                    <select name="department" required value={formData.department} onChange={handleChange} className="input-field">
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
                    <input type="number" name="yearsOfExperience" required min="0" value={formData.yearsOfExperience} onChange={handleChange} className="input-field" placeholder="e.g. 10" />
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 gap-4">
                  <button type="button" onClick={prevStep} className="btn-secondary w-full sm:w-auto px-8">Back</button>
                  <button type="submit" className="btn-primary w-full sm:w-auto px-8">Next Step</button>
                </div>
              </div>
            )}

            {/* Step 3: Consultation Fees */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                  <div className="flex items-start space-x-4">
                    <BriefcaseMedical className="h-6 w-6 text-primary-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Set your consultation fees</h4>
                      <p className="text-sm text-slate-500 mt-1">These fees will be displayed to patients during the booking process. You can change them later in your settings.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Chat Consultation Fee (₹)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-slate-500 sm:text-sm">₹</span>
                      </div>
                      <input type="number" name="consultationFeeChat" required min="0" value={formData.consultationFeeChat} onChange={handleChange} className="input-field pl-8" placeholder="500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Video Consultation Fee (₹)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-slate-500 sm:text-sm">₹</span>
                      </div>
                      <input type="number" name="consultationFeeVideo" required min="0" value={formData.consultationFeeVideo} onChange={handleChange} className="input-field pl-8" placeholder="1000" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-6 gap-4">
                  <button type="button" onClick={prevStep} className="btn-secondary w-full sm:w-auto px-8">Back</button>
                  <button type="submit" disabled={isLoading} className="btn-primary w-full sm:w-auto px-8">
                    {isLoading ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-500">
              Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterDoctor;
