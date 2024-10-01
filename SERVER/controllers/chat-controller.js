// chatController.js
const chatService = require('../services/chat-service');

const sendMessage = async (req, res) => {
  const { teamId, userId, message } = req.body;
  try {
    const newMessage = await chatService.saveMessage(teamId, userId, message);

    // Emit the message via Socket.IO
    const io = req.app.get('socketio');
    io.to(teamId).emit('receiveChatMessage', newMessage);

    return res.status(201).json({ success: true, message: 'Message sent', data: newMessage });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch chat history
const getChatHistory = async (req, res) => {
  const { teamId } = req.params;
  try {
    const chatHistory = await chatService.fetchChatHistory(teamId);
    return res.status(200).json({ success: true, data: chatHistory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getTeams = async(req, res)=> {
    try {
        console.log(req.body)
        const userId = req.params.userId;

        // Fetch the teams using the service
        const teams = await chatService.getTeamsByUserId(userId);

        return res.status(200).json({ success: true, data: teams });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
  sendMessage,
  getChatHistory,
  getTeams
};
