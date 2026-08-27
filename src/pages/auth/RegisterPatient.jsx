import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HeartPulse, CheckCircle } from 'lucide-react';

const RegisterPatient = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', 
    dateOfBirth: '', gender: 'Male', bloodGroup: '', address: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/register/patient`, formData, { withCredentials: true });
      localStorage.setItem('user', JSON.stringify(res.data));
      window.dispatchEvent(new Event('storage'));
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* Left side - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900 flex-col">
        <div className="p-16 relative z-10 flex-grow">
          <Link to="/" className="flex items-center space-x-2 text-white hover:opacity-80 transition-opacity mb-24">
            <HeartPulse className="h-8 w-8" />
            <span className="text-2xl font-extrabold tracking-tight">Preamganga<span className="text-primary-300">Health</span></span>
          </Link>
          
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Your journey to better health starts here.</h2>
          <p className="text-primary-100 text-lg mb-12 max-w-md leading-relaxed">Join thousands of patients who trust our platform for seamless, secure, and professional online consultations.</p>
          
          <div className="space-y-6">
            <div className="flex space-x-4">
              <CheckCircle className="h-6 w-6 text-primary-300 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold mb-1">Instant Access</h4>
                <p className="text-primary-100 text-sm">Consult doctors anytime, anywhere.</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <CheckCircle className="h-6 w-6 text-primary-300 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold mb-1">Digital Health Records</h4>
                <p className="text-primary-100 text-sm">All your prescriptions and reports in one secure place.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-primary-800 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-32 -right-32 w-[400px] h-[400px] bg-primary-700 rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12 relative overflow-y-auto">
        <div className="lg:hidden absolute top-8 left-6">
          <Link to="/" className="flex items-center space-x-2">
            <HeartPulse className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">Preamganga<span className="text-primary-600">Health</span></span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto mt-12 lg:mt-0 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Patient Account</h1>
            <p className="mt-2 text-sm text-slate-500">Step {step} of 2</p>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div className={`h-full bg-primary-600 transition-all duration-500 ease-out ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
            </div>
          </div>

          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); setStep(2); }} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            
            {step === 1 ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="input-field" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input-field" placeholder="name@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="input-field" placeholder="9876543210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input type="password" name="password" required minLength={6} value={formData.password} onChange={handleChange} className="input-field" placeholder="••••••••" />
                </div>
                <button type="submit" className="w-full btn-primary py-3 mt-6">Continue</button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                  <input type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <select name="gender" required value={formData.gender} onChange={handleChange} className="input-field">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                    <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="input-field" placeholder="O+" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Residential Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-field" placeholder="123 Main St, City" />
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={() => setStep(1)} className="w-1/3 btn-secondary py-3">Back</button>
                  <button type="submit" disabled={isLoading} className="w-2/3 btn-primary py-3">
                    {isLoading ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPatient;
