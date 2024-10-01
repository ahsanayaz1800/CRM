const router = require('express').Router();
const customerController = require('../controllers/customer-controller');
const asyncMiddleware = require('../middlewares/async-middleware');

// Customer Routes
router.post('/add_customer', asyncMiddleware(customerController.createCustomer));         // Add new customer
router.get('/get_all_customers', asyncMiddleware(customerController.getAllCustomers));        // Get all customers
router.get('/get_customers_by_month', asyncMiddleware(customerController.getCustomersByMonth));        // Get all customers
router.get('/get_customer_by_id/:id', asyncMiddleware(customerController.getCustomerById));     // Get customer by ID
router.patch('/update_customer/:id', asyncMiddleware(customerController.updateCustomer));    // Update customer by ID
router.delete('/customer/:id', asyncMiddleware(customerController.deleteCustomer));   // Delete customer by ID
router.get('/search_by_phone', asyncMiddleware(customerController.searchCustomerByPhone))
module.exports = router;
