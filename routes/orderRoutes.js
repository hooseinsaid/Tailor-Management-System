const express = require('express');
const orderController = require('../controllers/orderController');
const serviceController = require('../controllers/serviceController');
const router = express.Router();


router.route('/invoice-order-to-customer/:id/:user').post(orderController.invoiceOrderToCustomer);
router.route('/finish-order/:id').post(orderController.finishOrder);
router.route('/take-order/:id').post(orderController.takeOrder);
router.route('/cancel-order/:id').post(orderController.cancelOrder);
router.route('/on-service-orders-by-user/:userId').get(orderController.getOnServiceOrdersByUser);
router.route('/pending-orders').get(orderController.getPendingOrders);
router.route('/on-service-orders').get(orderController.getOnServiceOrders);
router.route('/finished-orders').get(orderController.getFinishedOrders);
router.route('/cancelled-orders').get(orderController.getCancelledOrders);
router.route('/payment/:orderId/:amount').post(orderController.payBill);
router.route('/bydate/:startDate/:endDate').get(orderController.getOrdersByDate);

router
    .route('/')
    .get(orderController.getAllOrders)
    .post(serviceController.createServices,orderController.createOrder);

router
    .route('/:id')
    .get(orderController.getOrder)
    .patch(orderController.updateOrder)
    .delete(orderController.deleteOrder);


module.exports = router;
