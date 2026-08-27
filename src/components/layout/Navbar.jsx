import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Menu, X, HeartPulse } from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
      else setUser(null);
    };
    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5001/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <HeartPulse className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-extrabold text-slate-850 tracking-tight">
                Preamganga<span className="text-primary-600">Health</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/doctors" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Find a Doctor</Link>
            <Link to="/departments" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Departments</Link>
            <Link to="/about" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">About Us</Link>
            
            <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
              {user ? (
                <>
                  <span className="text-sm text-slate-500 font-medium hidden lg:block">
                    Welcome, {user.profile?.fullName?.split(' ')[0] || 'User'}
                  </span>
                  <Link to={`/${user.role.toLowerCase()}/dashboard`} className="btn-secondary">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-slate-500 hover:text-danger font-medium transition-colors text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">Login</Link>
                  <Link to="/register/patient" className="btn-primary">Book Consultation</Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 hover:text-slate-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/doctors" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">Find a Doctor</Link>
            <Link to="/departments" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">Departments</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">About Us</Link>
            
            <div className="pt-4 border-t border-slate-200">
              {user ? (
                <div className="flex flex-col space-y-3">
                  <Link to={`/${user.role.toLowerCase()}/dashboard`} onClick={() => setIsMobileMenuOpen(false)} className="block text-center btn-primary w-full">Dashboard</Link>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-medium text-danger hover:bg-red-50 rounded-md">Logout</button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 px-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-center btn-secondary w-full">Login</Link>
                  <Link to="/register/patient" onClick={() => setIsMobileMenuOpen(false)} className="block text-center btn-primary w-full">Book Consultation</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
