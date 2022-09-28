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

module.exports = multer({ storage });
