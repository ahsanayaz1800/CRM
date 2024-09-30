// chatService.js
const Chat = require('../models/chat-model'); // Import Chat model

// Save a new chat message
const saveMessage = async (teamId, userId, message) => {
  try {
    const newMessage = new Chat({
      teamId,
      sender: userId,
      message,
    });
    await newMessage.save();
    return newMessage;
  } catch (err) {
    throw new Error('Error saving message: ' + err.message);
  }
};

// Fetch chat history for a team
const fetchChatHistory = async (teamId) => {
  try {
    const messages = await Chat.find({ teamId }).populate('sender', 'name').sort({ createdAt: 1 });
    return messages;
  } catch (err) {
    throw new Error('Error fetching chat history: ' + err.message);
  }
};

module.exports = {
  saveMessage,
  fetchChatHistory,
};
