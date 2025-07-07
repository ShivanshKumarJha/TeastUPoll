const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [String],
  duration: {
    type: Number,
    default: 60,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: Date,
  answers: [
    {
      token: String,
      name: String,
      answer: Number,
    },
  ],
  results: [
    {
      option: String,
      count: Number,
    },
  ],
});

module.exports = mongoose.model('Poll', PollSchema);
