import { NavLink } from "react-router-dom";
import { dLogout } from "../../http";
import { setAuth } from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import '../Navigation/CSS/Admin.css'
const Admin = () =>
{
  const dispatch = useDispatch();
  const history = useHistory();
  const logout = async () => {
    await dLogout(); // This should also clear tokens (check if this happens)
    document.cookie = 'refreshToken=; Max-Age=0; path=/;';  // Clear refresh token cookie
    document.cookie = 'accessToken=; Max-Age=0; path=/;';   // Clear access token cookie
    dispatch(setAuth(null));
    history.push('/login');
};
    return(
        <ul className="sidebar-menu">
        <li><NavLink className="nav-link" to="/home"><i className="fas fa-home"></i> <span>Dashboard</span></NavLink></li>
        <li><NavLink className="nav-link" to="/admin_customer"><i className="fas fa-list"></i> <span>Customer Listing</span></NavLink></li>
        {/* <li><NavLink className="nav-link" to="/employees"><i className="fas fa-users"></i> <span>Employees</span></NavLink></li> */}

        <li><NavLink className="nav-link" to="/admins_attendance_details"><i className="fas fa-users-cog"></i> <span>Attendance Details</span></NavLink></li>
        <li><NavLink className="nav-link" to="/admins"><i className="fas fa-users-cog"></i> <span>Admins</span></NavLink></li>
        <li><NavLink className="nav-link" to="/junior_admins"><i className="fas fa-users-cog"></i> <span>Junior Admins</span></NavLink></li>
        <li><NavLink className="nav-link" to="supervisors"><i className="fas fa-users"></i> <span>Supervisors</span></NavLink></li>
        <li><NavLink className="nav-link" to="/managers"><i className="fas fa-users-cog"></i> <span>Managers</span></NavLink></li>
        <li><NavLink className="nav-link" to="/leaders"><i className="fas fa-user-friends"></i> <span>Team Leaders</span></NavLink></li>
        <li><NavLink className="nav-link" to="/agents"><i className="fas fa-users-cog"></i> <span>Agents</span></NavLink></li>
        <li><NavLink className="nav-link" to="/users"><i className="fas fa-users"></i> <span>Users</span></NavLink></li>
        <li><NavLink className="nav-link" to="/verifiers"><i className="fas fa-certificate"></i> <span>Verifier</span></NavLink></li>
        <li><NavLink className="nav-link" to="/advisors"><i className="fas fa-users-cog"></i> <span>Financial Advisor</span></NavLink></li>
        <li><NavLink className="nav-link" to="/customer_services"><i className="fas fa-fire"></i> <span>Customer Service</span></NavLink></li>
        <li><NavLink className="nav-link" to="/admin_attendance"><i className="fas fa-list"></i> <span>Attendance</span></NavLink></li>

        {/* <li><NavLink className="nav-link" to="/attendance"><i className="fas fa-user"></i> <span>Attendance</span></NavLink></li>
        <li><NavLink className="nav-link" to="/leaves"><i className="fas fa-book"></i><span>Leaves</span></NavLink></li>
        <li><NavLink className="nav-link" to="/assignSalary"><i class="fas fa-pen"></i> <span>Assign Salary</span></NavLink></li>
        <li><NavLink className="nav-link" to="/salaries"><i class="fas fa-piggy-bank"></i> <span>Salaries</span></NavLink></li> */}
        <li><NavLink className="nav-link" to="/teams"><i className="fas fa-fire"></i> <span>Teams</span></NavLink></li>

        <li className="menu-header">Starter</li>
        <li><NavLink className="nav-link" to="/adduser"><i className="fas fa-user-plus"></i> <span>Add User</span></NavLink></li>
        <li><NavLink className="nav-link" to="/addteam"><i className="fas fa-address-card"></i> <span>Add Team</span></NavLink></li>
        <li><NavLink className="nav-link" to="/home"><i className="far fa-square"></i> <span>Blank Page</span></NavLink></li>

        <li className="menu-header">Settings</li>
        <li><NavLink className="nav-link" to="/contact"><i className="fab fa-teamspeak"></i> <span>Contact Us</span></NavLink></li>
        <li><NavLink className="nav-link" to="/about"><i className="fas fa-info-circle"></i> <span>About Us</span></NavLink></li>
        <li><NavLink onClick={logout} className="nav-link" to="/home"><i className="fas fa-sign-out-alt"></i> <span>Logout</span></NavLink></li>
      </ul>
    )
}

export default Admin;