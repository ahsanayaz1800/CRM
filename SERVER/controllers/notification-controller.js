// controllers/notification-controller.js
const notificationService = require('../services/notification-service');

const getNotifications = async (req, res) => {
  const userId = req.params.userId; // Get userId from request parameters

  try {
    const notifications = await notificationService.getNotificationsByUserId(userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

module.exports = {
  getNotifications
};
