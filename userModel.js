const mongoose = require("mongoose");

const schema = mongoose.Schema({
 name: String,
 email:String,
 profile:String
})

module.exports = new mongoose.model('users', schema);