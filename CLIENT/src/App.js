
import {Redirect,Switch,Route} from 'react-router-dom'
import Login from './pages/auth/Login'
import Forgot from './pages/auth/Forgot'
import Home from './pages/Home'
import {useSelector} from 'react-redux';
// import '../node_modules/materialize-css/dist/css/materialize.min.css';
// import '../node_modules/materialize-css/dist/js/materialize.min.js';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import '../node_modules/bootstrap/dist/js/bootstrap.min.js'
import '@popperjs/core';
import './App.css';
import Loading from './components/Loading';
import NotificationDetails from './components/notificationDetails';
import { useAutoLogin } from './hooks/useAutoLogin';
import Employees from './pages/employee/Employees';
import Admins from './pages/admin/Admins';
import Teams from './pages/team/Teams';
import AddUser from './pages/user/AddUser';
import AddTeam from './pages/team/AddTeam';
import Employee from './pages/employee/Employee';
import Team from './pages/team/team/Team';
import EditUser from './pages/user/EditUser';
import EditTeam from './pages/team/EditTeam';
import Admin from './pages/admin/Admin';
import './App.css';
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';
import './assets/css/components.css';
import Leaders from './pages/leader/Leaders';
import SideBar from './components/sidebar';
import Navigation from './components/navigation';
import Members from './pages/leaderpage/Members';
import UserTeams from './components/Employees/UserTeams';
import Attendance from './components/Employees/Attendance';
import LeaveApplications from './components/Employees/LeaveApplications';
import Salary from './components/Employees/Salary';
import ApplyForLeave from './components/Employees/ApplyForLeave';
import EmployeeTeam from './pages/team/team/EmployeeTeam';
import LeaveApplication from './components/Employees/LeaveApplication';
import DashboardEmployee from './components/DashboardEmployee';
import AttendanceView from './components/Admin/AttendanceView';
import LeaveView from './components/Admin/LeaveView';
import Leave from './components/Admin/Leave';
import AssignSalary from './components/Admin/AssignSalary';
import Salaries from './components/Admin/Salaries';
import SalaryView from './components/Admin/Salary';
import Customer from './pages/customers/Customer';
import Customer1 from './pages/customers/AddCustomer1';
import Adviser from './components/dashboard/adviser';
import Agent from './pages/Agent/Agent';
import Supervisors from './pages/supervisor/Supervisor';
import Managers from './pages/manager/Managers';
import Users from './pages/user/Users';
import Verifiers from './pages/verifier/verifiers';
import Advisors from './pages/advisor/Avisors';
import JuniorAdmins from './pages/junior admin/JuniorAdmins';
import CustomerServices from './pages/customer service/CustomerServices';
import CustomerDetails from './pages/customers/CustomerDetails';
import AttendancePage from './pages/attendance/AttendancePage';
import AttendanceDetail from './pages/attendance_detail/AttendanceDetail';
import UserAttendanceDetail from './pages/attendance_detail/UserAttendanceDetail';
// import './assets/css/asdfasdf';
// import './assets/css/asdfasdf';

const App = () =>
{
  const { user } = useSelector(state => state.authSlice);
  
  const loading = useAutoLogin();

  return loading ? 
  <Loading/> : (
    <Switch>
    <Route path="/customer_details/:customerId" component={CustomerDetails} /> 

      <ManagerRoute exact path='/manager_customer'>
        <Customer />
      </ManagerRoute>
      <ManagerRoute exact path='/manager_attendance'>
        <AttendancePage />
      </ManagerRoute>
      <ManagerRoute exact path='/manager_customerinfo'>
        <Customer1 />
      </ManagerRoute>
      <AgentRoute exact path='/agent_customer'>
        <Customer />
      </AgentRoute>
      <AgentRoute exact path='/agent_customerinfo'>
        <Customer1 />
      </AgentRoute>
      <AgentRoute  path='/agent_attendance'>
        <AttendancePage />

      </AgentRoute>
      <VerifierRoute exact path='/verifier_customer'>
        <Customer />
      </VerifierRoute>
      <VerifierRoute exact path='/verifier_customerinfo'>
        <Customer1 />
      </VerifierRoute>
      <VerifierRoute exact path='/verifier_attendance'>
        <AttendancePage />
      </VerifierRoute>
      <SupervisorRoute exact path='/supervisor_customer'>
        <Customer />
      </SupervisorRoute>
      <SupervisorRoute exact path='/supervisor_attendance'>
        <AttendancePage />
      </SupervisorRoute>
      <SupervisorRoute exact path='/supervisor_customerinfo'>
        <Customer1 />
      </SupervisorRoute>
   
      <JuniorAdminRoute exact path='/jr_admin_customer'>
        <Customer />
      </JuniorAdminRoute>
      <JuniorAdminRoute exact path='/jr_admin_attendance'>
        <AttendancePage />
      </JuniorAdminRoute>
      <JuniorAdminRoute exact path='/jr_admin_addteam'>
      <AddTeam/>

      </JuniorAdminRoute>
      <JuniorAdminRoute exact path='/jr_admin_adduser'>
   
        <AddUser />
      </JuniorAdminRoute>
      <CustomerServiceRoute exact path='/customer_service_customer'>
        <Customer />
      </CustomerServiceRoute>
      <CustomerServiceRoute exact path='/customer_service_attendance'>
        <AttendancePage />
      </CustomerServiceRoute>
      <CustomerServiceRoute exact path='/customer_service_customerinfo'>
        <Customer1 />
      </CustomerServiceRoute>
      <EmployeeRoute exact path='/userTeams'>
        <UserTeams/>
      </EmployeeRoute>
      <EmployeeRoute exact path='/userteam/:id'>
        <EmployeeTeam/>
      </EmployeeRoute> 
      {/* <EmployeeRoute exact path='/employee_customer'>
        <EmployeeTeam/>
      </EmployeeRoute>  */}
      <EmployeeRoute exact path='/dashboardEmployee'>
        <DashboardEmployee/>
      </EmployeeRoute>
      <EmployeeRoute exact path='/userAttendance'>
        <Attendance/>
      </EmployeeRoute>
      <EmployeeRoute exact path='/applyforleave'>
        <ApplyForLeave/>
      </EmployeeRoute>
      <EmployeeRoute exact path='/userSalary'>
        <Salary/>
      </EmployeeRoute>
      <EmployeeRoute exact path='/userLeaveApplications'>
        <LeaveApplications/>
      </EmployeeRoute>
      <EmployeeRoute exact path='/userLeaveApplications/:id'>
        <LeaveApplication/>
      </EmployeeRoute>
      <GuestRoute exact path='/' >
        <Login/>
      </GuestRoute>
      <GuestRoute exact path='/login' >
        <Login/>
      </GuestRoute>
      <GuestRoute exact path='/forgot' >
        <Forgot/>
      </GuestRoute>
      <ProtectedRoute exact path='/home'>
        <Home/>
      </ProtectedRoute>
      <AdminRoute exact path='/employees'>
        <Employees/>
      </AdminRoute>
      <LeaderRoute exact path='/members'>
        <Members/>
      </LeaderRoute>
      <LeaderRoute exact path='/leader_customer'>
        <Customer/>
      </LeaderRoute>
      <LeaderRoute exact path='/leader_customerinfo'>
        <Customer1/>
      </LeaderRoute>
      <AdminRoute exact path='/admins'>
        <Admins/>
      </AdminRoute>
      <AdminRoute exact path='/teams'>
        <Teams/>
      </AdminRoute>
      <AdminRoute exact path='/adduser'>
        <AddUser/>
      </AdminRoute>
      <AdminRoute exact path='/admins_attendance_details'>
        <AttendanceDetail />
      </AdminRoute>
      <AdminRoute exact path='/admin_customer'>
        <Customer/>
      </AdminRoute>
      <AdminRoute exact path='/admin_attendance'>
        <AttendancePage/>
      </AdminRoute>
      <AdminRoute exact path='/admin_customerinfo'>
        <Customer1/>
      </AdminRoute>
      <AdminRoute exact path='/attendance'>
        <AttendanceView/>
      </AdminRoute>
      <AdminRoute exact path='/leaves'>
        <LeaveView/>
      </AdminRoute>
      <AdminRoute exact path='/admin_user_attendance/:id'>
        <UserAttendanceDetail/>
      </AdminRoute>
      <AdminRoute exact path='/assignSalary'>
        <AssignSalary/>
      </AdminRoute>
      <AdminRoute exact path='/salaries'>
        <Salaries/>
      </AdminRoute>
      <AdminRoute exact path='/leaves/:id'>
        <Leave/>
      </AdminRoute>
      <AdminRoute exact path='/salary/:id'>
        <SalaryView/>
      </AdminRoute>
      <AdminRoute exact path='/addteam'>
        <AddTeam/>
      </AdminRoute>
      <AdminRoute  path='/employee/:id'>
        <Employee/>
      </AdminRoute>
      <AdminRoute  path='/team/:id'>
        <Team/>
      </AdminRoute> 
      <AdminRoute  path='/edituser/:id'>
        <EditUser/>
      </AdminRoute>
      <AdminRoute  path='/editteam/:id'>
        <EditTeam/>
      </AdminRoute>
      <AdminRoute  path='/admin/:id'>
        <Admin/>
      </AdminRoute>
      <AdminRoute  path='/leaders'>
        <Leaders/>
      </AdminRoute>
      <AdminRoute  path='/agents'>
        <Agent/>
      </AdminRoute>
      <AdminRoute  path='/supervisors'>
        <Supervisors/>
      </AdminRoute>
      <AdminRoute  path='/managers'>
        <Managers/>
      </AdminRoute>
      <AdminRoute  path='/users'>
        <Users/>
      </AdminRoute>
      <AdminRoute  path='/verifiers'>
        <Verifiers/>
      </AdminRoute>
      <AdminRoute  path='/advisors'>
        <Advisors/>
      </AdminRoute>
      <AdminRoute  path='/customer_services'>
        <CustomerServices/>
      </AdminRoute>
      <AdminRoute  path='/junior_admins'>
        <JuniorAdmins/>
      </AdminRoute>
      <FAAdvisorRoute  path='/advisor_customer'>
         <Customer/>
      </FAAdvisorRoute>
      <FAAdvisorRoute  path='/advisor_attendance'>
         <AttendancePage/>
         
      </FAAdvisorRoute>
      <FAAdvisorRoute exact path='/advisor_customerinfo'>
         <Customer1/>
      </FAAdvisorRoute>
      <UserRoute exact path='/user_attendance' >
        <AttendancePage />
   
      </UserRoute>
   
    </Switch>
  )
}


const GuestRoute = ({children,...rest}) =>
{
  const {isAuth} = useSelector((state)=>state.authSlice);
  return(
    <Route {...rest} render={({location})=>
    {
      return isAuth ? (
        <Redirect to={{pathname:'/home',state:{from:location}}} />
      ) : (children);
    }}>
    </Route>
  )
}


const ProtectedRoute = ({children,...rest}) =>
{
  const {isAuth} = useSelector((state)=>state.authSlice);
  return (
    <Route {...rest} render={({location})=>{
      return isAuth ? (
        <>
          <SideBar/>
          <Navigation/>
          {children}
        </>) : (
        <Redirect
          to={{
            pathname:'/',
            state:{
              from:location
            }
          }}
        />
      );
    }} />
  );
}

const AdminRoute = ({children,...rest}) =>
{
  const {user} = useSelector((state)=>state.authSlice);
  return (
    <Route {...rest} render={({location})=>{
      return user && user.type==='Admin'? (
        <>
          <SideBar/>
          <Navigation/>
          {children}
        </>) : (
        <Redirect
          to={{
            pathname:'/',
            state:{
              from:location
            }
          }}
        />
      );
    }} />
  );
}
// Define routes for new roles similarly
const AgentRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => state.authSlice);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user && user.type === 'Agent' ? (
          <>
            <SideBar />
            <Navigation />
            {children}
          </>
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: {
                from: location,
              },
            }}
          />
        )
      }
    />
  );
};

const SupervisorRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => state.authSlice);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user && user.type === 'Supervisor' ? (
          <>
            <SideBar />
            <Navigation />
            {children}
          </>
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: {
                from: location,
              },
            }}
          />
        )
      }
    />
  );
};

const ManagerRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => state.authSlice);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user && user.type === 'Manager' ? (
          <>
            <SideBar />
            <Navigation />
            {children}
          </>
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: {
                from: location,
              },
            }}
          />
        )
      }
    />
  );
};

const TeamLeadRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => state.authSlice);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user && user.type === 'Team Lead' ? (
          <>
            <SideBar />
            <Navigation />
            {children}
          </>
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: {
                from: location,
              },
            }}
          />
        )
      }
    />
  );
};

const UserRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => state.authSlice);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user && user.type === 'User' ? (
          <>
            <SideBar />
            <Navigation />
            {children}
          </>
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: {
                from: location,
              },
            }}
          />
        )
      }
    />
  );
};

const VerifierRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => state.authSlice);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user && user.type === 'Verifier' ? (
          <>
            <SideBar />
            <Navigation />
            {children}
          </>
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: {
                from: location,
              },
            }}
          />
        )
      }
    />
  );
};

const FAAdvisorRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => state.authSlice);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user && user.type === 'Advisor' ? (
          <>
            <SideBar />
            <Navigation />
            {children}
          </>
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: {
                from: location,
              },
            }}
          />
        )
      }
    />
  );
};

const CustomerServiceRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => state.authSlice);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user && user.type === 'Customer_service' ? (
          <>
            <SideBar />
            <Navigation />
            {children}
          </>
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: {
                from: location,
              },
            }}
          />
        )
      }
    />
  );
};

const JuniorAdminRoute = ({ children, ...rest }) => {
  const {user} = useSelector(state => state.authSlice);
  return (
    <Route
      {...rest}
      render={({ location }) =>
       user && user.type ===  "Junior_admin"? (
          <>
            <SideBar />
            <Navigation />
            {children}
          </>
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: {
                from: location,
              },
            }}
          />
        )
      }
    />
  );
};


const AdminLeaderRouter = ({children,...rest}) =>
{
  const {user} = useSelector((state)=>state.authSlice);
  return (
    <Route {...rest} render={({location})=>{
      return user && (user.type==='Admin' || user.type==='Leader') ? (
        <>
          <SideBar/>
          <Navigation/>
          {children}
        </>) : (
        <Redirect
          to={{
            pathname:'/',
            state:{
              from:location
            }
          }}
        />
      );
    }} />
  );
}


const LeaderRoute = ({children,...rest}) =>
{
  const {user} = useSelector((state)=>state.authSlice);
  return (
    <Route {...rest} render={({location})=>{
      return user && user.type==='Leader' ? (
        <>
          <SideBar/>
          <Navigation/>
          {children}
        </>) : (
        <Redirect
          to={{
            pathname:'/',
            state:{
              from:location
            }
          }}
        />
      );
    }} />
  );
}

const EmployeeRoute = ({children,...rest}) =>
{
  const {user} = useSelector((state)=>state.authSlice);
  return (
    <Route {...rest} render={({location})=>{
      return user && user.type==='Employee' || user.type==='Leader' ? (
        <>
          <SideBar/>
          <Navigation/>
          {children}
        </>) : (
        <Redirect
          to={{
            pathname:'/',
            state:{
              from:location
            }
          }}
        />
      );
    }} />
  );
}

export default App;