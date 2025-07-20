import React, { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../../hooks/useSocket';
import CountdownTimer from '../common/CountdownTimer';

const AnswerPoll = ({ poll, token, name }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(poll.duration);
  const [submitted, setSubmitted] = useState(false);
  const [votes, setVotes] = useState(poll.answers || []);
  const socket = useSocket();

  // Handle time expiration
  const handleTimeExpired = useCallback(() => {
    if (!submitted) {
      setSubmitted(true);
    }
  }, [submitted]);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if time has expired
  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      handleTimeExpired();
    }
  }, [timeLeft, submitted, handleTimeExpired]);

  // Listen for updated poll results
  useEffect(() => {
    if (socket) {
      const handleUpdatedResults = data => {
        setVotes(data.answers);
      };
      socket.on('updatedPollResults', handleUpdatedResults);
      return () => socket.off('updatedPollResults', handleUpdatedResults);
    }
  }, [socket]);

  // Submit answer to the server
  const submitAnswer = () => {
    if (!submitted) {
      socket.emit('submitAnswer', {
        token,
        name,
        answer: selectedOption,
      });
      setSubmitted(true);
    }
  };

  // Only show results when time is up
  const showResults = timeLeft === 0;
  const totalVotes = votes.length;

  const getOptionVotes = index => votes.filter(v => v.answer === index).length;

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{poll.question}</h2>
              <p className="text-purple-100">Choose your answer below</p>
            </div>
            <div className="text-right">
              <CountdownTimer timeLeft={timeLeft} />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {poll.options.map((option, index) => {
              const label = String.fromCharCode(65 + index);
              const votesCount = getOptionVotes(index);
              const percentage =
                totalVotes > 0
                  ? Math.round((votesCount / totalVotes) * 100)
                  : 0;

              return (
                <div
                  key={index}
                  className={`relative w-full h-12 rounded-xl overflow-hidden border-2 transition-all duration-200 px-4 flex items-center justify-between text-sm font-medium ${
                    showResults ? 'cursor-default' : ''
                  } ${
                    selectedOption === index && !showResults
                      ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                  onClick={() =>
                    !submitted && timeLeft > 0 && setSelectedOption(index)
                  }
                >
                  {/* Filled Background - Only show after timer ends */}
                  {showResults && (
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl z-0"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  )}

                  {/* Label and Text */}
                  <span
                    className={`z-10 flex items-center gap-2 ${
                      showResults && percentage > 50
                        ? 'text-white'
                        : 'text-black'
                    }`}
                  >
                    <span className="bg-white text-purple-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                      {label}
                    </span>
                    {option}
                  </span>

                  {/* Percentage - Only show after timer ends */}
                  {showResults && (
                    <span
                      className={`z-10 text-sm font-semibold ${
                        percentage > 50 ? 'text-white' : 'text-black'
                      }`}
                    >
                      {percentage}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Button or Status */}
          {!submitted && timeLeft > 0 ? (
            <div className="text-center">
              <button
                onClick={submitAnswer}
                disabled={selectedOption === null}
                className={`px-12 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform ${
                  selectedOption !== null
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {selectedOption !== null ? 'Submit Answer' : 'Select an Option'}
              </button>
            </div>
          ) : (
            <div
              className={`text-center py-6 rounded-xl ${
                timeLeft === 0
                  ? 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200'
                  : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
              }`}
            >
              <div className="mb-3">
                {timeLeft === 0 ? (
                  <svg
                    className="w-12 h-12 text-red-500 mx-auto"
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
                ) : (
                  <svg
                    className="w-12 h-12 text-green-500 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <p
                className={`font-bold text-lg ${
                  timeLeft === 0 ? 'text-red-700' : 'text-green-700'
                }`}
              >
                {timeLeft === 0 ? 'Time Expired!' : 'Answer Submitted!'}
              </p>
              <p
                className={`mt-2 ${
                  timeLeft === 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {timeLeft === 0
                  ? 'The poll has ended.'
                  : 'Waiting for results...'}
              </p>
            </div>
          )}

          {/* Total Votes Badge - Only show after timer ends */}
          {showResults && (
            <div className="mt-6 text-right">
              <span className="inline-block bg-gradient-to-r from-gray-300 to-gray-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                🗳️ Total Votes: {totalVotes}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerPoll;
