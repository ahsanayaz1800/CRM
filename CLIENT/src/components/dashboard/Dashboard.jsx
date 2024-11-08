import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import HeaderSection from "../HeaderSection";
import Admin from "./Admin";
import Employee from "./Employee";
import Leader from "./Leader";
import Supervisor from "./Supervisor";
import Agent from "./Agent";
import CustomerService from "./CustomerService";
import JuniorAdmin from "./JuniorAdmin";
import Manager from "./Manager";
import Adviser from "./Adviser";
import Verifier from "./Adviser";
import User from "./User";
import { getNotifications } from "../../http";
import io from "socket.io-client"; // Uncomment if you're using socket.io

const Dashboard = () => {
  const { user } = useSelector(state => state.authSlice);
  const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL); // Set your Socket.io server URL
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // State to control view all notifications
  const { name, image, type } = useSelector((state) => state.authSlice.user);

  const showActivities = ['Admin', 'Manager', 'Junior_admin'].includes(type);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        console.log(response);
        setNotifications(response); // Assuming response contains the array of notifications
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const renderComponent = () => {
    switch (user.type) {
      case 'Admin':
        return <Admin />;
      case 'Leader':
        return <Leader />;
      case 'Supervisor':
        return <Supervisor />;
      case 'Agent':
        return <Agent />;
      case 'Manager':
        return <Manager />;
      case 'Test User':
        return <User />;
      case 'Verifier':
        return <Verifier />;
      case 'FA Advisor':
        return <Adviser />;
      case 'Customer Service':
        return <CustomerService />;
      case 'Junior Admin':
        return <JuniorAdmin />;
      default:
        return <Employee />;
    }
  };

  const toggleShowAll = () => {
    setShowAll(prev => !prev);
  };

  return (
    <div className="main-content">
      <section className="section">
        <HeaderSection title='Dashboard'/>

        {showActivities && (
          <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            {renderComponent()}
          </div>
          <div>
            <div style={{ width: '280px', height: '400px' }}> 
              <div className="activities-table" > 
                <h3>Activities</h3>
                <div 
                  style={{ 
                    maxHeight: showAll ? '400px' : '400px', // Adjust height based on showAll state
                    overflowY: showAll ? 'scroll': 'hidden' // Enable scrolling only when showAll is true
                  }}
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="1">Loading...</td>
                        </tr>
                      ) : notifications.length > 0 ? (
                        (showAll ? notifications : notifications.slice(0, 5)).map((notification) => (
                          <tr key={notification._id}>
                            <td>{notification.message}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="1">No notifications found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <button onClick={toggleShowAll} style={{ marginTop: '10px' }}>
                  {showAll ? 'View Less' : 'View All'}
                </button>
              </div>
            </div>
          </div>
        </div>

)}


{!showActivities && renderComponent()}
        



     
      </section>
    </div>
  );
};

export default Dashboard;
