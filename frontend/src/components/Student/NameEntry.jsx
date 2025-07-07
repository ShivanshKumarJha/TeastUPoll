import React, { useState } from 'react';
import { useSocket } from '../../hooks/useSocket';

const NameEntry = ({ onRegistered }) => {
  const [name, setName] = useState('');
  const socket = useSocket();

  const handleSubmit = e => {
    e.preventDefault();
    if (name.trim()) {
      socket.emit('registerStudent', name.trim(), response => {
        localStorage.setItem('studentToken', response.token);
        onRegistered(response.token, name.trim());
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header Section */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-6 animate-pulse-custom">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Live Polling System
          </h1>
          <p className="text-white/80 text-lg">
            Join the conversation, make your voice heard
          </p>
        </div>

        {/* Main Card */}
        <div
          className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Live Polling
              </h2>
              <p className="text-gray-600">
                Enter your name to join the session
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg"
                  placeholder="Your Name"
                  autoFocus
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform ${
                  name.trim()
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!name.trim()}
              >
                {name.trim() ? 'Join Session' : 'Enter Your Name'}
              </button>
            </form>
          </div>

          {/* Decorative Bottom Border */}
          <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500"></div>
        </div>

        {/* Footer */}
        <div
          className="text-center mt-8 animate-fadeInUp"
          style={{ animationDelay: '0.4s' }}
        >
          <p className="text-white/70 text-sm">
            Powered by TeastuPoll • Real-time Polling Made Simple
          </p>
        </div>
      </div>
    </div>
  );
};

export default NameEntry;
