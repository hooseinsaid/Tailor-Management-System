const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chunkSchema = new Schema({
    files_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    n: {
        type: Number,
    },
    data: {
        type: Buffer,
    },
});

const Chunk = mongoose.model('uploads.chunks', chunkSchema);

module.exports = Chunk;
