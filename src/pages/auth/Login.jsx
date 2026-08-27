import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HeartPulse, ArrowRight, CheckCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/login`, { email, password }, { withCredentials: true });
      localStorage.setItem('user', JSON.stringify(res.data));
      window.dispatchEvent(new Event('storage')); // Trigger update for navbar
      
      if (res.data.role === 'PATIENT') navigate('/patient/dashboard');
      else if (res.data.role === 'DOCTOR') navigate('/doctor/dashboard');
      else if (res.data.role === 'ADMIN') navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Doctor caring for patient" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/60 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-end p-16 h-full text-white">
          <Link to="/" className="absolute top-12 left-16 flex items-center space-x-2 text-white hover:opacity-80 transition-opacity">
            <HeartPulse className="h-8 w-8" />
            <span className="text-2xl font-extrabold tracking-tight">Preamganga<span className="text-primary-300">Health</span></span>
          </Link>
          
          <h2 className="text-4xl font-bold mb-6">Expert medical care, right at your fingertips.</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-md">Connect with verified doctors, manage your health records, and get digital prescriptions instantly.</p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-primary-300" />
              <span>Bank-level secure data encryption</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-primary-300" />
              <span>Top 1% medical professionals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 relative">
        {/* Mobile Header Logo */}
        <div className="lg:hidden absolute top-8 left-6">
          <Link to="/" className="flex items-center space-x-2">
            <HeartPulse className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">Preamganga<span className="text-primary-600">Health</span></span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="text-center lg:text-left mb-10 mt-12 lg:mt-0">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="mt-2 text-slate-500">Sign in to your account to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="name@example.com"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">Forgot password?</a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-medium transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Signing in...
                </span>
              ) : (
                <>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </button>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">New to Preamganga HealthCare?</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Link to="/register/patient" className="w-full flex justify-center py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Join as Patient
              </Link>
              <Link to="/register/doctor" className="w-full flex justify-center py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Join as Doctor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
