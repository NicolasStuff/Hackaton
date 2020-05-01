var mongoose = require('mongoose')

var destinationSchema = mongoose.Schema({
    departure: String,
    arrival: String,
  });
  
module.exports = mongoose.model('destinationModel', destinationSchema);
