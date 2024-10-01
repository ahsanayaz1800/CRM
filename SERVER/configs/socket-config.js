const socketIo = require('socket.io');
const Customer = require('../models/customer-modal');
const User = require('../models/user-model');
const Notification = require('../models/notification-model'); // Import Notification model

let io;  // Declare io globally
let latestChange = null; // Store the latest change globally

const socketConnection = (server) => {
  io = socketIo(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://1.1.1.111:3000', process.env.CLIENT_URL],
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true 
    }
  });
     // **Chat functionality**
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // **Join room for team chat**
    socket.on('joinRoom', ({ teamId }) => {
      socket.join(teamId);
      console.log(`User ${socket.id} joined room ${teamId}`);
    });

    // **Handle message sending**
    socket.on('sendChatMessage', (messageData) => {
      const { teamId } = messageData;
      io.to(teamId).emit('receiveChatMessage', messageData); // Emit to the room
    });

    // **Leave room on disconnect**
    socket.on('leaveRoom', ({ teamId }) => {
      socket.leave(teamId);
      console.log(`User ${socket.id} left room ${teamId}`);
    });

    // **Disconnect handling for chat**
    socket.on('disconnect', () => {
      console.log('Client disconnected from chat:', socket.id);
    });
  });
  // Watch changes in the Customer model
  const changeStream = Customer.watch();

  changeStream.on('change', async (change) => {
    console.log('Change detected:', change);
  
    try {
      // Store the latest change
      latestChange = change;
  
      // Initialize variables for customer and role information
      let message = `Change detected: ${change.operationType}`;
      let customerData = null;
      let roleName = "Unknown Role"; // Default role name if not available
      let roleType = "Unknown Type"; // Default role type if not available
      let customerId = null
      // Fetch the customer data if the change involves an insert or update operation
      if (change.operationType === 'insert' && change.fullDocument) {
        customerData = change.fullDocument; // Full document available on insert
      } else if (change.operationType === 'update' || change.operationType === 'replace') {
        // Fetch updated customer data based on the customer ID
        customerData = await Customer.findById(change.documentKey._id).lean();
      } else if (change.operationType === 'delete') {
        message = `Customer deleted with ID: ${change.documentKey._id}`;
      }
  
      // If customer data is available, construct the message with role information
      if (customerData) {
        const customerName = customerData.customerInformation.customerName || "Unknown Customer";
          if (customerData){
            customerId=customerData._id

          }
        // If roleInformation exists in customer data, extract it
        if (customerData.roleInformation) {
          roleName = customerData.roleInformation.roleName || roleName;
          roleType = customerData.roleInformation.roleType || roleType;
        }
  
        // Update the message format
        message = `Customer ${customerName} ${change.operationType} by ${roleType} ${roleName} `;
      }
  
      // Notify all connected clients of the latest change
      io.emit('notification', {
        message, // Use the new message format
        change: latestChange, // Send the change details to clients
        customerData, // Include customer data
        customerId,
        timestamp: new Date().toISOString(),
        priority: 1
      });
  
      // Fetch users of types 'manager', 'admin', and 'junior_admin'
      const users = await User.find({ type: { $in: ['manager', 'admin', 'junior_admin'] } });
  
      // Save notifications to the database
      await Promise.all(users.map(user => {
        const notification = new Notification({
          userId: user._id,
          message,
          customerId,
          timestamp: new Date(),
          changeDetails: latestChange, // Store the entire change object
          priority: 1 // Set priority as needed
        });
        return notification.save();
      }));
  
      // Notify specific users
      users.forEach(user => {
        if (user.socketId) {
          console.log('Emitting notification to:', user.socketId);
          io.to(user.socketId).emit('notification', {
            message, // Use the new message format
            customerData, // Send the customer data to the user
            timestamp: new Date().toISOString(),
            priority: 1 // Adjust priority as needed
          });
        }
      });
  
    } catch (err) {
      console.error('Error fetching customer data or sending notifications:', err);
    }
  });
  


  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
     
 
    // Update user's socketId
    const userEmail = socket.handshake.query.email;  // Assuming you're passing the email in the handshake query
    if (userEmail) {
      User.findOneAndUpdate({ email: userEmail }, { socketId: socket.id }, { new: true })
        .then(user => console.log('User socketId updated:', user))
        .catch(err => console.error('Error updating user socketId:', err));
    }
 
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);

      // Clear socketId on disconnect
      User.findOneAndUpdate({ socketId: socket.id }, { socketId: null })
        .then(user => console.log('User socketId cleared:', user))
        .catch(err => console.error('Error clearing user socketId:', err));
    });
  });
};


module.exports = socketConnection;
     