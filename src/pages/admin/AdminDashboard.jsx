import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Users, UserRound, Stethoscope, Calendar, Activity, ChevronRight, Search, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [docsRes, deptsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/doctors/admin/all', { withCredentials: true }),
          axios.get('http://localhost:5001/api/departments')
        ]);
        setDoctors(docsRes.data);
        setDepartments(deptsRes.data);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVerifyDoctor = async (doctorId, status) => {
    try {
      await axios.patch(`http://localhost:5001/api/doctors/${doctorId}/verify`, { status }, { withCredentials: true });
      // Update local state
      setDoctors(doctors.map(d => d._id === doctorId ? { ...d, verificationStatus: status } : d));
    } catch (err) {
      alert('Failed to update verification status');
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-primary-50 text-primary-700 font-medium' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className={`h-5 w-5 ${activeTab === id ? 'text-primary-600' : 'text-slate-400'}`} />
      <span>{label}</span>
      {activeTab === id && <ChevronRight className="h-4 w-4 ml-auto text-primary-600" />}
    </button>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Admin Controls</h2>
          <div className="space-y-1">
            <SidebarItem id="overview" icon={LayoutDashboard} label="Overview" />
            <SidebarItem id="doctors" icon={Stethoscope} label="Doctors" />
            <SidebarItem id="patients" icon={UserRound} label="Patients" />
            <SidebarItem id="departments" icon={Activity} label="Departments" />
            <SidebarItem id="appointments" icon={Calendar} label="Appointments" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 capitalize">{activeTab}</h1>
            <p className="text-slate-500 mt-1">Manage and monitor platform activity.</p>
          </header>

          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-3 gap-6"><div className="h-32 bg-slate-200 rounded-xl"></div><div className="h-32 bg-slate-200 rounded-xl"></div><div className="h-32 bg-slate-200 rounded-xl"></div></div>
              <div className="h-64 bg-slate-200 rounded-xl"></div>
            </div>
          ) : (
            <>
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Stethoscope className="h-6 w-6" /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total Doctors</p>
                        <h3 className="text-2xl font-bold text-slate-900">{doctors.length}</h3>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                      <div className="p-3 bg-primary-50 text-primary-600 rounded-lg"><Activity className="h-6 w-6" /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Departments</p>
                        <h3 className="text-2xl font-bold text-slate-900">{departments.length}</h3>
                      </div>
                    </div>
                    {/* Placeholder metrics */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                      <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Users className="h-6 w-6" /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total Patients</p>
                        <h3 className="text-2xl font-bold text-slate-900">--</h3>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                      <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><Calendar className="h-6 w-6" /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Appointments</p>
                        <h3 className="text-2xl font-bold text-slate-900">--</h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DOCTORS TAB */}
              {activeTab === 'doctors' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">Doctor Management</h3>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input type="text" placeholder="Search doctors..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-sm font-medium text-slate-500 border-b border-slate-200">
                          <th className="p-4">Doctor</th>
                          <th className="p-4">Specialization</th>
                          <th className="p-4">Experience</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {doctors.map(doctor => (
                          <tr key={doctor._id} className="hover:bg-slate-50/50">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                                  {doctor.fullName?.charAt(0) || 'D'}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">{doctor.fullName}</p>
                                  <p className="text-xs text-slate-500">{doctor.medicalRegistrationNumber}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-slate-600">{doctor.specialization}</td>
                            <td className="p-4 text-sm text-slate-600">{doctor.yearsOfExperience} yrs</td>
                            <td className="p-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                doctor.verificationStatus === 'Verified' ? 'bg-green-100 text-green-700' :
                                doctor.verificationStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {doctor.verificationStatus || 'Pending'}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              {doctor.verificationStatus !== 'Verified' && (
                                <button onClick={() => handleVerifyDoctor(doctor._id, 'Verified')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                              )}
                              {doctor.verificationStatus !== 'Rejected' && (
                                <button onClick={() => handleVerifyDoctor(doctor._id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                                  <XCircle className="h-5 w-5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* DEPARTMENTS TAB */}
              {activeTab === 'departments' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">Departments</h3>
                    <button className="btn-primary py-2 px-4 text-sm">Add New Department</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-sm font-medium text-slate-500 border-b border-slate-200">
                          <th className="p-4">Department Name</th>
                          <th className="p-4">Description</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {departments.map(dept => (
                          <tr key={dept._id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-medium text-slate-900">{dept.name}</td>
                            <td className="p-4 text-sm text-slate-500 max-w-xs truncate">{dept.description}</td>
                            <td className="p-4 text-right text-sm font-medium">
                              <button className="text-primary-600 hover:text-primary-800 mr-3">Edit</button>
                              <button className="text-red-600 hover:text-red-800">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PLACEHOLDERS FOR OTHER TABS */}
              {(activeTab === 'patients' || activeTab === 'appointments') && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                  <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">Module Under Construction</h3>
                  <p className="text-slate-500 mt-2">This view will be implemented in the next phase of the rebuild.</p>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
