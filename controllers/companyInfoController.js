const catchAsync = require("../utils/catchAsync");
const CompanyInfo = require("../models/companyInfoModel");
const AppError = require("../utils/appError");
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');


// Mongo URI
// Mongo URI
const mongoURI = `${process.env.MONGO_URL}/${process.env.DATABASE_NAME}`;

// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    }
});


const multerFilter = async (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: multerFilter
});

exports.uploadLogo = upload.single("logo");

exports.createCompanyInfo = catchAsync(async (req, res, next) => {
    const info = await CompanyInfo.find();
    if (info.length) {
        return next(new AppError("all ready exist, please update"), 400)
    }

    const imageName = req.file.filename;

    const companyInfo = await CompanyInfo.create({ ...req.body, logo: imageName });

    res.status(201).json({
        status: "Success",
        data: {
            companyInfo
        },
    });
});

exports.getCompanyInfo = catchAsync(async (req, res, next) => {

    let companyInfo = await CompanyInfo.findOne();
    if (!companyInfo) {
        return res.status(200).json({
            status: "success",
            message: "No compnay Information Found",
            data: null
        })
    }

    res.status(200).json({
        message: "success",
        data: {
            companyInfo
        }
    })
});

exports.updateCompanyInfo = catchAsync(async (req, res, next) => {

    let updatedCompanyInfo;
    if (req.file) {
        const imageName = req.file.filename;
        updatedCompanyInfo = await CompanyInfo.findOneAndUpdate({}, { ...req.body, logo: imageName }, {
            new: true,
            runValidators: true,
        })
    } else {
        updatedCompanyInfo = await CompanyInfo.findOneAndUpdate({}, req.body, {
            new: true,
            runValidators: true,
        })
    }

    res.status(201).json({
        status: "Success",
        message: "Updated Successfully",
        data: {
            updatedCompanyInfo
        },
    });
})

