const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    attendanceFaceData: {
        type: String,
        required: true
    },
    attendanceStatus: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now // Automatically adds the current timestamp
    }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
