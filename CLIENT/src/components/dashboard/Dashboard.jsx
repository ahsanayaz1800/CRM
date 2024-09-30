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
import Adviser from "./adviser";
import Verifier from "./verifier";
import User from "./User"; // Assuming you have a TestUser component
import io from "socket.io-client"; // Import socket.io-client
import { useEffect } from "react";
import 'dotenv/config'

const Dashboard = () => {
  const { user } = useSelector(state => state.authSlice);
  const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL); // Set your Socket.io server URL

  // useEffect(() => {
  //   // Socket connection and event listeners
  //   socket.on('connect', () => {
  //     console.log('Connected to socket server');
  //   });

  //   socket.on('message', (message) => {
  //     console.log('New message:', message);
  //     // Handle incoming messages
  //   });

  //   // Clean up on component unmount
  //   return () => {
  //     socket.off('message');
  //     socket.disconnect();
  //   };
  // }, []);
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

  return (
    <div className="main-content">
      <section className="section">
        <HeaderSection title='Dashboard'/>
        {renderComponent()}
      </section>
    </div>
  );
}

export default Dashboard;
