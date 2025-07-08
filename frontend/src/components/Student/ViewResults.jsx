import React from 'react';

const ViewResults = ({ poll }) => {
  const totalVotes = poll.answers.length;

  const getOptionLabel = index => String.fromCharCode(65 + index); // A, B, C...

  return (
    <div className="max-w-2xl mx-auto rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-4 py-3 text-sm font-semibold">
        Poll Results
      </div>

      {/* Poll Content */}
      <div className="bg-white px-4 py-5 space-y-4">
        <p className="font-medium text-gray-800 mb-4">{poll.question}</p>

        {poll.options.map((option, index) => {
          const votes = poll.answers.filter(a => a.answer === index).length;
          const percentage =
            totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

          return (
            <div
              key={index}
              className="w-full h-10 relative bg-gray-100 rounded-full overflow-hidden flex items-center justify-between px-3 text-sm font-medium"
            >
              {/* Filled Bar */}
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                style={{
                  width: `${percentage}%`,
                  borderRadius: '9999px',
                }}
              ></div>

              {/* Option Label (left-aligned) */}
              <span
                className={`z-10 ${
                  percentage > 30 ? 'text-white' : 'text-black'
                }`}
              >
                {`${getOptionLabel(index)}. ${option}`}
              </span>

              {/* Percentage (right-aligned) */}
              <span
                className={`z-10 ${
                  percentage > 70 ? 'text-white' : 'text-black'
                }`}
              >
                {percentage}%
              </span>
            </div>
          );
        })}

        {/* Total Votes Badge */}
        <div className="mt-6 text-right">
          <span className="inline-block bg-gradient-to-r from-gray-300 to-gray-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            🗳️ Total Votes: {totalVotes}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ViewResults;
