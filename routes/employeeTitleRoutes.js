const express = require('express');
const employeeTitleController = require('./../controllers/employeeTitleController');

const router = express.Router();

router
      .route('/')
      .get(employeeTitleController.getAllEmployeeTitles)
      .post(employeeTitleController.createEmployeeTitle);

router
      .route('/:id')
      .patch(employeeTitleController.updateEmployeeTitle)
      .delete(employeeTitleController.deleteEmployeeTitle);


module.exports = router;
