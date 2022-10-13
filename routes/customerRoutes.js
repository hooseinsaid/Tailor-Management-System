const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

router.route("/customers-with-transactions").get(customerController.getCustomersWithTransactions);
router.route("/orders/:customerId").get(customerController.getCustomerOrders);
router
    .route('/')
    .get(customerController.getAllCustomers)
    .post(customerController.createCustomer);

router
    .route('/:id')
    .get(customerController.getCustomer)
    .patch(customerController.updateCustomer)


module.exports = router;
