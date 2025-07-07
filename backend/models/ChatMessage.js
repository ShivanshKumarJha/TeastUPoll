const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  senderType: {
    type: String,
    enum: ['teacher', 'student'],
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
