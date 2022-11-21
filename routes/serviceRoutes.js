const express = require('express');
const serviceController = require('../controllers/serviceController');
const router = express.Router();


router.route('/assign-service-to-user/:serviceId/:userId').post(serviceController.assignServiceToUser);
router.route('/finish-service/:id').post(serviceController.finishService);
router.route('/on-service-services-by-user/:userId').get(serviceController.getOnServiceServicesByUser);


router
    .route('/')
    .get(serviceController.getAllServices)
router
    .route('/:id')
    .get(serviceController.getService)
    .patch(serviceController.updateService)
    .delete(serviceController.deleteService);


module.exports = router;
