const express = require("express");
const fileController = require("../controllers/fileController");

const router = express.Router();

router
  .route("/:filename")
  .get(fileController.getFile)
  .delete(fileController.deleteFile);

module.exports = router;
