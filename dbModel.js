const mongoose = require("mongoose");

const schema = mongoose.Schema({
 message: String,
 name: String,
 timestamp: String,
 recieved:Boolean
})


module.exports = new mongoose.model('messageContent', schema);