// models/notification-model.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  customerId:{type: String},
  timestamp: { type: Date, default: Date.now },
  changeDetails: { type: Object, required: true } ,// Store the entire change object
  priority: { type: Number, default: 1 } // You can define priorities as needed
});

module.exports = mongoose.model('Notification', notificationSchema);
