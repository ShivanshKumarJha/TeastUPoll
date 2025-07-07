import React, { useState } from 'react';
import CreatePoll from './CreatePoll';
import LiveResults from './LiveResults';
import StudentList from './StudentList';
import PastPolls from './PastPolls';
import ChatPopup from '../common/ChatPopup';

const TeacherDashboard = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100">
      <header className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">🎓 Teacher Dashboard</h1>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 shadow transition-all"
          >
            {chatOpen ? 'Close Chat' : 'Open Chat'}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CreatePoll />
            <LiveResults />
            <PastPolls />
          </div>

          <div className="lg:col-span-1">
            <StudentList />
          </div>
        </div>
      </main>

      {/* Chat Popup */}
      <ChatPopup
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        userType="student"
        userId="teacher1"
        userName="Teacher"
      />
    </div>
  );
};

export default TeacherDashboard;
