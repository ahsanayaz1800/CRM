// services/notification-service.js
const Notification = require('../models/notification-model');

const getNotificationsByUserId = async (userId) => {
  try {
    return await Notification.find({ userId }).sort({ timestamp: -1 }); // Sort by timestamp, most recent first
  } catch (error) {
    throw new Error('Error fetching notifications: ' + error.message);
  }
};

module.exports = {
  getNotificationsByUserId
};
