const router = require('express').Router();
const notificationController = require('../controllers/notification-controller');
const asyncMiddleware = require('../middlewares/async-middleware');

router.get('/get_notifications/:userId', asyncMiddleware(notificationController.getNotifications));

module.exports = router;
   