import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Admin from './Navigation/Admin';
import Leader from './Navigation/Leader';
import Employee from './Navigation/Employee';
import Supervisor from './Navigation/Supervisor';
import Agent from './Navigation/Agent';
import Manager from './Navigation/Manager';
import Verifier from './Navigation/Verifier';
import CustomerService from './Navigation/CustomerService';
import JuniorAdmin from './Navigation/JuniorAdmin';
import Adviser from "./Navigation/Advisor";
import User from "./Navigation/User";
import logo from "../assets/img/logo.svg"
import { useEffect } from "react";

const SideBar = () => {
  const { user } = useSelector(state => state.authSlice);
  const permissions = user.permissions

  const renderSidebar = () => {
    switch (user.type) {
      case 'Admin':
        return <Admin />;
      case 'Leader':
        return <Leader />;
      case 'Employee':
        return <Employee />;
      case 'Supervisor':
        return <Supervisor />;
      case 'Agent':
        return <Agent />;
      case 'Manager':
        return <Manager />;
      case 'User':
        return <User />;
      case 'Verifier':
        return <Verifier />;
      case 'Advisor':
        return <Adviser />;
      case 'Customer_service':
        return <CustomerService />;
      case 'Junior_admin':
        return <JuniorAdmin />;
      default:
        return <Employee />; // Default to Employee if role is unknown
    }
  };

  return (
    <div className="main-sidebar">
      <aside id="sidebar-wrapper">
        <div className="sidebar-brand">
        <img src={logo} alt="logo" width="200"   className=""/>

          {/* <NavLink to="/home">The Organization</NavLink> */}
        </div>
        <div className="sidebar-brand sidebar-brand-sm">
          <NavLink to="/home">TM</NavLink>
        </div>
        {renderSidebar()}
      </aside>
    </div>
  );
}

export default SideBar;
