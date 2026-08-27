import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import RegisterPatient from './pages/auth/RegisterPatient';
import RegisterDoctor from './pages/auth/RegisterDoctor';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Departments from './pages/public/Departments';
import DoctorSearch from './pages/public/DoctorSearch';
import AvailabilityManager from './pages/doctor/AvailabilityManager';
import AppointmentWizard from './pages/patient/AppointmentWizard';
import PrescriptionBuilder from './pages/doctor/PrescriptionBuilder';
import VideoRoom from './pages/consultation/VideoRoom';
import ChatRoom from './pages/consultation/ChatRoom';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/patient" element={<RegisterPatient />} />
          <Route path="/register/doctor" element={<RegisterDoctor />} />
          {/* Consultation Rooms */}
          <Route path="/consultation/video/:id" element={<VideoRoom />} />
          <Route path="/consultation/chat/:id" element={<ChatRoom />} />

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/doctors" element={<DoctorSearch />} />
          <Route path="/doctor/availability" element={<AvailabilityManager />} />
          <Route path="/doctor/prescription/:id" element={<PrescriptionBuilder />} />
          <Route path="/book-appointment" element={<AppointmentWizard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
