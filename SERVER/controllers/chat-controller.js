// chatController.js
const chatService = require('../services/chatService');

// Controller for sending a message
const sendMessage = async (req, res) => {
  const { teamId, userId, message } = req.body;
  try {
    const newMessage = await chatService.saveMessage(teamId, userId, message);
    return res.status(201).json({ success: true, message: 'Message sent', data: newMessage });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Controller for fetching chat history
const getChatHistory = async (req, res) => {
  const { teamId } = req.params;
  try {
    const chatHistory = await chatService.fetchChatHistory(teamId);
    return res.status(200).json({ success: true, data: chatHistory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
};
