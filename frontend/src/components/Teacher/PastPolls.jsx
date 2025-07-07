import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../../hooks/useSocket'; // Adjust path as needed

const PastPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    const fetchPastPolls = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'https://teastupoll.onrender.com/api/polls'
        );
        setPolls(response.data || []);
      } catch (err) {
        setError(
          'Failed to fetch past polls. Please make sure the server is running.'
        );
        console.error('Error fetching past polls:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPastPolls();

    // Add WebSocket listener for new polls
    if (socket) {
      const handleNewPollEnded = newPoll => {
        setPolls(prev => [newPoll, ...prev]);
      };

      socket.on('pollEnded', handleNewPollEnded);

      return () => {
        socket.off('pollEnded', handleNewPollEnded);
      };
    }
  }, [socket]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="text-gray-600 mt-2">Loading past polls...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No past polls available
      </div>
    );
  }

  const getOptionLabel = index => String.fromCharCode(65 + index); // A, B, C...

  return (
    <div className="space-y-10">
      {polls.map((poll, idx) => {
        const totalVotes = poll.results.reduce((sum, r) => sum + r.count, 0);

        return (
          <div
            key={poll._id}
            className="rounded-xl shadow-lg overflow-hidden border border-gray-200"
          >
            {/* Gradient Header with Question */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-4 py-3 text-sm font-semibold">
              {`Q${idx + 1}. ${poll.question}`}
            </div>

            {/* Poll Results */}
            <div className="bg-white px-4 py-5 space-y-4">
              {poll.results.map((result, index) => {
                const percentage =
                  totalVotes > 0
                    ? Math.round((result.count / totalVotes) * 100)
                    : 0;

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
                        percentage === 100 ? 'text-white' : 'text-black'
                      }`}
                    >
                      {`${getOptionLabel(index)}. ${result.option}`}
                    </span>

                    {/* Percentage (right-aligned) */}
                    <span
                      className={`z-10 ${
                        percentage === 0 ? 'text-black' : 'text-white'
                      }`}
                    >
                      {percentage}%
                    </span>
                  </div>
                );
              })}

              <p className="text-xs text-gray-500 mt-3">
                Conducted on:{' '}
                {poll.endTime ? new Date(poll.endTime).toLocaleString() : 'N/A'}
              </p>

              {/* Total Votes Badge */}
              <div className="mt-2 text-right">
                <span className="inline-block bg-gradient-to-r from-gray-300 to-gray-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  🗳️ Total Votes: {totalVotes}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PastPolls;
