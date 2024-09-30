import { NavLink } from "react-router-dom";
import { dLogout } from "../../http";
import { setAuth } from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const Verifier = () => {
  const dispatch = useDispatch();
  const history = useHistory();

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
      {/* <li><NavLink className="nav-link" to="/verificationTasks"><i className="fas fa-check-circle"></i> <span>Verification Tasks</span></NavLink></li> */}
      <li><NavLink className="nav-link" to="/verifier_customer"><i className="fas fa-list"></i> <span>Customer Listing</span></NavLink></li>
      <li><NavLink className="nav-link" to="/verifier_attendance"><i className="fas fa-list"></i> <span>Attendance</span></NavLink></li>

      <li className="menu-header">Settings</li>
      <li><NavLink className="nav-link" to="/contact"><i className="fab fa-teamspeak"></i> <span>Contact me</span></NavLink></li>
      <li><NavLink className="nav-link" to="/about"><i className="fas fa-info-circle"></i> <span>About me</span></NavLink></li>
      <li><NavLink onClick={logout} className="nav-link" to="/home"><i className="fas fa-sign-out-alt"></i> <span>Logout</span></NavLink></li>
    </ul>
  );
}

export default Verifier;
