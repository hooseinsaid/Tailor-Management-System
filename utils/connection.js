const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// variables from enviroument variables
const port = process.env.PORT || 80;
const DB = process.env.DATABASE_NAME;
const url = `${process.env.MONGO_URL}/${DB}`
const user = process.env.DATABASE_USER;
const pass = process.env.DATABASE_PASSWORD;
const authSource = process.env.AUTHSOURCE;

async function connection() {
    var response = {
        err: true,
        message: "helheh"
    };
    try {

        // if all well, connect to mongdb instance with user and password
        await mongoose.connect(url, { useFindAndModify: false })
        response = {
            error: false,
            message: `successful Connected To ${DB}!`
        }
    } catch (err) {
        response = {
            error: true,
            message: "could not connect to database " + DB + " with " + url + err 
        }
    }
    return response;
};

module.exports = connection;