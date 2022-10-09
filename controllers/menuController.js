const catchAsync = require("../utils/catchAsync");
const Menu = require("../models/menuModel");
const APIFeatures = require("../utils/apiFeatures")
const AppError = require("../utils/appError");


exports.getAllMenus = catchAsync(async (req, res, next) => {
      const features = new APIFeatures(Menu.find(), req.query).filter().sort().limitFields().paginate()
      const menus = await features.query;

      res.status(200).json({
            message: "Sucess",
            count: menus.length,
            data: {
                  menus,
            },
      });
});

exports.getMenu = catchAsync(async (req, res, next) => {
      const menu = await Menu.findById(req.params.id);
      res.status(200).json({
            message: "Sucess",
            data: {
                  menu,
            },
      });
});

exports.createMenu = catchAsync(async (req, res, next) => {

      if (!req.file) {
            return next(new AppError("Menu Cover Image is Requireid!", 400))
      }

      const coverImageUrl = req.file.filename;

      const createdMenu = await Menu.create({ ...req.body, coverImageUrl });


      res.status(200).json({
            data: {
                  createdMenu,
                  message: "Menu Successfully Created"
            },

      });
});

exports.updateMenu = catchAsync(async (req, res, next) => {

      let updatedMenu;
      if (req.file) {
            const coverImageUrl = req.file && req.file.filename;
            updatedMenu = await Menu.findByIdAndUpdate(req.params.id, { ...req.body, coverImageUrl }, {
                  new: true,
                  runValidators: true,
            })
      } else {
            updatedMenu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
                  new: true,
                  runValidators: true,
            })
      }

      res.status(201).json({
            status: "Success",
            data: {
                  updatedMenu
            },
      });
})

exports.deleteMenu = catchAsync(async (req, res, next) => {
      const menu = await Menu.findByIdAndDelete(req.params.id);

      res.status(204).json({
            status: "success",
            message: "Menu Successfully Deleted",
            data: null,
      });
});

exports.addImagesToMenu = catchAsync(async (req, res, next) => {
      const menu = await Menu.findById(req.params.menuId);

      if (!menu) {
            return next(new AppError("No Menu found with that ID", 404))
      }
      const files = req.files;

      var menuProducts = menu.menuProducts;

      for (let index = 0; index < files.length; index++) {
            const imageName = files[0].filename;
            menuProducts.push(imageName);
      }

      updatedMenu = await Menu.findByIdAndUpdate(req.params.menuId, { ...req.body, menuProducts }, {
            new: true,
            runValidators: true,
      })

      res.status(200).json({
            status: "success",
            data: {
                  updatedMenu
            },
      });
});


