import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import PollChart from '../common/PollChart';

const LiveResults = () => {
  const [poll, setPoll] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('newPoll', setPoll);
      socket.on('updateResults', setPoll);
      socket.on('pollEnded', () => setPoll(null));

      return () => {
        socket.off('newPoll');
        socket.off('updateResults');
        socket.off('pollEnded');
      };
    }
  }, [socket]);

  if (!poll) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all text-center text-gray-600 mb-6">
        No active poll. Create a new poll to see results.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Live Results: <span className="text-indigo-600">{poll.question}</span>
        </h2>
        <button
          onClick={() => socket.emit('endPoll')}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full shadow hover:from-red-600 hover:to-pink-600 transition"
        >
          End Poll Early
        </button>
      </div>

      <PollChart data={poll.answers} options={poll.options} />

      <div className="mt-6 text-gray-700 text-sm text-right">
        <span className="font-medium">Total Votes:</span> {poll.answers.length}
      </div>
    </div>
  );
};

export default LiveResults;
