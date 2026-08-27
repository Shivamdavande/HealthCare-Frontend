import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { ArrowLeft, Send, User, CheckCircle, FileText } from 'lucide-react';

const ChatRoom = () => {
  const { id } = useParams(); // appointment ID
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Initialize data
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchAppointmentDetails = async () => {
      try {
        const { data: aptData } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/appointments/${id}`, { withCredentials: true });
        setAppointment(aptData);
        
        const { data: msgData } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/appointments/${id}/messages`, { withCredentials: true });
        setMessages(msgData);
      } catch (err) {
        console.error('Failed to fetch data', err);
        setError('Failed to load chat details.');
      }
    };

    fetchAppointmentDetails();
  }, [id, currentUser]);

  // Setup Socket
  useEffect(() => {
    if (!currentUser) return;

    // Connect socket
    const newSocket = io(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}`, {
      withCredentials: true,
      // If server expects token in auth
      auth: {
        token: document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1] // Or however jwt is stored. The backend chatSocket uses socket.handshake.auth.token
      }
    });

    newSocket.on('connect', () => {
      newSocket.emit('join_chat', id);
    });

    newSocket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [id, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    // Optimistically update UI if we wanted, but we'll let socket handle broadcast to all including sender if possible.
    // Actually the server broadcasts to the room, so sender might receive it.
    // Let's emit the message
    socket.emit('send_message', {
      appointmentId: id,
      content: newMessage
    });
    setNewMessage('');
  };

  const handleCompleteChat = async () => {
    try {
      const { data } = await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/appointments/${id}/complete-chat`, {}, { withCredentials: true });
      setAppointment(data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to complete chat');
    }
  };

  if (!currentUser) return <div className="p-10 text-center">Loading user...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!appointment) return <div className="p-10 text-center">Loading chat...</div>;

  const isDoctor = currentUser.role === 'DOCTOR';
  const hasPrescription = !!appointment.prescriptionId;
  const ICompleted = isDoctor ? appointment.doctorCompletedChat : appointment.patientCompletedChat;
  const ChatFullyCompleted = appointment.status === 'COMPLETED';
  
  let completeButtonDisabled = false;
  let completeButtonTooltip = '';

  if (ICompleted) {
    completeButtonDisabled = true;
    completeButtonTooltip = "You have marked this as complete.";
  } else if (isDoctor && !hasPrescription) {
    completeButtonDisabled = true;
    completeButtonTooltip = "Please upload a prescription before completing.";
  } else if (!isDoctor && !hasPrescription) {
    completeButtonDisabled = true;
    completeButtonTooltip = "Waiting for doctor to upload prescription.";
  } else if (ChatFullyCompleted) {
    completeButtonDisabled = true;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center shadow-sm z-10 sticky top-0 justify-between">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold mr-3">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 flex items-center">
                Consultation Chat
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
              </h1>
              <p className="text-xs text-slate-500">
                {ChatFullyCompleted ? 'Session Completed' : 'End-to-end encrypted'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {isDoctor && !hasPrescription && !ChatFullyCompleted && (
            <button 
              onClick={() => navigate(`/doctor/prescription/${id}`)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Write Prescription
            </button>
          )}

          <button 
            onClick={handleCompleteChat}
            disabled={completeButtonDisabled}
            title={completeButtonTooltip}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
              ICompleted || ChatFullyCompleted ? 'bg-green-100 text-green-800' :
              completeButtonDisabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {ChatFullyCompleted ? 'Completed' : ICompleted ? 'Waiting for other party' : 'Complete Meet'}
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            No messages yet. Start the conversation.
          </div>
        )}
        
        {messages.map((msg, index) => {
          const isMe = msg.sender === currentUser._id || msg.sender === currentUser.id;
          const timeString = new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          
          return (
            <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                isMe 
                  ? 'bg-primary-600 text-white rounded-br-none shadow-sm' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              }`}>
                <p className="text-sm">{msg.content || msg.text}</p>
                <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-100' : 'text-slate-400'}`}>
                  {timeString}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!ChatFullyCompleted && (
        <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message securely..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
