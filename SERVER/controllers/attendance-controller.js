const attendanceService = require('../services/attendance-service');
const userService = require('../services/user-service');
const validator = require('validator');
const ErrorHandler = require('../utils/error-handler');

const calculateEuclideanDistance = (data1, data2) => {
    let sum = 0;
    for (let key in data1) {
        if (data2.hasOwnProperty(key)) {
            sum += Math.pow(data1[key] - data2[key], 2);
        }
    }
    return Math.sqrt(sum);
};
// Controller function to handle marking attendance
const markAttendance = async (req, res, next) => {
    try {
        const {name, email, userId, attendanceFaceData, attendanceStatus } = req.body;

        if (!name || !email || !userId || !attendanceFaceData || !attendanceStatus) {
            return next(ErrorHandler.badRequest('Email, userId, attendance face data, and attendance status are required'));
        }

        let data = validator.isEmail(email) ? { email } : { username: email };

        const user = await userService.findUser(data);

        if (!user) {
            return next(ErrorHandler.notFound('User not found'));
        }

        const { type, faceData, status } = user;

        let parsedAttendanceFaceData, parsedFaceData;

        try {
            parsedAttendanceFaceData = JSON.parse(attendanceFaceData);
        } catch (error) {
            return next(ErrorHandler.badRequest('Invalid attendance face data format'));
        }

        try {
            parsedFaceData = JSON.parse(faceData);
        } catch (error) {
            return next(ErrorHandler.badRequest('Invalid stored face data format'));
        }

        // Validate that both parsedFaceData and parsedAttendanceFaceData are objects
        if (typeof parsedFaceData !== 'object' || typeof parsedAttendanceFaceData !== 'object') {
            return next(ErrorHandler.badRequest('Face data should be valid objects'));
        }

        // Calculate the distance between the two face data sets
        const distance = calculateEuclideanDistance(parsedFaceData, parsedAttendanceFaceData);
        const threshold = 0.5; // Adjust this threshold based on your requirements

        if (distance > threshold) {
            console.log('Face not recognized');
            return res.status(500).json({ status: 500 });
        }

        // Check if attendance was already marked in the last 24 hours
        const lastAttendance = await attendanceService.getLastAttendance(userId);

        if (lastAttendance) {
            const now = new Date();
            const lastAttendanceTime = new Date(lastAttendance.timestamp);
            const hoursSinceLastAttendance = Math.abs(now - lastAttendanceTime) / 36e5; // Convert milliseconds to hours

            if (hoursSinceLastAttendance < 24) {
                return res.status(400).json({ message: 'Attendance already marked in the last 24 hours' , status:400});
            }
        }

        // Mark new attendance
        const response = await attendanceService.markAttendance({
            name,
            email,
            userId,
            attendanceFaceData,
            attendanceStatus
        });

        return res.status(200).json({ status: 200, response });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};


const getAttendance = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return next(ErrorHandler.badRequest('User ID is required'));
        }

        // Get all attendance records for the given userId
        const attendanceRecords = await attendanceService.getAttendance(id);

        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json({ status: 404, message: 'No attendance records found' });
        }

        return res.status(200).json({ status: 200, data: attendanceRecords });
    } catch (error) {
        console.error('Error fetching attendance:', error.message);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};
const getAttendanceByDateRange = async (req, res) => {
    console.log(req.query)
    console.log(req.body)
    const { userId, from, to } = req.query;

    try {
        // Call the service function and pass the userId and date range
        const attendanceRecords = await attendanceService.getAttendanceByDateRange(userId, from, to);

        // Send response
        res.status(200).json({ success: true, data: attendanceRecords });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};


module.exports = {
    markAttendance,
    getAttendanceByDateRange,
    getAttendance
};

