import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

// In a real app, you'd get the auth token from cookies/local storage or context
// For socket.io auth to work smoothly across domains, we pass it explicitly if possible, 
// or rely on cookies if the socket server is configured for it (withCredentials: true).

const ChatInterface = ({ appointmentId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // We assume the cookie 'jwt' is sent automatically if withCredentials is true
    // However, Socket.io auth payload is often safer if we extract the token.
    // For this boilerplate, we'll setup socket with credentials.
    
    socketRef.current = io(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}`, {
      withCredentials: true,
      // auth: { token: 'YOUR_TOKEN_HERE' } // Ideal way if token is accessible
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join_chat', appointmentId);
    });

    socketRef.current.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [appointmentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socketRef.current.emit('send_message', {
        appointmentId,
        content: newMessage,
      });
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">Consultation Chat</h3>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[500px]">
        {messages.map((msg, idx) => {
          // Compare sender ID with currentUser ID to style bubble
          const isMe = msg.sender === currentUser._id;
          return (
            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-slate-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-primary-600 text-white px-6 py-2 rounded-full font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
