import React, { useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import Button from '../common/Button';

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(60);
  const socket = useSocket();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, '']);
  const removeOption = i =>
    options.length > 2 && setOptions(options.filter((_, idx) => idx !== i));
  const createPoll = () => {
    const valid = options.filter(o => o.trim() !== '');
    if (!question.trim() || valid.length < 2)
      return alert('Enter valid question and at least 2 options');
    socket.emit('createPoll', {
      question: question.trim(),
      options: valid,
      duration,
    });
    setQuestion('');
    setOptions(['', '']);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Poll</h2>
      <input
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Poll question"
        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {options.map((opt, i) => (
        <div className="flex mb-2" key={i}>
          <input
            value={opt}
            onChange={e => handleOptionChange(i, e.target.value)}
            className="flex-1 px-3 py-2 border rounded-l-lg focus:ring-indigo-500"
            placeholder={`Option ${i + 1}`}
          />
          <button
            onClick={() => removeOption(i)}
            disabled={options.length <= 2}
            className="bg-red-500 text-white px-3 rounded-r-lg hover:bg-red-600 disabled:bg-red-300"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addOption}
        className="text-indigo-600 mt-2 hover:underline text-sm"
      >
        + Add Option
      </button>
      <div className="mt-4">
        <label className="block text-gray-700 mb-1">Duration (seconds)</label>
        <input
          type="number"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500"
          min="10"
        />
      </div>
      <button
        onClick={createPoll}
        disabled={!question.trim() || options.filter(o => o.trim()).length < 2}
        className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all shadow"
      >
        Start Poll
      </button>
    </div>
  );
};

export default CreatePoll;
