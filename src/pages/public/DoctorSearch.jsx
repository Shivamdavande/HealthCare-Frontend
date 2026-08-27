import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Star, CheckCircle, Video, MessageSquare, MapPin, Briefcase } from 'lucide-react';

const DoctorSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const deptId = searchParams.get('department') || '';

  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Fetch departments for filter
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/departments`);
        setDepartments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch doctors based on filters
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/doctors?`;
        if (deptId) url += `department=${deptId}&`;
        if (debouncedSearch) url += `search=${debouncedSearch}&`;
        
        const res = await axios.get(url);
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [deptId, debouncedSearch]);

  const handleDepartmentChange = (e) => {
    if (e.target.value) {
      searchParams.set('department', e.target.value);
    } else {
      searchParams.delete('department');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-primary-900 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary-800 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-primary-800 blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Find Your Doctor</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">Book appointments with top-rated, verified medical specialists across India.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search by doctor name, specialty..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-slate-50"
            />
          </div>
          
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-slate-400" />
            </div>
            <select 
              value={deptId}
              onChange={handleDepartmentChange}
              className="block w-full pl-12 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-slate-50 appearance-none text-slate-700"
            >
              <option value="">All Specialties</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {loading ? (
            // Skeleton Loader
            <>
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse flex flex-col md:flex-row gap-6">
                  <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto md:mx-0 flex-shrink-0"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-full md:w-48 space-y-3">
                    <div className="h-10 bg-slate-200 rounded w-full"></div>
                    <div className="h-10 bg-slate-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </>
          ) : doctors.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-100">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No doctors found</h3>
              <p className="text-slate-500 max-w-md mx-auto">We couldn't find any doctors matching your search criteria. Try adjusting your filters or search term.</p>
              <button onClick={() => {setSearchTerm(''); setSearchParams({});}} className="mt-6 text-primary-600 font-medium hover:text-primary-700">
                Clear all filters
              </button>
            </div>
          ) : (
            // Doctor Cards
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {doctors.map(doctor => (
                <div key={doctor._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow flex flex-col sm:flex-row gap-6">
                  
                  {/* Photo & Rating */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="relative">
                      {doctor.profilePhoto ? (
                        <img src={doctor.profilePhoto} alt={doctor.fullName} className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm" />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-3xl font-bold border-4 border-slate-50">
                          {doctor.fullName.charAt(0)}
                        </div>
                      )}
                      {doctor.verificationStatus === 'Verified' && (
                        <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5" title="Verified Professional">
                          <CheckCircle className="w-6 h-6 text-primary-500 fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-sm font-semibold">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 mr-1" />
                      {doctor.averageRating > 0 ? doctor.averageRating.toFixed(1) : 'New'}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{doctor.fullName}</h3>
                    <p className="text-primary-600 font-medium mb-3 flex items-center justify-center sm:justify-start">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {doctor.specialization} • {doctor.department?.name}
                    </p>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{doctor.qualification}</p>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-slate-700 font-medium mb-6 border-t border-slate-100 pt-4">
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 text-slate-400 mr-2" />
                        Chat: ₹{doctor.consultationFeeChat}
                      </div>
                      <div className="flex items-center">
                        <Video className="w-4 h-4 text-slate-400 mr-2" />
                        Video: ₹{doctor.consultationFeeVideo}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                      <Link 
                        to="/book-appointment"
                        state={{ 
                          doctorId: doctor.user, 
                          doctorName: doctor.fullName, 
                          departmentId: doctor.department?._id, 
                          fees: { chat: doctor.consultationFeeChat, video: doctor.consultationFeeVideo } 
                        }}
                        className="flex-1 btn-primary text-center"
                      >
                        Book Visit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSearch;
