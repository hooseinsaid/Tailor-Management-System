const express = require('express');
const compnayInfoController = require('../controllers/companyInfoController');
const fileController = require("../controllers/fileController");
const router = express.Router();
const upload = require("../controllers/upload")

router
    .route('/')
    .get(compnayInfoController.getCompanyInfo)
    .patch(fileController.uploadLogo, compnayInfoController.updateCompanyInfo)
    .post(upload.single("logo"), compnayInfoController.createCompanyInfo);

module.exports = router;
