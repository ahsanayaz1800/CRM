const TeamModel = require('../models/team-model');
const mongoose = require('mongoose');
const UserModel = require('../models/user-model');

class TeamService{
    addUserToTeam = async (userId, teamId) => {
        if (!mongoose.Types.ObjectId.isValid(teamId) || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid Team Id or User Id');
        }
    
        // Find the user to add to the team
        const user = await UserModel.findById(userId);
        if (!user) {
            return { success: false, message: 'No User Found' };
        }
    
        // Check if the user is already in the team
        if (user.team.includes(teamId)) {
            return { success: false, message: `${user.name} is already in this team` };
        }
    
        // Find the team to ensure it exists
        const team = await TeamModel.findById(teamId);
        if (!team) {
            return { success: false, message: 'No Team Found' };
        }
    
        // Check if the user is already in the team members array
        if (team.members.includes(userId)) {
            return { success: false, message: `${user.name} is already a member of this team` };
        }
    
        // Update both user and team to add user to the team
        try {
            // Add teamId to user's team array
            const userUpdateResult = await UserModel.updateOne(
                { _id: userId },
                { $push: { team: teamId } }
            );
    
            // Add userId to team's members array
            const teamUpdateResult = await TeamModel.updateOne(
                { _id: teamId },
                { $push: { members: userId } }
            );
    
            if (userUpdateResult.modifiedCount !== 1 || teamUpdateResult.modifiedCount !== 1) {
                throw new Error(`Failed to add ${user.name} to the team`);
            }
    
            return { success: true, message: `${user.name} has been added to the team` };
        } catch (error) {
            throw new Error('Error updating user and team: ' + error.message);
        }
    };
    
    // addUserToTeam = async (userId, teamId) => {
    //     if (!mongoose.Types.ObjectId.isValid(teamId) || !mongoose.Types.ObjectId.isValid(userId)) {
    //         throw new Error('Invalid Team Id or User Id');
    //     }
    
    //     // Find the user to add to the team
    //     const user = await UserModel.findById(userId);
    //     if (!user) {
    //         return { success: false, message: 'No User Found' };
    //     }
    
    //     // Check if the user is already in the team
    //     if (user.team.includes(teamId)) {
    //         return { success: false, message: `${user.name} is already in this team` };
    //     }
    
    //     // Update the user to add them to the team
    //     try {
    //         const result = await UserModel.updateOne(
    //             { _id: userId },
    //             { $push: { team: teamId } }

    //         );
    
    //         if (result.modifiedCount !== 1) {
    //             throw new Error(`Failed to add ${user.name} to the team`);
    //         }
    
    //         return { success: true, userName: user.name };
    //     } catch (error) {
    //         throw new Error('Error updating user: ' + error.message);
    //     }
    // };
    
 removeUserFromTeam = async (userId, teamId) => {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(teamId)) {
            throw new Error('Invalid User Id or Team Id');
        }
    
        // Find the user to remove from the team
        const user = await UserModel.findById(userId);
        if (!user) {
            return { success: false, message: 'No User Found' };
        }
    
        // Check if the user is part of the specified team
        if (!user.team.includes(teamId)) {
            return { success: false, message: `${user.name} is not in this team` };
        }
    
        // Update the user to remove them from the team
        try {
            const result = await UserModel.updateOne(
                { _id: userId },
                { $pull: { team: teamId } }
            );
    
            if (result.modifiedCount !== 1) {
                throw new Error(`Failed to remove ${user.name} from the team`);
            }
    
            return { success: true, userName: user.name };
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }
    };
    
    
    
    createTeam = async team => await TeamModel.create(team);

    findTeams = async filter => await TeamModel.find(filter).populate('leader')

    findTeam = async filter => await TeamModel.findOne(filter).populate('leader');

    findCount = async filter => await TeamModel.find(filter).countDocuments();

    updateTeam = async (_id,data) => await TeamModel.updateOne({_id},data,{ runValidators: true });
    
    
// Example teamService function
addMemberToTeam = async (userId, teamId) => {
    try {
        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(teamId)) {
            throw new Error('Invalid IDs provided');
        }

        // Find team
        const team = await Team.findById(teamId);
        if (!team) {
            throw new Error('Team not found');
        }

        // Check if member already exists
        if (team.members.includes(userId)) {
            throw new Error('Member already in team');
        }

        // Add member
        team.members.push(userId);
        await team.save();

        return true;
    } catch (error) {
        console.error('Error adding member to team:', error);
        throw error; // Propagate error to be handled by controller
    }
};

}

module.exports = new TeamService();