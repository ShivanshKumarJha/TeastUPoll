import React from 'react';

const ViewResults = ({ poll }) => {
  const totalVotes = poll.answers.length;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-4 py-2 font-semibold text-sm">
        Poll Results
      </div>

      {/* Poll Content */}
      <div className="bg-white px-4 py-5 space-y-4">
        <p className="font-medium text-gray-800">{poll.question}</p>

        {poll.options.map((option, index) => {
          const votes = poll.answers.filter(a => a.answer === index).length;
          const percentage =
            totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

          const label = String.fromCharCode(65 + index); // A, B, C...

          return (
            <div key={index} className="space-y-1">
              <div className="w-full bg-gray-100 h-10 rounded-full overflow-hidden relative">
                {/* Filled Bar */}
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300 flex items-center justify-between px-3"
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 0 && (
                    <>
                      <span className="flex items-center gap-2 text-white text-sm font-semibold">
                        <span className="bg-white text-purple-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                          {label}
                        </span>
                        {option}
                      </span>
                      <span className="text-white text-sm font-semibold">
                        {percentage}%
                      </span>
                    </>
                  )}
                </div>

                {/* Text for 0% votes */}
                {percentage === 0 && (
                  <div className="absolute inset-0 flex justify-between items-center px-3 text-sm font-semibold text-black">
                    <span className="flex items-center gap-2">
                      <span className="bg-purple-400 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                        {label}
                      </span>
                      {option}
                    </span>
                    <span>{percentage}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Total Votes Badge */}
        <div className="mt-4 text-right">
          <span className="inline-block bg-gradient-to-r from-gray-300 to-gray-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            🗳️ Total Votes: {totalVotes}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ViewResults;
