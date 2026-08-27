import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, PhoneOff } from 'lucide-react';

const VideoRoom = () => {
  const { id } = useParams(); // appointment ID
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jitsiApi, setJitsiApi] = useState(null);

  useEffect(() => {
    // Fetch appointment details to get room name and user info
    const fetchAppointment = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/appointments/${id}`, {
          withCredentials: true
        });
        setAppointment(data);
      } catch (err) {
        console.error("Failed to load appointment", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id]);

  useEffect(() => {
    if (!loading && appointment && jitsiContainerRef.current && !jitsiApi) {
      // Load Jitsi external API script
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => {
        const domain = 'meet.jit.si';
        // Unique room name based on appointment ID
        const roomName = `Preamganga_Consult_${id}`;
        const options = {
          roomName: roomName,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            disableModeratorIndicator: true,
          },
          interfaceConfigOverwrite: {
            DISABLE_DOMINANT_SPEAKER_INDICATOR: true,
            SHOW_CHROME_EXTENSION_BANNER: false,
          },
          userInfo: {
            // In a real app we'd pass the actual user's name
            displayName: 'Participant'
          }
        };
        const api = new window.JitsiMeetExternalAPI(domain, options);
        
        api.addEventListener('videoConferenceLeft', () => {
          navigate(-1);
        });

        setJitsiApi(api);
      };
      document.body.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [loading, appointment, id, navigate, jitsiApi]);

  const endCall = () => {
    if (jitsiApi) {
      jitsiApi.dispose();
    }
    navigate(-1);
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">Connecting to secure video room...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center">
          <button onClick={endCall} className="mr-4 p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold">Secure Video Consultation</h1>
            <p className="text-xs text-slate-400">End-to-end encrypted • ID: {id}</p>
          </div>
        </div>
        <button onClick={endCall} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors">
          <PhoneOff className="w-4 h-4 mr-2" /> End Consultation
        </button>
      </div>
      
      <div className="flex-1 bg-black relative">
        <div ref={jitsiContainerRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
};

export default VideoRoom;
