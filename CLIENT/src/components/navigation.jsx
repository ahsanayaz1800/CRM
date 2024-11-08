import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import { dLogout } from "../http";
import { setAuth } from "../store/auth-slice";
import Notification from "../components/notification"; // Import Notification component

const Navigation = () => {
  const { name, image, type } = useSelector((state) => state.authSlice.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const logout = async () => {
    await dLogout(); // This should also clear tokens (check if this happens)
    document.cookie = 'refreshToken=; Max-Age=0; path=/;';  // Clear refresh token cookie
    document.cookie = 'accessToken=; Max-Age=0; path=/;';   // Clear access token cookie
    dispatch(setAuth(null));
    history.push('/login');
};

  const showNotification = ['Admin', 'Manager', 'Junior_admin'].includes(type);

  return (
    <>
      <div className="navbar-bg"></div>
      <nav className="navbar navbar-expand-lg main-navbar" >
        <form className="form-inline mr-auto">
          <ul className="navbar-nav mr-3">
            <li>
              <NavLink to='/' id='sidebarCollapse' data-toggle="sidebar" className="nav-link nav-link-lg">
                <i className="fas fa-bars"></i>
              </NavLink>
            </li>
            <li>
              <NavLink to='/' data-toggle="search" className="nav-link nav-link-lg d-sm-none">
                <i className="fas fa-search"></i>
              </NavLink>
            </li>
          </ul>
          <div className="search-element">
            <input className="form-control" type="search" placeholder="Search" aria-label="Search" data-width="250"/>
            <button className="btn" type="submit"><i className="fas fa-search"></i></button>
          </div>
        </form>
        <ul className="navbar-nav navbar-right">
          {showNotification && (
            <li className="dropdown dropdown-list-toggle">
              <a href='#' data-toggle="dropdown" className="nav-link notification-toggle nav-link-lg beep">
                <i className="far fa-bell"></i>
              </a>
              <Notification /> {/* Show Notification component */}
            </li>
          )}
          <li className="dropdown">
            <a href='#' data-toggle="dropdown" className="nav-link dropdown-toggle nav-link-lg nav-link-user">
              <img alt="image" src={image} className="rounded-circle mr-1"/>
              <div className="d-sm-none d-lg-inline-block">Hi,{type} {name}</div>
            
            </a>

            
            <div className="dropdown-menu dropdown-menu-right">
              <div className="dropdown-title">Logged in 5 min ago</div>
              {/* <NavLink to="features-profile.html" className="dropdown-item has-icon">
                <i className="far fa-user"></i> Profile
              </NavLink> */}
              <NavLink to="/activities" className="dropdown-item has-icon">
                <i className="fas fa-bolt"></i> Activities
              </NavLink>
              {/* <NavLink to="features-settings.html" className="dropdown-item has-icon">
                <i className="fas fa-cog"></i> Settings
              </NavLink> */}
              <div className="dropdown-divider"></div>
              <NavLink to='/' onClick={logout} className="dropdown-item has-icon text-danger">
                <i className="fas fa-sign-out-alt"></i> Logout
              </NavLink>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navigation;
