const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  socketId: String,
  lastActive: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Student', StudentSchema);
