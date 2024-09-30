const Attendance = require('../models/attendance-model');

const markAttendance = async ({ email, userId, attendanceFaceData, attendanceStatus,name }) => {
    try {
        const newAttendance = new Attendance({
            name,
            email,
            userId,
            attendanceFaceData,
            attendanceStatus
        });

        // Save the attendance data to the database
        await newAttendance.save();

        return { success: true, message: 'Attendance marked successfully' };
    } catch (error) {
        console.error('Error saving attendance:', error.message); // Log the error message
        throw new Error('Failed to save attendance');
    }
};
const getAttendance = async (userId) => {
    try {
        // Find all attendance records for the user, sorted by timestamp
        const attendanceRecords = await Attendance.find({ userId
         }).sort({ timestamp: -1 });
        return attendanceRecords;
    } catch (error) {
        console.error('Error fetching attendance records:', error.message);
        throw new Error('Failed to fetch attendance records');
    }
};
const getLastAttendance = async (userId) => {
    try {
        // Find the most recent attendance record for the user
        return await Attendance.findOne({ userId }).sort({ timestamp: -1 });
    } catch (error) {
        console.error('Error fetching last attendance:', error.message);
        throw new Error('Failed to fetch last attendance');
    }
};
const getAttendanceByDateRange = async (userId, from, to) => {
    try {
        // Define the query
        const query = {
            userId,
            timestamp: {
                $gte: new Date(from), // Convert "from" to Date object
                $lte: new Date(to) // Convert "to" to Date object
            }
        };

        // Fetch records from the database using Mongoose
        const attendanceRecords = await Attendance.find(query);

        return attendanceRecords;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    markAttendance,
    getLastAttendance,
    getAttendance,
    getAttendanceByDateRange
};
