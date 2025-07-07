import React from 'react';
import { useNavigate } from 'react-router-dom';

const KickedScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-red-600 text-white p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">You've been Kicked out!</h1>
          <p className="opacity-90">
            Looks like the teacher had removed you from the poll system. Please
            try again sometime.
          </p>
        </div>

        <div className="p-8 text-center">
          <p className="text-gray-600 mb-6">
            You can join again with a new session, but please follow the
            teacher's instructions.
          </p>

          <button
            onClick={() => {
              localStorage.removeItem('studentToken');
              navigate('/');
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition"
          >
            Return to Welcome Screen
          </button>
        </div>
      </div>
    </div>
  );
};

export default KickedScreen;
