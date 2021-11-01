const mongoose = require("mongoose");

const schema = mongoose.Schema({
 name: String,
 email:String,
 profile: String,
 highlightMessage: String,
 timestamp: String,
 online:Boolean
})

module.exports = new mongoose.model('users', schema);