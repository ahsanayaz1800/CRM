const teamService = require('../services/team-service');
const ErrorHandler = require('../utils/error-handler');
const TeamDto = require('../dtos/team-dto');
const userService = require('../services/user-service');
const mongoose = require('mongoose');
const UserDto = require('../dtos/user-dto');
const UserModel = require('../models/user-model');

class TeamController {

    createTeam = async (req,res,next) =>
    {
        const image = req.file && req.file.filename;
        const {name,description} =req.body;
        if(!name) return next(ErrorHandler.badRequest('Required Parameter Teams Name Is Empty'))
        const team = {
            name,
            description,
            image
        }
        console.log(team)
        const teamResp = await teamService.createTeam(team);
        if(!teamResp) return next(ErrorHandler.serverError('Failed To Create The Team'));
        res.json({success:true,message:'Team Has Been Created',team:new TeamDto(teamResp)});
    }

    updateTeam = async (req,res,next) =>
    {
        const {id} = req.params;
        if(!id) return next(ErrorHandler.badRequest('Team Id Is Missing'));
        if(!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('Invalid Team Id'));
        let {name,description,status,leader} =req.body;
        const image = req.file && req.file.filename;
        status = status && status.toLowerCase();
        if(leader && !mongoose.Types.ObjectId.isValid(leader)) return next(ErrorHandler.badRequest('Invalid Leader Id'));
        const team = {
            name,
            description,
            status,
            image,
            leader
        }
        const teamResp = await teamService.updateTeam(id,team);
        return (teamResp.modifiedCount!=1) ? next(ErrorHandler.serverError('Failed To Update Team')) : res.json({success:true,message:'Team Updated'})
    }

    addMember = async (req, res, next) => {
        const { teamId, userId } = req.body;
        if (!teamId || !userId) return next(ErrorHandler.badRequest('All Fields Required'));
        if (!mongoose.Types.ObjectId.isValid(teamId)) return next(ErrorHandler.badRequest('Invalid Team Id'));
        if (!mongoose.Types.ObjectId.isValid(userId)) return next(ErrorHandler.badRequest('Invalid User Id'));
    
        try {
            // Call the new service function to add the member to the team
            const result = await teamService.addUserToTeam(userId, teamId);
    
            if (result.success) {
                res.json({ success: true, message: `Successfully added ${result.userName} to the team` });
            } else {
                return next(ErrorHandler.badRequest(result.message));
            }
        } catch (error) {
            console.error('Error adding member to team:', error);
            res.status(500).json({ error: error.message });
        }
    };
    
    
    
    removeMember = async (req, res, next) => {
        const { userId, teamId } = req.body;
        if (!userId || !teamId) return next(ErrorHandler.badRequest('All Fields Required'));
        if (!mongoose.Types.ObjectId.isValid(userId)) return next(ErrorHandler.badRequest('Invalid User Id'));
        if (!mongoose.Types.ObjectId.isValid(teamId)) return next(ErrorHandler.badRequest('Invalid Team Id'));
    
        try {
            // Find the user to remove from the team
            const user = await UserModel.findById(userId);
            if (!user) return next(ErrorHandler.notFound('No User Found'));
    
            // Check if the user is part of the specified team
            if (!user.team.includes(teamId)) return next(ErrorHandler.badRequest(`${user.name} is not in this team`));
    
            // Update the user to remove them from the team
            const result = await UserModel.updateOne(
                { _id: userId },
                { $pull: { team: teamId } }
            );
    
            // Send response based on result
            if (result.modifiedCount === 1) {
                res.json({ status: 200, success: true, message: `Successfully removed ${user.name} from the team` });
            } else {
                res.status(400).json({ status: 400, success: false, message: `Failed to remove ${user.name} from the team` });
            }
    
        } catch (error) {
            console.error('Error removing member from team:', error);
            res.status(500).json({ status: 500, success: false, message: error.message });
        }
    };
    
    

    addRemoveLeader = async (req,res,next) =>
    {
        const {userId:id,teamId} = req.body;
        const type = req.path.split('/').pop();
        if(!teamId || !id) return next(ErrorHandler.badRequest('All Fields Required'));
        if(!mongoose.Types.ObjectId.isValid(teamId)) return next(ErrorHandler.badRequest('Invalid Team Id'));
        if(!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('Invalid Leader Id'));
        const user = await userService.findUser({_id:id});
        if(!user) return next(ErrorHandler.notFound('No Leader Found'));
        if(user.type!=='leader') return next(ErrorHandler.badRequest(`${user.name} is not a Leader`));
        const team = await teamService.findTeam({leader:id});
        console.log(team)
        if(type==='add' && team) return next(ErrorHandler.badRequest(`${user.name} is already leading '${team.name}' team`));
        if(type==='remove' && !team) return next(ErrorHandler.badRequest(`${user.name} is not leading any team`));
        const update = await teamService.updateTeam(teamId,{leader: type==='add' ? id : null});
        console.log(type==='add' ? id : null);
        return update.modifiedCount!==1 ? next(ErrorHandler.serverError(`Failed To ${type.charAt(0).toUpperCase() + type.slice(1)} Leader`)) : res.json({success:true,message:`${type==='add'? 'Added' : 'Removed'} Successfully ${user.name} As A Leader`})
    }

    getTeams = async (req,res,next) =>
    {
        const teams = await teamService.findTeams({});
        if(!teams) return next(ErrorHandler.notFound('No Team Found'));
        const data = teams.map((o)=> new TeamDto(o));
        res.json({success:true,message:'Team Found',data})
    }

    getTeam = async (req,res,next) =>
    {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('Invalid Team Id'));
        const team = await teamService.findTeam({_id:id});
        if(!team) return next(ErrorHandler.notFound('No Team Found'));
        const data = new TeamDto(team);
        const employee = await userService.findCount({team:data.id});
        data.information = {employee};
        res.json({success:true,message:'Team Found',data})
    }

    getTeamMembers = async (req,res,next) =>
    {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)) return next(ErrorHandler.badRequest('Invalid Team Id'));
        const teams = await userService.findUsers({team:id});
        if(!teams) return next(ErrorHandler.notFound('No Team Found'));
        const data = teams.map((o)=> new UserDto(o));
        res.json({success:true,message:'Team Found',data})
    }

    getCounts = async (req,res,next) =>
    {
        const admin = await userService.findCount({type:'admin'});
        const employee = await userService.findCount({type:'employee'});
        const leader = await userService.findCount({type:'leader'});
        const team = await teamService.findCount({});
        const data = {
            admin,
            employee,
            leader,
            team
        }
        res.json({success:true,message:'Counts Found',data})
    }
    getUserCounts = async (req,res,next) =>
    {
    
        const data = await userService.findCount();
        res.json({success:true,message:'Counts Found',data})
    }

}

module.exports = new TeamController();