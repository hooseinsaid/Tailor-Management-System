const express = require("express");
const menuController = require("../controllers/menuController");
const upload = require("../controllers/upload")

const router = express.Router();

router.route("/add-menu-products/:menuId").post(upload.array("menuProducts"), menuController.addImagesToMenu)

router
  .route("/")
  .get(menuController.getAllMenus)
  .post(upload.single("cover"), menuController.createMenu);

router
  .route("/:id")
  .get(menuController.getMenu)
  .patch(upload.single("cover"), menuController.updateMenu)
  .delete(menuController.deleteMenu);

module.exports = router;
