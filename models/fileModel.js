

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    length: {
        type: Number,
    },
    chunkSize: {
        type: Number,
    },
    fileName: {
        type: String,
    },
    contentType: {
        type: String,
    },
});

const File = mongoose.model('uploads.files', fileSchema);

module.exports = File;