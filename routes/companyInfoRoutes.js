const express = require('express');
const compnayInfoController = require('../controllers/companyInfoController');

const router = express.Router();


router
    .route('/')
    .get(compnayInfoController.getCompanyInfo)
    .patch(compnayInfoController.uploadLogo, compnayInfoController.updateCompanyInfo)
    .post(compnayInfoController.uploadLogo, compnayInfoController.createCompanyInfo);


module.exports = router;
