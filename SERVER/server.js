require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 5500;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const dbConnection = require('./configs/db-config');
const authRoute = require('./routes/auth-route');
const customerRoute = require('./routes/customer-routes')
const adminRoute = require('./routes/admin-route');
const employeeRoute = require('./routes/employee-route');
const attendanceRoute = require('./routes/attendance-routes')
const leaderRoute = require('./routes/leader-route');
const notificationRoute = require('./routes/notification-routes')
const chatRoute = require('./routes/chat-routes')
const errorMiddleware = require('./middlewares/error-middleware');
const ErrorHandler = require('./utils/error-handler');
const {auth, authRole} = require('./middlewares/auth-middleware');
const socketConnection = require('./configs/socket-config');
const {checkPermission}=require('./middlewares/customerPermission-middleware')
const http = require('http');


const app = express();

// Database Connection
dbConnection();
 

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
socketConnection(server);


const {CLIENT_URL} = process.env;
console.log(CLIENT_URL);

//Cors Option
const corsOption = {
    credentials:true,
    origin:['http://localhost:3000','http://1.1.1.111:3000', CLIENT_URL],

}

//Configuration
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes

app.use('/api/auth',authRoute);
app.use('/api/admin',adminRoute);
app.use('/api/admin',auth,authRole(['admin', 'junior_admin']),checkPermission('Manage User'),adminRoute);
app.use('/api/employee',auth,authRole(['employee','leader']),employeeRoute);
app.use('/api/leader',auth,authRole(['leader']),leaderRoute);
app.use('/api/customer',customerRoute);
app.use('/api/notification', notificationRoute)
app.use('/api/attendance', attendanceRoute)
app.use('/api/chat', chatRoute)

app.use('/storage',express.static('storage'))

//Middlewares;
app.use((req,res,next)=>
{
    return next(ErrorHandler.notFound('The Requested Resources Not Found'));
});

app.use(errorMiddleware)





// Start server
server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));