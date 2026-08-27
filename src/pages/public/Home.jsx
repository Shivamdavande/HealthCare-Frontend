import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Video, MessageSquare, Clock, ShieldCheck, Activity, Brain, Baby, Heart } from 'lucide-react';

import heroDoctorImg from '../../assets/hero_doctor.jpg';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-8 z-10">
              <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-pulse"></span>
                <span>24/7 Verified Doctors Available</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Healthcare that <span className="text-primary-600">fits your life.</span>
              </h1>
              
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                Consult top-rated specialists online through secure video and chat. Get professional medical care, digital prescriptions, and peace of mind from the comfort of your home.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/doctors" className="btn-primary px-8 py-4 text-base">
                  Book Consultation
                </Link>
                <Link to="/departments" className="btn-secondary px-8 py-4 text-base group">
                  Explore Specialties
                  <ArrowRight className="ml-2 h-5 w-5 text-slate-400 group-hover:text-primary-600 transition-colors" />
                </Link>
              </div>
            </div>

            <div className="relative z-10">
              {/* Refined editorial image rather than a generic blob */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={heroDoctorImg} 
                  alt="Doctor consulting with patient" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl flex items-center space-x-4 shadow-lg">
                    <div className="bg-success/20 p-3 rounded-full">
                      <ShieldCheck className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Secure & Confidential</p>
                      <p className="text-sm text-slate-600">End-to-end encrypted consultations</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -z-10 -top-12 -right-12 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -z-10 -bottom-12 -left-12 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why choose Preamganga HealthCare?</h2>
            <p className="mt-4 text-lg text-slate-600">We've built a platform that prioritizes clinical excellence, patient privacy, and seamless technology.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-primary-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Video className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">HD Video Consultations</h3>
              <p className="text-slate-600 leading-relaxed">Connect face-to-face with specialists through our secure, high-definition video infrastructure powered by Google Meet.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-primary-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Instant Chat Support</h3>
              <p className="text-slate-600 leading-relaxed">Have a quick medical query? Use our realtime encrypted chat to get answers from verified doctors instantly.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-primary-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Flexible Scheduling</h3>
              <p className="text-slate-600 leading-relaxed">Book appointments at your convenience. Our smart availability engine ensures zero double-bookings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Specialties */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Top Specialties</h2>
              <p className="mt-3 text-lg text-slate-600 max-w-2xl">Consult with India's top doctors across 20+ specialties.</p>
            </div>
            <Link to="/departments" className="hidden sm:inline-flex items-center text-primary-600 font-medium hover:text-primary-700">
              View all specialties <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Link to="/doctors?department=cardiology" className="group bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:bg-primary-50 hover:border-primary-100 transition-all text-center">
              <Heart className="h-10 w-10 text-slate-400 group-hover:text-primary-600 mx-auto mb-4 transition-colors" />
              <h3 className="font-semibold text-slate-900 group-hover:text-primary-900">Cardiology</h3>
            </Link>
            
            <Link to="/doctors?department=neurology" className="group bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:bg-primary-50 hover:border-primary-100 transition-all text-center">
              <Brain className="h-10 w-10 text-slate-400 group-hover:text-primary-600 mx-auto mb-4 transition-colors" />
              <h3 className="font-semibold text-slate-900 group-hover:text-primary-900">Neurology</h3>
            </Link>
            
            <Link to="/doctors?department=pediatrics" className="group bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:bg-primary-50 hover:border-primary-100 transition-all text-center">
              <Baby className="h-10 w-10 text-slate-400 group-hover:text-primary-600 mx-auto mb-4 transition-colors" />
              <h3 className="font-semibold text-slate-900 group-hover:text-primary-900">Pediatrics</h3>
            </Link>
            
            <Link to="/doctors?department=general" className="group bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:bg-primary-50 hover:border-primary-100 transition-all text-center">
              <Activity className="h-10 w-10 text-slate-400 group-hover:text-primary-600 mx-auto mb-4 transition-colors" />
              <h3 className="font-semibold text-slate-900 group-hover:text-primary-900">General Medicine</h3>
            </Link>
          </div>
          
          <div className="mt-8 sm:hidden">
            <Link to="/departments" className="btn-secondary w-full">
              View all specialties
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to take control of your health?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto text-lg">Join thousands of patients who trust Preamganga HealthCare for their medical needs.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register/patient" className="btn-primary bg-white text-primary-900 hover:bg-slate-50 px-8 py-3">Create Patient Account</Link>
            <Link to="/register/doctor" className="btn-secondary border-primary-700 bg-transparent text-white hover:bg-primary-800 px-8 py-3">Join as a Doctor</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
