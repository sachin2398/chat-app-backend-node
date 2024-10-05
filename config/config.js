require("dotenv").config();
module.exports = {
    uri: process.env._MONGO_URI,
    port: process.env._PORT||5050
};