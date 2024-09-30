import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useHistory } from "react-router-dom"; // Import useHistory
import notificationSound from '../../src/assets/sound/notification.wav'
const socket = io(process.env.REACT_APP_BASE_URL, {
  transports: ['websocket'] // Ensure WebSocket transport is used
});

const Notification = () => {
  const [messages, setMessages] = useState([]);
  const history = useHistory(); // Initialize useHistory for navigation
  const [notificationData, setNotificationData]=useState()
  const notificationSoundUrl = '/sounds/notification.mp3'; // Adjust the path as needed
  const notificationAudio = new Audio(notificationSound);

  useEffect(() => {
    // Listen for notifications from the server
    socket.on('notification', (data) => {
      console.log('Notification received:', data); // Added logging
      setNotificationData(data)
      // Play the notification sound
      notificationAudio.play().catch((error) => {
        console.error("Failed to play notification sound", error);
      });

      setMessages(prevMessages => {
        const updatedMessages = [data, ...prevMessages];
        return updatedMessages.sort((a, b) => b.priority - a.priority || new Date(b.timestamp) - new Date(a.timestamp));
      });
    });
    // Cleanup listener on component unmount
    return () => {
      socket.off('notification');
    };
  }, [notificationAudio]);
   // Handle notification click to navigate to customer details
  //  const handleNotificationClick = (customerId) => {
  //   if (customerId) {
  //     history.push(`/customer_details/${customerId}`); // Navigate to customer details page
  //   } else {
  //     console.error("Customer ID not found in the notification data");
  //   }
  // };
  return (
    <div className="dropdown-menu dropdown-list dropdown-menu-right">
      <div className="dropdown-header">Notifications
        <div className="float-right">
          <a href='/'>Mark All As Read</a>
        </div>
      </div>
      <div className="dropdown-list-content dropdown-list-icons">
        {messages.length > 0 ? messages.map((msg, index) => (
          <a 
            href="#" 
            key={index} 
            className="dropdown-item"
           // Use customerId to navigate
          >
            <div className="dropdown-item-icon bg-primary text-white">
              <i className="fas fa-bell"></i>
            </div>
            <div className="dropdown-item-desc">
              {msg.message}
              <div className="time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
            </div>
          </a>
        )) : <p>No notifications</p>}
      </div>
      <div className="dropdown-footer text-center">
        <a href='/'>View All <i className="fas fa-chevron-right"></i></a>
      </div>
    </div>
  );
};

export default Notification;
