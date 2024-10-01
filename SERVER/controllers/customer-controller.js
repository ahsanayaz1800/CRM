const customerService = require('../services/customer-service');

// Create a new customer
exports.createCustomer = async (req, res) => {
    const customerData = req.body;
    const newCustomer = await customerService.createCustomer(customerData);
    return res.status(200).json({status:200, success: true,message:"customer added" ,data: newCustomer })
};
exports.getCustomersByMonth = async (req, res) => {
    try {
      const userData = await customerService.getCustomersByMonth();
      return res.status(200).json({ success: true, data: userData });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
exports.searchCustomerByPhone = async (req, res) => {
    const { phoneNumber } = req.query;
    console.log('Query Parameters:', req.query);

    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    try {
        const users = await customerService.searchCustomerByPhoneNumber(phoneNumber);
        if (!users.length) {
            return res.status(404).json({ message: 'No users found' });
        }
        if(users){

           return res.status(200).json({users, status:200});
        }
    } catch (error) {
        res.status(500).json({ message: error.message , status:200});
    }
};


// Get all customers
exports.getAllCustomers = async (req, res) => {
    const customers = await customerService.getAllCustomers();
    console.log("api hit")
    return res.status(200).json({status:200, success: true, data: customers });
};

// Get customer by ID
exports.getCustomerById = async (req, res) => {
    const customerId = req.params.id;
    const customer = await customerService.getCustomerById(customerId);
    return res.status(200).json({ success: true, data: customer });
};

// Update customer by ID
exports.updateCustomer = async (req, res) => {
    const customerId = req.params.id;
    const customerData = req.body;
    const updatedCustomer = await customerService.updateCustomer(customerId, customerData);
    return res.status(200).json({ success: true, data: updatedCustomer});
};

// Delete customer by ID
exports.deleteCustomer = async (req, res) => {
    const customerId = req.params.id;
    await customerService.deleteCustomer(customerId);
    return res.status(200).json({ success: true, message: 'Customer deleted successfully' });
};
