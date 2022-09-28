const express = require("express");
const styleController = require("../controllers/styleController");

const router = express.Router();

router
  .route("/")
  .get(styleController.getAllStyles)
  .post(styleController.createStyle);

router
  .route("/:id")
  .get(styleController.getStyle)
  .patch(styleController.updateStyle)
  .delete(styleController.deleteStyle);

module.exports = router;
