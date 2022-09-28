const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError");

let gfs;

const conn = mongoose.connection;
conn.once("open", function () {
      gfs = Grid(conn.db, mongoose.mongo);
      gfs.collection("uploads");
});


exports.getFile = catchAsync(async (req, res, next) => {

      const file = await gfs.files.findOne({ filename: req.params.filename });
      if (!file) {
            return next(new AppError("No File Found with that"))
      }
      const readStream = gfs.createReadStream(file.filename);
      readStream.pipe(res);


});

exports.deleteFile = catchAsync(async (req, res, next) => {
      await gfs.files.deleteOne({ filename: req.params.filename });
      res.status(204).json({
            status: "success",
            message: "image Successfully Deleted",
            data: null,
      });
});




