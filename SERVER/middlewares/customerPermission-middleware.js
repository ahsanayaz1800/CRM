const mongoose = require('mongoose');
const userModel = require('../models/user-model')

// services/permissionMiddleware.js

// services/permissionMiddleware.js


/**
 * Middleware to check if the user has the "Manage User" permission.
 */
const checkPermission = () => {
    return async (req, res, next) => {
        try {
            // Extract user ID from the request (assuming it's available in req.user)
            const userId = req.user?._id; // Adjust based on how you store the user ID

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Fetch the user from the database
            const user = await userModel.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if the user has the "Manage Customer" permission
            if (!user.permissions.includes('Manage User')) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.error('Error in permission middleware:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};

module.exports = { checkPermission };
