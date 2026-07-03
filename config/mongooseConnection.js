
const mongoose = require('mongoose');
const debug = require('debug')("development : mongoose");
const config = require('config');


mongoose
    .connect(`${config.get("MONGODB_URI")}/e-commerce`)
    .then(() => {
        debug("Db Connected Successfully.")
    })
    .catch((err) => {
        debug(err)
    })

module.exports = mongoose.connection;