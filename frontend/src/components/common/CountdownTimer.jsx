import React from 'react';

const CountdownTimer = ({ timeLeft }) => {
  const isUrgent = timeLeft <= 10;
  const isWarning = timeLeft <= 30 && timeLeft > 10;

  return (
    <div className="text-center">
      <div
        className={`inline-flex items-center px-4 py-2 rounded-full ${
          isUrgent
            ? 'bg-red-100 text-red-700'
            : isWarning
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-blue-100 text-blue-700'
        }`}
      >
        <svg
          className={`w-5 h-5 mr-2 ${isUrgent ? 'animate-pulse' : ''}`}
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
        <span className="font-semibold">
          {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;
