import { NavLink } from "react-router-dom";
import { dLogout } from "../../http";
import { setAuth } from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory , Redirect} from "react-router-dom";


const JuniorAdmin = () => {
  const { user } = useSelector(state => state.authSlice);

  const dispatch = useDispatch();
  const history = useHistory();
  const permissions = user.permissions || []
console.log(user)
  const logout = async () => {
    await dLogout(); // This should also clear tokens (check if this happens)
    document.cookie = 'refreshToken=; Max-Age=0; path=/;';  // Clear refresh token cookie
    document.cookie = 'accessToken=; Max-Age=0; path=/;';   // Clear access token cookie
    dispatch(setAuth(null));
    history.push('/login');
};

  return (
    <ul className="sidebar-menu">
      <li><NavLink className="nav-link" to="/home"><i className="fas fa-fire"></i> <span>Dashboard</span></NavLink></li>
      <li><NavLink className="nav-link" to="/jr_admin_customer"><i className="fas fa-list"></i> <span>Customer Listing</span></NavLink></li>
      {permissions.includes('Manage User') && (
      <li><NavLink className="nav-link" to="/jr_admin_adduser"><i className="fas fa-user-plus"></i> <span>Add User </span></NavLink></li>
      )}
      {permissions.includes('Manage Team') && (
      <li><NavLink className="nav-link" to="/jr_admin_addteam"><i className="fas fa-address-card"></i> <span>Add Team</span></NavLink></li>
      )}
      {/* {permissions.includes('Manage Team') ? (
      ):  <Redirect to="/no-access" />} */}
      <li><NavLink className="nav-link" to="/jr_admin_attendance"><i className="fas fa-list"></i> <span>Attendance</span></NavLink></li>

      {/* <li><NavLink className="nav-link" to="/userManagement"><i className="fas fa-users-cog"></i> <span>User Management</span></NavLink></li>
      <li><NavLink className="nav-link" to="/reports"><i className="fas fa-chart-line"></i> <span>Reports</span></NavLink></li> */}

      <li className="menu-header">Settings</li>
      <li><NavLink className="nav-link" to="/contact"><i className="fab fa-teamspeak"></i> <span>Contact me</span></NavLink></li>
      <li><NavLink className="nav-link" to="/about"><i className="fas fa-info-circle"></i> <span>About me</span></NavLink></li>
      <li><NavLink onClick={logout} className="nav-link" to="/home"><i className="fas fa-sign-out-alt"></i> <span>Logout</span></NavLink></li>
    </ul>
  );
}

export default JuniorAdmin;
