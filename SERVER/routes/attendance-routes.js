const router = require('express').Router();
const attendanceController = require('../controllers/attendance-controller');
const asyncMiddleware = require('../middlewares/async-middleware');



router.post('/mark_attendance', asyncMiddleware(attendanceController.markAttendance));         // Add new customer
router.get('/get_attendance/:id', asyncMiddleware(attendanceController.getAttendance));        
router.get('/get_attendance_by_date', asyncMiddleware(attendanceController.getAttendanceByDateRange));        
module.exports = router;
 

