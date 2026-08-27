import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-850 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <HeartPulse className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Preamganga<span className="text-primary-400">Health</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Providing premium, secure, and instant online doctor consultations. Connecting you with verified specialists from the comfort of your home.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">For Patients</h3>
            <ul className="space-y-4">
              <li><Link to="/doctors" className="hover:text-primary-400 transition-colors text-sm">Find a Doctor</Link></li>
              <li><Link to="/departments" className="hover:text-primary-400 transition-colors text-sm">Departments</Link></li>
              <li><Link to="/login" className="hover:text-primary-400 transition-colors text-sm">Patient Login</Link></li>
              <li><Link to="/register/patient" className="hover:text-primary-400 transition-colors text-sm">Book Consultation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">For Doctors</h3>
            <ul className="space-y-4">
              <li><Link to="/register/doctor" className="hover:text-primary-400 transition-colors text-sm">Join as Doctor</Link></li>
              <li><Link to="/login" className="hover:text-primary-400 transition-colors text-sm">Doctor Login</Link></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors text-sm">Clinic Management</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <span>123 Healthcare Avenue, Cyber City, Gurugram, 122002</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <span>support@preamganga.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Preamganga HealthCare. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
