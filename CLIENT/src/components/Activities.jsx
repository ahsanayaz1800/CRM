import React, { useEffect, useState } from 'react';
import { getNotifications } from '../http'; // Ensure this points to your API functions
import { Spinner } from 'react-bootstrap';
const Activities = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        console.log(response);
        setNotifications(response); // assuming response contains the array of notifications
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    // Format date: MM-DD-YYYY
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // Format time: h:mm AM/PM
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return { formattedDate, formattedTime };
  };

  if (loading) {
    return <div style={{justifyContentz:'center', alignItems:'center'}}><Spinner></Spinner></div>;
  }

  return (
    <div className="activities-table">
      <h2>Activities</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Message</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const { formattedDate, formattedTime } = formatDateTime(notification.timestamp);
              return (
                <tr key={notification._id.$oid}>
                  <td>{notification.message}</td>
                  <td>{formattedDate}</td>
                  <td>{formattedTime}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="3">No notifications found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Activities;
