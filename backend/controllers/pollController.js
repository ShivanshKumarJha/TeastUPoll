const Poll = require('../models/Poll');

exports.createPoll = async pollData => {
  const newPoll = new Poll({
    ...pollData,
    startTime: new Date(),
  });

  // Set end time based on duration
  const endTime = new Date();
  endTime.setSeconds(endTime.getSeconds() + pollData.duration);
  newPoll.endTime = endTime;

  return await newPoll.save();
};

exports.submitAnswer = async (pollId, token, name, answer) => {
  const poll = await Poll.findById(pollId);
  if (!poll) return null;

  // Add answer
  poll.answers.push({ token, name, answer });

  // Update results
  const results = poll.options.map((option, index) => ({
    option,
    count: poll.answers.filter(a => a.answer === index).length,
  }));

  poll.results = results;
  return await poll.save();
};

exports.endPoll = async pollId => {
  const poll = await Poll.findById(pollId);
  if (!poll) return null;

  poll.endTime = new Date();
  return await poll.save();
};

exports.getPastPolls = async () => {
  return await Poll.find({ endTime: { $lt: new Date() } })
    .sort({ endTime: -1 })
    .exec();
};

exports.getActivePoll = async () => {
  return await Poll.findOne({ endTime: { $exists: false } });
};
