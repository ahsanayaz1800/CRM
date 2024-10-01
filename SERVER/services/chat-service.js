// chatService.js
const Chat = require('../models/chat-model'); // Import Chat model
const user = require('../models/user-model')
// Save a new chat message
const saveMessage = async (teamId, userId, message) => {
  try {
    const newMessage = new Chat({
      teamId,
      sender: userId,
      message,
    });
    await newMessage.save();
    return newMessage.populate('sender', 'name').execPopulate();
  } catch (err) {
    throw new Error('Error saving message: ' + err.message);
  }
};

const fetchChatHistory = async (teamId) => {
  try {
    const messages = await Chat.find({ teamId }).populate('sender', 'name').sort({ createdAt: 1 });
    return messages;
  } catch (err) {
    throw new Error('Error fetching chat history: ' + err.message);
  }
};

// Function to fetch teams of a particular user
const getTeamsByUserId= async(userId)=> {
    try {
        // Find the user by ID and populate the 'team' field (which refers to the 'Team' model)
        const User = await user.findById(userId).populate('team');
        
        if (!User) {
            throw new Error('User not found');
        }

        // Return the teams associated with the user
        console.log(User.team)
        return User.team;
    } catch (error) {
        throw new Error(error.message);
    }
}




module.exports = {
  saveMessage,
  fetchChatHistory,
  getTeamsByUserId
};
