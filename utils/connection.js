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

module.exports = async function connection() {
    try {
        const options = {
            authSource,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
        // // if all well, connect to mongdb instance with user and password
        mongoose.connect(url, {useFindAndModify: false}).then((result) => {
            console.log(`successful Connected To ${DB}!`);
        }).catch(err => {
            console.log("Database Connection Error" + err + ' Url : ' + url)
        });

    } catch (error) {
        console.log(error);
        console.log("could not connect to database");
    }
};
