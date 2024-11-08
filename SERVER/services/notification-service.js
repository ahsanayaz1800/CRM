// services/notification-service.js
const Notification = require('../models/notification-model');

// service.js
const getNotifications = async () => {
  try {
    // Sort by timestamp, most recent first (use -1 for descending order)
    return await Notification.find().sort({ timestamp: -1 }); // Change to -1 for descending order
  } catch (error) {
    throw new Error('Error fetching notifications: ' + error.message);
  }
};


module.exports = {
  getNotifications
};
