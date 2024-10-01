const validator = require('validator');
const bcrypt = require('bcrypt');
const ErrorHandler = require('../utils/error-handler');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');
const otpService = require('../services/otp-service');
const mailService = require('../services/mail-service');

class AuthController {
    calculateEuclideanDistance = (data1, data2) => {
        let sum = 0;
        for (let key in data1) {
            if (data2.hasOwnProperty(key)) {
                sum += Math.pow(data1[key] - data2[key], 2);
            }
        }
        return Math.sqrt(sum);
    };

    login = async (req, res, next) => {
        try {
            const { email, password, loginFaceData } = req.body;

            console.log('Request Body:', req.body);

            if (!email || !password || !loginFaceData) {
                return next(ErrorHandler.badRequest('Email, password, and face verification data are required'));
            }

            let data = validator.isEmail(email) ? { email } : { username: email };
            const user = await userService.findUser(data);

            if (!user) {
                return next(ErrorHandler.badRequest('Invalid Email or Username'));
            }

            const { _id, name, username, email: dbEmail, password: hashPassword, type, status, faceData,permissions } = user;

            if (status !== 'active') {
                return next(ErrorHandler.badRequest('Account is not active. Please contact admin.'));
            }

            // Parse the incoming face data and the stored face data
            const parsedLoginFaceData = JSON.parse(loginFaceData);
            const parsedFaceData = JSON.parse(faceData);

            // Calculate the distance between the two face data sets
            const distance = this.calculateEuclideanDistance(parsedFaceData, parsedLoginFaceData);
            const threshold = 0.5; // Adjust this threshold based on your requirements

            if (distance > threshold) {
                console.log('Face not recognized');
                return next(ErrorHandler.badRequest('Face not recognized'));
            
            }

            const isValid = await userService.verifyPassword(password, hashPassword);

            if (!isValid) {
                return next(ErrorHandler.badRequest('Invalid Password'));
            }

            const payload = { _id, email: dbEmail, username, type };
            const { accessToken, refreshToken } = tokenService.generateToken(payload);

            console.log('Generated Access Token:', accessToken);
            console.log('Generated Refresh Token:', refreshToken);

            await tokenService.storeRefreshToken(_id, refreshToken);

            res.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true
            });
            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true
            });

            res.json({ success: true, message: 'Login Successful', user: new UserDto(user) });
        } catch (error) {
            console.error('Login Error:', error);
            next(ErrorHandler.serverError('An error occurred during login'));
        }
    }

    // Other methods remain unchanged...

    forgot = async (req, res, next) => {
        const { email: requestEmail } = req.body;
        if (!requestEmail) return next(ErrorHandler.badRequest());
        if (!validator.isEmail(requestEmail)) return next(ErrorHandler.badRequest('Invalid Email Address'));
        const user = await userService.findUser({ email: requestEmail });
        if (!user) return next(ErrorHandler.notFound('Invalid Email Address'));
        const { _id: userId, name, email } = user;
        const otp = otpService.generateOtp();
        const type = process.env.TYPE_FORGOT_PASSWORD;
        await otpService.removeOtp(userId);
        await otpService.storeOtp(userId, otp, type);
        await mailService.sendForgotPasswordMail(name, email, otp);
        res.json({ success: true, message: 'Email has been sent to your email address' });
    }

    reset = async (req, res, next) => {
        const { email, otp, password } = req.body;
        if (!email || !otp || !password) return next(ErrorHandler.badRequest());
        const user = await userService.findUser({ email });
        if (!user) return next(ErrorHandler.notFound('No Account Found'));
        const { _id: userId } = user;
        const type = process.env.TYPE_FORGOT_PASSWORD || 2;
        const response = await otpService.verifyOtp(userId, otp, type);
        console.log("Response", response);
        if (response === 'INVALID') return next(ErrorHandler.badRequest('Invalid OTP'));
        if (response === 'EXPIRED') return next(ErrorHandler.badRequest('Otp has been Expired'));
        const { modifiedCount } = await userService.updatePassword(userId, password);
        return modifiedCount === 1 ? res.json({ success: true, message: 'Password has been reset successfully' }) : next(ErrorHandler.serverError('Failed to Reset your password'));
    }

    logout = async (req, res, next) => {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                return next(ErrorHandler.unAuthorized('Refresh token is missing'));
            }

            const { _id } = req.user;
            const response = await tokenService.removeRefreshToken(_id, refreshToken);

            if (response.modifiedCount !== 1) {
                return next(ErrorHandler.unAuthorized('Failed to log out'));
            }

            res.clearCookie('refreshToken');
            res.clearCookie('accessToken');

            res.json({ success: true, message: 'Logout Successful' });
        } catch (error) {
            console.error('Logout Error:', error);
            next(ErrorHandler.serverError('An error occurred during logout'));
        }
    }

    refresh = async (req, res, next) => {
        try {
            const { refreshToken: refreshTokenFromCookie } = req.cookies;

            if (!refreshTokenFromCookie) {
                return next(ErrorHandler.unAuthorized('Refresh token is missing'));
            }

            const userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);

            if (!userData) {
                res.clearCookie('refreshToken');
                res.clearCookie('accessToken');
                return res.status(401).json({ success: false, message: 'Unauthorized Access' });
            }

            const { _id, email, username } = userData;
            const token = await tokenService.findRefreshToken(_id, refreshTokenFromCookie);

            if (!token) {
                res.clearCookie('refreshToken');
                res.clearCookie('accessToken');
                return res.status(401).json({ success: false, message: 'Unauthorized Access' });
            }

            const user = await userService.findUser({ email });

            if (user?.status !== 'active') {
                return next(ErrorHandler.unAuthorized('Account is not active. Please contact admin.'));
            }

            const payload = { _id, email, username, type: user.type };
            const { accessToken, refreshToken } = tokenService.generateToken(payload);

            await tokenService.updateRefreshToken(_id, refreshTokenFromCookie, refreshToken);

            res.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true
            });
            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true
            });

            res.json({ success: true, message: 'Secure access has been granted', user: new UserDto(user) });
        } catch (error) {
            console.error('Refresh Token Error:', error);
            next(ErrorHandler.serverError('An error occurred during token refresh'));
        }
    }
}

module.exports = new AuthController();
