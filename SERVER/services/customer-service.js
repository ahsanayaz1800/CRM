const Customer = require('../models/customer-modal');

// Create a new customer
exports.createCustomer = async (customerData) => {
    const newCustomer = new Customer(customerData);
    return await newCustomer.save(); // Save the customer to the database
};
const normalizePhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/[^\d]/g, ''); // Remove all non-numeric characters
};
exports.searchCustomerByPhoneNumber = async (phoneNumber) => {
    console.log(phoneNumber)
    try {
        console.log('Received phoneNumber in service:', phoneNumber);
        const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
        const regex = new RegExp(normalizedPhoneNumber, 'i');
        const users = await Customer.find({
            'customerInformation.customerPhone': { $regex: regex }
        });
        console.log('Users found:', users);
        return users;
    } catch (error) {
        throw new Error('Error searching for customers: ' + error.message);
    }
};



// Get all customers
exports.getAllCustomers = async () => {
    return await Customer.find(); // Find all customers in the database
};

// Get customer by ID
exports.getCustomerById = async (customerId) => {
    return await Customer.findById(customerId); // Find customer by ID
};

// Update customer by ID
exports.updateCustomer = async (customerId, customerData) => {
    return await Customer.findByIdAndUpdate(customerId, customerData, { new: true }); // Update the customer
};

// Delete customer by ID
exports.deleteCustomer = async (customerId) => {
    return await Customer.findByIdAndDelete(customerId); // Delete customer by ID
};
