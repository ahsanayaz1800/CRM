const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,  // Fixed from 'require' to 'required'
        minlength: [3, 'Team name too short.'],
        maxlength: [200, 'Team name too long'],
        trim: true
    },
    description: {
        type: String,
        required: false,
        default: 'This team does not have any description'
    },
    image: {
        type: String,
        required: false,
        default: 'team.png'
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'banned', 'deleted'],
        default: 'active'
    },
    members: [{  // Added field for storing team members
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema, 'teams');
