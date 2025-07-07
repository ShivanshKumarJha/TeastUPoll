import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap } from 'lucide-react';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  const handleRoleSelect = role => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole === 'student') {
      navigate('/student');
    } else if (selectedRole === 'teacher') {
      navigate('/teacher');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-indigo-100 to-purple-100 px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10 md:p-14 transition-all">
        {/* Badge */}
        <div className="inline-block px-4 py-1 text-sm bg-indigo-600 text-white rounded-full mb-6 animate-pulse">
          ✦ Intervue Poll
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center leading-tight">
          Choose Your <span className="text-indigo-600">Role</span>
        </h1>
        <p className="text-base text-gray-500 text-center mt-2 mb-10">
          Select the role that best describes you to start participating
        </p>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center mb-10">
          {/* Student Card */}
          <div
            onClick={() => handleRoleSelect('student')}
            className={`w-full p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 shadow-md ${
              selectedRole === 'student'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 bg-white hover:border-indigo-400 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="text-indigo-600 w-6 h-6" />
              <h3 className="text-xl font-semibold text-gray-800">
                I’m a Student
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Participate in fun, interactive polls and share your responses
              live.
            </p>
          </div>

          {/* Teacher Card */}
          <div
            onClick={() => handleRoleSelect('teacher')}
            className={`w-full p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 shadow-md ${
              selectedRole === 'teacher'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-purple-400 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <User className="text-purple-600 w-6 h-6" />
              <h3 className="text-xl font-semibold text-gray-800">
                I’m a Teacher
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Host polls, ask questions, and monitor live results.
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-8 py-3 rounded-full font-semibold text-white transition duration-300 shadow-md ${
              selectedRole
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
