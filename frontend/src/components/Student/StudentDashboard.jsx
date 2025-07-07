import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import NameEntry from './NameEntry';
import AnswerPoll from './AnswerPoll';
import ViewResults from './ViewResults';
import ChatPopup from '../common/ChatPopup';
import KickedScreen from './KickedScreen';

const StudentDashboard = () => {
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [poll, setPoll] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [kicked, setKicked] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    const savedToken = localStorage.getItem('studentToken');
    if (savedToken && socket) {
      // Attempt to reconnect
      socket.emit('reconnectStudent', savedToken, response => {
        if (response.success) {
          setToken(savedToken);
          setName(response.name);
        } else {
          localStorage.removeItem('studentToken');
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      // Listen for kick event
      const handleKicked = () => {
        setKicked(true);
        localStorage.removeItem('studentToken');
      };

      const handleLoggedOut = () => {
        localStorage.removeItem('studentToken');
        setToken('');
        setName('');
      };

      socket.on('kicked', handleKicked);

      socket.on('newPoll', newPoll => {
        setPoll(newPoll);
        setHasAnswered(false);
      });

      socket.on('updateResults', setPoll);

      socket.on('pollEnded', () => {
        setHasAnswered(true);
      });

      socket.on('loggedOut', handleLoggedOut);

      return () => {
        socket.off('kicked', handleKicked);
        socket.off('newPoll');
        socket.off('updateResults');
        socket.off('pollEnded');
        socket.off('loggedOut', handleLoggedOut);
      };
    }
  }, [socket]);

  const handleRegistered = (token, name) => {
    setToken(token);
    setName(name);
  };

  if (kicked) {
    return <KickedScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      {token && (
        <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Welcome, {name}
                </h1>
                <p className="text-sm text-gray-600">Student Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <svg
                className="w-5 h-5 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {chatOpen ? 'Close Chat' : 'Open Chat'}
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`container mx-auto px-4 ${token ? 'py-8' : ''}`}>
        {!token ? (
          <NameEntry onRegistered={handleRegistered} />
        ) : !poll ? (
          <div className="max-w-lg mx-auto mt-20 animate-fadeInUp">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-custom">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Waiting for Poll
              </h2>
              <p className="text-gray-600 mb-6">
                The teacher hasn't started a poll yet. Please wait while we
                prepare the next question...
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        ) : hasAnswered ? (
          <ViewResults poll={poll} />
        ) : (
          <AnswerPoll poll={poll} token={token} name={name} />
        )}
      </main>

      {/* Chat Popup */}
      <ChatPopup
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        userType="student"
        userId={token}
        userName={name}
      />
    </div>
  );
};

export default StudentDashboard;
