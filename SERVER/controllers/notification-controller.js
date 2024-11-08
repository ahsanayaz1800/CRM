// controllers/notification-controller.js
const notificationService = require('../services/notification-service');

// controller.js
const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getNotifications();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};
  
module.exports = {
  getNotifications
};
