const mongoose = require("mongoose");

const schema = mongoose.Schema({
 sender: String,
 reciever: String,
 reciever_name: String,
 message: String,
 name: String,
 timestamp: String,
 recieved:Boolean
})


module.exports = new mongoose.model('messageContent', schema);