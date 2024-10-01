const router = require('express').Router();
const chatController = require('../controllers/chat-controller');
const asyncMiddleware = require('../middlewares/async-middleware');

// Customer Routes
// router.get('/get_chat_teams/:userId', asyncMiddleware(chatController.getTeams));        // Get all customers
router.get('/get_chat_teams/:userId', asyncMiddleware(chatController.getTeams));
router.post('/send_message', asyncMiddleware(chatController.sendMessage));
router.get('/get_chat_message/:teamId', asyncMiddleware(chatController.getChatHistory));


module.exports = router;
