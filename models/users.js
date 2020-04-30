var mongoose = require('mongoose')

var UsersSchema = mongoose.Schema({
    name: String,
    firstName: String,
    email: String,
    password: String,
  });
  
module.exports = mongoose.model('userModel', UsersSchema);
