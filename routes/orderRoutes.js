const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();


router.route('/invoice-order-to-customer/:id').post(orderController.invoiceOrderToCustomer);
router.route('/assign-order-to-user/:orderId/:userId').post(orderController.assignOrderToUser);
router.route('/finish-order/:id').post(orderController.finishOrder);
router.route('/take-order/:id').post(orderController.takeOrder);
router.route('/on-service-orders-by-user/:userId').get(orderController.getOnServiceOrdersByUser);
router.route('/pending-orders').get(orderController.getPendingOrders);
router.route('/on-service-orders').get(orderController.getOnServiceOrders);
router.route('/finished-orders').get(orderController.getFinishedOrders);
router.route('/payment/:orderId/:amount').post(orderController.payBill);

router
    .route('/')
    .get(orderController.getAllOrders)
    .post(orderController.createOrder);

router
    .route('/:id')
    .patch(orderController.updateOrder)
    .delete(orderController.deleteOrder);


module.exports = router;
