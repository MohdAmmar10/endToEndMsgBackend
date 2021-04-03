const mongoose = require("mongoose")

const msgSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean
});
module.exports = Messages = mongoose.model('msgcontents',msgSchema)
