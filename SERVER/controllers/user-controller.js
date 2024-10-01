const ErrorHandler = require('../utils/error-handler');
const userService = require('../services/user-service');
const UserDto = require('../dtos/user-dto');
const mongoose = require('mongoose');
const crypto = require('crypto');
const teamService = require('../services/team-service');
const attendanceService = require('../services/attendance-service');


class UserController {
    createUser = async (req, res, next) => {
        const file = req.file;
        let { name, email, password, type, address, mobile, permissions,cnic,relativeName,relativePhone,relativeRelation,faceData } = req.body;
        const username = 'user' + crypto.randomInt(11111111, 999999999);
    
        // Add validation for new roles if needed
        const validRoles = ['admin', 'employee', 'leader', 'junior_admin', 'supervisor', 'manager', 'team lead', 'agent', 'user', 'verifier', 'advisor', 'customer_service'];
        if (!validRoles.includes(type.toLowerCase())) {
            return next(ErrorHandler.badRequest('Invalid Role'));
        }
    
        if (!name || !email || !username || !password || !type || !address || !file || !mobile || !cnic || !faceData) 
            return next(ErrorHandler.badRequest('All Fields Required'));
    
        type = type.toLowerCase();
    
        if (type === 'admin') {
            const adminPassword = req.body.adminPassword;
            if (!adminPassword)
                return next(ErrorHandler.badRequest(`Please Enter Your Password to Add ${name} as an Admin`));
            const { _id } = req.user;
            const { password: hashPassword } = await userService.findUser({ _id });
            const isPasswordValid = await userService.verifyPassword(adminPassword, hashPassword);
            if (!isPasswordValid) return next(ErrorHandler.unAuthorized('You have entered a wrong password'));
        }
        
        // Ensure permissions are an array and valid
        if (typeof permissions === 'string') {
            permissions = JSON.parse(permissions); // Convert string to array if necessary
        }
    
        // Validate permissions
        const validPermissions = ['Manage Customer', 'Manage User', 'Manage Team'];
        permissions = permissions.filter(permission => validPermissions.includes(permission));
    
        const user = {
            name, email, username, mobile, password, type, address, faceData,image: file.filename, permissions,cnic,relativeName,relativePhone,relativeRelation
        };
    
        const userResp = await userService.createUser(user);
    
        if (!userResp) return next(ErrorHandler.serverError('Failed To Create An Account'));
        res.json({ success: true, message: 'User has been Added', user: new UserDto(user) });
    };
    


    // updateUser = async (req, res, next) => {
    //     try {
    //         console.log('Request Body:', req.body);
    //         const file = req.file;
    //         const filename = file ? file.filename : undefined;
    //         let user, id;
    
    //         if (req.user.type === 'admin') {
    //             id = req.params.id;
    //             let { name, username, email, password, type, status, address, mobile } = req.body;
    //             type = type ? type.toLowerCase() : undefined;
    
    //             if (!mongoose.Types.ObjectId.isValid(id)) {
    //                 return next(ErrorHandler.badRequest('Invalid User Id'));
    //             }
    
    //             const dbUser = await userService.findUser({ _id: id });
    //             if (!dbUser) {
    //                 return next(ErrorHandler.badRequest('No User Found'));
    //             }
    
    //             // Validate new roles
    //             const validRoles = ['admin', 'employee', 'leader', 'junior_admin', 'supervisor', 'manager', 'team lead', 'agent', 'user', 'verifier', 'advisor', 'customer_service'];
    //             if (type && !validRoles.includes(type)) {
    //                 return next(ErrorHandler.badRequest('Invalid Role'));
    //             }
    
    //             if (type && dbUser.type !== type) {
    //                 const { _id } = req.user;
    //                 if (_id === id) {
    //                     return next(ErrorHandler.badRequest('You Can\'t Change Your Own Position'));
    //                 }
    
    //                 const { adminPassword } = req.body;
    //                 if (!adminPassword) {
    //                     return next(ErrorHandler.badRequest('Please Enter Your Password To Change The Type'));
    //                 }
    
    //                 const { password: hashPassword } = await userService.findUser({ _id });
    //                 const isPasswordValid = await userService.verifyPassword(adminPassword, hashPassword);
    //                 if (!isPasswordValid) {
    //                     return next(ErrorHandler.unAuthorized('You have entered a wrong password'));
    //                 }
    
    //                 // Role Transition Validation
    //                 if ((dbUser.type === 'employee') && (type === 'admin' || type === 'leader' || type === 'junior_admin' || type === 'supervisor' || type === 'manager' || type === 'team lead' || type === 'agent' || type === 'user' || type === 'verifier' || type === 'advisor' || type === 'customer_service')) {
    //                     if (dbUser.team != null) {
    //                         return next(ErrorHandler.badRequest(`Error: ${dbUser.name} is in a team.`));
    //                     }
    //                 }
    
    //                 if ((dbUser.type === 'leader') && (type === 'admin' || type === 'employee' || type === 'junior_admin' || type === 'supervisor' || type === 'manager' || type === 'team lead' || type === 'agent' || type === 'user' || type === 'verifier' || type === 'advisor' || type === 'customer_service')) {
    //                     if (await teamService.findTeam({ leader: id })) {
    //                         return next(ErrorHandler.badRequest(`Error: ${dbUser.name} is leading a team.`));
    //                     }
    //                 }
    //             }
    
    //             user = {
    //                 ...(name && { name }),
    //                 ...(email && { email }),
    //                 ...(status && { status }),
    //                 ...(username && { username }),
    //                 ...(mobile && { mobile }),
    //                 ...(password && { password }),
    //                 ...(type && { type }),
    //                 ...(address && { address }),
    //                 ...(filename && { image: filename })
    //             };
    //         } else {
    //             id = req.user._id;
    //             let { name, username, address, mobile } = req.body;
    
    //             user = {
    //                 ...(name && { name }),
    //                 ...(username && { username }),
    //                 ...(address && { address }),
    //                 ...(mobile && { mobile }),
    //                 ...(filename && { image: filename })
    //             };
    //         }
    
    //         console.log('User Object:', user);
    
    //         // Update user
    //         const userResp = await userService.updateUser(id, user);
    
    //         if (!userResp) {
    //             return next(ErrorHandler.serverError('Failed To Update Account'));
    //         }
    
    //         res.json({ success: true, message: 'Account Updated' });
    //     } catch (error) {
    //         console.error('Error in updateUser function:', error);
    //         next(ErrorHandler.serverError('Internal Server Error'));
    //     }
    // };
     getUsersByMonth = async (req, res) => {
        try {
          const userData = await userService.getUsersByMonth();
          return res.status(200).json({ success: true, data: userData });
        } catch (error) {
          return res.status(500).json({ success: false, message: error.message });
        }
      };
    updateUser = async (req, res, next) => {
        try {
            console.log('Request Body:', req.body);
            const file = req.file;
            const filename = file ? file.filename : undefined;
            let user, id;
    
            // Extract userId and teamId for team removal
            const { userId, teamId } = req.body;
    
            if (userId && teamId) {
                if (!mongoose.Types.ObjectId.isValid(userId)) {
                    return next(ErrorHandler.badRequest('Invalid User Id'));
                }
                if (!mongoose.Types.ObjectId.isValid(teamId)) {
                    return next(ErrorHandler.badRequest('Invalid Team Id'));
                }
    
                // Find the user to remove from the team
                const user = await userService.findUser({ _id: userId });
                if (!user) {
                    return next(ErrorHandler.notFound('No User Found'));
                }
    
                // Check if the user is part of the specified team
                if (!user.team.includes(teamId)) {
                    return next(ErrorHandler.badRequest(`${user.name} is not in this team`));
                }
    
                // Remove the teamId from the user's team array
                const result = await userService.updateUser(userId, { $pull: { team: teamId } });
                if (result.modifiedCount !== 1) {
                    throw new Error(`Failed to remove ${user.name} from the team`);
                }
    
                return res.json({ success: true, message: `Successfully removed ${user.name} from the team` });
            }
    
            if (req.user.type === 'admin') {
                id = req.params.id;
                let { name, username, email, password, type, status, address, mobile, permissions, cnic, relativeName,relativePhone,relativeRelation } = req.body;
                type = type ? type.toLowerCase() : undefined;
    
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return next(ErrorHandler.badRequest('Invalid User Id'));
                }
    
                const dbUser = await userService.findUser({ _id: id });
                if (!dbUser) {
                    return next(ErrorHandler.badRequest('No User Found'));
                }
    
                // Validate new roles
                const validRoles = ['admin', 'employee', 'leader', 'junior_admin', 'supervisor', 'manager', 'team lead', 'agent', 'user', 'verifier', 'advisor', 'customer_service'];
                if (type && !validRoles.includes(type)) {
                    return next(ErrorHandler.badRequest('Invalid Role'));
                }
    
                if (type && dbUser.type !== type) {
                    const { _id } = req.user;
                    if (_id === id) {
                        return next(ErrorHandler.badRequest('You Can\'t Change Your Own Position'));
                    }
    
                    const { adminPassword } = req.body;
                    if (!adminPassword) {
                        return next(ErrorHandler.badRequest('Please Enter Your Password To Change The Type'));
                    }
    
                    const { password: hashPassword } = await userService.findUser({ _id });
                    const isPasswordValid = await userService.verifyPassword(adminPassword, hashPassword);
                    if (!isPasswordValid) {
                        return next(ErrorHandler.unAuthorized('You have entered a wrong password'));
                    }
    
                    // Role Transition Validation
                    if ((dbUser.type === 'employee') && (type === 'admin' || type === 'leader' || type === 'junior_admin' || type === 'supervisor' || type === 'manager' || type === 'team lead' || type === 'agent' || type === 'user' || type === 'verifier' || type === 'advisor' || type === 'customer_service')) {
                        if (dbUser.team != null) {
                            return next(ErrorHandler.badRequest(`Error: ${dbUser.name} is in a team.`));
                        }
                    }
    
                    if ((dbUser.type === 'leader') && (type === 'admin' || type === 'employee' || type === 'junior_admin' || type === 'supervisor' || type === 'manager' || type === 'team lead' || type === 'agent' || type === 'user' || type === 'verifier' || type === 'advisor' || type === 'customer_service')) {
                        if (await teamService.findTeam({ leader: id })) {
                            return next(ErrorHandler.badRequest(`Error: ${dbUser.name} is leading a team.`));
                        }
                    }
                }
    
                user = {
                    ...(name && { name }),
                    ...(email && { email }),
                    ...(status && { status }),
                    ...(username && { username }),
                    ...(permissions && { permissions }),
                    ...(mobile && { mobile }),
                    ...(password && { password }),
                    ...(type && { type }),
                    ...(address && { address }),
                    ...(cnic && { cnic }),
                    ...(relativeName && { relativeName }),
                    ...(relativePhone && { relativePhone }),
                    ...(relativeRelation && { relativeRelation }),
                    ...(filename && { image: filename })
                };
            } else {
                id = req.user._id;
                let { name, username, address, mobile,cnic, relativeName,relativePhone, relativeRelation } = req.body;
    
                user = {
                    ...(name && { name }),
                    ...(username && { username }),
                    ...(address && { address }),
                    ...(mobile && { mobile }),
                    ...(cnic && { cnic }),
                    ...(relativeName && { relativeName }),
                    ...(relativePhone && { relativePhone }),
                    ...(relativeRelation && { relativeRelation }),
                    ...(filename && { image: filename }),
                    ...(permissions && { permissions })
                };
            }
    
            console.log('User Object:', user);
    
            // Update user
            const userResp = await userService.updateUser(id, user);
    
            if (!userResp) {
                return next(ErrorHandler.serverError('Failed To Update Account'));
            }
    
            res.json({ success: true, message: 'Account Updated' });
        } catch (error) {
            console.error('Error in updateUser function:', error);
            next(ErrorHandler.serverError('Internal Server Error'));
        }
    };
    
    findAllUsers = async (req, res) => {
        try {
            const users = await userService.getAllUsers(); // Call service function
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    
    getUsers = async (req, res, next) => {
        const type = req.path.split('/').pop();
        const validRoles = ['admin', 'employee', 'leader', 'junior_admin', 'supervisor', 'manager', 'team lead', 'agent', 'user', 'verifier', 'advisor', 'customer_service'];
    
        // Convert underscores to spaces
        let normalizedType = type.replace(/_/g, ' ');
        
        // Handle plural forms
        if (normalizedType.endsWith('s')) {
            normalizedType = normalizedType.slice(0, -1);
        }
    
        // Check if normalizedType is valid
        if (!validRoles.includes(normalizedType.replace(/ /g, '_'))) {
            return next(ErrorHandler.badRequest('Invalid Role Type'));
        }
    
        // Map the normalized type back to its database format
        const dbFormat = normalizedType.replace(/ /g, '_');
    
        const emps = await userService.findUsers({ type: dbFormat });
        if (!emps || emps.length < 1) {
            return next(ErrorHandler.notFound(`No ${normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1)} Found`));
        }
        
        const employees = emps.map((o) => new UserDto(o));
        res.json({ success: true, message: `${normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1)} List Found`, data: employees });
    };
    

    getFreeEmployees = async (req,res,next) =>
    {
        const emps = await userService.findUsers({type:'employee',team:null});
        if(!emps || emps.length<1) return next(ErrorHandler.notFound(`No Free Employee Found`));
        const employees = emps.map((o)=> new UserDto(o));
        res.json({success:true,message:'Free Employees List Found',data:employees})
    }


    getUser = async (req, res, next) => {
        const { id } = req.params;
        const type = req.path.replace(id, '').replace('/', '').replace('/', '');
        const validRoles = ['admin', 'employee', 'leader', 'junior_admin', 'supervisor', 'manager', 'team lead', 'agent', 'user', 'verifier', 'advisor', 'customer_service'];
    
        if (!validRoles.includes(type)) {
            return next(ErrorHandler.badRequest('Invalid Role Type'));
        }
    
        if (!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest(`Invalid ${type.charAt(0).toUpperCase() + type.slice(1).replace(' ', '')} Id`));
        const emp = await userService.findUser({ _id: id, type });
        if (!emp) return next(ErrorHandler.notFound(`No ${type.charAt(0).toUpperCase() + type.slice(1).replace(' ', '')} Found`));
        res.json({ success: true, message: 'Employee Found', data: new UserDto(emp) });
    };
    
    getUserNoFilter = async (req,res,next) =>
    {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('Invalid User Id'));
        const emp = await userService.findUser({_id:id});
        if(!emp) return next(ErrorHandler.notFound('No User Found'));
        res.json({success:true,message:'User Found',data:new UserDto(emp)})
    }

    getLeaders = async (req, res, next) => {
        const leaders = await userService.findLeaders();
        const data = leaders.map((o) => new UserDto(o));
        res.json({ success: true, message: 'Leaders Found', data });
    };
    
    getFreeLeaders = async (req, res, next) => {
        const leaders = await userService.findFreeLeaders();
        const data = leaders.map((o) => new UserDto(o));
        res.json({ success: true, message: 'Free Leaders Found', data });
    };
    

    // markEmployeeAttendance = async (req,res,next) => {
    //     try {
    //     const {employeeID} = req.body;
    //     const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    //     const d = new Date();

    //     // const {_id} = employee;
        
    //     const newAttendance = {
    //         employeeID,
    //         year:d.getFullYear(),
    //         month:d.getMonth() + 1,
    //         date:d.getDate(),
    //         day:days[d.getDay()],
    //         present: true, 
    //     };

    //    const isAttendanceMarked = await attendanceService.findAttendance(newAttendance);
    //    if(isAttendanceMarked) return next(ErrorHandler.notAllowed(d.toLocaleDateString() +" "+ days[d.getDay()-1]+" "+"Attendance Already Marked!"));

    //    const resp = await attendanceService.markAttendance(newAttendance);
    //    console.log(resp);
    //    if(!resp) return next(ErrorHandler.serverError('Failed to mark attendance'));

    //    const msg = d.toLocaleDateString() +" "+ days[d.getDay()]+" "+ "Attendance Marked!";
       
    //    res.json({success:true,newAttendance,message:msg});
            
    //     } catch (error) {
    //         res.json({success:false,error});    
    //     } 
    // }

    // viewEmployeeAttendance = async (req,res,next) => {
    //     try {
    //         const data = req.body;
    //         const resp = await attendanceService.findAllAttendance(data);
    //         if(!resp) return next(ErrorHandler.notFound('No Attendance found'));

    //         res.json({success:true,data:resp});
            
    //     } catch (error) {
    //         res.json({success:false,error});
    //     }
    // }

    // applyLeaveApplication = async (req, res, next) => {
    //     try {
    //         const data = req.body;
    //         const { applicantID, title, type, startDate, endDate, appliedDate, period, reason } = data;
    //         const newLeaveApplication = {
    //             applicantID,
    //             title,
    //             type,
    //             startDate,
    //             endDate,
    //             appliedDate, 
    //             period, 
    //             reason, 
    //             adminResponse:"Pending"
    //         };

    //         const isLeaveApplied = await userService.findLeaveApplication({applicantID,startDate,endDate,appliedDate});
    //         if(isLeaveApplied) return next(ErrorHandler.notAllowed('Leave Already Applied'));

    //         const resp = await userService.createLeaveApplication(newLeaveApplication);
    //         if(!resp) return next(ErrorHandler.serverError('Failed to apply leave'));

    //         res.json({success:true,data:resp});

    //     } catch (error) {
    //         res.json({success:false,error});   
    //     }
    // }

    // viewLeaveApplications = async (req, res, next) => {
    //     try {
    //         const data = req.body;
    //         const resp = await userService.findAllLeaveApplications(data);
    //         if(!resp) return next(ErrorHandler.notFound('No Leave Applications found'));

    //         res.json({success:true,data:resp});

    //     } catch (error) {
    //         res.json({success:false,error});
    //     }
    // }

    // updateLeaveApplication = async (req, res, next) => {
    //     try {

    //         const {id} = req.params;
    //         const body = req.body;
    //         const isLeaveUpdated = await userService.updateLeaveApplication(id,body);
    //         if(!isLeaveUpdated) return next(ErrorHandler.serverError('Failed to update leave'));
    //         res.json({success:true,message:'Leave Updated'});
            
            
    //     } catch (error) {
    //         res.json({success:false,error});
    //     }
    // }

    // assignEmployeeSalary = async (req, res, next) => {
    //     try {
    //         const data = req.body;
    //         const obj = {
    //             "employeeID":data.employeeID
    //         }
    //         const isSalaryAssigned = await userService.findSalary(obj);
    //         if(isSalaryAssigned) return next(ErrorHandler.serverError('Salary already assigned'));

    //         const d = new Date();
    //         data["assignedDate"] = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    //         const resp = await userService.assignSalary(data);
    //         if(!resp) return next(ErrorHandler.serverError('Failed to assign salary'));
    //         res.json({success:true,data:resp}); 
    //     } catch (error) {
    //         res.json({success:false,error});
    //     }
    // }

    // updateEmployeeSalary = async (req,res,next) => {
    //     try {
    //         const body = req.body;
    //         const {employeeID} = body;
    //         const d = new Date();
    //         body["assignedDate"] = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    //         const isSalaryUpdated = await userService.updateSalary({employeeID},body);
    //         console.log(isSalaryUpdated);
    //         if(!isSalaryUpdated) return next(ErrorHandler.serverError('Failed to update salary'));
    //         res.json({success:true,message:'Salary Updated'});
            
    //     } catch (error) {
    //         res.json({success:false,error});
    //     }
    // }

    // viewSalary = async (req,res,next) => {
    //     try {
    //         const data = req.body;
    //         const resp = await userService.findAllSalary(data);
    //         if(!resp) return next(ErrorHandler.notFound('No Salary Found'));
    //         res.json({success:true,data:resp});

    //     } catch (error) {
    //         res.json({success:false,error});
    //     }
    // }
}

module.exports = new UserController();