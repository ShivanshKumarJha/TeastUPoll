const ChatMessage = require('../models/ChatMessage');

// Save chat message to database
exports.saveMessage = async messageData => {
  try {
    const newMessage = new ChatMessage({
      senderType: messageData.senderType,
      senderId: messageData.senderId,
      senderName: messageData.senderName,
      message: messageData.message,
    });

    return await newMessage.save();
  } catch (err) {
    console.error('Error saving chat message:', err);
    throw err;
  }
};

// Get chat history
exports.getChatHistory = async () => {
  try {
    return await ChatMessage.find().sort({ timestamp: -1 }).limit(50).exec();
  } catch (err) {
    console.error('Error fetching chat history:', err);
    throw err;
  }
};
