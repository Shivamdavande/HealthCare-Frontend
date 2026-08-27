import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/departments`);
        setDepartments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Premium Header */}
      <div className="bg-primary-900 pt-16 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Hospital Hallway" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Our Specialties</h1>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
            Comprehensive medical care across specialized departments. Find the right expert for your health needs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse">
                <div className="w-full h-48 bg-slate-200 rounded-xl mb-6"></div>
                <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {departments.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                <p className="text-slate-500 text-lg">No departments found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {departments.map((dept) => (
                  <Link 
                    key={dept._id} 
                    to={`/doctors?department=${dept._id}`} 
                    className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all duration-300 flex flex-col"
                  >
                    {dept.imageUrl ? (
                      <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-primary-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                        <img 
                          src={dept.imageUrl} 
                          alt={dept.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-slate-100 flex items-center justify-center">
                        <span className="text-5xl font-bold text-slate-300">{dept.name.charAt(0)}</span>
                      </div>
                    )}
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-700 transition-colors">
                        {dept.name}
                      </h3>
                      <p className="text-slate-600 mb-6 flex-grow leading-relaxed line-clamp-3">
                        {dept.description || 'Specialized medical care providing advanced diagnosis and treatment.'}
                      </p>
                      <div className="flex items-center text-primary-600 font-medium mt-auto group-hover:text-primary-800">
                        View Doctors <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Departments;
