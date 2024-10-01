const UserModel = require('../models/user-model');
const LeaveModel = require('../models/leave-model');
const UserSalaryModel = require('../models/user-salary');
const bcrypt = require('bcrypt');

class UserService {

    // Create a new user with role validation
    createUser = async user => {
        const validRoles = ['admin', 'employee', 'leader', 'junior_admin', 'supervisor', 'manager', 'team lead', 'agent', 'user', 'verifier', 'advisor', 'customer_service'];
        if (!validRoles.includes(user.type.toLowerCase())) {
            throw new Error('Invalid Role');
        }
        return await UserModel.create(user);
    };

 

updateUser = async (id, user) => {
    try {
        console.log('Updating user:', id, user);

        // Validate new roles
        const validRoles = ['admin', 'employee', 'leader', 'junior_admin', 'supervisor', 'manager', 'team lead', 'agent', 'user', 'verifier', 'advisor', 'customer_service'];
        if (user.type && !validRoles.includes(user.type.toLowerCase())) {
            throw new Error('Invalid Role');
        }

        // Check for role transition conflicts
        const updatedUser = await UserModel.findById(id);
        if (updatedUser) {
            if (updatedUser.type === 'employee' && user.type && ['admin', 'leader', 'junior_admin', 'supervisor', 'manager', 'team lead', 'agent', 'user', 'verifier', 'advisor', 'customer_service'].includes(user.type)) {
                if (updatedUser.team) {
                    throw new Error('Cannot change role while in a team');
                }
            }

            if (updatedUser.type === 'leader' && user.type && ['admin', 'employee', 'junior_admin', 'supervisor', 'manager', 'team lead', 'agent', 'user', 'verifier', 'advisor', 'customer_service'].includes(user.type)) {
                const team = await UserModel.aggregate([
                    { $match: { leader: id } }
                ]);
                if (team.length > 0) {
                    throw new Error('Cannot change role while leading a team');
                }
            }
        }

        // Hash the password if it's being updated
        if (user.password) {
            const saltRounds = 10;
            user.password = await bcrypt.hash(user.password, saltRounds);
        }

        const updatedUserResult = await UserModel.findByIdAndUpdate(id, user, { new: true });
        console.log('Update result:', updatedUserResult);
        return updatedUserResult;
    } catch (error) {
        console.error('Error updating user in UserService:', error);
        throw new Error('Failed to update user');
    }
};


 getUsersByMonth = async() =>{
    try {
      // Aggregation pipeline to group users by creation month
      const usersByMonth = await UserModel.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },  // Group by the month (1 for Jan, 12 for Dec)
            usersCount: { $sum: 1 }          // Count the number of users in each month
          }
        },
        {
          $sort: { "_id": 1 }                // Sort the result by month (1 - 12)
        }
      ]);
  
      // Define an array for month names
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      // Format the data to include all months and ensure correct structure for the chart
      const formattedData = months.map((month, index) => {
        const foundMonth = usersByMonth.find(data => data._id === index + 1);
        return {
          month: month,
          users: foundMonth ? foundMonth.usersCount : 0 // If no data for the month, return 0
        };
      });
  
      return formattedData;
    } catch (error) {
      throw new Error("Error fetching users by month: " + error.message);
    }
  }
  
getAllUsers = async () => {
        try {
            const users = await UserModel.find(); // Find all users
            return users;
        } catch (error) {
            throw new Error('Error fetching users: ' + error.message);
        }
    };
    // Count documents based on filter
    findCount = async filter => await UserModel.find(filter).countDocuments();

    // Find a single user based on filter
    findUser = async filter => await UserModel.findOne(filter);

    // Find users based on filter and populate team
    findUsers = async filter => {
        const validRoles = ['admin', 'employee', 'leader', 'junior_admin', 'supervisor', 'manager', 'team lead', 'agent', 'user', 'verifier', 'advisor', 'customer_service'];
        if (filter.type && !validRoles.includes(filter.type.toLowerCase())) {
            throw new Error('Invalid Role');
        }
        return await UserModel.find(filter).populate('team');
    };

    // Verify password against hashed password
    verifyPassword = async (password, hashPassword) => await bcrypt.compare(password, hashPassword);

    // Reset password for a user
    resetPassword = async (_id, password) => await UserModel.updateOne({ _id }, { password });

    // Update password for a user
    updatePassword = async (_id, password) => await UserModel.updateOne({ _id }, { password });

    // Find all leaders and populate team details
    findLeaders = async () => await UserModel.aggregate([
        { $match: { "type": 'leader' }},
        {
            $lookup: {
                from: "teams",
                localField: "_id",
                foreignField: "leader",
                as: "team"
            }
        }
    ]);
 
    // Find leaders who do not lead any teams
    findFreeLeaders = async () => await UserModel.aggregate([
        { $match: { "type": 'leader' }},
        {
            $lookup: {
                from: "teams",
                localField: "_id",
                foreignField: "leader",
                as: "team"
            }
        },
        { $match: { "team": { $eq: [] } } }
    ]);

    // Create a leave application
    createLeaveApplication = async data => LeaveModel.create(data);

    // Find a leave application based on data
    findLeaveApplication = async data => LeaveModel.findOne(data);

    // Find all leave applications based on data
    findAllLeaveApplications = async data => LeaveModel.find(data);

    // Assign salary to a user
    assignSalary = async data => UserSalaryModel.create(data);

    // Find a salary record based on data
    findSalary = async data => UserSalaryModel.findOne(data);

    // Find all salary records based on data
    findAllSalary = async data => UserSalaryModel.find(data);

    // Update a salary record
    updateSalary = async (data, updatedSalary) => UserSalaryModel.findOneAndUpdate(data, updatedSalary);

    // Update a leave application
    updateLeaveApplication = async (id, updatedLeave) => LeaveModel.findByIdAndUpdate(id, updatedLeave);
    
}

module.exports = new UserService();
