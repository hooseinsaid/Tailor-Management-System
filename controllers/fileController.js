const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError");

let gfs;

const conn = mongoose.connection;
conn.once("open", function () {
      gfs = Grid(conn.db, mongoose.mongo);
      gfs.collection("fs");
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

const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

// Mongo URI
const mongoURI = `${process.env.MONGO_URL}/${process.env.DATABASE_NAME}`;
const storage = new GridFsStorage({
    // url: `${process.env.MONGO_URL}/${process.env.DATABASE_NAME}`,
    url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-any-name-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "uploads",
            filename: `${Date.now()}-any-name-${file.originalname}`,
        };
    },
});

const upload = multer({
      storage: storage,
})

exports.uploadLogo = upload.single("logo");
exports.uploadCoverImage = upload.single("cover")
exports.uploadMenuProducts = upload.array("menuProductImages")



