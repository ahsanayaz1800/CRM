import axios from 'axios';
import { data, param } from 'jquery';
import { PhoneNumber } from 'libphonenumber-js';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL:`${process.env.REACT_APP_BASE_URL}/api`,
    withCredentials:true,
    
})

// 'http://localhost:5500/api'

//Auth
export const doLogin = data => api.post('/auth/login',data);
export const forgotPassword = data => api.post('/auth/forgot',data);
export const resetPassword = data => api.patch('/auth/reset',data);
export const dLogout = () => api.get('/auth/logout');

//Admin
export const getAllUsers = () => api.get('/admin/all_users');
export const getUsersByMonth = () => api.get('/admin/get_users_by_month');
export const getAgents = () => api.get('/admin/agents');
export const getJuniorAdmins = () => api.get('/admin/junior_admin');
export const getCustomerServices = () => api.get('/admin/customer_service');
export const getAdvisors = () => api.get('/admin/advisor');
export const getSupervisors = () => api.get('/admin/supervisors');
export const getUsers = () => api.get('/admin/users');
export const getVerifiers = () => api.get('/admin/verifiers');
export const getManagers = () => api.get('/admin/managers');
export const getCounts = () => api.get('/admin/counts');
export const getEmployees = () => api.get('/admin/employees');
export const getLeaders = () => api.get('/admin/leaders');
export const getFreeLeaders = () => api.get('/admin/leaders/free');
export const getAdmins = () => api.get('/admin/admins');
export const getTeams = () => api.get('/admin/teams');

export const getTeamMembers = data => api.get(`/admin/team/${data}/members`);
export const addUser = data => api.post('/admin/user',data);
export const updateUser = (id,data) => api.patch(`/admin/user/${id}`,data);
export const addTeam = data => api.post('/admin/team',data);
export const updateTeam = (id,data) => api.patch(`/admin/team/${id}`,data);
export const getEmployee = data => api.get(`/admin/employee/${data}`);
export const getLeader = data => api.get(`/admin/leader/${data}`);
export const getFreeEmployees = () => api.get('/admin/employees/free');
export const getTeam = data => api.get(`/admin/team/${data}`);
export const removeMember = data=>api.patch('/admin/team/member/remove', data)

  export const addMember = data => api.patch('/admin/team/member/add',data);
export const removeLeader = data => api.patch('/admin/team/leader/remove',data);
export const addLeader = data => api.patch('/admin/team/leader/add',data);
export const getUser = data => api.get(`/admin/user/${data}`);
// export const getAttendance = data => api.post('admin/view-employee-attendance',data);
export const viewLeaves = data => api.post('admin/view-leave-applications',data);
export const updateLeave = (id,data) => api.post(`admin/update-leave/${id}`,data);
export const assignSalary = data => api.post('admin/assign-employee-salary',data);
export const updateSalary = data => api.post('admin/update-employee-salary',data);
export const viewAllSalaries = data => api.post('admin/view-all-salary',data);

//Leader
export const getMembers_Leader = () => api.get('/leader/team/members');
export const getTeam_Leader = () => api.get('/leader/team/');


// Employee
export const getEmployeeTeam = data => api.get(`/employee/team/${data}`);
export const getEmployeeTeamMembers = data => api.get(`/employee/team/${data}/members`);
export const markEmployeeAttendance = data => api.post('/employee/mark-employee-attendance',data);
export const viewEmployeeAttendance = data => api.post('/employee/view-employee-attendance',data);
export const applyforleave = data => api.post('/employee/apply-leave-application',data);
export const viewLeaveApplications = data  => api.post('/employee/view-leave-applications',data);
export const viewEmployeeSalary = data => api.post('employee/view-salary',data);
//customer
export const createCustomer = data => api.post('/customer/add_customer',  data)
export const getAllCustomers = ()=>api.get('/customer/get_all_customers')
export const getCustomersByMonth = ()=>api.get('/customer/get_customers_by_month')
export const getCustomerById = data => api.get(`customer/get_customer_by_id/${data}`,  data)
export const updateCustomer = (id, data)=> api.patch(`customer/update_customer/${id}`, data)
//notifications

export const getNotifications = () =>api.get('notification/get_notifications')

//filters

export const getCustomerByPhone = phoneNumber => api.get(`/customer/search_by_phone`,{params:{phoneNumber}})

//attendance

export const markAttendance = data => api.post('attendance/mark_attendance', data)
export const getAttendance = (data) => api.get(`attendance/get_attendance/${data}`)
export const getAttendanceByDate = (userId, from, to) => api.get(`attendance/get_attendance_by_date`, {params:{userId,from,to}})


//chat
export const getTeamChats = (userId) => api.get(`chat/get_chat_teams/${userId}`)
export const sendMessage = (data) => api.post('chat/send_message', data);
export const getMessage = (teamId) => api.get(`chat/get_chat_message/${teamId}`);

api.interceptors.response.use((response)=>{
    console.log("All Cookies",document.cookie);
    return response.data;
},(error)=>{
    console.log(error);
    return error.response.data
})

export default api;